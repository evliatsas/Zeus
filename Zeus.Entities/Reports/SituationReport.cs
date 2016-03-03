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

        public SituationReport():base()
        {
        }
    }
}
