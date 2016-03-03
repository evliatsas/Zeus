using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class LogisticsProvider : Provider
    {
        public IList<string> Items { get; set; }

        public LogisticsProvider():base()
        {
            this.Items = new List<string>();
        }
    }
}
