using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Contact : Entity
    {
        public string Name { get; set; }
        public string Title { get; set; }
        public string Company { get; set; }
        public string Address { get; set; }
        public IList<Phone> Phones{ get; set; }
        public string Email { get; set; }
        public string Type { get; set; }

        public Contact()
        {
            this.Phones = new List<Phone>();
        }
    }
}
