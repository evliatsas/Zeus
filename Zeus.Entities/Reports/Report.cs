using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace Zeus.Entities
{
    [BsonDiscriminator(RootClass = true)]
    [BsonKnownTypes(
        typeof(FeedingReport), 
        typeof(HousingReport), 
        typeof(MovementReport), 
        typeof(ProblemReport), 
        typeof(RequestReport), 
        typeof(SituationReport))]
    public abstract class Report : Entity
    {
        public Auth.User User { get; set; }
        public Facility Facility { get; set; }
        public DateTime DateTime { get; set; }
        public ReportType Type { get; set; }
    }

    public enum ReportType
    {
        FeedingReport,
        HousingReport,
        MovementReport,
        ProblemReport,
        RequestReport,
        SituationReport
    }
}
