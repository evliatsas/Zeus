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
    [RoutePrefix(Zeus.Routes.ProvidersController)]
    public class ProvidersController : ApiController
    {
        private Entities.Repositories.Context context;

        public ProvidersController()
        {
            context = Entities.Repositories.Context.Instance;
        }

        [Route("")]
        [ResponseType(typeof(IEnumerable<Provider>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetProviders()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            var result = await context.Providers.GetAll();

            return result == null ? this.Ok(new List<Provider>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.Name).AsEnumerable());
        }

        [Route("{id}")]
        [ResponseType(typeof(Provider))]
        [HttpGet]
        public async Task<IHttpActionResult> GetProvider(string id)
        {
            var result = await context.Providers.Get(x => x.Id == id);
            var provider = result.FirstOrDefault();
            if (provider != null)
            {
                var multiContacts = await context.ProviderContacts.Get(x => x.ProviderId == id);
                var contactIds = multiContacts.Select(x => x.ContactId);
                var contacts = await context.Contacts.Get(x => contactIds.Contains(x.Id));
                provider.Contacts = contacts.ToList();

                var multiFacilities = await context.ProviderFacilities.Get(x => x.ProviderId == id);
                var facilityIds = multiFacilities.Select(x => x.FacilityId);
                var facilities = await context.Facilities.Get(x => facilityIds.Contains(x.Id));
                provider.Facilities = facilities.ToList();
            }

            return provider == null ? (IHttpActionResult)this.NotFound() : this.Ok(provider);
        }

        [Route("")]
        [ResponseType(typeof(Provider))]
        [HttpPost]
        public async Task<IHttpActionResult> CreateProvider(Provider provider)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Providers.Insert(provider);

                Log.Information("Provider({Provider.Id}) created By {user}", data.Id, user);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating Provider By {user}", exc, user);
                return this.BadRequest("Σφάλμα Δημιουργίας Προμηθευτή");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteProvider(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Providers.Get(x => x.Id == id);
                await context.Providers.Delete(id);
                await context.ProviderContacts.Delete(x => x.ProviderId == id);
                await context.ProviderFacilities.Delete(x => x.ProviderId == id);

                Log.Information("Provider({Provider}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Provider By {user}", exc, user);
                return this.BadRequest("Σφάλμα Διαγραφής Προμηθευτή");
            }
        }

        [Route("")]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateProvider(Provider provider)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var result = await context.Providers.Update(provider);

                Log.Information("Provider({Provider.Id}) updated By {user}", result.Id, user);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Provider By {user}", exc, user);
                return this.BadRequest("Σφάλμα Ενημέρωσης Προμηθευτή");
            }
        }
    }
}
