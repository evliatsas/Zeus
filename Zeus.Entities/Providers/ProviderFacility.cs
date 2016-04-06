using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class ProviderFacility : Entity
    {
        public string ProviderId { get; set; }
        public string FacilityId { get; set; }
        public IList<Lookup> Items { get; set; }
        public IList<Personnel> Personnel { get; set; }
        public Nullable<DateTime> LastUpdated { get; set; }
        public string LastUpdateReportId { get; set; }
        [BsonIgnore]
        public Facility Facility { get; set; }
        [BsonIgnore]
        public int TotalPersonnel { get { return this.Personnel.Sum(x => x.PersonnelCount); } }
        [BsonIgnore]
        public string ItemsText
        {
            get
            {
                var text = string.Empty;
                foreach (var item in this.Items)
                    text += String.Format("{0} ({1})\n", item.Id, item.Description);
                return text.TrimEnd(Environment.NewLine.ToCharArray());
            }
        }
        [BsonIgnore]
        public string PersonnelText
        {
            get
            {
                var text = string.Empty;
                foreach (var person in this.Personnel)
                    text += String.Format("{0} ({1})\n", person.Type, person.PersonnelCount);
                return text.TrimEnd(Environment.NewLine.ToCharArray());
            }
        }

        public ProviderFacility()
        {
            this.Items = new List<Lookup>();
            this.Personnel = new List<Personnel>();
        }
    }
}
