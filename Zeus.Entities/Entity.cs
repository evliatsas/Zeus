using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Zeus.Entities
{
    /// <summary>
    /// Base class (abstract) of every Zeus DB Stored Type (Class)
    /// </summary>
    public abstract class Entity
    {
        /// <summary>
        /// The Unique Identification (Primary Key) of the Entity
        /// </summary>
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public virtual string Id { get; set; }

        /// <summary>
        /// Data Placeholder
        /// </summary>
        public virtual object Tag { get; set; }

        /// <summary>
        /// Remarks for the specified Instance
        /// </summary>
        public virtual string Notes { get; set; }
    }
}
