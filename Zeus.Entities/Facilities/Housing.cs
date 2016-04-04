using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Housing
    {
        [BsonRequired]
        [BsonDefaultValue("Σκηνή")]
        public string Type { get; set; }
        public int Capacity { get; set; }
        public int Attendance { get; set; }
        public int Count { get; set; }
        public int Utilization
        {
            get
            {
                if (Capacity == 0 || Count == 0)
                    return 0;
                else
                    return Convert.ToInt32(((double)Attendance / ((double)Capacity * (double)Count)) * 100D);
            }
        }
        public string Status { get; set; }
    }
}
