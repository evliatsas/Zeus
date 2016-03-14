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
    [RoutePrefix(Zeus.Routes.Operations)]
    public class OperationsController : BaseController
    {
        private Entities.Repositories.Context context;

        public OperationsController()
        {
            context = Entities.Repositories.Context.Instance;
        }

        [Route("")]
        [ResponseType(typeof(IEnumerable<Operation>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetOperations()
        {           
            IEnumerable<Operation> result;
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                if (user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
                    result = await context.Operations.GetAll();
                else
                {
                    var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
                    var f = await context.Facilities.Get(x => facilityClaims.Contains(x.Id));
                    var names = f.Select(x => x.Name);
                    result = await context.Operations.Get(x => names.Contains(x.StartingPoint) || names.Contains(x.Destination));
                }

                var startIds = result.Select(x => x.StartingPoint);
                var destIds = result.Select(x => x.Destination);
                var facilityIds = startIds.Union(destIds).Distinct<string>().ToList();
                var facilities = await context.Facilities.Get(x => facilityIds.Contains(x.Name));
                result = result.Select(x =>
                {
                    x.StartFacility = facilities.FirstOrDefault(f => f.Name == x.StartingPoint);
                    if (x.StartFacility == null)
                        x.StartFacility = new Facility() { Name = x.StartingPoint };
                    x.DestinationFacility = facilities.FirstOrDefault(f => f.Name == x.Destination);
                    if (x.DestinationFacility == null)
                        x.DestinationFacility = new Facility() { Name = x.Destination };

                    return x;
                });

                return result == null ? this.Ok(new List<Operation>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.Start).AsEnumerable());
            }
            catch(Exception exc)
            {
                Log.Error("Error {Exception} fetching Operations By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Ανάκτησης δεδομένων Επιχείρησης");
            }
        }

        [Route("{id}")]
        [ResponseType(typeof(Operation))]
        [HttpGet]
        public async Task<IHttpActionResult> GetOperation(string id)
        {
            var operation = await context.Operations.GetById(id);

            if (operation != null)
            {
                var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);
                if (!user.Roles.Any(x => x == ApplicationRoles.Administrator || x == ApplicationRoles.Viewer))
                {
                    var facilityClaims = user.Claims.Where(x => x.Type == ApplicationClaims.FacilityClaim).Select(s => s.Value);
                    var f = await context.Facilities.Get(x => facilityClaims.Contains(x.Id));
                    var names = f.Select(x => x.Name);
                    if (!names.Contains(operation.StartingPoint) && !names.Contains(operation.Destination))
                    {
                        Log.Fatal("Security violation. User {user} requested Operation Info {operation} with insufficient rights", user.UserName, id);
                        return this.BadRequest("Δεν έχεται το δικαίωμα να δείτε την εγγραφή που ζητήσατε.");
                    }
                }

                if(!string.IsNullOrEmpty(operation.DestinationContactId))
                    operation.DestinationContact = await context.Contacts.GetById(operation.DestinationContactId);

                var sFacility = (await context.Facilities.Get(x=>x.Name == operation.StartingPoint)).FirstOrDefault();
                if (sFacility == null)
                    operation.StartFacility = new Facility() { Name = operation.StartingPoint };
                else
                    operation.StartFacility = sFacility;

                var dFacility = (await context.Facilities.Get(x => x.Name == operation.Destination)).FirstOrDefault();
                if (dFacility == null)
                    operation.DestinationFacility = new Facility() { Name = operation.Destination };
                else
                    operation.DestinationFacility = dFacility;

                foreach (var provider in operation.Providers)
                    provider.Provider = await context.Providers.GetById(provider.ProviderId);
            }

            return operation == null ? (IHttpActionResult)this.NotFound() : this.Ok(operation);
        }

        [Route("")]
        [ResponseType(typeof(Operation))]
        [HttpPost]
        [Authorize(Roles = ApplicationRoles.Administrator + "," + ApplicationRoles.User)]
        public async Task<IHttpActionResult> CreateOperation(Operation operation)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var data = await context.Operations.Insert(operation);

                Log.Information("Operation({Id}) created By {user}", data.Id, user.UserName);
                return this.Ok(data);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} creating Operation By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Δημιουργίας δεδομένων Επιχείρησης");
            }
        }

        [Route("{id}")]
        [HttpDelete]
        [Authorize(Roles = ApplicationRoles.Administrator + "," + ApplicationRoles.User)]
        public async Task<IHttpActionResult> DeleteOperation(string id)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var data = await context.Operations.GetById(id);

                await context.Operations.Delete(id);

                Log.Warning("Operation({@Operation}) deleted By {user}", data, user);

                return this.Ok();
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} deleting Operation By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Διαγραφής δεδομένων Επιχείρησης");
            }
        }

        [Route("")]
        [ResponseType(typeof(Operation))]
        [HttpPut]
        [Authorize(Roles = ApplicationRoles.Administrator + "," + ApplicationRoles.User)]
        public async Task<IHttpActionResult> UpdateOperation(Operation operation)
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            try
            {
                var result = await context.Operations.Update(operation);

                Log.Information("Operation({Id}) updated By {user}", result.Id, user.UserName);

                return this.Ok(result);
            }
            catch (Exception exc)
            {
                Log.Error("Error {Exception} updating Operation By {user}", exc, user.UserName);
                return this.BadRequest("Σφάλμα Ενημέρωσης δεδομένων Επιχείρησης");
            }
        }
    }
}