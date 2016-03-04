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
    [RoutePrefix(Zeus.Routes.PersonsController)]
    public class PersonsController : ApiController
    {
        private Entities.Repositories.Context context;

        public PersonsController()
        {
            context = Entities.Repositories.Context.Instance;
        }

        [Route("")]
        [ResponseType(typeof(IEnumerable<Person>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetPersons()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            var result = await context.Persons.GetAll();

            return result == null ? this.Ok(new List<Person>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.Name).AsEnumerable());
        }

        [Route("{id}")]
        [ResponseType(typeof(Person))]
        [HttpGet]
        public async Task<IHttpActionResult> GetPerson(string id)
        {
            var result = await context.Persons.Get(x => x.Id == id);
            var person = result.FirstOrDefault();
            if(person != null)
            {
                if(!string.IsNullOrEmpty(person.FacilityId))
                {
                    var facility = await context.Facilities.GetById(person.FacilityId);
                    person.Facility = facility;
                }
            }

            return person == null ? (IHttpActionResult)this.NotFound() : this.Ok(person);
        }

        [Route(Routes.PersonRelation + "/{id}")]
        [ResponseType(typeof(IEnumerable<FamilyRelation>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetPersonRelatives(string id)
        {
            var result = await context.Persons.Get(x => x.Id == id);
            var person = result.FirstOrDefault();
            if (person != null)
            {
                var relations = await context.FamilyRelations.Get(x => x.PersonId == id || x.RelativeId == id);
                foreach (var relative in relations)
                {
                    relative.Person = relative.PersonId == id ? person : await context.Persons.GetById(relative.PersonId);
                    relative.Relative = relative.RelativeId == id ? person : await context.Persons.GetById(relative.RelativeId);
                }

                return this.Ok(relations);
            }
            else
                return this.NotFound();
        }

        [Route("")]
        [ResponseType(typeof(Person))]
        [HttpPost]
        public async Task<IHttpActionResult> CreatePerson(Person person)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Persons.Insert(person);

                Log.Information("Person({Person.Id}) created By {user}", data.Id, user);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating Person By {user}", exc, user);
                return this.BadRequest("Σφάλμα Δημιουργίας Αναφοράς");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<IHttpActionResult> DeletePerson(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Persons.Get(x => x.Id == id);
                await context.Persons.Delete(id);
                await context.FamilyRelations.Delete(x => x.PersonId == id || x.RelativeId == id);

                Log.Information("Person({Person}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Person By {user}", exc, user);
                return this.BadRequest("Σφάλμα Διαγραφής Αναφοράς");
            }
        }

        [Route("")]
        [HttpPut]
        public async Task<IHttpActionResult> UpdatePerson(Person person)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var result = await context.Persons.Update(person);

                Log.Information("Person({Person.Id}) updated By {user}", result.Id, user);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Person By {user}", exc, user);
                return this.BadRequest("Σφάλμα Ενημέρωσης Αναφοράς");
            }
        }
    }
}
