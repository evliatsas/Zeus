using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Zeus.Entities;

namespace Zeus.Models
{
    public class PdfReport
    {
        private Font titleFont;
        private Font subTitleFont;
        private Font boldTableFont;
        private Font bodyFont;
        private Font boldFont;
        private int border = Rectangle.NO_BORDER;
        string fontType;
        //private int rowsPerPage = 27;

        private Report report;
        private string title;

        public PdfReport()
        {

        }

        public async Task<byte[]> PrintPdfReport(string id)
        {
            var ctx = Entities.Repositories.Context.Instance;
            report = await ctx.Reports.GetById(id);

            switch (report.Type)
            {
                case ReportType.FeedingReport:
                    title = "ΑΝΑΦΟΡΑ ΣΙΤΙΣΗΣ";
                    break;
                case ReportType.HousingReport:
                    title = "ΑΝΑΦΟΡΑ ΣΤΕΓΑΣΗΣ";
                    break;
                case ReportType.MovementReport:
                    title = "ΑΝΑΦΟΡΑ ΜΕΤΑΚΙΝΗΣΗΣ";
                    break;
                case ReportType.ProblemReport:
                    title = "ΑΝΑΦΟΡΑ ΠΡΟΒΛΗΜΑΤΟΣ";
                    break;
                case ReportType.RequestReport:
                    title = "ΑΝΑΦΟΡΑ ΑΙΤΗΣΗΣ";
                    break;
                case ReportType.SituationReport:
                    title = "ΑΝΑΦΟΡΑ ΚΑΤΑΣΤΑΣΗΣ";
                    break;
                case ReportType.Message:
                    title = "ΜΗΝΥΜΑ ΠΡΟΣ ΕΓΚΑΤΑΣΤΑΣΗ";
                    break;
            }

            return constructPdf();
        }

