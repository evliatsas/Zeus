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
    [RoutePrefix(Zeus.Routes.Common)]
    public class CommonController : ApiController
    {
        private Entities.Repositories.Context context;

        public CommonController()
        {
            context = Entities.Repositories.Context.Instance;
        }

       
    }
}
