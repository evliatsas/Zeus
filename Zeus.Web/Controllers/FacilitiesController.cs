using MongoDB.Driver;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Zeus.Entities;
using Zeus.Models;

namespace Zeus.Controllers
{
    [Authorize]
    [RoutePrefix(Zeus.Routes.Facilities)]
    public class FacilitiesController : BaseController
    {
        private Entities.Repositories.Context context;

        public FacilitiesController()
        {
            context = Entities.Repositories.Context.Instance;
        }

        [Route("")]
        [ResponseType(typeof(IEnumerable<Facility>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetFacilities()
        {
            try
            {
                IEnumerable<Facility> result;

                var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
                if (user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
                    result = await context.Facilities.GetAll();
                else
                {
                    var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
                    result = await context.Facilities.Get(x => facilityClaims.Contains(x.Id));
                }

                var facilitiesIds = result.Select(x => x.Id);
                var multiProviders = await context.ProviderFacilities.Get(x => facilitiesIds.Contains(x.FacilityId));
                var providerIds = multiProviders.Select(x => x.ProviderId);
                var providers = await context.Providers.Get(x => providerIds.Contains(x.Id));
                foreach (var facility in result)
                {
                    facility.ReportsCount = await context.Reports.Count(x => x.FacilityId == facility.Id);
                    facility.PersonsCount = await context.Persons.Count(x => x.FacilityId == facility.Id);
                    var problemReports = await context.Reports.Get(x => x.FacilityId == facility.Id && !x.IsArchived && x.Type == ReportType.ProblemReport);
                    facility.HealthcareReportsCount = problemReports.Cast<ProblemReport>().Count(x => x.Category == ReportCategory.Healthcare);
                    var tmpProviderIds = multiProviders.Where(x => x.FacilityId == facility.Id).Select(p => p.ProviderId);
                    facility.Providers = providers.Where(x => tmpProviderIds.Contains(x.Id)).ToList();
                }

                return result == null ? this.Ok(new List<Facility>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.Name).AsEnumerable());
            }
            catch (Exception exc)
            {
                return this.BadRequest(exc.ToString());
            }
        }

        [Route("{id}")]
        [ResponseType(typeof(Facility))]
        [HttpGet]
        public async Task<IHttpActionResult> GetFacility(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
            if (!user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
                if (!facilityClaims.Contains(id))
                {
                    Log.Fatal("Security violation. User {user} requested Facility Info {facility} with insufficient rights", user.UserName, id);
                    return this.BadRequest("Δεν έχεται το δικαίωμα να δείτε την εγγραφή που ζητήσατε.");
                }
            }

            var facility = await context.Facilities.GetById(id);
            if (facility != null)
            {
                var multiContacts = await context.FacilityContacts.Get(x => x.FacilityId == id);
                var contactIds = multiContacts.Select(x => x.ContactId);
                var contacts = await context.Contacts.Get(x => contactIds.Contains(x.Id));
                facility.Contacts = contacts.ToList();

                var multiProviders = await context.ProviderFacilities.Get(x => x.FacilityId == id);
                var providerIds = multiProviders.Select(x => x.ProviderId);
                var providers = await context.Providers.Get(x => providerIds.Contains(x.Id));
                facility.Providers = providers.ToList();

                var persons = await context.Persons.Get(x => x.FacilityId == id);
                facility.Persons = persons.ToList();

                var reports = await context.Reports.Get(x => x.FacilityId == id);
                facility.Reports = reports.ToList();
            }

            return facility == null ? (IHttpActionResult)this.NotFound() : this.Ok(facility);
        }

        [Route("")]
        [ResponseType(typeof(Facility))]
        [HttpPost]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<IHttpActionResult> CreateFacility(Facility facility)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                //check for Name unique
                var exists = await context.Facilities.Count(x => x.Name == facility.Name);
                if (exists > 0)
                {
                    Log.Error("Integrity violation. User {user} requested Facility Name {facility} that already exists", user.UserName, facility.Name);
                    return this.BadRequest("Το όνομα που επιλέξατε υπάρχει ήδη σε άλλη Δομή Φιλοξενίας.");
                }

                //insert contacts
                var contacts = facility.Contacts.Select(x =>
                {
                    var record = new FacilityContact()
                    {
                        ContactId = x.Id,
                        FacilityId = facility.Id
                    };
                    return record;
                });
                await context.FacilityContacts.BulkInsert(contacts);
                //insert providers
                var providers = facility.Providers.Select(x =>
                {
                    var record = new ProviderFacility()
                    {
                        ProviderId = x.Id,
                        FacilityId = facility.Id
                    };
                    return record;
                });
                await context.ProviderFacilities.BulkInsert(providers);

                var data = await context.Facilities.Insert(facility);

                Log.Information("Facility({Facility.Id}) created By {user}", data.Id, user.UserName);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating Facility By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Δημιουργίας Δομής Φιλοξενίας");
            }
        }

        [Route("")]
        [ResponseType(typeof(Facility))]
        [HttpPut]
        [Authorize(Roles = ApplicationRoles.Administrator + "," + ApplicationRoles.User)]
        public async Task<IHttpActionResult> UpdateFacility(Facility facility)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
            if (!user.Roles.Any(x => x == ApplicationRoles.Administrator))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
                if (!facilityClaims.Contains(facility.Id))
                {
                    Log.Fatal("Security violation. User {user} requested to Update Facility Info {facility} with insufficient rights", user.UserName, facility.Id);
                    return this.BadRequest("Δεν έχεται το δικαίωμα να ενημερώσεται την εγγραφή.");
                }
            }

