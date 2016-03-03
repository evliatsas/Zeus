using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public abstract class Report : Entity
    {
        public Auth.User User { get; set; }
        public Facility Facility { get; set; }
        public DateTime DateTime { get; set; }
        
        public Report()
        {
            this.DateTime = DateTime.Now;
        }
    }
}
