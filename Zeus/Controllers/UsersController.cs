using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Zeus.Entities;
using Zeus.Models;

namespace Zeus.Controllers
{
    [RoutePrefix(Zeus.Routes.Users)]
    public class UsersController : ApiController
    {
        private Entities.Repositories.Context context;

        public UsersController()
        {
            context = Entities.Repositories.Context.Instance;
        }

        [AllowAnonymous]
        [Route("")]
        [ResponseType(typeof(IEnumerable<User>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetUsers()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            var result = await context.Users.GetAll();

            return result == null ? this.Ok(new List<User>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.FullName).AsEnumerable());
        }

        [Route("{id}")]
        [ResponseType(typeof(User))]
        [HttpGet]
        public async Task<IHttpActionResult> GetUser(string id)
        {
            var user = await context.Users.GetById(id);
            
            return user == null ? (IHttpActionResult)this.NotFound() : this.Ok(user);
        }

        [Route("")]
        [ResponseType(typeof(User))]
        [HttpPost]
        public async Task<IHttpActionResult> CreateUser(User user)
        {
            var currentuser = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var userManager = this.Request.GetOwinContext().GetUserManager<ApplicationUserManager>();

                var appuser = new ApplicationUser { FullName = user.FullName, PhoneNumber = user.PhoneNumber, UserName = user.UserName, Email = user.Email };
                var result = await userManager.CreateAsync(appuser, user.Password);
                if (result.Succeeded)
                {
                    Log.Information("User({User.Id}) created By {currentuser}", appuser.Id, currentuser);
                    return this.Ok(appuser);
                }
                else
                {
                    Log.Error("Error {Exception} creating User By {currentuser}", result.Errors, currentuser);
                    return BadRequest("Σφάλμα Δημιουργίας δεδομένων Ατόμου");
                }
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating User By {currentuser}", exc, currentuser);
                return this.BadRequest("Σφάλμα Δημιουργίας δεδομένων Ατόμου");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteUser(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Users.GetById(id);
                await context.Users.Delete(id);

                Log.Information("User({User}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting User By {user}", exc, user);
                return this.BadRequest("Σφάλμα Διαγραφής δεδομένων Ατόμου");
            }
        }

        [Route("")]
        [ResponseType(typeof(User))]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateUser(User user)
        {
            var currentuser = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var result = await context.Users.Update(user);

                Log.Information("User({User.Id}) updated By {currentuser}", result.Id, currentuser);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating User By {currentuser}", exc, currentuser);
                return this.BadRequest("Σφάλμα Ενημέρωσης δεδομένων Ατόμου");
            }
        }

        [Route("password")]
        [HttpPost]
        public async Task<IHttpActionResult> ChangePassword([FromBody] string oldPassword, string newPassword)
        {
            var userManager = this.Request.GetOwinContext().GetUserManager<ApplicationUserManager>();

            var result = await userManager.ChangePasswordAsync(User.Identity.GetUserId(), oldPassword, newPassword);
            if (result.Succeeded)
            {
                return Ok();                
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
