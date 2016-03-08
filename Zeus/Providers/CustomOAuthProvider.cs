using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Zeus.Models;

namespace Zeus.Providers
{
    public class CustomOAuthProvider : OAuthAuthorizationServerProvider
    {
        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            string clientId = string.Empty;
            string clientSecret = string.Empty;
            string symmetricKeyAsBase64 = string.Empty;

            if (!context.TryGetBasicCredentials(out clientId, out clientSecret))
            {
                context.TryGetFormCredentials(out clientId, out clientSecret);
            }

            if (context.ClientId == null)
            {
                context.SetError("invalid_clientId", "client_Id is not set");
                return Task.FromResult<object>(null);
            }

            var client = ClientsStore.FindClient(context.ClientId);

            if (client == null)
            {
                context.SetError("invalid_clientId", string.Format("Invalid client_id '{0}'", context.ClientId));
                return Task.FromResult<object>(null);
            }

            context.Validated();
            return Task.FromResult<object>(null);
        }

        public async override Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();
            ApplicationUser user = await userManager.FindByNameAsync(context.UserName);

            if (user == null)
            {
                //user = new ApplicationUser();
                //user.UserName = context.UserName;
                //user.Email = string.Format("{0}@local.lc",context.UserName);
                //var result = await userManager.CreateAsync(user, context.Password);
                context.SetError("invalid_grant", "The user name is incorrect");
                return;
            }

            if (await userManager.IsLockedOutAsync(user.Id))
            {
                context.SetError("invalid_grant", "The user is LockedOut");
                return;
            }

            if (await userManager.CheckPasswordAsync(user, context.Password))
            {
                var identity = new ClaimsIdentity("JWT");

                identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
                identity.AddClaim(new Claim("sub", context.UserName));
                identity.AddClaim(new Claim(ClaimTypes.Role, "Manager"));
                identity.AddClaim(new Claim(ClaimTypes.Role, "Supervisor"));

                var props = new AuthenticationProperties(new Dictionary<string, string>
                {
                    {
                         "client", (context.ClientId == null) ? string.Empty : context.ClientId
                    }
                });

                var ticket = new AuthenticationTicket(identity, props);
                context.Validated(ticket);
                return;
            }
            else
            {
                await userManager.AccessFailedAsync(user.Id);
                if (await userManager.IsLockedOutAsync(user.Id))
                {
                    context.SetError("invalid_grant", "The user is LockedOut");
                    return;
                }
            }
        }
    }
}
