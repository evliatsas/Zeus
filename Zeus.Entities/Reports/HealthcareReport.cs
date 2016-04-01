using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class HealthcareReport : Report
    {
        [BsonIgnore]
        public Provider HealthcareProvider { get; set; }
        public string HealthcareProviderId { get; set; }
        public IList<Lookup> Items { get; set; }
        public IList<Personnel> Personnel { get; set; }

        public HealthcareReport()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.HealthcareReport;
            this.Items = new List<Lookup>();
            this.Personnel = new List<Personnel>();
        }
    }
}
