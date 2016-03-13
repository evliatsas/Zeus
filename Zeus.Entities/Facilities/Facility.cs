using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Zeus.Entities
{
    public class Facility : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Type { get; set; }
        public Location Location { get; set; }
        public IList<Housing> Housings { get; set; }
        public int MaxCapacity { get; set; }
        public int Capacity { get; set; }
        public int Attendance { get; set; }
        public int Children { get; set; }
        public int SensitiveCount { get; set; }
        public int Utilization
        {
            get
            {
                return Capacity == 0 ? 0 : Convert.ToInt32(((double)Attendance / (double)Capacity) * 100D);
            }
        }
        public bool IsSecure { get { return this.Providers.Any(p => p.Type == ProviderType.Security); } }
        public bool HasHealthcare { get { return this.Providers.Any(p => p.Type == ProviderType.Healthcare); } }
        public string Status { get; set; }
        public Nullable<DateTime> StatusDateTime { get; set; }
        public Nullable<DateTime> StatusECT { get; set; }
        public string Administration { get; set; }
        [BsonIgnore]
        public IList<Contact> Contacts { get; set; }
        [BsonIgnore]
        public IList<Provider> Providers { get; set; }
        [BsonIgnore]
        public int ReportsCount { get; set; }
        [BsonIgnore]
        public IList<Report> Reports { get; set; }
        [BsonIgnore]
        public int PersonsCount { get; set; }
        [BsonIgnore]
        public IList<Person> Persons { get; set; }


        public Facility()
        {
            this.Contacts = new List<Contact>();
            this.Providers = new List<Provider>();
            this.Reports = new List<Report>();
            this.Persons = new List<Person>();
            this.Housings = new List<Housing>();
        }
    }
}
