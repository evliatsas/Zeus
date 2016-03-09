using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class MovementReport : Report
    {
        [BsonIgnore]
        public Facility StartingPoint
        {
            get { return this.Facility; }
            set { this.Facility = value; this.FacilityId = value.Id; }
        }
        public string DestinationFacilityId { get; set; }
        [BsonIgnore]
        public Facility Destination { get; set; }
        public int PersonCount { get; set; }
        public Transportation Transportation { get; set; }
        public DateTime Departure { get; set; }
        public DateTime ETA { get; set; }
        public string MovementType { get; set; }
        public bool IsTransportHired { get; set; }

        public MovementReport()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.MovementReport;
        }
    }
}
