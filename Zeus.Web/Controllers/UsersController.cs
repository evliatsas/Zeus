using Microsoft.AspNet.Identity;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Zeus.Models;

namespace Zeus.Controllers
{
    [Authorize]
    [RoutePrefix(Zeus.Routes.Users)]
    public class UsersController : BaseController
    {
        [Route("")]
        [ResponseType(typeof(IEnumerable<ApplicationUser>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetUsers()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);


            var result = await IdentityContext.AllUsersAsync();

            return result == null ? this.Ok(new List<ApplicationUser>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.FullName).AsEnumerable());
        }

        [Route("{id}")]
        [ResponseType(typeof(ApplicationUser))]
        [HttpGet]
        public async Task<IHttpActionResult> GetUser(string id)
        {
            if (id == "self")
            {
                var claimsIdentity = User.Identity as ClaimsIdentity;
                var userIdClaim = claimsIdentity.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
                id = userIdClaim.Value;
            }

            var user = await UserManager.FindByIdAsync(id);

            return user == null ? (IHttpActionResult)this.NotFound() : this.Ok(user);
        }

        [Route("")]
        [ResponseType(typeof(ApplicationUser))]
        [HttpPost]
        public async Task<IHttpActionResult> CreateUser(RegisterUser user)
        {
            var currentuser = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var appuser = new ApplicationUser { FullName = user.FullName, PhoneNumber = user.PhoneNumber, UserName = user.UserName, Email = user.Email };
                var result = await UserManager.CreateAsync(appuser, user.Password);
                if (result.Succeeded)
                {
                    Log.Information("User({Id}) created By {user}", appuser.Id, currentuser);
                    return this.Ok(appuser);
                }
                else
                {
                    Log.Error("Error {Exception} creating User By {user}", result.Errors, currentuser);
                    return BadRequest(result.Errors.FirstOrDefault());
                }
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating User By {user}", exc, currentuser);
                return this.BadRequest("Σφάλμα Δημιουργίας δεδομένων Ατόμου");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteUser(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var data = await UserManager.FindByIdAsync(id);
                var result = await UserManager.DeleteAsync(data);
                if (result.Succeeded)
                {
                    Log.Warning("User({@User}) deleted By {user}", data, user);
                    return this.Ok();
                }
                else
                {
                    throw new Exception( result.Errors.FirstOrDefault());
                }
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting User By {user}", exc, user);
                return this.BadRequest("Σφάλμα Διαγραφής δεδομένων Ατόμου");
            }
        }

        [Route("")]
        [ResponseType(typeof(ApplicationUser))]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateUser(ApplicationUser user)
        {
            var currentuser = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var oldUser = await UserManager.FindByIdAsync(user.Id);
                oldUser.FullName = user.FullName;
                oldUser.UserName = user.UserName;
                oldUser.Email = user.Email;
                oldUser.PhoneNumber = user.PhoneNumber;
                oldUser.Roles = user.Roles;
                oldUser.Claims = user.Claims;
                var result = await UserManager.UpdateAsync(oldUser);

                Log.Information("User({Id}) updated By {user}", user.Id, currentuser);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating User By {user}", exc, currentuser);
                return this.BadRequest("Σφάλμα Ενημέρωσης δεδομένων Ατόμου");
            }
        }

        [Route("password")]
        [HttpPost]
        public async Task<IHttpActionResult> ChangePassword(dynamic obj)
        {
            IdentityResult result;
            string userId = obj.userId;
            string oldPassword = obj.oldPassword;
            string newPassword = obj.newPassword;
            string passwordConfirm = obj.passwordConfirm;

            if (newPassword != passwordConfirm)
            {
                return BadRequest("Wrong password confirmation.");
            }

            if (string.IsNullOrWhiteSpace(userId))
            {
                var claimsIdentity = User.Identity as ClaimsIdentity;

                if (claimsIdentity == null)
                    return BadRequest();

                var userIdClaim = claimsIdentity.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return BadRequest();

                userId = userIdClaim.Value;

                result = await change(userId, oldPassword, newPassword);
            }
            else
            {
                result = reset(userId, newPassword);
            }

            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(result.Errors.FirstOrDefault());
            }
        }

        private async Task<IdentityResult> change(string userId, string oldPassword, string newPassword)
        {
            return await UserManager.ChangePasswordAsync(userId, oldPassword, newPassword);
        }

        private IdentityResult reset(string userId, string newPassword)
        {
            var result = UserManager.RemovePassword(userId);
            if (result.Succeeded)
                result = UserManager.AddPassword(userId, newPassword);

            return result;
        }
    }
}
