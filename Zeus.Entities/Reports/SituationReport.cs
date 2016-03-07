using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class SituationReport : Report
    {
        public int PersonCount { get; set; }
        public int Children { get; set; }
        public int SensitiveCount { get; set; }

        public SituationReport()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.SituationReport;
        }
    }
}
