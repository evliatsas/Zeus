using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public abstract class Provider : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IList<Contact> Contacts { get; set; }
        public IList<Facility> Facilities { get; set; }
        public int PersonnelCount { get; set; }

        public Provider()
        {
            this.Contacts = new List<Contact>();
            this.Facilities = new List<Facility>();
        }
    }
}
