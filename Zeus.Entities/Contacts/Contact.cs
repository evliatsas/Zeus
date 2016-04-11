using MongoDB.Bson.Serialization.Attributes;
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
        public string Administration { get; set; }
        public IList<Phone> Phones{ get; set; }
        public string Email { get; set; }
        public string Type { get; set; }
        [BsonIgnore]
        public IList<Facility> Facilities { get; set; }
        [BsonIgnore]
        public IList<Provider> Providers { get; set; }
        [BsonIgnore]
        public string PhoneNumbers
        {
            get
            {
                string phones = Helper.ConcateStrings(this.Phones.Select(x => x.Number));

                return phones.TrimEnd('\r', '\n');
            }
        }

        public Contact()
        {
            this.Phones = new List<Phone>();
            this.Facilities = new List<Facility>();
            this.Providers = new List<Provider>();
        }
    }
}
