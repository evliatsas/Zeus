using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Phone
    {
        public PhoneType Type { get; set; }
        public string Number { get; set; }
    }

    public enum PhoneType
    {
        Landline,
        Mobile,
        Fax,
        Crypto
    }
}
