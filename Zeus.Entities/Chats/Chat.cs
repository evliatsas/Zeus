using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Chat : Entity
    {
        public string Sender { get; set; }
        [BsonIgnore]
        public string SenderName { get; set; }
        public string Receiver { get; set; }
        [BsonIgnore]
        public string ReceiverName { get; set; }
        public string Message { get; set; }
        public DateTime Send { get; set; }
        public DateTime Oppened { get; set; }
        public ChatSatus Status { get; set; }
    }

    public enum ChatSatus
    {
        UnReaded,
        Readed,
        Archived
    }
}
