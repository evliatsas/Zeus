using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class Housing
    {
        public string Type { get; set; }
        public int Capacity { get; set; }
        public int Attendance { get; set; }
        public int Count { get; set; }
        public int Utilization { get { return (int)((double)Attendance / (double)(Capacity * Count)) * 100; } }
        public string Status { get; set; }
    }
}
