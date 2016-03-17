using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class SituationReport : Report
    {
        public IList<Identity> Identities { get; set; }
        public IList<Sensitivity> Sensitivities { get; set; }

        public SituationReport()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.SituationReport;
            this.Identities = new List<Identity>();
            this.Sensitivities = new List<Sensitivity>();
        }
    }
}
