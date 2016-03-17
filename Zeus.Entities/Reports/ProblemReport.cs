using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class ProblemReport : Report
    {
        public ProblemReport()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.ProblemReport;
        }

        public ProblemCategory Category { get; set; }

        public enum ProblemCategory
        {
            Humanity,
            Healthcare,
            Equipment,
            Functionality
        }
    }
}
