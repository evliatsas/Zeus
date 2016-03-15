using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Zeus.Entities;

namespace Zeus.Controllers
{
    [Authorize]
    [RoutePrefix(Zeus.Routes.Common)]
    public class CommonController : BaseController
    {
        private Entities.Repositories.Context context;

        public CommonController()
        {
            context = Entities.Repositories.Context.Instance;
        }
        
        [Route(Routes.Facilities)]
        [ResponseType(typeof(IEnumerable<Lookup>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetFacilitiesAsLookup()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            var result = context.GetFacilitiesLookup();

            return result == null ? this.Ok(new List<Lookup>().AsEnumerable()) : this.Ok(result.OrderBy(o => o.Description).AsEnumerable());
        }

        [Route(Routes.Contacts)]
        [ResponseType(typeof(IEnumerable<Lookup>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetContactsAsLookup()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            var result = context.GetContactsLookup();

            return result == null ? this.Ok(new List<Lookup>().AsEnumerable()) : this.Ok(result.OrderBy(o => o.Description).AsEnumerable());
        }

        [Route(Routes.Providers)]
        [ResponseType(typeof(IEnumerable<Lookup>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetProvidersAsLookup()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            var result = await context.GetProvidersLookup();

            return result == null ? this.Ok(new List<Lookup>().AsEnumerable()) : this.Ok(result.OrderBy(o => o.Description).AsEnumerable());
        }

        [Route(Routes.Persons)]
        [ResponseType(typeof(IEnumerable<Lookup>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetPersonsAsLookup()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal, UserManager);

            var result = context.GetPersonsLookup();

            return result == null ? this.Ok(new List<Lookup>().AsEnumerable()) : this.Ok(result.OrderBy(o => o.Description).AsEnumerable());
        }

        [Route("log")]
        [ResponseType(typeof(IEnumerable<LogEntry>))]
        [HttpPost]
        public async Task<IHttpActionResult> GetLogEntries(dynamic dates)
        {
            try
            {
                DateTime from = Convert.ToDateTime(dates.from);
                DateTime to = Convert.ToDateTime(dates.to);
                var entries = await context.GetLogEntries(from, to);

                return entries == null ? (IHttpActionResult)this.NotFound() : this.Ok(entries);
            }
            catch
            {
                return null;
            }
        }
    }
}
