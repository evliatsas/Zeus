using MongoDB.Bson.Serialization.Attributes;
using System;
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
        [BsonRequired]
        public string FacilityId { get; set; }
        [BsonIgnore]
        public Facility Facility { get; set; }
        public DateTime DateTime { get; set; }
        public Priority Priority { get; set; }
        [BsonRequired]
        [BsonDefaultValue("Νέα Αναφορά")]
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
        Message,
        HealthcareProblemReport
    }

    public enum Priority
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
