using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Message : Report
    {
        public string Sender { get { return this.User; } }
        public string Recipient { get; set; }
        public Message()
        {
            this.DateTime = DateTime.Now;
            this.Type = ReportType.Message;
        }
    }
}
