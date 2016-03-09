using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel;

namespace Zeus.Entities
{
    [BsonDiscriminator(RootClass = true)]
    [BsonKnownTypes(
        typeof(FeedingReport), 
        typeof(HousingReport), 
        typeof(MovementReport), 
        typeof(ProblemReport), 
        typeof(RequestReport), 
        typeof(SituationReport),
        typeof(Message))]
    public abstract class Report : Entity
    {
        public string User { get; set; }
        public string FacilityId { get; set; }
        [BsonIgnore]
        public Facility Facility { get; set; }
        public DateTime DateTime { get; set; }
        public ReportPriority Priority { get; set; }
        public string Subject { get; set; }
        public ReportType Type { get; set; }
        public bool IsAcknoledged { get; set; }
        public bool IsArchived { get; set; }
    }

    public enum ReportType
    {
        FeedingReport,
        HousingReport,
        MovementReport,
        ProblemReport,
        RequestReport,
        SituationReport,
        Message
    }

    public enum ReportPriority
    {
        [Description("ΚΟΙΝΟ")]
        Routine,
        [Description("ΕΠΕΙΓΟΝ")]
        Priority,
        [Description("ΚΑΤΕΠΕΙΓΟΝ")]
        OpsImmediate,
        [Description("ΑΜΕΣΟ")]
        Immediate,
        [Description("ΑΣΤΡΑΠΙΑΙΟ")]
        Flash
    }
}
