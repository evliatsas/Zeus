using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class OperationProvider
    {
        public string ProviderId { get; set; }
        [BsonIgnore]
        public Provider Provider { get; set; }
        public string Instructions { get; set; }
        public string Problems { get; set; }
    }
}