            try
            {
                //update contacts
                await context.FacilityContacts.Delete(x => x.FacilityId == facility.Id);
                var contacts = facility.Contacts
                                       .Select(x =>
                                        new FacilityContact()
                                        {
                                            ContactId = x.Id,
                                            FacilityId = facility.Id
                                        })
                                       .ToList();
                await context.FacilityContacts.BulkInsert(contacts);

                //update providers
                await context.ProviderFacilities.Delete(x => x.FacilityId == facility.Id);
                var providers = facility.Providers
                                        .Select(x =>
                                        new ProviderFacility()
                                        {
                                            ProviderId = x.Id,
                                            FacilityId = facility.Id
                                        })
                                        .ToList();
                await context.ProviderFacilities.BulkInsert(providers);

                var result = await context.Facilities.Update(facility);

                Log.Information("Facility({Facility.Id}) updated By {user}", result.Id, user.UserName);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Facility By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Ενημέρωσης Δομής Φιλοξενίας");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        [Authorize(Roles = ApplicationRoles.Administrator)]
        public async Task<IHttpActionResult> DeleteFacility(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var data = await context.Facilities.GetById(id);
                await context.Facilities.Delete(id);
                await context.FacilityContacts.Delete(x => x.FacilityId == id);
                await context.ProviderFacilities.Delete(x => x.FacilityId == id);

                // clean up persons facility
                var filter = Builders<Person>.Filter.Eq("FacilityId", id);
                var definition = Builders<Person>.Update.Set("FacilityId", string.Empty);
                await context.Persons.UpdateMany(filter, definition);

                Log.Warning("Facility({@Facility}) deleted By {user}", data, user.UserName);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Facility By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Διαγραφής Δομής Φιλοξενίας");
            }
        }

