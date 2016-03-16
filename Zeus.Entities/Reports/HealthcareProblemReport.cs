using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class HealthcareProblemReport : Report
    {
        public string Sortages { get; set; }

        public HealthcareProblemReport()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.HealthcareProblemReport;
        }
    }
}
