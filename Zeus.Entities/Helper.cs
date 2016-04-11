using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public static class Helper
    {
        public static string ConcateStrings(IEnumerable<string> strings)
        {
            string result = string.Empty;

            foreach (var s in strings)
                if (!string.IsNullOrEmpty(s))
                    result += s + "\n";

            return result;
        }
    }
}
