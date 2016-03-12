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
            IEnumerable<Contact> result;

            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);
            if(user.Roles.Any(x=>x == Roles.Administrator || x == Roles.Viewer))
                result = await context.Contacts.GetAll();
            else
            {
                var facilityClaims = user.Claims.Where(x => x.Type == Claims.FacilityClaim).Select(s=>s.Value);
                var facilityContacts = (await context.FacilityContacts.Get(x => facilityClaims.Contains(x.FacilityId))).Select(s=>s.ContactId);
                result = await context.Contacts.Get(x => facilityContacts.Contains(x.Id));
            }
            
            return result == null ? this.Ok(new List<Contact>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.Name).AsEnumerable());
        }

        [Route("{id}")]
        [ResponseType(typeof(Contact))]
        [HttpGet]
        public async Task<IHttpActionResult> GetContact(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);
            if (!user.Roles.Any(x => x == Roles.Administrator || x == Roles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == Claims.FacilityClaim).Select(s => s.Value);
                var facilityContacts = (await context.FacilityContacts.Get(x => facilityClaims.Contains(x.FacilityId))).Select(s => s.ContactId);
                if(!facilityContacts.Contains(id))
                {
                    Log.Fatal("Security violation. User {user} requested Contact Info {contact} with insufficient rights", user.UserName, id);
                    return this.BadRequest("Δεν έχεται το δικαίωμα να δείτε την εγγραφή που ζητήσατε.");
                }
            }

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
        [Authorize(Roles = Roles.Administrator +"," + Roles.User)]
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

                Log.Information("Contact({Id}) created By {user}", data.Id, user.UserName);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating Contact By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Δημιουργίας δεδομένων Ατόμου");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        [Authorize(Roles = Roles.Administrator + "," + Roles.User)]
        public async Task<IHttpActionResult> DeleteContact(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Contacts.GetById(id);
                
                await context.Contacts.Delete(id);
                
                Log.Warning("Contact({@Contact}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Contact By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Διαγραφής δεδομένων Ατόμου");
            }
        }

        [Route("")]
        [ResponseType(typeof(Contact))]
        [HttpPut]
        [Authorize(Roles = Roles.Administrator + "," + Roles.User)]
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

                Log.Information("Contact({Id}) updated By {user}", result.Id, user.UserName);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Contact By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Ενημέρωσης δεδομένων Ατόμου");
            }
        }        
    }
}
