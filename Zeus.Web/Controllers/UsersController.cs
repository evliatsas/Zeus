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
        [ResponseType(typeof(IEnumerable<UserViewModel>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetUsers()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            var list = await IdentityContext.AllUsersAsync();
            var result = list.Select(t => UserViewModel.Map(t));

            return result == null ? this.Ok(new List<UserViewModel>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.FullName).AsEnumerable());
        }

        [Route("{id}")]
        [ResponseType(typeof(UserViewModel))]
        [HttpGet]
        public async Task<IHttpActionResult> GetUser(string id)
        {
            ApplicationUser app;
            UserViewModel user;

            if (id == "self")
            {
                var claimsIdentity = User.Identity as ClaimsIdentity;
                var userIdClaim = claimsIdentity.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
                id = userIdClaim.Value;
                app = await UserManager.FindByIdAsync(id);
                user = UserViewModel.Map(app);
            }
            else
            {
                app = await UserManager.FindByNameAsync(id);
                user = UserViewModel.Map(app);
            }

            return user == null ? (IHttpActionResult)this.NotFound() : this.Ok(user);
        }

        [Route("")]
        [ResponseType(typeof(UserViewModel))]
        [HttpPost]
        public async Task<IHttpActionResult> CreateUser(UserViewModel user)
        {
            var currentuser = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var appuser = UserViewModel.Map(new ApplicationUser(), user);
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
                var data = await UserManager.FindByNameAsync(id);
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
        [ResponseType(typeof(UserViewModel))]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateUser(UserViewModel user)
        {
            var currentuser = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var oldUser = await UserManager.FindByNameAsync(user.UserName);
                oldUser = UserViewModel.Map(oldUser, user);
                var result = await UserManager.UpdateAsync(oldUser);

                Log.Information("User({UserName}) updated By {user}", user.UserName, currentuser);

                return this.Ok(user);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating User By {user}", exc, currentuser);
                return this.BadRequest("Σφάλμα Ενημέρωσης δεδομένων Ατόμου");
            }
        }

        [Route("password")]
        [HttpPost]
        public async Task<IHttpActionResult> ChangePassword(UserViewModel user)
        {
            IdentityResult result;
           
            if (user.NewPassword != user.PasswordConfirm)
            {
                return BadRequest("Wrong password confirmation.");
            }

            if (string.IsNullOrWhiteSpace(user.UserName))
            {
                var claimsIdentity = User.Identity as ClaimsIdentity;

                if (claimsIdentity == null)
                    return BadRequest();

                var userIdClaim = claimsIdentity.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return BadRequest();

                var userId = userIdClaim.Value;

                result = await change(userId, user.Password, user.NewPassword);
            }
            else
            {
                var app = await UserManager.FindByNameAsync(user.UserName);
                result = reset(app.Id, user.NewPassword);
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
