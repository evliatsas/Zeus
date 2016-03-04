using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Person : Entity
    {
        public string Name { get; set; }
        public string Passport { get; set; }
        public Nullable<int> Age { get; set; }
        public string Nationality { get; set; }
        public bool IsSensitive { get; set; }
        public string Sensitivity { get; set; }
        [BsonIgnore]
        public IList<FamilyRelation> Relatives { get; set; }
        public string FacilityId { get; set; }
        [BsonIgnore]
        public Facility Facility { get; set; }

        public Person()
        {
            this.Name = "Άγνωστο";
            this.Age = null;
            this.Nationality = "Άγνωστο";
            this.IsSensitive = false;
        }
    }    
}
