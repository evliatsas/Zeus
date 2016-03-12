using Serilog;
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
            IEnumerable<Provider> result;

            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);
            if (user.Roles.Any(x => x == Roles.Administrator || x == Roles.Viewer))
                result = await context.Providers.GetAll();
            else
            {
                var facilityClaims = user.Claims.Where(x => x.Type == Claims.FacilityClaim).Select(s => s.Value);
                var facilityProviders = (await context.ProviderFacilities.Get(x => facilityClaims.Contains(x.FacilityId))).Select(s => s.ProviderId);
                result = await context.Providers.Get(x => facilityProviders.Contains(x.Id));
            }

            return result == null ? this.Ok(new List<Provider>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.Name).AsEnumerable());            
        }

        [Route("{id}")]
        [ResponseType(typeof(Provider))]
        [HttpGet]
        public async Task<IHttpActionResult> GetProvider(string id)
        {
            try
            {
                var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);
                if (!user.Roles.Any(x => x == Roles.Administrator || x == Roles.Viewer))
                {
                    var facilityClaims = user.Claims.Where(x => x.Type == Claims.FacilityClaim).Select(s => s.Value);
                    var facilityProviders = (await context.ProviderFacilities.Get(x => facilityClaims.Contains(x.FacilityId))).Select(s => s.ProviderId);
                    if (!facilityProviders.Contains(id))
                    {
                        Log.Fatal("Security violation. User {user} requested Provider Info {provider} with insufficient rights", user.UserName, id);
                        return this.BadRequest("Δεν έχεται το δικαίωμα να δείτε την εγγραφή που ζητήσατε.");
                    }
                }

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
        [Authorize(Roles = Roles.Administrator + "," + Roles.User)]
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

                Log.Information("Provider({Id}) created By {user}", data.Id, user.UserName);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating Provider By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Δημιουργίας Προμηθευτή");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        [Authorize(Roles = Roles.Administrator + "," + Roles.User)]
        public async Task<IHttpActionResult> DeleteProvider(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Providers.GetById(id);
                await context.ProviderContacts.Delete(x => x.ProviderId == id);
                await context.ProviderFacilities.Delete(x => x.ProviderId == id);
                await context.Providers.Delete(id);

                Log.Warning("Provider({@Provider}) deleted By {user}", data, user.UserName);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Provider By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Διαγραφής Προμηθευτή");
            }
        }

        [Route("")]
        [ResponseType(typeof(Provider))]
        [HttpPut]
        [Authorize(Roles = Roles.Administrator + "," + Roles.User)]
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

                Log.Information("Provider({Id}) updated By {user}", result.Id, user.UserName);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Provider By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Ενημέρωσης Προμηθευτή");
            }
        }
    }
}
