using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Tester
{
    class Program
    {
        static void Main(string[] args)
        {
            Task.Run(async () =>
            {
                Zeus.Entities.Repositories.Context context = new Entities.Repositories.Context();
                var facilities = await context.Facilities.GetAll();
                var ids = facilities.Select(x => x.Id);
                var dreports = await context.DailyReports.Get(x => !ids.Contains(x.FacilityId));
                foreach(var drep in dreports)
                {
                    await context.DailyReports.Delete(drep);
                }

                var reports = await context.Reports.Get(x => !ids.Contains(x.FacilityId));
                foreach (var rep in reports)
                {
                    await context.Reports.Delete(rep);
                }

            }).Wait();

            Console.ReadLine();
        }
    }
}
