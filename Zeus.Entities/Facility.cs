using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Facility : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public IList<Contact> Contacts { get; set; }
        public Location Location { get; set; }
        public IList<Person> Persons { get; set; }
        public int Capacity { get; set; }
        public int Attendance { get { return this.Persons.Count; } }
        public IList<Housing> Housings { get; set; }
        public bool IsSecure { get; set; }
        public SecurityProvider SecurityProvider { get; set; }
        public int FeedingCapacity { get; set; }
        public Contact FeedingContact { get; set; }
        public FeedingProvider FeedingProvider { get; set; }
        public string Status { get; set; }
        public Nullable<DateTime> StatusDateTime { get; set; }
        public Nullable<DateTime> StatusECT { get; set; }
        public string Administration { get; set; }

        public Facility()
        {
            this.Contacts = new List<Contact>();
            this.Persons = new List<Person>();
            this.Housings = new List<Housing>();
        }
    }
}
