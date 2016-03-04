﻿using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities.Auth
{
    public class User : Entity
    {
        public string UserName { get; set; }
        public Contact Contact { get; set; }
    }
}
