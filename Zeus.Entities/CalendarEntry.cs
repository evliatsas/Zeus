using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zeus.Entities
{
    public class CalendarEntry : Entity
    {
        public string SourceId { get; set; }
        public DateTime DateTime { get; set; }
        public string Author { get; set; }
        public string Description { get; set; }
        public string Actions { get; set; }

        public CalendarEntry()
        {
            this.DateTime = DateTime.Now;
        }

        public CalendarEntry(Report report, string author)
        {
            this.SourceId = report.Id;
            this.DateTime = report.DateTime;
            this.Author = author;
            this.Description = String.Format("{0}\n{1}\n{2}", report.Facility.Name, report.Subject, report.Notes);
        }

        public CalendarEntry(Operation operation)
        {
            this.SourceId = operation.Id;
            this.DateTime = DateTime.Now;
            this.Author = "Κέντρο Επιχειρήσεων";
            this.Description = String.Format("{0}\n{1}", operation.Name, operation.ReportedProblems);
        }
    }
}
