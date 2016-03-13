using AspNet.Identity.MongoDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;

namespace Zeus.Models
{
    public class UserViewModel
    {
        public UserViewModel()
        {
            Roles = new List<string>();
            Claims = new List<IdentityUserClaim>();
        }
        
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public List<string> Roles { get; set; }
        public List<IdentityUserClaim> Claims { get; set; }
        public string Tag { get; set; }
        public string Notes { get; set; }   
        public string Password { get; set; }
        public string NewPassword { get; set; }
        public string PasswordConfirm { get; set; }

        public static ApplicationUser Map(ApplicationUser userTo, UserViewModel userFrom)
        {
            userTo.FullName = userFrom.FullName;
            userTo.UserName = userFrom.UserName;
            userTo.Email = userFrom.Email;
            userTo.PhoneNumber = userFrom.PhoneNumber;
            userTo.Roles = userFrom.Roles;
            userTo.Claims = userFrom.Claims;
            userTo.Tag = userFrom.Tag;
            userTo.Notes = userFrom.Notes;
            return userTo;
        }

        public static UserViewModel Map(ApplicationUser userFrom)
        {
            UserViewModel userTo = new UserViewModel();
            userTo.FullName = userFrom.FullName;
            userTo.UserName = userFrom.UserName;
            userTo.Email = userFrom.Email;
            userTo.PhoneNumber = userFrom.PhoneNumber;
            userTo.Roles = userFrom.Roles;
            userTo.Claims = userFrom.Claims;
            userTo.Tag = userFrom.Tag;
            userTo.Notes = userFrom.Notes;
            return userTo;
        }
    }
}