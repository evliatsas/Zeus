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
        public string Administration { get; set; }
        public string Instructions { get; set; }  
        [BsonIgnore]
        public IList<Contact> Contacts { get; set; }       
        [BsonRequired]
        [BsonDefaultValue(ProviderType.Security)]
        public ProviderType Type { get; set; }
        [BsonIgnore]
        public IList<ProviderFacility> ProviderFacilities { get; set; }
        [BsonIgnore]
        public IEnumerable<Facility> Facilities { get { return this.ProviderFacilities.Where(p => p.Facility != null).Select(x => x.Facility); } }
        [BsonIgnore]
        public int PersonnelCount { get { return this.ProviderFacilities.Sum(x => x.TotalPersonnel); } }

        public Provider()
        {
            this.Contacts = new List<Contact>();
            this.ProviderFacilities = new List<ProviderFacility>();   
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
