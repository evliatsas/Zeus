using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Zeus.Entities;

namespace Zeus.Controllers
{
    [RoutePrefix(Zeus.Routes.Common)]
    public class CommonController : ApiController
    {
        private Entities.Repositories.Context context;

        public CommonController()
        {
            context = Entities.Repositories.Context.Instance;
        }

        [AllowAnonymous]
        [Route("")]
        [ResponseType(typeof(byte[]))]
        [HttpGet]
        public async Task<HttpResponseMessage> GetFile()
        {
            try
            {
                var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);
                var report = new Models.PdfReport();
                var pdf = await report.PrintPdfReport("56daea1fb51eb41e38277437");

                var result = Request.CreateResponse(HttpStatusCode.OK);
                result.Content = new ByteArrayContent(pdf);
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                result.Content.Headers.Add("x-filename", "test.pdf");
                result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                result.Content.Headers.ContentDisposition.FileName = "test.pdf";

                return result;
            }
            catch(Exception exc)
            {
                return null;
            }
        }

        [Route("facilities")]
        [ResponseType(typeof(IEnumerable<Lookup>))]
        [HttpGet]
        public async Task<IHttpActionResult> GetFacilitiesAsLookup()
        {
            var user = await Helper.GetUserByRequest(User as ClaimsPrincipal);

            var result = context.GetFacilitiesLookup();

            return result == null ? this.Ok(new List<Lookup>().AsEnumerable()) : this.Ok(result.OrderByDescending(o => o.Description).AsEnumerable());
        }
    }
}
