using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Zeus.Entities;
using Zeus.Models;

namespace Zeus.Controllers
{
    [Authorize]
    [RoutePrefix(Zeus.Routes.Reports)]
    public class ReportsController : BaseController
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

            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
            if (user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
                result = await context.Reports.GetAll();
            else
            {
                var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
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

            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
            if (!user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
                if (!facilityClaims.Contains(report.FacilityId))
                {
                    Log.Fatal("Security violation. User {user} requested Report Info {report} with insufficient rights", user.UserName, id);
                    return this.BadRequest("Δεν έχεται το δικαίωμα να δείτε την εγγραφή που ζητήσατε.");
                }
            }

            var facility = await context.Facilities.GetById(report.FacilityId);
            report.Facility = facility;

            if(!report.IsAcknoledged && user.UserName != report.User)
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
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
            if (!user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
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
        [HttpPost]
        public async Task<IHttpActionResult> GetStatReports(dynamic query)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var types = new List<ReportType>();
                foreach(var t in query.types)
                {
                    types.Add((ReportType)t);
                }
                DateTime from = Convert.ToDateTime(query.from);
                DateTime to = Convert.ToDateTime(query.to);

                IEnumerable<Report> result;

                if (user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
                    result = await context.Reports
                                          .Get(x => types.Contains(x.Type) &&
                                                    x.DateTime >= from &&
                                                    x.DateTime <= to);
                else
                {
                    var facilityClaims = user.Claims
                                             .Where(x => x.Type == ApplicationClaims.FacilityClaim)
                                             .Select(s => s.Value);

                    result = await context.Reports
                                          .Get(x => facilityClaims.Contains(x.FacilityId) &&
                                                    types.Contains(x.Type) &&
                                                    x.DateTime >= from &&
                                                    x.DateTime <= to);
                }

                var facilityIds = result.Select(x => x.FacilityId).Distinct<string>();
                var facilities = await context.Facilities.Get(x => facilityIds.Contains(x.Id));

                result = result.Select(s =>
                {
                    s.Facility = facilities.FirstOrDefault(t => t.Id == s.FacilityId);
                    return s;
                });

                return result == null ? (IHttpActionResult)NotFound() : Ok(result);
            }
            catch (Exception exception)
            {
                Log.Error("Error {Exception} requesting Report Stats By {user}", exception, user.UserName);
                return BadRequest("Παρουσιάστηκε σφάλμα κατά την προσπάθεια ανάκτησης των αναφορών");
            }

        }

        [Route("")]
        [ResponseType(typeof(Report))]
        [HttpPost]
        [Authorize(Roles = ApplicationRoles.Administrator + "," + ApplicationRoles.User)]
        public async Task<IHttpActionResult> CreateReport(Report report)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                report.User = user.UserName;
                report.DateTime = DateTime.Now;
                report.IsAcknoledged = false;
                var data = await context.Reports.Insert(report);

                if (report.Type == ReportType.SituationReport)
                {
                    var facility = await context.Facilities.GetById(report.FacilityId);
                    if (facility != null)
                    {
                        facility.Attendance = (report as SituationReport).PersonCount;
                        await context.Facilities.Update(facility);
                    }
                }

                await AddToCalendar(data, user);

                Log.Information("Report({Id}) created By {user}", data.Id, user.UserName);
                return Ok(data);
            }
            catch (Exception exception)
            {
                Log.Error("Error {Exception} creating Report By {user}", exception, user.UserName);
                return BadRequest("Σφάλμα Δημιουργίας Αναφοράς");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        [Authorize(Roles = ApplicationRoles.Administrator + "," + ApplicationRoles.User)]
        public async Task<IHttpActionResult> DeleteReport(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

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
        [Authorize(Roles = ApplicationRoles.Administrator + "," + ApplicationRoles.User)]
        public async Task<IHttpActionResult> UpdateReport(Report report)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                report.User = user.UserName;
                report.DateTime = DateTime.Now;
                report.IsAcknoledged = false;

                var result = await context.Reports.Update(report);

                if (report.Type == ReportType.SituationReport)
                {
                    var facility = await context.Facilities.GetById(report.FacilityId);
                    if (facility != null)
                    {
                        facility.Attendance = (report as SituationReport).PersonCount;
                        await context.Facilities.Update(facility);
                    }
                }

                await UpdateCalendar(result, user);

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
        [Authorize(Roles = ApplicationRoles.Administrator + "," + ApplicationRoles.User)]
        public async Task<IHttpActionResult> ArchiveReport(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

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
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
            if (!user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
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
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
            if (!user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
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
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
            if (!user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
                count = await context.Reports.Count(x => x.Type == ReportType.Message && !x.IsAcknoledged && facilityClaims.Contains(x.Id));
            }
            else
                count = await context.Reports.Count(x => x.Type == ReportType.Message && !x.IsAcknoledged);

            return this.Ok(count);
        }

        private async Task AddToCalendar(Report report, ApplicationUser user)
        {
            try
            {
                if (report.Type == ReportType.ProblemReport
                    || report.Type == ReportType.RequestReport
                    || report.Type == ReportType.Message)
                {
                    var entry = new CalendarEntry(report, user.Administration);
                    await context.Calendar.Insert(entry);
                }
            }
            catch(Exception exc)
            {
                Log.Error("Error {Exception} inserting Calendar Entry for Report {@report}", exc, report);
            }
        }

        private async Task UpdateCalendar(Report report, ApplicationUser user)
        {
            try
            {
                if (report.Type == ReportType.ProblemReport
                       || report.Type == ReportType.RequestReport
                       || report.Type == ReportType.Message)
                {
                    var query = await context.Calendar.Get(x => x.SourceId == report.Id);
                    var entry = query.FirstOrDefault();
                    if (entry != null)
                    {
                        entry.DateTime = report.DateTime;
                        entry.Author = user.Administration;
                        entry.Description = String.Format("{0}\n{1}\n{2}", report.Facility.Name, report.Subject, report.Notes);
                        await context.Calendar.Update(entry);
                    }
                }

            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} inserting Calendar Entry for Report {@report}", exc, report);
            }
        }
    }
}
