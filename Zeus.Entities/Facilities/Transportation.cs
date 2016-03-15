using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Transportation
    {
        [BsonRequired]
        [BsonDefaultValue("Λεωφορείο")]
        public string Type { get; set; }
        public string UniqueId { get; set; }
        public string Owner { get; set; }
        public string Instructions { get; set; }
        public string Problems { get; set; }
    }
}
