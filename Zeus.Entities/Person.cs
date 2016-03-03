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
        public FamilyRelation FamilyRelation { get; set; }

        public Person()
        {
            this.Name = "Άγνωστο";
            this.Age = null;
            this.Nationality = "Άγνωστο";
            this.IsSensitive = false;
        }
    }

    public class FamilyRelation
    {
        public Relationship Relationship { get; set; }
        public string Relative { get; set; }
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
