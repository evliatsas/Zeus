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
    [RoutePrefix(Zeus.Routes.Persons)]
    public class PersonsController : BaseController
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
            IEnumerable<Person> result;

            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
            if (user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
                result = await context.Persons.GetAll();
            else
            {
                var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
                result = await context.Persons.Get(x => facilityClaims.Contains(x.FacilityId));
            }

            return result == null ? this.Ok(new List<Person>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.Name).AsEnumerable());
        }

        [Route("{id}")]
        [ResponseType(typeof(Person))]
        [HttpGet]
        public async Task<IHttpActionResult> GetPerson(string id)
        {
            var person = await context.Persons.GetById(id);

            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
            if (!user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
            {
                var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
                if (!facilityClaims.Contains(person.FacilityId))
                {
                    Log.Fatal("Security violation. User {user} requested Person Info {person} with insufficient rights", user.UserName, id);
                    return this.BadRequest("Δεν έχεται το δικαίωμα να δείτε την εγγραφή που ζητήσατε.");
                }
            }
            
            if (person != null)
            {
                if(!string.IsNullOrEmpty(person.FacilityId))
                {
                    var facility = await context.Facilities.GetById(person.FacilityId);
                    person.Facility = facility;
                }
            }

            var relatives = await context.FamilyRelations.Get(x => x.PersonId == id || x.RelativeId == id);

            var personIds = relatives.Select(x => x.PersonId).ToList();
            var relativeIds = relatives.Select(x => x.RelativeId);
            personIds.AddRange(relativeIds);
            var overall = personIds.Distinct<string>();
            var persons = await context.Persons.Get(x => overall.Contains(x.Id));

            person.Relatives = relatives.Select(x =>
            {
                x.Person = persons.FirstOrDefault(p => p.Id == x.PersonId);
                x.Relative = persons.FirstOrDefault(r => r.Id == x.RelativeId);
                return x;
            }).ToList();

            return person == null ? (IHttpActionResult)this.NotFound() : this.Ok(person);
        }       

        [Route("")]
        [ResponseType(typeof(Person))]
        [HttpPost]
        [Authorize(Roles = ApplicationRoles.Administrator + "," + ApplicationRoles.User)]
        public async Task<IHttpActionResult> CreatePerson(Person person)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var data = await context.Persons.Insert(person);

                Log.Information("Person({Id}) created By {user}", data.Id, user.UserName);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating Person By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Δημιουργίας δεδομένων Ατόμου");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        [Authorize(Roles = ApplicationRoles.Administrator + "," + ApplicationRoles.User)]
        public async Task<IHttpActionResult> DeletePerson(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var data = await context.Persons.GetById(id);
                await context.FamilyRelations.Delete(x => x.PersonId == id || x.RelativeId == id);
                await context.Persons.Delete(id);
                
                Log.Warning("Person({@Person}) deleted By {user}", data, user.UserName);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Person By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Διαγραφής δεδομένων Ατόμου");
            }
        }

        [Route("")]
        [ResponseType(typeof(Person))]
        [HttpPut]
        [Authorize(Roles = ApplicationRoles.Administrator + "," + ApplicationRoles.User)]
        public async Task<IHttpActionResult> UpdatePerson(Person person)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                await context.FamilyRelations.Delete(x => x.PersonId == person.Id);

                var relatives = person.Relatives
                                      .Select(s => new FamilyRelation() {
                                        PersonId = person.Id,
                                        RelativeId = s.RelativeId,
                                        Relationship = s.Relationship
                                      }).ToList();

                await context.FamilyRelations.BulkInsert(relatives);

                var result = await context.Persons.Update(person);

                Log.Information("Person({Id}) updated By {user}", result.Id, user.UserName);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Person By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Ενημέρωσης δεδομένων Ατόμου");
            }
        }
    }
}
