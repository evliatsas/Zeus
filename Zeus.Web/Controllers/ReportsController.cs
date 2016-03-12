﻿using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Zeus.Entities;
using Zeus.Entities.Users;

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
            IEnumerable<Report> result;

            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);
            if (user.Roles.Any(x => x == Roles.Administrator || x == Roles.Viewer))
                result = await context.Reports.GetAll();
            else
            {
                var facilityClaims = user.Claims.Where(x => x.Type == Claims.FacilityClaim).Select(s => s.Value);
                result = await context.Reports.Get(x => facilityClaims.Contains(x.FacilityId));
            }

            var facilityIds = result.Select(x => x.FacilityId).Distinct<string>();
            var facilities = await context.Facilities.Get(x=>facilityIds.Contains(x.Id));
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

            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);
            if (!user.Roles.Any(x => x == Roles.Administrator || x == Roles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == Claims.FacilityClaim).Select(s => s.Value);
                if (!facilityClaims.Contains(report.FacilityId))
                {
                    Log.Fatal("Security violation. User {user} requested Report Info {report} with insufficient rights", user.UserName, id);
                    return this.BadRequest("Δεν έχεται το δικαίωμα να δείτε την εγγραφή που ζητήσατε.");
                }
            }

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
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);
            if (!user.Roles.Any(x => x == Roles.Administrator || x == Roles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == Claims.FacilityClaim).Select(s => s.Value);
                if (!facilityClaims.Contains(id))
                {
                    Log.Fatal("Security violation. User {user} requested Report Info {report} with insufficient rights", user.UserName, id);
                    return this.BadRequest("Δεν έχεται το δικαίωμα να δείτε την εγγραφή που ζητήσατε.");
                }
            }

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

            IEnumerable<Report> result;

            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);
            if (user.Roles.Any(x => x == Roles.Administrator || x == Roles.Viewer))
                result = await context.Reports.Get(x => x.Type == ReportType.SituationReport);
            else
            {
                var facilityClaims = user.Claims.Where(x => x.Type == Claims.FacilityClaim).Select(s => s.Value);
                result = await context.Reports.Get(x => facilityClaims.Contains(x.FacilityId) && x.Type == ReportType.SituationReport);
            }

            var facilityIds = result.Select(x => x.FacilityId).Distinct<string>();
            var facilities = await context.Facilities.Get(x => facilityIds.Contains(x.Id));
            result = result.Select(s =>
            {
                s.Facility = facilities.FirstOrDefault(t => t.Id == s.FacilityId);
                return s;
            });
            
            return result == null ? (IHttpActionResult)this.NotFound() : this.Ok(result);
        }

        [Route("")]
        [ResponseType(typeof(Report))]
        [HttpPost]
        [Authorize(Roles = Roles.Administrator + "," + Roles.User)]
        public async Task<IHttpActionResult> CreateReport(Report report)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                //report.User = user;
                report.DateTime = DateTime.Now;

                var data = await context.Reports.Insert(report);

                Log.Information("Report({Id}) created By {user}", data.Id, user.UserName);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating Report By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Δημιουργίας Αναφοράς");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        [Authorize(Roles = Roles.Administrator + "," + Roles.User)]
        public async Task<IHttpActionResult> DeleteReport(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Reports.GetById(id);
                await context.Reports.Delete(id);

                Log.Warning("Report({@Report}) deleted By {user}", data, user.UserName);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Report By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Διαγραφής Αναφοράς");
            }
        }

        [Route("")]
        [ResponseType(typeof(Report))]
        [HttpPut]
        [Authorize(Roles = Roles.Administrator + "," + Roles.User)]
        public async Task<IHttpActionResult> UpdateReport(Report report)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var result = await context.Reports.Update(report);

                Log.Information("Report({Id}) updated By {user}", result.Id, user.UserName);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Report By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Ενημέρωσης Αναφοράς");
            }
        }

        [Route(Routes.Archive + "/{id}")]
        [ResponseType(typeof(bool))]
        [HttpGet]
        [Authorize(Roles = Roles.Administrator + "," + Roles.User)]
        public async Task<IHttpActionResult> ArchiveReport(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            var report = await context.Reports.GetById(id);
            if (report != null)
            {
                report.IsArchived = !report.IsArchived;
                report = await context.Reports.Update(report);

                Log.Information("Report({Id}) {action} archive By {user}", id, report.IsArchived ? "added to":"removed from", user.UserName);
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

            IEnumerable<Report> result;           
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);
            if (!user.Roles.Any(x => x == Roles.Administrator || x == Roles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == Claims.FacilityClaim).Select(s => s.Value);
                result = reports.Where(x=> facilityClaims.Contains(x.FacilityId));
            }
           
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
            IEnumerable<Report> reports;
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);
            if (!user.Roles.Any(x => x == Roles.Administrator || x == Roles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == Claims.FacilityClaim).Select(s => s.Value);
                reports = await context.Reports.Get(x => x.Type == ReportType.Message && facilityClaims.Contains(x.Id));
            }
            else
                reports = await context.Reports.Get(x => x.Type == ReportType.Message);

            var facilityIds = reports.Select(x => x.FacilityId);
            var facilities = await context.Facilities.Get(x=>facilityIds.Contains(x.Id));

            reports = reports.Select(s =>
            {
                s.Facility = facilities.FirstOrDefault(t => t.Id == s.FacilityId);
                return s;
            });

            return reports == null ? (IHttpActionResult)this.NotFound() : this.Ok(reports);
        }

        [Route(Routes.Message + "/unread")]
        [ResponseType(typeof(int))]
        [HttpGet]
        public async Task<IHttpActionResult> GetUnreadMessages()
        {
            int count = 0;
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);
            if (!user.Roles.Any(x => x == Roles.Administrator || x == Roles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == Claims.FacilityClaim).Select(s => s.Value);
                count = await context.Reports.Count(x => x.Type == ReportType.Message && !x.IsAcknoledged && facilityClaims.Contains(x.Id));
            }
            else
                count = await context.Reports.Count(x => x.Type == ReportType.Message && !x.IsAcknoledged);

            return this.Ok(count);
        }
    }
}
