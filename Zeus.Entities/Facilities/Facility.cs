using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Zeus.Entities
{
    public class Facility : Entity
    {
        [BsonRequired]
        [BsonDefaultValue("Νέα Δομή Φιλοξενίας")]
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Area { get; set; }
        public string Type { get; set; }
        public Location Location { get; set; }
        public IList<Housing> Housings { get; set; }
        public int MaxCapacity { get; set; }
        public int ReportCapacity { get; set; }
        public int Capacity { get; set; }
        public int Attendance { get; set; }
        public int Children { get; set; }
        public int SensitiveCount { get; set; }
        public int Utilization
        {
            get
            {
                return Capacity == 0 ? 0 : Convert.ToInt32(((double)Attendance / (double)Capacity) * 100D);
            }
        }
        [BsonIgnore]
        public bool IsSecure { get { return this.Providers.Any(p => p.Type == ProviderType.Security); } }
        [BsonIgnore]
        public bool HasHealthcare { get { return this.Providers.Any(p => p.Type == ProviderType.Healthcare); } }
        public string Status { get; set; }
        public Nullable<DateTime> StatusDateTime { get; set; }
        public Nullable<DateTime> StatusECT { get; set; }
        public string Administration { get; set; }
        [BsonIgnore]
        public IList<Contact> Contacts { get; set; }
        [BsonIgnore]
        public IList<Provider> Providers { get; set; }
        [BsonIgnore]
        public IList<Provider> HealthcareProviders { get { return this.Providers.Where(x => x.Type == ProviderType.Healthcare).ToList(); } }
        [BsonIgnore]
        public IList<Provider> FeedingProviders { get { return this.Providers.Where(x => x.Type == ProviderType.Catering).ToList(); } }
        [BsonIgnore]
        public IList<Provider> LogisticsProviders { get { return this.Providers.Where(x => x.Type == ProviderType.Logistics).ToList(); } }
        public int MaxRations { get; set; }
        [BsonIgnore]
        public IList<Report> Reports { get; set; }
        [BsonIgnore]
        public int ReportsCount { get { return this.Reports.Count; } }
        [BsonIgnore]
        public IList<ProblemReport> HealthcareReports { get { return this.Reports.Where(x =>x.Type == ReportType.ProblemReport)
                    .Cast<ProblemReport>().Where(r => r.Category == ReportCategory.Healthcare).ToList(); } }
        [BsonIgnore]
        public int HealthcareReportsCount { get { return this.HealthcareReports.Count(); } }    
        [BsonIgnore]
        public IList<RequestReport> HumanitarianReports { get { return this.Reports.Where(x => x.Type == ReportType.RequestReport)
                    .Cast<RequestReport>().Where(r => r.Category == ReportCategory.Humanitarian).ToList(); } }
        [BsonIgnore]
        public IList<RequestReport> HealthRequestReports { get { return this.Reports.Where(x => x.Type == ReportType.RequestReport)
                    .Cast<RequestReport>().Where(r => r.Category == ReportCategory.Healthcare).ToList(); } }
        [BsonIgnore]
        public IList<RequestReport> EquipmentReports { get {return this.Reports.Where(x => x.Type == ReportType.RequestReport)
                    .Cast<RequestReport>().Where(r => r.Category == ReportCategory.Equipment).ToList(); } }
        [BsonIgnore]
        public IList<RequestReport> FunctionalityReports { get { return this.Reports.Where(x => x.Type == ReportType.RequestReport)
                    .Cast<RequestReport>().Where(r => r.Category == ReportCategory.Functionality).ToList(); } }
        [BsonIgnore]
        public IList<Person> Persons { get; set; }
        [BsonIgnore]
        public int PersonsCount { get; set; }
        public IList<Identity> Identities { get; set; }
        public IList<Sensitivity> Sensitivities { get; set; }
        public IList<Procedure> Procedures { get; set; }
        public string IdentitiesLastUpdatedBy { get; set; }
        public DateTime IdentitiesLastUpdated { get; set; }
        [BsonIgnore]
        public int Arrivals { get; set; }

        public Facility()
        {
            this.Contacts = new List<Contact>();
            this.Providers = new List<Provider>();
            this.Reports = new List<Report>();
            this.Persons = new List<Person>();
            this.Housings = new List<Housing>();
            this.Identities = new List<Identity>();
            this.Sensitivities = new List<Sensitivity>();
            this.Procedures = new List<Procedure>();
        }
    }
}
