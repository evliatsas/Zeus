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
    [RoutePrefix(Zeus.Routes.Contacts)]
    public class ContactsController : ApiController
    {
        private Entities.Repositories.Context context;

        public ContactsController()
        {
            context = Entities.Repositories.Context.Instance;
        }

        [Route("")]
        [ResponseType(typeof(IEnumerable<Contact>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetContacts()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            var result = await context.Contacts.GetAll();

            return result == null ? this.Ok(new List<Contact>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.Name).AsEnumerable());
        }

        [Route("{id}")]
        [ResponseType(typeof(Contact))]
        [HttpGet]
        public async Task<IHttpActionResult> GetContact(string id)
        {
            var contact = await context.Contacts.GetById(id);

            if (contact != null)
            {
                var multiFacilities = await context.FacilityContacts.Get(x => x.ContactId == id);
                var facilityIds = multiFacilities.Select(x => x.FacilityId);
                var facilities = await context.Facilities.Get(x => facilityIds.Contains(x.Id));
                contact.Facilities = facilities.ToList();

                var multiProviders = await context.ProviderContacts.Get(x => x.ContactId == id);
                var providerIds = multiProviders.Select(x => x.ProviderId);
                var providers = await context.Providers.Get(x => providerIds.Contains(x.Id));
                contact.Providers = providers.ToList();
            }
                        
            return contact == null ? (IHttpActionResult)this.NotFound() : this.Ok(contact);
        }       

        [Route("")]
        [ResponseType(typeof(Contact))]
        [HttpPost]
        public async Task<IHttpActionResult> CreateContact(Contact contact)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                //insert contacts
                var facilities = contact.Facilities.Select(x =>
                {
                    var record = new FacilityContact()
                    {
                        ContactId = contact.Id,
                        FacilityId = x.Id
                    };
                    return record;
                });
                await context.FacilityContacts.BulkInsert(facilities);
                //insert providers
                var providers = contact.Providers.Select(x =>
                {
                    var record = new ProviderContact()
                    {
                        ProviderId = x.Id,
                        ContactId = contact.Id
                    };
                    return record;
                });
                await context.ProviderContacts.BulkInsert(providers);

                var data = await context.Contacts.Insert(contact);

                Log.Information("Contact({Contact.Id}) created By {user}", data.Id, user);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating Contact By {user}", exc, user);
                return this.BadRequest("Σφάλμα Δημιουργίας δεδομένων Ατόμου");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteContact(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Contacts.GetById(id);
                
                await context.Contacts.Delete(id);
                
                Log.Information("Contact({Contact}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Contact By {user}", exc, user);
                return this.BadRequest("Σφάλμα Διαγραφής δεδομένων Ατόμου");
            }
        }

        [Route("")]
        [ResponseType(typeof(Contact))]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateContact(Contact contact)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                //update contacts
                await context.FacilityContacts.Delete(x => x.ContactId == contact.Id);
                var facilities = contact.Facilities.Select(x =>
                {
                    var record = new FacilityContact()
                    {
                        ContactId = contact.Id,
                        FacilityId = x.Id
                    };
                    return record;
                });
                await context.FacilityContacts.BulkInsert(facilities);
                //update providers
                await context.ProviderContacts.Delete(x => x.ContactId == contact.Id);
                var providers = contact.Providers.Select(x =>
                {
                    var record = new ProviderContact()
                    {
                        ProviderId = x.Id,
                        ContactId = contact.Id
                    };
                    return record;
                });
                await context.ProviderContacts.BulkInsert(providers);

                var result = await context.Contacts.Update(contact);

                Log.Information("Contact({Contact.Id}) updated By {user}", result.Id, user);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Contact By {user}", exc, user);
                return this.BadRequest("Σφάλμα Ενημέρωσης δεδομένων Ατόμου");
            }
        }
        
    }
}
