using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Message : Report
    {
        [BsonRequired]
        public string Sender { get { return this.User; } }
        [BsonRequired]
        public string Recipient { get; set; }
        public RecipientType RecipientType { get; set; }
        
        public Message()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.Message;
            this.RecipientType = RecipientType.Facility;
        }
    }

    public enum RecipientType
    {
        Facility,
        Provider,
        Contact
    }
}
