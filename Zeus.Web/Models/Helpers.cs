using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
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
                var hub = new ChatHub();
                var admins = ChatHub.Users.Where(x => x.Value.Roles.Contains(ApplicationRoles.Administrator)).Select(k => k.Key);
                var viewers = ChatHub.Users.Where(x => x.Value.Roles.Contains(ApplicationRoles.Viewer)).Select(k => k.Key);
                var now = DateTime.Now;
                var ops = await ctx.Operations.Get(x => !x.End.HasValue && x.ETA < now);
                var title = "Επιχειρήσεις";
                foreach(var op in ops)
                {
                    var facilities = new List<string>() { op.StartingPoint, op.Destination };
                    var users = ChatHub.Users.Where(x =>((x.Value.Claims.Where(c => c.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value)).Intersect(facilities)).Count() > 0)
                        .Select(k=>k.Key);

                    var overall = admins.Union(viewers).Union(users).Distinct<string>();
                    var msg = String.Format("Η Επιχείρηση {0} δεν έχει ολοκληρωθεί, παρότι έχει παρέλθει το εκτιμώμενο πέρας ({1}) !", op.Name, op.ETA.ToString("dd/MM HH:mm"));

                    hub.NotifyUsers(Priority.Immediate, title, msg, overall);
                }
            });
            Task.WaitAll(new Task[] { task });

            sw.Stop();

            Log.Debug("Notified for Expired Operations in Zeus {Elapsed:000} ms", sw.ElapsedMilliseconds);
        }

        #endregion
    }
}
