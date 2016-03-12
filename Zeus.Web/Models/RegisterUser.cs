using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Zeus.Models
{
    public class RegisterUser : ApplicationUser
    {
        public string Password { get; set; }
        public string NewPassword { get; set; }
        public string PasswordConfirm { get; set; }
    }
}