using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Zeus.Entities;

namespace Zeus.Controllers
{
    [Authorize]
    [RoutePrefix(Zeus.Routes.Reports)]
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

            var result = await context.Reports.Get(x=>!x.IsArchived);
            var facilities = await context.Facilities.GetAll();
            result = result.Select(s =>
            {
                s.Facility = facilities.FirstOrDefault(t=>t.Id == s.FacilityId);
                return s;
            });

            return result == null ? this.Ok(new List<Report>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.DateTime).AsEnumerable());
        }

        [Route("{id}")]
        [ResponseType(typeof(Report))]
        [HttpGet]
        public async Task<IHttpActionResult> GetReport(string id)
        {
            var report = await context.Reports.GetById(id);

            var facility = await context.Facilities.GetById(report.FacilityId);
            report.Facility = facility;

            if(!report.IsAcknoledged)
            {
                report.IsAcknoledged = true;
                report = await context.Reports.Update(report);
            }

            return report == null ? (IHttpActionResult)this.NotFound() : this.Ok(report);
        }

        [Route(Routes.Facilities + "/{id}")]
        [ResponseType(typeof(IEnumerable<Report>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetFacilityReports(string id)
        {
            var reports = await context.Reports.Get(x=>!x.IsArchived && x.FacilityId == id);
            var facility = await context.Facilities.GetById(id);
            reports = reports.Select(s =>
            {
                s.Facility = facility;
                return s;
            });
            return reports == null ? (IHttpActionResult)this.NotFound() : this.Ok(reports);
        }

        [Route(Routes.Facilities + "/stats")]
        [ResponseType(typeof(IEnumerable<Report>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetStatReports()
        {
            var reports = await context.Reports.Get(x => x.Type == ReportType.SituationReport);
            var facilities = await context.Facilities.GetAll();

            reports = reports.Select(s =>
            {
                s.Facility = facilities.FirstOrDefault(t => t.Id == s.FacilityId);
                return s;
            });
            
            return reports == null ? (IHttpActionResult)this.NotFound() : this.Ok(reports);
        }

        [Route("")]
        [ResponseType(typeof(Report))]
        [HttpPost]
        public async Task<IHttpActionResult> CreateReport(Report report)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                //report.User = user;
                report.DateTime = DateTime.Now;

                var data = await context.Reports.Insert(report);

                Log.Information("Report({Id}) created By {user}", data.Id, user);
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

                Log.Warning("Report({@Report}) deleted By {user}", data, user);

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

                Log.Information("Report({Id}) updated By {user}", result.Id, user);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Report By {user}", exc, user);
                return this.BadRequest("Σφάλμα Ενημέρωσης Αναφοράς");
            }
        }

        [Route(Routes.Archive + "/{id}")]
        [ResponseType(typeof(bool))]
        [HttpGet]
        public async Task<IHttpActionResult> ArchiveReport(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            var report = await context.Reports.GetById(id);
            if (report != null)
            {
                report.IsArchived = !report.IsArchived;
                report = await context.Reports.Update(report);

                Log.Information("Report({Id}) {action} archive By {user}", id, report.IsArchived ? "added to":"removed from", user);
                return this.Ok(report.IsArchived);
            }
            else
            {
                return this.BadRequest("Δεν υπάρχει η Αναφορά που ζητήσατε.");
            }
        }

        [Route(Routes.Archive)]
        [ResponseType(typeof(IEnumerable<Report>))]
        [HttpPost]
        public async Task<IHttpActionResult> GetArchivedReports(dynamic dates)
        {
            DateTime from = Convert.ToDateTime(dates.from);
            DateTime to = Convert.ToDateTime(dates.to);
            var reports = await context.Reports.Get(x => x.IsArchived && x.DateTime > from && x.DateTime < to);
            var fIds = reports.Select(x => x.FacilityId);
            var facilities = await context.Facilities.Get(x => fIds.Contains(x.Id));
            reports = reports.Select(s =>
            {
                var temp = facilities.First(f => f.Id == s.FacilityId);
                s.Facility = new Facility() { Id = temp.Id, Name = temp.Name };
                return s;
            });
            return reports == null ? (IHttpActionResult)this.NotFound() : this.Ok(reports);
        }

        [Route(Routes.Message)]
        [ResponseType(typeof(IEnumerable<Report>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetMessageReports()
        {
            var reports = await context.Reports.Get(x => x.Type == ReportType.Message);
            var facilities = await context.Facilities.GetAll();

            reports = reports.Select(s =>
            {
                s.Facility = facilities.FirstOrDefault(t => t.Id == s.FacilityId);
                return s;
            });

            return reports == null ? (IHttpActionResult)this.NotFound() : this.Ok(reports);
        }
    }
}
