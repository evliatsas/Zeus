using MongoDB.Bson.Serialization.Attributes;

namespace Zeus.Entities
{
    [BsonIgnoreExtraElements]
    public class User : Entity
    {
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
    }
}
