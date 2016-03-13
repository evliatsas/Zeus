using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Operation : Entity
    {
        public ReportPriority Priority { get; set; }
        public OperationType Type { get; set; }
        public DateTime Start { get; set; }
        public DateTime ETA { get; set; }
        public Nullable<DateTime> End { get; set; }
        public string StartingPoint { get; set; }
        [BsonIgnore]
        public Facility StartFacility { get; set; }
        public string Destination { get; set; }
        [BsonIgnore]
        public Facility DestinationFacility { get; set; }
        public int PersonCount { get; set; }
        public IList<Preparation> Preparations { get; set; }
        public IList<Transportation> Transports { get; set; }  
        public IList<OperationProvider> Providers { get; set; }
        public string DestinationContactId { get; set; }
        [BsonIgnore]
        public Contact DestinationContact { get; set; }
        public bool IsCancelled { get; set; }
        [BsonIgnore]
        public string ReportedProblems
        {
            get {
                string problems = string.Empty;
                var preps = this.Preparations.Select(x => x.Problems);
                problems += ConcateStrings(preps);
                var trans = this.Transports.Select(x => x.Problems);
                problems += ConcateStrings(trans);
                var prov = this.Providers.Select(x => x.Problems);
                problems += ConcateStrings(prov);

                return problems.TrimEnd('\r', '\n');
            }
        }
        [BsonIgnore]
        public bool IsPreparationCompleted
        {
            get
            {
                return !this.Preparations.Any(x => !x.IsCompleted);
            }
        }


        public Operation()
        {
            this.Priority = ReportPriority.Routine;
            this.Type = OperationType.Transport;
            this.Start = DateTime.Now;
            this.ETA = DateTime.Now.AddHours(12);
            this.End = null;
            this.Preparations = new List<Preparation>();
            this.Transports = new List<Transportation>();
            this.Providers = new List<OperationProvider>();
            this.IsCancelled = false;
        }

        public string ConcateStrings(IEnumerable<string> strings)
        {
            string result = string.Empty;

            foreach (var s in strings)
                if(!string.IsNullOrEmpty(s))
                    result += s + "\n";

            return result;
        }
    }
}
