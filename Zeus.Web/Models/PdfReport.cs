using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Zeus.Entities;

namespace Zeus.Models
{
    public class PdfReport
    {
        private Font titleFont;
        private Font subTitleFont;
        private Font normalFont;
        private Font boldFont;
        private List<DailyReport> reports;
                
        public PdfReport()
        {

        }

        public byte[] PrintPdfReport(IEnumerable<DailyReport> reports)
        {
            this.reports = reports.OrderBy(t=>t.Facility.Category).ThenBy(t=>t.Facility.Name).ToList();            
            var fontType = "Tahoma";
            FontFactory.RegisterDirectory(Environment.GetFolderPath(Environment.SpecialFolder.Fonts));
            titleFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 14, Font.BOLD);
            subTitleFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 12, Font.BOLD);
            normalFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, 10, Font.NORMAL);
            boldFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, 10, Font.BOLD);

            Document doc = new Document(PageSize.A4, 25, 25, 25, 25);
            MemoryStream stream = new MemoryStream();
            PdfWriter writer = PdfWriter.GetInstance(doc, stream);
            doc.SetPageSize(PageSize.A4);

            doc.Open();
            doc.NewPage();
            doc.Add(reportHeader());
            doc.Add(reportInfo());

            doc.Close();
            writer.Close();
            stream.Close();

            return stream.GetBuffer();
        }
        
        private PdfPTable reportHeader()
        {
            PdfPTable table = new PdfPTable(5);
            table.HorizontalAlignment = Element.ALIGN_CENTER;
            table.WidthPercentage = 100;
            table.SetWidths( new float[] { 40, 15, 15, 15, 15 });
            table.DefaultCell.Border = Rectangle.BOX;

            {
                string s = string.Format("ΣΥΝΟΠΤΙΚΗ ΚΑΤΑΣΤΑΣΗ ΠΡΟΣΦΥΓΙΚΏΝ ΡΟΩΝ ΤΗΣ {0:dd/MM/yyyy} \n ΩΡΑ {1:HH:mm}", reports.Max(t=>t.ReportDate), reports.Max(t=>t.ReportDateTime));
                PdfPCell cell = new PdfPCell(new Phrase(s, titleFont));
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Colspan = 5;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }

            {
                string s = "ΧΩΡΟΙ";
                PdfPCell cell = new PdfPCell(new Phrase(s, boldFont));
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Rowspan = 2;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }

            {
                string s = "ΠΑΡΑΜΕΝΟΥΝ";
                PdfPCell cell = new PdfPCell(new Phrase(s, boldFont));
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Rowspan = 2;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }

            {
                string s = "ΧΩΡΗΤΙΚΟΤΗΤΑ";
                PdfPCell cell = new PdfPCell(new Phrase(s, boldFont));
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Colspan = 2;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }

            {
                string s = "ΑΦΙΞΕΙΣ   ΑΝΑΧΩΡΗΣΕΙΣ";
                PdfPCell cell = new PdfPCell(new Phrase(s, boldFont));
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Rowspan = 2;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }

            {
                string s = "ΑΠΟ";
                PdfPCell cell = new PdfPCell(new Phrase(s, boldFont));
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }

            {
                string s = "ΕΩΣ";
                PdfPCell cell = new PdfPCell(new Phrase(s, boldFont));
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }

            return table;
        }
        
        private PdfPTable reportInfo()
        {
            PdfPTable table = new PdfPTable(5);
            table.HorizontalAlignment = Element.ALIGN_CENTER;
            table.WidthPercentage = 100;
            table.SetWidths(new float[] { 40, 15, 15, 15, 15 });

            var categories = reports.Select(t => t.Facility.Category).Distinct();

            foreach (var category in categories)
            {
                var rows = reports.Where(t => t.Facility.Category == category);

                PdfPCell cell = new PdfPCell(new Phrase(category, subTitleFont));
                cell.HorizontalAlignment = Element.ALIGN_LEFT;
                cell.Colspan = 5;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);

                foreach (var row in rows)
                {
                    addRow(table, row);
                }

                addSubTotal(table, category);
            }

            addTotal(table);

            return table;
        }

        private void addRow(PdfPTable table, DailyReport report)
        {
            {
                string s = report.Facility.Name;
                PdfPCell cell = new PdfPCell(new Phrase(s, normalFont));
                cell.HorizontalAlignment = Element.ALIGN_LEFT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
            {
                string s = string.Format("{0:#,###}", report.Attendance);
                PdfPCell cell = new PdfPCell(new Phrase(s, normalFont));
                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
            {
                string s = string.Format("{0:#,###}", report.Capacity);
                PdfPCell cell = new PdfPCell(new Phrase(s, normalFont));
                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
            {
                string s = string.Format("{0:#,###}", report.ReportCapacity);
                PdfPCell cell = new PdfPCell(new Phrase(s, normalFont));
                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
            {
                string s = string.Format("{0:#,###}", report.Arrivals);
                PdfPCell cell = new PdfPCell(new Phrase(s, normalFont));
                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
        }

        private void addSubTotal(PdfPTable table, string category)
        {
            var tmp = reports.Where(t => t.Facility.Category == category);
            
            {
                string s = string.Format("Σύνολα {0}" , category);
                PdfPCell cell = new PdfPCell(new Phrase(s, boldFont));
                cell.HorizontalAlignment = Element.ALIGN_LEFT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
            {
                string s = string.Format("{0:#,###}", tmp.Sum(t=>t.Attendance));
                PdfPCell cell = new PdfPCell(new Phrase(s, boldFont));
                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
            {
                string s = string.Format("{0:#,###}", tmp.Sum(t => t.Capacity));
                PdfPCell cell = new PdfPCell(new Phrase(s, boldFont));
                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
            {
                string s = string.Format("{0:#,###}", tmp.Sum(t => t.ReportCapacity));
                PdfPCell cell = new PdfPCell(new Phrase(s, boldFont));
                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
            {
                string s = string.Format("{0:#,###}", tmp.Sum(t => t.Arrivals));
                PdfPCell cell = new PdfPCell(new Phrase(s, boldFont));
                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
        }

        private void addTotal(PdfPTable table)
        {
            {
                string s = "Γενικά Σύνολα";
                PdfPCell cell = new PdfPCell(new Phrase(s, subTitleFont));
                cell.HorizontalAlignment = Element.ALIGN_LEFT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
            {
                string s = string.Format("{0:#,###}", reports.Sum(t => t.Attendance));
                PdfPCell cell = new PdfPCell(new Phrase(s, subTitleFont));
                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
            {
                string s = string.Format("{0:#,###}", reports.Sum(t => t.Capacity));
                PdfPCell cell = new PdfPCell(new Phrase(s, subTitleFont));
                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
            {
                string s = string.Format("{0:#,###}", reports.Sum(t => t.ReportCapacity));
                PdfPCell cell = new PdfPCell(new Phrase(s, subTitleFont));
                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
            {
                string s = string.Format("{0:#,###}", reports.Sum(t => t.Arrivals));
                PdfPCell cell = new PdfPCell(new Phrase(s, subTitleFont));
                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
                cell.Border = Rectangle.BOX;
                table.AddCell(cell);
            }
        }
    }
}