        [Route("makereport/{id}")]
        [ResponseType(typeof(IEnumerable<Facility>))]
        [HttpGet]
        public async Task<IHttpActionResult> MakeReport(string id)
        {
            try
            {
                bool isNew = false;
                DailyReport report;
                DailyReport previousReport;
                Facility facility;
                DateTime date = DateTime.Now.Date;
                DateTime previousDate = date.AddDays(-1);

                var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
                if (user.Roles.Any(x => x != ApplicationRoles.Administrator))
                {
                    var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
                    if (!facilityClaims.Contains(id))
                    {
                        return this.BadRequest("Δεν έχετε δικαίωμα στη συγκεκριμένη δομή.");
                    }
                }

                facility = await context.Facilities.GetById(id);
                previousReport = (await context.DailyReports.Get(x => x.FacilityId == id && x.ReportDate == previousDate)).FirstOrDefault();
                report = (await context.DailyReports.Get(x => x.FacilityId == id && x.ReportDate == date)).FirstOrDefault();

                if (report == null)
                {
                    report = new DailyReport();
                    isNew = true;
                }
                else
                {
                    isNew = false;
                }

                report.FacilityId = facility.Id;
                report.ReportDateTime = DateTime.Now;
                report.Arrivals = previousReport == null ? 0 : facility.Attendance - previousReport.Attendance;
                report.Attendance = facility.Attendance;
                report.Capacity = facility.Capacity;
                report.ReportDate = date;
                report.ReportCapacity = facility.ReportCapacity;

                if (isNew)
                {
                    await context.DailyReports.Insert(report);
                }
                else
                {
                    await context.DailyReports.Update(report);
                }

                Log.Information("DailyReport({Facility.Id}) created By {user}", facility.Id, user.UserName);

                return Ok();
            }
            catch (Exception exc)
            {
                return this.BadRequest(exc.ToString());
            }
        }

        [AllowAnonymous]
        [Route("getreport/pdf/{year}/{month}/{day}")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetPdfReport(int year, int month, int day)
        {
            try
            {
                var date = new DateTime(year, month, day);
                var facilities = await context.Facilities.GetAll();
                var reports = (await context.DailyReports.Get(x => x.ReportDate == date));
                if (reports == null || reports.Count() == 0)
                {
                    var errorResult = Request.CreateResponse(HttpStatusCode.OK);
                    errorResult.Content = new StringContent("Report not exist for date.");
                    return errorResult;
                }

                reports = reports.Select(x =>
                {
                    x.Facility = facilities.FirstOrDefault(t => t.Id == x.FacilityId);
                    return x;
                });

                var pdfReport = new PdfReport();
                var pdf = pdfReport.PrintPdfReport(reports);
                var result = Request.CreateResponse(HttpStatusCode.OK);
                result.Content = new ByteArrayContent(pdf);
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

                return result;
            }
            catch (Exception exc)
            {
                var errorResult = Request.CreateResponse(HttpStatusCode.BadRequest);
                errorResult.Content = new StringContent(exc.ToString());
                return errorResult;
            }
        }

        [Route("getreport/view/{year}/{month}/{day}")]
        [ResponseType(typeof(IEnumerable<DailyReport>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetViewReport(int year, int month, int day)
        {
            try
            {
                var date = new DateTime(year, month, day);
                var facilities = await context.Facilities.GetAll();
                var reports = (await context.DailyReports.Get(x => x.ReportDate == date));
                
                reports = reports.Select(x =>
                {
                    x.Facility = facilities.FirstOrDefault(t => t.Id == x.FacilityId);
                    return x;
                });

                return Ok(reports);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.ToString());
            }
        }

        [Route("getreport/view")]
        [ResponseType(typeof(IEnumerable<DailyReport>))]
        [HttpPost]
        public async Task<IHttpActionResult> GetViewReports(dynamic dates)
        {
            try
            {
                DateTime from = Convert.ToDateTime(dates.from);
                DateTime to = Convert.ToDateTime(dates.to);

                var facilities = await context.Facilities.GetAll();
                var reports = (await context.DailyReports.Get(x => x.ReportDate >= from && x.ReportDate <= to));
                //if (reports == null || reports.Count() == 0)
                //{
                //    return BadRequest("Report not exist for date.");
                //}

                reports = reports.Select(x =>
                {
                    x.Facility = facilities.FirstOrDefault(t => t.Id == x.FacilityId);
                    return x;
                });

                return Ok(reports);
            }
            catch (Exception exc)
            {
                return BadRequest(exc.ToString());
            }
        }
    }
}
