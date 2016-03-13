using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Preparation
    {
        public string Carrier { get; set; }
        public string Instructions { get; set; }
        public string Problems { get; set; }
        public int Completion { get; set; }
        [BsonIgnore]
        public bool IsCompleted { get { return this.Completion == 100; } }
    }
}
