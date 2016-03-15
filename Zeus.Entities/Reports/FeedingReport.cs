using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Zeus.Entities
{
    public class FeedingReport : Report
    {
        [BsonIgnore]
        public Provider FeedingProvider { get; set; }
        public string FeedingProviderId { get; set; }
        public int Rations { get; set; }
        public string Meal { get; set; }

        public FeedingReport()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.FeedingReport;
        }
    }
}
