using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class FeedingReport : Report
    {
        public Provider FeedingProvider { get; set; }
        public int Rations { get; set; }
        public string Meal { get; set; }

        public FeedingReport()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.FeedingReport;
        }
    }
}