        private byte[] constructPdf()
        {           
            fontType = "Tahoma";
            FontFactory.RegisterDirectory(Environment.GetFolderPath(Environment.SpecialFolder.Fonts));
            titleFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 14, Font.BOLD);
            subTitleFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 12, Font.BOLD);
            boldTableFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 6, Font.BOLD);
            bodyFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, 8, Font.NORMAL);
            boldFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, 8, Font.BOLD);

            Document doc = new Document(PageSize.A4, 12, 12, 12, 12);
            MemoryStream stream = new MemoryStream();
            PdfWriter writer = PdfWriter.GetInstance(doc, stream);
            doc.SetPageSize(PageSize.A4.Rotate());
            //writer.PageEvent = new HeaderFooter();

            doc.Open();

            doc.NewPage();
            doc.Add(reportHeader());
            doc.Add(reportInfo());

            doc.Close();
            writer.Close();
            stream.Close();

            return stream.GetBuffer();
        }

        //private PdfPTable reportTitle()
        //{
        //    PdfPTable table = new PdfPTable(1);
        //    table.HorizontalAlignment = Element.ALIGN_CENTER;
        //    table.WidthPercentage = 100;
        //    table.DefaultCell.Border = border;
        //    table.SpacingAfter = 10;

        //    PdfPCell cell = new PdfPCell(new Phrase(title, titleFont));
        //    cell.HorizontalAlignment = Element.ALIGN_CENTER;
        //    cell.Border = border;
        //    table.AddCell(cell);

        //    return table;
        //}

        private PdfPTable reportHeader()
        {
            PdfPTable table = new PdfPTable(3);
            table.HorizontalAlignment = Element.ALIGN_CENTER;
            table.WidthPercentage = 100;
            table.DefaultCell.Border = border;

            {
                PdfPCell cell = new PdfPCell(reportLeftHeader());
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Border = border;
                table.AddCell(cell);
            }

            {
                PdfPCell cell = new PdfPCell(reportInfoHeader());
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Border = border;
                cell.MinimumHeight = 75;
                table.AddCell(cell);
            }

            {
                PdfPCell cell = new PdfPCell(reportRightHeader());
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Border = border;
                table.AddCell(cell);
            }

            return table;
        }

        private PdfPTable reportLeftHeader()
        {
            PdfPTable table = new PdfPTable(1);
            table.HorizontalAlignment = Element.ALIGN_CENTER;
            table.WidthPercentage = 100;
            table.DefaultCell.Border = border;

            {
                PdfPCell cell = new PdfPCell(reportLogo());
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Border = border;
                table.AddCell(cell);
            }

            

            return table;
        }

        private PdfPTable reportRightHeader()
        {
            PdfPTable table = new PdfPTable(1);
            table.HorizontalAlignment = Element.ALIGN_CENTER;
            table.WidthPercentage = 100;
            table.DefaultCell.Border = border;

            {
                PdfPCell cell = new PdfPCell(reportMessage());
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Border = border;
                cell.MinimumHeight = 201;
                table.AddCell(cell);
            }

            return table;
        }

        private PdfPTable reportLogo()
        {
            Image jpg = Image.GetInstance(global::Zeus.Properties.Resources.logo, System.Drawing.Imaging.ImageFormat.Jpeg);

            PdfPTable table = new PdfPTable(1);
            table.HorizontalAlignment = Element.ALIGN_CENTER;
            table.WidthPercentage = 100;
            table.DefaultCell.Border = border;

            PdfPCell cell = new PdfPCell(jpg);
            cell.HorizontalAlignment = Element.ALIGN_CENTER;
            cell.Border = border;
            table.AddCell(cell);

            return table;
        }

        private PdfPTable reportInfoHeader()
        {
            PdfPTable table = new PdfPTable(1);
            table.HorizontalAlignment = Element.ALIGN_CENTER;
            table.WidthPercentage = 100;
            table.DefaultCell.Border = border;

            PdfPCell cell = new PdfPCell(new Phrase(title, boldFont));
            cell.HorizontalAlignment = Element.ALIGN_CENTER;
            cell.Border = border;
            table.AddCell(cell);

            return table;
        }

        private PdfPTable reportMessage()
        {
            PdfPTable table = new PdfPTable(1);
            table.HorizontalAlignment = Element.ALIGN_CENTER;
            table.WidthPercentage = 100;
            table.DefaultCell.Border = border;

            {
                PdfPCell cell = new PdfPCell(new Phrase("ΗΜΕΡΟΜΗΝΙΑ", boldFont));
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.Border = border;
                cell.MinimumHeight = 10;
                table.AddCell(cell);
            }

            {
                PdfPCell cell = new PdfPCell(new Paragraph(report.DateTime.ToString("ddd dd/MM/yyyy")));
                cell.HorizontalAlignment = Element.ALIGN_LEFT;
                cell.Border = border;
                table.AddCell(cell);
            }

            return table;
        }

        private PdfPTable reportInfo()
        {
            PdfPTable table = new PdfPTable(2);
            table.HorizontalAlignment = Element.ALIGN_CENTER;
            table.WidthPercentage = 100;
            table.SpacingBefore = 7;

            #region Body

            table.DefaultCell.VerticalAlignment = Element.ALIGN_CENTER;
            table.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
            table.DefaultCell.Border = border;
            table.DefaultCell.Colspan = 1;
            table.DefaultCell.Rowspan = 1;

            table.AddCell(new Phrase("Θέμα:", bodyFont));
            table.AddCell(new Phrase(report.Subject, bodyFont));
            table.AddCell(new Phrase("Δομή Φιλοξενίας:", bodyFont));
            table.AddCell(new Phrase(report.Facility.Name, bodyFont));

            switch (report.Type)
            {
                case Entities.ReportType.FeedingReport:
                    var fReport = report as FeedingReport;
                    table.AddCell(new Phrase("Προμηθευτής:", bodyFont));
                    table.AddCell(new Phrase(fReport.FeedingProvider.Name, bodyFont));
                    table.AddCell(new Phrase("Γεύμα:", bodyFont));
                    table.AddCell(new Phrase(fReport.Meal, bodyFont));
                    table.AddCell(new Phrase("Μερίδες:", bodyFont));
                    table.AddCell(new Phrase(fReport.Rations.ToString(), bodyFont));
                    break;
                case Entities.ReportType.HousingReport:
                    var hReport = report as HousingReport;
                    table.AddCell(new Phrase("Είδος Στέγασης:", bodyFont));
                    table.AddCell(new Phrase(hReport.Housing.Type, bodyFont));
                    table.AddCell(new Phrase("Πλήθος Ατόμων:", bodyFont));
                    table.AddCell(new Phrase(hReport.HousedCount.ToString(), bodyFont));
                    break;
                case Entities.ReportType.MovementReport:
                    var mReport = report as MovementReport;
                    table.AddCell(new Phrase("Είδος:", bodyFont));
                    table.AddCell(new Phrase(mReport.MovementType, bodyFont));
                    table.AddCell(new Phrase("Πρός:", bodyFont));
                    table.AddCell(new Phrase(mReport.Destination, bodyFont));
                    table.AddCell(new Phrase("Πλήθος Ατόμων:", bodyFont));
                    table.AddCell(new Phrase(mReport.PersonCount.ToString(), bodyFont));
                    table.AddCell(new Phrase("Μέσο Μεταφοράς:", bodyFont));
                    table.AddCell(new Phrase(mReport.Transportation.Type, bodyFont));
                    table.AddCell(new Phrase("Αναχώρηση:", bodyFont));
                    table.AddCell(new Phrase(mReport.Departure.ToString("ddd dd/MM/yyyy HH:mm"), bodyFont));
                    table.AddCell(new Phrase("Εκτιμώμενη Άφιξη:", bodyFont));
                    table.AddCell(new Phrase(mReport.ETA.ToString("ddd dd/MM/yyyy HH:mm"), bodyFont));
                    table.AddCell(new Phrase("Ναυλωμένο:", bodyFont));
                    table.AddCell(new Phrase(mReport.IsTransportHired ? "ΝΑΙ" : "ΟΧΙ", bodyFont));
                    break;
                case Entities.ReportType.SituationReport:
                    var sReport = report as SituationReport;
                    table.AddCell(new Phrase("Πλήθος Ατόμων:", bodyFont));
                    table.AddCell(new Phrase(sReport.PersonCount.ToString(), bodyFont));
                    break;
            }

            table.AddCell(new Phrase("Σημειώσεις:", bodyFont));
            table.AddCell(new Phrase(report.Notes, bodyFont));

            #endregion

            return table;
        }
    }

    public class HeaderFooter : PdfPageEventHelper
    {
        PdfContentByte cb;
        PdfTemplate pages;
        BaseFont bf;
        Rectangle pageSize;
        int bottom = 16;
        float width = 16;
        float height = 16;

        public override void OnOpenDocument(PdfWriter writer, Document document)
        {
            FontFactory.RegisterDirectory(Environment.GetFolderPath(Environment.SpecialFolder.Fonts));
            bf = FontFactory.GetFont("Calibri", BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, 8, Font.BOLD).BaseFont;
            pages = writer.DirectContent.CreateTemplate(width, height);
            cb = writer.DirectContent;
            pageSize = document.PageSize;

            base.OnOpenDocument(writer, document);
        }

        public override void OnStartPage(PdfWriter writer, Document document)
        {
            base.OnStartPage(writer, document);
        }

        public override void OnEndPage(PdfWriter writer, Document document)
        {
            String text = "Σελίδα " + writer.PageNumber + " από ";
            float len = bf.GetWidthPoint(text, 8);

            cb.BeginText();
            cb.SetFontAndSize(bf, 8);
            cb.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, text, pageSize.GetRight(document.RightMargin + width), pageSize.GetBottom(bottom), 0);
            cb.EndText();
            cb.AddTemplate(pages, pageSize.GetRight(document.RightMargin + width), pageSize.GetBottom(bottom));

            base.OnEndPage(writer, document);
        }

        public override void OnCloseDocument(PdfWriter writer, Document document)
        {
            base.OnCloseDocument(writer, document);
            pages.BeginText();
            pages.SetFontAndSize(bf, 8);
            pages.SetTextMatrix(0, 0);
            pages.ShowText("" + (writer.PageNumber - 1));
            pages.EndText();
        }
    }

}