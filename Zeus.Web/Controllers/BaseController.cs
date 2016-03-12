using Microsoft.AspNet.Identity.Owin;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Zeus.Models;

namespace Zeus.Controllers
{
    public abstract class BaseController : ApiController
    {
        private ApplicationIdentityContext identityContext;
        public ApplicationIdentityContext IdentityContext
        {
            get
            {
                if (identityContext == null)
                    identityContext = Request.GetOwinContext().Get<ApplicationIdentityContext>();

                return identityContext;
            }
        }

        private ApplicationUserManager userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                if (userManager == null)
                    userManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();

                return userManager;
            }
        }        
    }
}