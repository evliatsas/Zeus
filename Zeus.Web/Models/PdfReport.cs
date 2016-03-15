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
            this.reports = reports.ToList();
            var fontType = "Tahoma";
            FontFactory.RegisterDirectory(Environment.GetFolderPath(Environment.SpecialFolder.Fonts));
            titleFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 14, Font.BOLD);
            subTitleFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 12, Font.BOLD);
            normalFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, 10, Font.NORMAL);
            boldFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, 10, Font.BOLD);

            Document doc = new Document(PageSize.A4, 12, 12, 12, 12);
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
            table.DefaultCell.Border = Rectangle.BOX;

            {
                string s = string.Format("ΣΥΝΟΠΤΙΚΗ ΚΑΤΑΣΤΑΣΗ ΠΡΟΣΦΥΓΙΚΏΝ ΡΟΩΝ ΤΗΣ {0:dd/MM/yyyy} - ΩΡΑ {1:HH:mm}", reports.Max(t=>t.ReportDate), reports.Max(t=>t.ReportDateTime));
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
                string s = "ΑΦΙΞΕΙΣ - ΑΝΑΧΩΡΗΣΕΙΣ";
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
            table.SpacingBefore = 7;

            foreach(var report in reports)
            {
                {
                    string s = report.Facility.Name;
                    PdfPCell cell = new PdfPCell(new Phrase(s, normalFont));
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    cell.Border = Rectangle.BOX;
                    table.AddCell(cell);
                }
                {
                    string s = string.Format("{0}", report.Attendance);
                    PdfPCell cell = new PdfPCell(new Phrase(s, normalFont));
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    cell.Border = Rectangle.BOX;
                    table.AddCell(cell);
                }
                {
                    string s = string.Format("{0}", report.Capacity);
                    PdfPCell cell = new PdfPCell(new Phrase(s, normalFont));
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    cell.Border = Rectangle.BOX;
                    table.AddCell(cell);
                }
                {
                    string s = string.Format("{0}", report.ReportCapacity);
                    PdfPCell cell = new PdfPCell(new Phrase(s, normalFont));
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    cell.Border = Rectangle.BOX;
                    table.AddCell(cell);
                }
                {
                    string s = string.Format("{0}", report.Arrivals);
                    PdfPCell cell = new PdfPCell(new Phrase(s, normalFont));
                    cell.HorizontalAlignment = Element.ALIGN_CENTER;
                    cell.Border = Rectangle.BOX;
                    table.AddCell(cell);
                }
            }            

            return table;
        }
    }
}