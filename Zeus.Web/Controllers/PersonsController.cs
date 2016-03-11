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
    [RoutePrefix(Zeus.Routes.Persons)]
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
            var person = await context.Persons.GetById(id);
            if (person != null)
            {
                if(!string.IsNullOrEmpty(person.FacilityId))
                {
                    var facility = await context.Facilities.GetById(person.FacilityId);
                    person.Facility = facility;
                }
            }

            var relatives = await context.FamilyRelations.Get(x => x.PersonId == id || x.RelativeId == id);

            if (relatives.Count() > 0)
            {
                person.Relatives = relatives.Select(async relationship =>
                                            {
                                                relationship.Person = await context.Persons.GetById(relationship.PersonId);
                                                relationship.Relative = await context.Persons.GetById(relationship.RelativeId);

                                                return relationship;
                                            })
                                            .Select(task => task.Result)
                                            .ToList();
            }

            return person == null ? (IHttpActionResult)this.NotFound() : this.Ok(person);
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
                return this.BadRequest("Σφάλμα Δημιουργίας δεδομένων Ατόμου");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<IHttpActionResult> DeletePerson(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.Persons.GetById(id);
                await context.FamilyRelations.Delete(x => x.PersonId == id || x.RelativeId == id);
                await context.Persons.Delete(id);
                
                Log.Information("Person({Person}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Person By {user}", exc, user);
                return this.BadRequest("Σφάλμα Διαγραφής δεδομένων Ατόμου");
            }
        }

        [Route("")]
        [ResponseType(typeof(Person))]
        [HttpPut]
        public async Task<IHttpActionResult> UpdatePerson(Person person)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

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

                Log.Information("Person({Person.Id}) updated By {user}", result.Id, user);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Person By {user}", exc, user);
                return this.BadRequest("Σφάλμα Ενημέρωσης δεδομένων Ατόμου");
            }
        }

        #region Family Relations

        [Route(Routes.FamilyRelations + "/{id}")]
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

        [Route(Routes.FamilyRelations)]
        [ResponseType(typeof(Person))]
        [HttpPost]
        public async Task<IHttpActionResult> CreateFamilyRelation(FamilyRelation relation)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.FamilyRelations.Insert(relation);

                Log.Information("FamilyRelation({FamilyRelation}) created By {user}", data, user);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating FamilyRelation By {user}", exc, user);
                return this.BadRequest("Σφάλμα Δημιουργίας Συγγένιας Ατόμων");
            }
        }

        [Route(Routes.FamilyRelations + "/{id}")]
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteFamilyRelation(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var data = await context.FamilyRelations.GetById(id);
                await context.FamilyRelations.Delete(id);

                Log.Information("FamilyRelation({FamilyRelation}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting FamilyRelation By {user}", exc, user);
                return this.BadRequest("Σφάλμα Διαγραφής Συγγένιας Ατόμων");
            }
        }

        [Route(Routes.FamilyRelations)]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateFamilyRelation(FamilyRelation relation)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            try
            {
                var result = await context.FamilyRelations.Update(relation);

                Log.Information("FamilyRelation({FamilyRelation.Id}) updated By {user}", result.Id, user);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating FamilyRelation By {user}", exc, user);
                return this.BadRequest("Σφάλμα Ενημέρωσης Συγγένιας Ατόμων");
            }
        }

        #endregion
    }
}
