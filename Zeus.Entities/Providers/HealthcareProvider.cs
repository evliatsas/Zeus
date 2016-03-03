using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class HealthcareProvider : Provider
    {
        public string Speciality { get; set; }
        public string Administration { get; set; }

        public HealthcareProvider():base()
        {
        }
    }
}
