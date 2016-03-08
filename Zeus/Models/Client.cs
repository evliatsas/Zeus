using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Models
{
    public class Client
    {
        public string ClientId { get; set; }        
        public string Base64Secret { get; set; }        
        public string Name { get; set; }
    }
}
