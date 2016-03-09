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
        public string StartingPoint { get; set; }
        public string DestinationFacilityId { get; set; }
        public string Destination { get; set; }
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
