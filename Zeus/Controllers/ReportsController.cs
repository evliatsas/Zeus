using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Zeus.Entities;

namespace Zeus.Controllers
{
    [ActionFilters.GzipCompressed]
    [RoutePrefix(Zeus.Routes.Facilities)]
    public class ReportsController : ApiController
    {
        private Entities.Repositories.Context context;

        public ReportsController()
        {
            context = Entities.Repositories.Context.Instance;
        }

        [Route("")]
        [ResponseType(typeof(IEnumerable<Report>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetReports()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            var result = await context.Reports.GetAll();

            return result == null ? this.Ok(new List<Report>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.DateTime).AsEnumerable());
        }

        [Route("{id}")]
        [ResponseType(typeof(Report))]
        [HttpGet]
        public async Task<IHttpActionResult> GetReport(string id)
        {
            var report = await context.Reports.GetById(id);

            return report == null ? (IHttpActionResult)this.NotFound() : this.Ok(report);
        }

        [Route("")]
        [ResponseType(typeof(Report))]
        [HttpPost]
        public async Task<IHttpActionResult> CreateReport(Report report)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Reports.Insert(report);

                Log.Information("Report({Report.Id}) created By {user}", data.Id, user);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating Report By {user}", exc, user);
                return this.BadRequest("Σφάλμα Δημιουργίας Αναφοράς");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteReport(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Reports.GetById(id);
                await context.Reports.Delete(id);

                Log.Information("Report({Report}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Report By {user}", exc, user);
                return this.BadRequest("Σφάλμα Διαγραφής Αναφοράς");
            }
        }

        [Route("")]
        [ResponseType(typeof(Report))]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateReport(Report report)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var result = await context.Reports.Update(report);

                Log.Information("Report({Report.Id}) updated By {user}", result.Id, user);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Report By {user}", exc, user);
                return this.BadRequest("Σφάλμα Ενημέρωσης Αναφοράς");
            }
        }
    }
}
