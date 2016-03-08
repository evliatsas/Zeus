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
        public static async Task<string> GetUserByRequest(ClaimsPrincipal principal)
        {
            try
            {
                var userName = principal.Identity.Name;
                return userName;
                //var idClaim = principal.Claims.FirstOrDefault(x => x.Type == Mis.Auth.Claim.EmployeeIdClaim);
                //if (idClaim == null)
                //    throw new Exception("No Employee Id Claim present in Request Identity...");

                //var catClaim = principal.Claims.FirstOrDefault(x => x.Type == Mis.Auth.Claim.EmployeeCategoryClaim);
                //if (catClaim == null)
                //    throw new Exception("No Employee Category Claim present in Request Identity...");

                //var employee = await GetEmployeeById(idClaim.Value, catClaim.Value);

                //return employee;

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
