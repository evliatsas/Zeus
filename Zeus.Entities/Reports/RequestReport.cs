using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class RequestReport : Report
    {
        public RequestReport()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.RequestReport;
        }

        public ReportCategory Category { get; set; }        
    }

    public enum ReportCategory
    {
        Humanitarian,
        Healthcare,
        Equipment,
        Functionality
    }
}
