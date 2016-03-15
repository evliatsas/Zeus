using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Zeus.Entities;
using Zeus.Models;
namespace Zeus.Controllers
{
    [Authorize]
    [RoutePrefix(Zeus.Routes.Calendar)]
    public class CalendarController : BaseController
    {
        private Entities.Repositories.Context context;

        public CalendarController()
        {
            context = Entities.Repositories.Context.Instance;
        }

        [Route("")]
        [ResponseType(typeof(IEnumerable<CalendarEntry>))]
        [HttpGet]
        [Authorize(Roles = ApplicationRoles.Administrator + "," + ApplicationRoles.Viewer)]
        public async Task<IHttpActionResult> GetCalendar()
        {
            IEnumerable<CalendarEntry> result = await context.Calendar.GetAll();

            return result == null ? this.Ok(new List<CalendarEntry>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.DateTime).AsEnumerable());
        }

        [Route("{id}")]
        [ResponseType(typeof(CalendarEntry))]
        [HttpGet]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<IHttpActionResult> GetCalendarEntry(string id)
        {
            var entry = await context.Calendar.GetById(id);

            return entry == null ? (IHttpActionResult)this.NotFound() : this.Ok(entry);
        }

        [Route("")]
        [ResponseType(typeof(CalendarEntry))]
        [HttpPost]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<IHttpActionResult> CreateCalendarEntry(CalendarEntry entry)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var data = await context.Calendar.Insert(entry);

                Log.Information("Calendar Entry ({Id}) created By {user}", data.Id, user.UserName);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating Calendar Entry By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Δημιουργίας δεδομένων Ημερολογίου");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<IHttpActionResult> DeleteCalendarEntry(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var data = await context.Calendar.GetById(id);

                await context.Calendar.Delete(id);

                Log.Warning("Calendar Entry ({@CalendarEntry}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Calendar Entry By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Διαγραφής δεδομένων Ημερολογίου");
            }
        }

        [Route("")]
        [ResponseType(typeof(CalendarEntry))]
        [HttpPut]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<IHttpActionResult> UpdateCalendarEntry(CalendarEntry entry)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var result = await context.Calendar.Update(entry);

                Log.Information("Calendar Entry ({Id}) updated By {user}", result.Id, user.UserName);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Calendar Entry By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Ενημέρωσης δεδομένων Ημερολογίου");
            }
        }
    }
}