using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities.Users
{
    public static class Claims
    {
        public const string FacilityClaim = "Facility";
        public const string ContactClaim = "Contact";
        public const string ProviderClaim = "Provider";
    }

    public static class Roles
    {
        public const string Administrator = "Administrator";
        public const string User = "User";
        public const string Viewer = "Viewer";
    }
}
