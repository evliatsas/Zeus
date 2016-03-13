using MongoDB.Driver;
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

                foreach (var facility in result)
                {
                    facility.ReportsCount = await context.Reports.Count(x => x.FacilityId == facility.Id);
                    facility.PersonsCount = await context.Persons.Count(x => x.FacilityId == facility.Id);
                }

                return result == null ? this.Ok(new List<Facility>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.Name).AsEnumerable());
            }
            catch(Exception exc)
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
                if(exists > 0)
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
            catch(Exception exc)
            {
                Log.Error("Error {Exception} creating Facility By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Δημιουργίας Δομής Φιλοξενίας");
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
            catch(Exception exc)
            {
                Log.Error("Error {Exception} deleting Facility By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Διαγραφής Δομής Φιλοξενίας");
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
                                        new FacilityContact() {
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
            catch(Exception exc)
            {
                Log.Error("Error {Exception} updating Facility By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Ενημέρωσης Δομής Φιλοξενίας");
            }
        }
    }
}
