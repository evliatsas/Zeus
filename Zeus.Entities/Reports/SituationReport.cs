using MongoDB.Bson.Serialization.Attributes;
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
        public IList<Procedure> Procedures { get; set; }
        [BsonIgnore]
        public int PersonCount { get { return this.Identities.Sum(x => x.Count); } }
        [BsonIgnore]
        public int SensitiveCount { get { return this.Sensitivities.Sum(x => x.Count); } }
        [BsonIgnore]
        public int ProcedureCount { get { return this.Procedures.Sum(x => x.Count); } }

        public SituationReport()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.SituationReport;
            this.Identities = new List<Identity>();
            this.Sensitivities = new List<Sensitivity>();
            this.Procedures = new List<Procedure>();
        }
    }
}
