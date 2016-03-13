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
    }
}
