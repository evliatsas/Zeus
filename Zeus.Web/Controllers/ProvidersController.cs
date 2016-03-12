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
    [RoutePrefix(Zeus.Routes.Providers)]
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
            try
            {
                var provider = await context.Providers.GetById(id);
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
            catch(Exception exc)
            {
                return this.BadRequest(exc.ToString());
            }
        }

        [Route("")]
        [ResponseType(typeof(Provider))]
        [HttpPost]
        public async Task<IHttpActionResult> CreateProvider(Provider provider)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                //insert contacts
                var contacts = provider.Contacts.Select(x =>
                {
                    var record = new ProviderContact()
                    {
                        ContactId = x.Id,
                        ProviderId = provider.Id
                    };
                    return record;
                });
                await context.ProviderContacts.BulkInsert(contacts);
                //insert facilities
                var facilities = provider.Facilities.Select(x =>
                {
                    var record = new ProviderFacility()
                    {
                        ProviderId = provider.Id,
                        FacilityId = x.Id
                    };
                    return record;
                });
                await context.ProviderFacilities.BulkInsert(facilities);

                var data = await context.Providers.Insert(provider);

                Log.Information("Provider({Id}) created By {user}", data.Id, user);
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
                var data = await context.Providers.GetById(id);
                await context.ProviderContacts.Delete(x => x.ProviderId == id);
                await context.ProviderFacilities.Delete(x => x.ProviderId == id);
                await context.Providers.Delete(id);

                Log.Warning("Provider({@Provider}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Provider By {user}", exc, user);
                return this.BadRequest("Σφάλμα Διαγραφής Προμηθευτή");
            }
        }

        [Route("")]
        [ResponseType(typeof(Provider))]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateProvider(Provider provider)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                //update contacts
                await context.ProviderContacts.Delete(x => x.ProviderId == provider.Id);
                var contacts = provider.Contacts.Select(x =>
                {
                    var record = new ProviderContact()
                    {
                        ContactId = x.Id,
                        ProviderId = provider.Id
                    };
                    return record;
                });
                await context.ProviderContacts.BulkInsert(contacts);
                //update facilities
                await context.ProviderFacilities.Delete(x => x.ProviderId == provider.Id);
                var facilities = provider.Facilities.Select(x =>
                {
                    var record = new ProviderFacility()
                    {
                        ProviderId = provider.Id,
                        FacilityId = x.Id
                    };
                    return record;
                });
                await context.ProviderFacilities.BulkInsert(facilities);

                var result = await context.Providers.Update(provider);

                Log.Information("Provider({Id}) updated By {user}", result.Id, user);

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
