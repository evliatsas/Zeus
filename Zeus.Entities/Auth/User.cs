using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities.Auth
{
    public class User : Entity
    {
        public Contact Contact { get; set; }
    }
}
