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
    [ActionFilters.GzipCompressed]
    [RoutePrefix(Zeus.Routes.FacilitiesController)]
    public class FacilitiesController : ApiController
    {
        private Entities.Repositories.Context context;

        public FacilitiesController()
        {
            context = Entities.Repositories.Context.Instance;
        }

        [ResponseType(typeof(IEnumerable<Facility>))]
        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetFacilities()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            var result = await context.Facilities.GetAll();

            return result == null ? this.Ok(new List<Facility>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.Name).AsEnumerable());
        }

        [Route("{id}")]
        [ResponseType(typeof(Facility))]
        [HttpGet]
        public async Task<IHttpActionResult> GetFacility(string id)
        {
            var result = await context.Facilities.Get(x => x.Id == id);
            var facility = result.FirstOrDefault();
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
            }

            return facility == null ? (IHttpActionResult)this.NotFound() : this.Ok(facility);
        }
        
        [ResponseType(typeof(Facility))]
        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> CreateFacility(Facility Facility)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Facilities.Insert(Facility);

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
                var data = await context.Facilities.Get(x => x.Id == id);
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

        [HttpPut]
        [Route("")]
        public async Task<IHttpActionResult> UpdateFacility(Facility Facility)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var result = await context.Facilities.Update(Facility);

                Log.Information("Facility({Facility.Id}) updated By {user}", result.Id, user);

                return this.Ok(result);
            }
            catch(Exception exc)
            {
                Log.Error("Error {Exception} updating Facility By {user}", exc, user);
                return this.BadRequest("Σφάλμα Ενημέρωσης Δομής Φιλοξενίας");
            }
        }

        [Route(Routes.PersonsController)]
        [ResponseType(typeof(IEnumerable<Person>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetFacilityPersons(string id)
        {
            var result = await context.Persons.Get(x => x.FacilityId == id);

            return result == null ? (IHttpActionResult)this.NotFound() : this.Ok(result);
        }
    }
}
