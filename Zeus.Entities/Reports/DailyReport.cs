using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class DailyReport : Entities.Entity
    {
        public string FacilityId { get; set; }
        [BsonIgnore]
        public Facility Facility { get; set; }
        public DateTime ReportDate { get; set; }
        public DateTime ReportDateTime { get; set; }
        public int Attendance { get; set; }
        public int Capacity { get; set; }
        public int ReportCapacity { get; set; }
        public int Arrivals { get; set; }
    }
}
