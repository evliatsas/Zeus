using MongoDB.Bson.Serialization.Attributes;
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
        public int PersonnelCount { get; set; }
        [BsonIgnore]
        public IList<Contact> Contacts { get; set; }
        [BsonIgnore]
        public IList<Facility> Facilities { get; set; }

        public Provider()
        {
            this.Contacts = new List<Contact>();
            this.Facilities = new List<Facility>();
        }
    }
}
