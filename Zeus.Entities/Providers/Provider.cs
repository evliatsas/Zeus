using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Provider : Entity
    {
        [BsonRequired]
        [BsonDefaultValue("Νέος Προμηθευτής")]
        public string Name { get; set; }
        public string Description { get; set; }      
        public int PersonnelCount { get; set; }
        public string Administration { get; set; }
        public string Instructions { get; set; }
        public IList<Personnel> Personnel { get; set; }
        [BsonIgnore]
        public int TotalPersonnel { get { return this.Personnel.Sum(x => x.PersonnelCount); } }
        public IList<Lookup> Items { get; set; }
        [BsonIgnore]
        public IList<Contact> Contacts { get; set; }
        [BsonIgnore]
        public IList<Facility> Facilities { get; set; }
        [BsonRequired]
        [BsonDefaultValue(ProviderType.Security)]
        public ProviderType Type { get; set; }

        public Provider()
        {
            this.Contacts = new List<Contact>();
            this.Facilities = new List<Facility>();
            this.Items = new List<Lookup>();
            this.Personnel = new List<Personnel>();
        }
    }

    public enum ProviderType
    {
        Healthcare,
        Logistics,
        Security,
        Catering,
        Interpreter,
        Transportation
    }
}
