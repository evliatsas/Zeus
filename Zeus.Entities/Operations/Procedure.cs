using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Procedure
    {
        public string Type { get; set; }
        public string Nationality { get; set; }
        public int Count { get; set; }
    }
}
