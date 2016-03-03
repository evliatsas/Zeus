using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class MovementReport : Report
    {
        public Facility StartingPoint
        {
            get { return this.Facility; }
            set { this.Facility = value; }
        }
        public Facility Destination { get; set; }
        public int PersonCount { get; set; }
        public Transportation Transportation { get; set; }
        public DateTime Departure { get; set; }
        public DateTime ETA { get; set; }
        public string MovementType { get; set; }
        public bool IsTransportHired { get; set; }

        public MovementReport():base()
        {
        }
    }
}
