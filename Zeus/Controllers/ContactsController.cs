using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Zeus.Entities;

namespace Zeus.Controllers
{
    [ActionFilters.GzipCompressed]
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
            var Contact = await context.Contacts.GetById(id);
                        
            return Contact == null ? (IHttpActionResult)this.NotFound() : this.Ok(Contact);
        }       

        [Route("")]
        [ResponseType(typeof(Contact))]
        [HttpPost]
        public async Task<IHttpActionResult> CreateContact(Contact Contact)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Contacts.Insert(Contact);

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
        public async Task<IHttpActionResult> UpdateContact(Contact Contact)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var result = await context.Contacts.Update(Contact);

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
