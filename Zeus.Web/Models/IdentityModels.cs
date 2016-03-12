using AspNet.Identity.MongoDB;
using Microsoft.AspNet.Identity;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Zeus.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public string Tag { get; set; }
        public string Notes { get; set; }        

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }        
    }

    public static class ApplicationClaims
    {
        public const string FacilityClaim = "Facility";
        public const string ContactClaim = "Contact";
        public const string ProviderClaim = "Provider";
    }

    public static class ApplicationRoles
    {
        public const string Administrator = "Administrator";
        public const string User = "User";
        public const string Viewer = "Viewer";
    }
}