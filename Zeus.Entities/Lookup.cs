using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Lookup
    {
        public string Id { get; set; }
        public string Description { get; set; }
        [BsonIgnore]
        public string Tag { get; set; }
    }
}
