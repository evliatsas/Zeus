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

namespace Zeus.Controllers
{
    //[ActionFilters.GzipCompressed]
    [RoutePrefix(Zeus.Routes.Facilities)]
    public class FacilitiesController : ApiController
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
                var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

                var result = await context.Facilities.GetAll();

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
            var facility = await context.Facilities.GetById(id);
            if (facility != null)
            {
                var multiContacts = await context.FacilityContacts.Get(x => x.FacilityId == id);
                var contactIds = multiContacts.Select(x => x.ContactId);
                facility.Contacts = context.GetContactsLookup().Where(x => contactIds.Contains(x.Id)).ToList();

                var multiProviders = await context.ProviderFacilities.Get(x => x.FacilityId == id);
                var providerIds = multiProviders.Select(x => x.ProviderId);
                facility.Providers = context.GetProvidersLookup().Where(x => providerIds.Contains(x.Id)).ToList();

                var reports = await context.Reports.Get(x => x.Facility.Id == id);
                facility.Reports = reports.ToList();
            }

            return facility == null ? (IHttpActionResult)this.NotFound() : this.Ok(facility);
        }

        [Route("")]
        [ResponseType(typeof(Facility))]
        [HttpPost]
        public async Task<IHttpActionResult> CreateFacility(Facility facility)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Facilities.Insert(facility);

                Log.Information("Facility({Facility.Id}) created By {user}", data.Id, user);
                return this.Ok(data);
            }
            catch(Exception exc)
            {
                Log.Error("Error {Exception} creating Facility By {user}", exc, user);
                return this.BadRequest("Σφάλμα Δημιουργίας Δομής Φιλοξενίας");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteFacility(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

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

                Log.Information("Facility({Facility}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch(Exception exc)
            {
                Log.Error("Error {Exception} deleting Facility By {user}", exc, user);
                return this.BadRequest("Σφάλμα Διαγραφής Δομής Φιλοξενίας");
            }
        }

        [Route("")]
        [ResponseType(typeof(Facility))]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateFacility(Facility facility)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var result = await context.Facilities.Update(facility);

                Log.Information("Facility({Facility.Id}) updated By {user}", result.Id, user);

                return this.Ok(result);
            }
            catch(Exception exc)
            {
                Log.Error("Error {Exception} updating Facility By {user}", exc, user);
                return this.BadRequest("Σφάλμα Ενημέρωσης Δομής Φιλοξενίας");
            }
        }

        [Route(Routes.Persons)]
        [ResponseType(typeof(IEnumerable<Person>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetFacilityPersons(string id)
        {
            var result = await context.Persons.Get(x => x.FacilityId == id);

            return result == null ? (IHttpActionResult)this.NotFound() : this.Ok(result);
        }

        #region Contacts

        [Route(Routes.Contacts)]
        [ResponseType(typeof(FacilityContact))]
        [HttpPost]
        public async Task<IHttpActionResult> CreateFacilityContact(FacilityContact providerContact)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.FacilityContacts.Insert(providerContact);

                Log.Information("FacilityContact({FacilityContact}) created By {user}", data, user);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating FacilityContact By {user}", exc, user);
                return this.BadRequest("Σφάλμα Δημιουργίας Συνδέσμου Δομής Φιλοξενίας");
            }
        }

        [Route(Routes.Contacts + "/{id}")]
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteFacilityContact(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.FacilityContacts.GetById(id);
                await context.FacilityContacts.Delete(id);

                Log.Information("FacilityContact({FacilityContact}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting FacilityContact By {user}", exc, user);
                return this.BadRequest("Σφάλμα Διαγραφής Συνδέσμων Δομής Φιλοξενίας");
            }
        }

        [Route(Routes.Contacts)]
        [ResponseType(typeof(FacilityContact))]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateFacilityContact(FacilityContact providerContact)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var result = await context.FacilityContacts.Update(providerContact);

                Log.Information("FacilityContact({FacilityContact}) updated By {user}", result, user);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating FacilityContact By {user}", exc, user);
                return this.BadRequest("Σφάλμα Ενημέρωσης Συνδέσμου Δομής Φιλοξενίας");
            }
        }

        #endregion
    }
}
