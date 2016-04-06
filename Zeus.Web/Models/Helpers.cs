using Microsoft.AspNet.SignalR;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Zeus.Entities;
using Zeus.Models;

namespace Zeus
{
    public static class Helper
    {
        #region User Methods

        /// <summary>
        /// Get the User associated with the given Claim Principal
        /// </summary>
        /// <param name="principal">The Claim Principal of the Request</param>
        /// <returns>The referebced Employee or null if none</returns>
        public static async Task<ApplicationUser> GetUserByRequest(ClaimsPrincipal principal, ApplicationUserManager userManager)
        {
            try
            {
                var claimsIdentity = principal.Identity as ClaimsIdentity;
                var userIdClaim = claimsIdentity.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
                var userId = userIdClaim.Value;

                return await userManager.FindByIdAsync(userId);
            }
            catch (Exception exc)
            {
                Log.Debug("Exception thrown at GetUserByRequest. Exception:{exception}", exc);
                return null;
            }
        }

        #endregion

        #region Hangfire Jobs

        public static void CheckExpiredOperations()
        {
            System.Diagnostics.Stopwatch sw = new System.Diagnostics.Stopwatch();
            sw.Start();

            var ctx = Zeus.Entities.Repositories.Context.Instance;
            var task = Task.Run(async () =>
            {
                var hub = GlobalHost.ConnectionManager.GetHubContext<ChatHub>();
                
                var now = DateTime.Now;
                var ops = await ctx.Operations.Get(x => !x.IsCancelled && !x.End.HasValue && x.ETA < now);
                var title = "Επιχειρήσεις";
                foreach(var op in ops)
                {
                    var facilities = new List<string>() { op.StartingPoint, op.Destination };
                    var overall = GetViewUsers(facilities);
                    var msg = String.Format("Η Επιχείρηση {0} δεν έχει ολοκληρωθεί, παρότι έχει παρέλθει το εκτιμώμενο πέρας ({1}) !", op.Name, op.ETA.ToString("dd/MM HH:mm"));

                    //hub.NotifyUsers(Priority.Immediate, title, msg, overall);
                    foreach (var id in overall)
                        hub.Clients.Client(id).notify(Priority.Immediate, title, msg);
                }
            });
            Task.WaitAll(new Task[] { task });

            sw.Stop();

            Log.Debug("Notified for Expired Operations in Zeus {Elapsed:000} ms", sw.ElapsedMilliseconds);
        }

        #endregion

        public static List<string> GetViewUsers (IEnumerable<string> facilityIds)
        {
            var admins = ChatHub.Users.Where(x => x.Value.Roles.Contains(ApplicationRoles.Administrator)).SelectMany(k => k.Value.ConnectionIds).AsEnumerable();
            var viewers = ChatHub.Users.Where(x => x.Value.Roles.Contains(ApplicationRoles.Viewer)).SelectMany(k => k.Value.ConnectionIds);
            var users = ChatHub.Users.Where(x => ((x.Value.Claims.Where(c => c.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value)).Intersect(facilityIds)).Count() > 0)
                       .SelectMany(k => k.Value.ConnectionIds);

            var overall = admins.Union(viewers).Union(users).Distinct<string>().ToList();

            return overall;
        }
    }
}
