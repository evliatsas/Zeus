using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class FamilyRelation : Entity
    {
        public Relationship Relationship { get; set; }
        public string PersonId { get; set; }
        [BsonIgnore]
        public Person Person { get; set; }
        public string RelativeId { get; set; }
        [BsonIgnore]
        public Person Relative { get; set; }
    }

    public enum Relationship
    {
        Husband,
        Wife,
        Father,
        Mother,
        Child,
        Brother,
        Sister,
        FatherInLaw,
        MotherInLaw
    }
}
