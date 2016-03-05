using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class HousingReport : Report
    {
        public int HousedCount { get; set; }
        public Housing Housing { get; set; }

        public HousingReport()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.HousingReport;
        }
    }
}
