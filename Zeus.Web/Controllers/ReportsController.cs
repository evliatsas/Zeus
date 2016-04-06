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
                result = await context.Reports.Get(x=>!x.IsArchived);
            else
            {
                var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
                result = await context.Reports.Get(x => !x.IsArchived && facilityClaims.Contains(x.FacilityId));
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

        [Route("type/{tp}")]
        [ResponseType(typeof(IEnumerable<Report>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetReports(int tp)
        {
            IEnumerable<Report> result;

            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
            if (user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
                result = await context.Reports.Get(x => !x.IsArchived && x.Type == (ReportType)tp);
            else
            {
                var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
                result = await context.Reports.Get(x => !x.IsArchived && facilityClaims.Contains(x.FacilityId));
            }

            var facilityIds = result.Select(x => x.FacilityId).Distinct<string>();
            var facilities = await context.Facilities.Get(x => facilityIds.Contains(x.Id));
            result = result.Select(s =>
            {
                s.Facility = facilities.FirstOrDefault(t => t.Id == s.FacilityId);
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

                var facility = await context.Facilities.GetById(report.FacilityId);
                if (report.Type == ReportType.SituationReport)
                {
                    var sitRep = report as SituationReport;
                    
                    if (facility != null)
                    {
                        facility.Attendance = sitRep.Identities.Sum(x=>x.Count);
                        facility.Identities = sitRep.Identities;
                        facility.Sensitivities = sitRep.Sensitivities;
                        facility.Procedures = sitRep.Procedures;
                        facility.IdentitiesLastUpdatedBy = sitRep.User;
                        facility.IdentitiesLastUpdated = sitRep.DateTime;
                        await context.Facilities.Update(facility);
                    }
                }
                else if (report.Type == ReportType.FeedingReport)
                {
                    var fRep = report as FeedingReport;
                    if (facility != null)
                    {
                        var isInsert = false;
                        var facilityProvider = (await context.ProviderFacilities.Get(x => x.FacilityId == facility.Id && x.ProviderId == fRep.FeedingProviderId)).FirstOrDefault();
                        if (facilityProvider == null)
                        {
                            facilityProvider = new ProviderFacility() { FacilityId = facility.Id, ProviderId = fRep.FeedingProviderId };
                            isInsert = true;
                        }

                        facilityProvider.LastUpdated = fRep.DateTime;
                        facilityProvider.LastUpdateReportId = fRep.Id;
                        facilityProvider.Items = new List<Lookup>() { new Lookup() { Id = fRep.Meal, Description = fRep.Rations.ToString() } };

                        if (isInsert)
                            await context.ProviderFacilities.Insert(facilityProvider);
                        else
                            await context.ProviderFacilities.Update(facilityProvider);
                    }
                }
                else if (report.Type == ReportType.HealthcareReport)
                {
                    var hRep = report as HealthcareReport;
                    if (facility != null)
                    {
                        var isInsert = false;
                        var facilityProvider = (await context.ProviderFacilities.Get(x => x.FacilityId == facility.Id && x.ProviderId == hRep.HealthcareProviderId)).FirstOrDefault();
                        if (facilityProvider == null)
                        {
                            facilityProvider = new ProviderFacility() { FacilityId = facility.Id, ProviderId = hRep.HealthcareProviderId };
                            isInsert = true;
                        }

                        facilityProvider.LastUpdated = hRep.DateTime;
                        facilityProvider.LastUpdateReportId = hRep.Id;
                        facilityProvider.Items = hRep.Items;
                        facilityProvider.Personnel = hRep.Personnel;

                        if (isInsert)
                            await context.ProviderFacilities.Insert(facilityProvider);
                        else
                            await context.ProviderFacilities.Update(facilityProvider);
                    }
                }
                else if (report.Type == ReportType.HousingReport)
                {
                    var houseRep = report as HousingReport;
                    if (facility != null)
                    {
                        var housing = facility.Housings.FirstOrDefault(x => x.Type == houseRep.Housing.Type && x.Capacity == houseRep.Housing.Capacity);
                        if (housing != null)
                        {
                            housing.Attendance = houseRep.Housing.Attendance;
                            await context.Facilities.Update(facility);
                        }
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

                var result = await context.Reports.Update(report);
                var last = await context.Reports.Get(r => r.Type == report.Type && r.FacilityId == report.FacilityId && r.DateTime > report.DateTime);
                if (last.Count() < 1) //the updated report is the most recent one
                {
                    var facility = await context.Facilities.GetById(report.FacilityId);
                    if (report.Type == ReportType.SituationReport)
                    {
                        var sitRep = report as SituationReport;
                        if (facility != null)
                        {
                            facility.Attendance = sitRep.Identities.Sum(x => x.Count);
                            facility.Identities = sitRep.Identities;
                            facility.Sensitivities = sitRep.Sensitivities;
                            facility.Procedures = sitRep.Procedures;
                            facility.IdentitiesLastUpdatedBy = sitRep.User;
                            facility.IdentitiesLastUpdated = sitRep.DateTime;
                            await context.Facilities.Update(facility);
                        }
                    }
                    else if (report.Type == ReportType.FeedingReport)
                    {
                        var fRep = report as FeedingReport;
                        if(facility != null)
                        {
                            var isInsert = false;
                            var facilityProvider = (await context.ProviderFacilities.Get(x => x.FacilityId == facility.Id && x.ProviderId == fRep.FeedingProviderId)).FirstOrDefault();
                            if (facilityProvider == null)
                            {
                                facilityProvider = new ProviderFacility() { FacilityId = facility.Id, ProviderId = fRep.FeedingProviderId };
                                isInsert = true;
                            }

                            facilityProvider.LastUpdated = fRep.DateTime;
                            facilityProvider.Items = new List<Lookup>() { new Lookup() { Id = fRep.Meal, Description = fRep.Rations.ToString() } };

                            if (isInsert)
                                await context.ProviderFacilities.Insert(facilityProvider);
                            else
                                await context.ProviderFacilities.Update(facilityProvider);
                        }
                    }
                    else if (report.Type == ReportType.HealthcareReport)
                    {
                        var hRep = report as HealthcareReport;
                        if (facility != null)
                        {
                            var isInsert = false;
                            var facilityProvider = (await context.ProviderFacilities.Get(x => x.FacilityId == facility.Id && x.ProviderId == hRep.HealthcareProviderId)).FirstOrDefault();
                            if (facilityProvider == null)
                            {
                                facilityProvider = new ProviderFacility() { FacilityId = facility.Id, ProviderId = hRep.HealthcareProviderId };
                                isInsert = true;
                            }

                            facilityProvider.LastUpdated = hRep.DateTime;
                            facilityProvider.LastUpdateReportId = hRep.Id;
                            facilityProvider.Items = hRep.Items;
                            facilityProvider.Personnel = hRep.Personnel;

                            if (isInsert)
                                await context.ProviderFacilities.Insert(facilityProvider);
                            else
                                await context.ProviderFacilities.Update(facilityProvider);
                        }
                    }
                    else if(report.Type == ReportType.HousingReport)
                    {
                        var houseRep = report as HousingReport;
                        if(facility != null)
                        {
                            var housing = facility.Housings.FirstOrDefault(x => x.Type == houseRep.Housing.Type && x.Capacity == houseRep.Housing.Capacity);
                            if (housing != null)
                            {
                                housing.Attendance = houseRep.Housing.Attendance;
                                await context.Facilities.Update(facility);
                            }
                        }
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
                var providerClaims = user.Claims.Where(x => x.Type == ApplicationClaims.ProviderClaim).Select(s => s.Value);
                var contactClaims = user.Claims.Where(x => x.Type == ApplicationClaims.ContactClaim).Select(s => s.Value);

                var allreports = (await context.Reports.Get(x => x.Type == ReportType.Message && !x.IsAcknoledged)).Cast<Message>();
                var fReports = facilityClaims.Count() > 0
                   ? allreports.Where(x => x.RecipientType == RecipientType.Facility && facilityClaims.Contains(x.Recipient)) : new List<Message>();
                var pReports = providerClaims.Count() > 0
                   ? allreports.Where(x => x.RecipientType == RecipientType.Provider && providerClaims.Contains(x.Recipient)) : new List<Message>();
                var cReports = contactClaims.Count() > 0
                   ? allreports.Where(x => x.RecipientType == RecipientType.Contact && contactClaims.Contains(x.Recipient)) : new List<Message>();

                reports = fReports.Union(pReports).Union(cReports);
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

            var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
            var providerClaims = user.Claims.Where(x => x.Type == ApplicationClaims.ProviderClaim).Select(s => s.Value);
            var contactClaims = user.Claims.Where(x => x.Type == ApplicationClaims.ContactClaim).Select(s => s.Value);

            var reports = (await context.Reports.Get(x => x.Type == ReportType.Message && !x.IsAcknoledged)).Cast<Message>();
            var fCount = facilityClaims.Count() > 0
                ? reports.Count(x => x.RecipientType == RecipientType.Facility && facilityClaims.Contains(x.Recipient)) : 0;
            var pCount = providerClaims.Count() > 0
                ? reports.Count(x => x.RecipientType == RecipientType.Provider && facilityClaims.Contains(x.Recipient)) : 0;
            var cCount = contactClaims.Count() > 0
                ? reports.Count(x => x.RecipientType == RecipientType.Contact && facilityClaims.Contains(x.Recipient)) : 0;

            count = fCount + pCount + cCount;

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
                        entry.Description = String.Format("({0})\n{1}\n{2}", report.Facility.Name, report.Subject, report.Notes);
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
