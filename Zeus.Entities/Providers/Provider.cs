﻿using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Provider : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }      
        public int PersonnelCount { get; set; }
        public string Administration { get; set; }
        public IList<string> Items { get; set; }
        [BsonIgnore]
        public IList<Lookup> Contacts { get; set; }
        [BsonIgnore]
        public IList<Lookup> Facilities { get; set; }
        public ProviderType Type { get; set; }

        public Provider()
        {
            this.Contacts = new List<Lookup>();
            this.Facilities = new List<Lookup>();
            this.Items = new List<string>();
        }
    }

    public enum ProviderType
    {
        Healthcare,
        Logistics,
        Security,
        Catering
    }
}
