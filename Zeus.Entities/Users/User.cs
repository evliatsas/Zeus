using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace Zeus.Entities
{
    [BsonIgnoreExtraElements]
    public class User : Entity
    {
        public User()
        {
            this.Roles = new List<string>();
            this.Claims = new List<string>();
        }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        [BsonIgnore]
        public string Password { get; set; }
        [BsonIgnore]
        public string NewPassword { get; set; }
        [BsonIgnore]
        public string PasswordConfirm { get; set; }
        public List<string> Roles { get; set; }
        public List<string> Claims { get; set; }
    }
}
