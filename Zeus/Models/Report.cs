//using EstiaDb.Models;
//using iTextSharp.text;
//using iTextSharp.text.pdf;
//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;

//namespace EstiaLib.Invoice
//{
//    public class Report
//    {
//        private Font titleFont;
//        private Font subTitleFont;
//        private Font boldTableFont;
//        private Font bodyFont;
//        private Font boldFont;
//        List<KoinoCat> categories;
//        private BuildingInfo building;
//        private int border = Rectangle.NO_BORDER;
//        private bool template = true;
//        string fontType;
//        private int rowsPerPage = 27;

//        public Report()
//        {

//        }

//        public byte[] Print(int id, int year, int month, bool tmp)
//        {
//            var db = new InvoiceContext();
//            categories = db.Categories;
//            building = db.GetData(id, year, month);

//            fontType = "Tahoma";
//            FontFactory.RegisterDirectory(Environment.GetFolderPath(Environment.SpecialFolder.Fonts));
//            titleFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 14, Font.BOLD);
//            subTitleFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 12, Font.BOLD);
//            boldTableFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.EMBEDDED, 6, Font.BOLD);
//            bodyFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, 8, Font.NORMAL);
//            boldFont = FontFactory.GetFont(fontType, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, 8, Font.BOLD);

//            Document doc = new Document(PageSize.A4, 12, 12, 12, 12);
//            MemoryStream stream = new MemoryStream();
//            PdfWriter writer = PdfWriter.GetInstance(doc, stream);
//            doc.SetPageSize(PageSize.A4.Rotate());
//            //writer.PageEvent = new HeaderFooter();

//            doc.Open();

//            Image jpg = null;
//            if (tmp)
//            {
//                string imageFilePath = "total.jpg";
//                jpg = Image.GetInstance(imageFilePath);
//                jpg.ScaleToFit(PageSize.A4.Height, PageSize.A4.Width);
//                jpg.Alignment = Image.UNDERLYING;
//                jpg.SetAbsolutePosition(0, 0);
//            }

//            int pages = ((building.Appartments.Count + (rowsPerPage - 1)) / rowsPerPage);
//            for (int i = 1; i <= pages; i++)
//            {
//                doc.NewPage();

//                if (tmp)
//                    doc.Add(jpg);

//                doc.Add(reportHeader());
//                doc.Add(appartmentsInfo(i));
//            }

//            doc.Close();
//            writer.Close();
//            stream.Close();

//            return stream.GetBuffer();
//        }

//        private PdfPTable reportTitle()
//        {
//            PdfPTable table = new PdfPTable(1);
//            table.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.WidthPercentage = 100;
//            table.DefaultCell.Border = border;
//            table.SpacingAfter = 10;

//            PdfPCell cell = new PdfPCell(new Phrase(template ? "" : "ΣΥΓΚΕΝΤΡΩΤΙΚΗ ΚΑΤΑΣΤΑΣΗ ΔΑΠΑΝΩΝ", titleFont));
//            cell.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell.Border = border;
//            table.AddCell(cell);

//            return table;
//        }

//        private PdfPTable reportHeader()
//        {
//            PdfPTable table = new PdfPTable(2);
//            table.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.WidthPercentage = 100;
//            table.SetWidths(new float[] { 43, 57 });
//            table.DefaultCell.Border = border;

//            {
//                PdfPCell cell = new PdfPCell(reportLeftHeader());
//                cell.HorizontalAlignment = Element.ALIGN_CENTER;
//                cell.Border = border;
//                table.AddCell(cell);
//            }

//            {
//                PdfPCell cell = new PdfPCell(reportRightHeader());
//                cell.HorizontalAlignment = Element.ALIGN_CENTER;
//                cell.Border = border;
//                table.AddCell(cell);
//            }

//            return table;
//        }

//        private PdfPTable reportLeftHeader()
//        {
//            PdfPTable table = new PdfPTable(1);
//            table.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.WidthPercentage = 100;
//            table.DefaultCell.Border = border;

//            {
//                PdfPCell cell = new PdfPCell(reportLogo());
//                cell.HorizontalAlignment = Element.ALIGN_CENTER;
//                cell.Border = border;
//                cell.MinimumHeight = 60;
//                table.AddCell(cell);
//            }

//            {
//                PdfPCell cell = new PdfPCell(buildingIfoHeader());
//                cell.HorizontalAlignment = Element.ALIGN_CENTER;
//                cell.Border = border;
//                cell.MinimumHeight = 75;
//                table.AddCell(cell);
//            }

//            {
//                PdfPCell cell = new PdfPCell(buildingMessage());
//                cell.HorizontalAlignment = Element.ALIGN_CENTER;
//                cell.Border = border;
//                table.AddCell(cell);
//            }

//            return table;
//        }

//        private PdfPTable reportRightHeader()
//        {
//            PdfPTable table = new PdfPTable(1);
//            table.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.WidthPercentage = 100;
//            table.DefaultCell.Border = border;

//            {
//                PdfPCell cell = new PdfPCell(buildingExpensesHeader());
//                cell.HorizontalAlignment = Element.ALIGN_CENTER;
//                cell.Border = border;
//                cell.MinimumHeight = 201;
//                table.AddCell(cell);
//            }

//            return table;
//        }

//        private PdfPTable reportLogo()
//        {
//            PdfPTable table = new PdfPTable(1);
//            table.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.WidthPercentage = 100;
//            table.DefaultCell.Border = border;

//            PdfPCell cell = new PdfPCell(new Phrase("", boldFont));
//            cell.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell.Border = border;
//            table.AddCell(cell);

//            return table;
//        }

//        private PdfPTable buildingIfoHeader()
//        {
//            PdfPTable table = new PdfPTable(1);
//            table.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.WidthPercentage = 100;
//            table.DefaultCell.Border = border;

//            PdfPCell cell = new PdfPCell(new Phrase(template ? "" : "ΣΤΟΙΧΕΙΑ ΠΟΛΥΚΑΤΟΙΚΙΑΣ", boldFont));
//            cell.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell.Border = border;
//            table.AddCell(cell);

//            table.AddCell(buildingIfo());

//            return table;
//        }

//        private PdfPTable buildingMessage()
//        {
//            PdfPTable table = new PdfPTable(1);
//            table.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.WidthPercentage = 100;
//            table.DefaultCell.Border = border;

//            {
//                PdfPCell cell = new PdfPCell(new Phrase(template ? "" : "ΑΝΑΚΟΙΝΩΣΕΙΣ - ΠΑΡΑΤΗΡΗΣΕΙΣ", boldFont));
//                cell.HorizontalAlignment = Element.ALIGN_CENTER;
//                cell.Border = border;
//                cell.MinimumHeight = 10;
//                table.AddCell(cell);
//            }

//            {
//                PdfPCell cell = new PdfPCell(new Paragraph(building.Announcement, bodyFont));
//                cell.HorizontalAlignment = Element.ALIGN_LEFT;
//                cell.Border = border;
//                table.AddCell(cell);
//            }

//            return table;
//        }

//        private PdfPTable buildingIfo()
//        {
//            PdfPTable table = new PdfPTable(4);
//            table.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.WidthPercentage = 100;
//            table.SetWidths(new float[] { 19, 37, 18, 26 });
//            table.DefaultCell.Border = border;

//            PdfPCell cell11 = new PdfPCell(new Phrase(template ? "" : "ΚΩΔΙΚΟΣ", boldFont));
//            cell11.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell11.Border = border;
//            cell11.MinimumHeight = 12;
//            table.AddCell(cell11);

//            PdfPCell cell12 = new PdfPCell(new Phrase(template ? "" : "ΟΔΟΣ", boldFont));
//            cell12.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell12.Border = border;
//            table.AddCell(cell12);

//            PdfPCell cell13 = new PdfPCell(new Phrase(template ? "" : "ΑΡΙΘΜΟΣ", boldFont));
//            cell13.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell13.Border = border;
//            table.AddCell(cell13);

//            PdfPCell cell14 = new PdfPCell(new Phrase(template ? "" : "ΠΕΡΙΟΧΗ", boldFont));
//            cell14.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell14.Border = border;
//            table.AddCell(cell14);

//            PdfPCell cell21 = new PdfPCell(new Phrase(building.Id.ToString(), bodyFont));
//            cell21.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell21.Border = border;
//            cell21.MinimumHeight = 22;
//            table.AddCell(cell21);

//            PdfPCell cell22 = new PdfPCell(new Phrase(building.Street, bodyFont));
//            cell22.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell22.Border = border;
//            table.AddCell(cell22);

//            PdfPCell cell23 = new PdfPCell(new Phrase(building.StreetNumber, bodyFont));
//            cell23.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell23.Border = border;
//            table.AddCell(cell23);

//            PdfPCell cell24 = new PdfPCell(new Phrase(building.Area, bodyFont));
//            cell24.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell24.Border = border;
//            table.AddCell(cell24);

//            PdfPCell cell31 = new PdfPCell(new Phrase(template ? "" : "ΔΙΑΧΕΙΡΙΣΤΗΣ", boldFont));
//            cell31.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell31.Colspan = 2;
//            cell31.Border = border;
//            cell31.MinimumHeight = 12;
//            table.AddCell(cell31);

//            PdfPCell cell33 = new PdfPCell(new Phrase(template ? "" : "ΕΤΟΣ", boldFont));
//            cell33.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell33.Border = border;
//            table.AddCell(cell33);

//            PdfPCell cell34 = new PdfPCell(new Phrase(template ? "" : "ΜΗΝΑΣ", boldFont));
//            cell34.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell34.Border = border;
//            table.AddCell(cell34);

//            PdfPCell cell41 = new PdfPCell(new Phrase(building.Manager, bodyFont));
//            cell41.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell41.Border = border;
//            cell41.Colspan = 2;
//            table.AddCell(cell41);

//            PdfPCell cell43 = new PdfPCell(new Phrase(building.Year.ToString(), bodyFont));
//            cell43.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell43.Border = border;
//            table.AddCell(cell43);

//            PdfPCell cell44 = new PdfPCell(new Phrase(building.MonthName, bodyFont));
//            cell44.HorizontalAlignment = Element.ALIGN_CENTER;
//            cell44.Border = border;
//            table.AddCell(cell44);

//            return table;
//        }

//        private PdfPTable buildingExpensesHeader()
//        {
//            PdfPTable table = new PdfPTable(1);
//            table.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.WidthPercentage = 100;
//            table.DefaultCell.Border = border;

//            {
//                PdfPCell cell = new PdfPCell(new Phrase(string.Format("Σύνολο:{0:#,##0.00}", building.ExpensesSum), boldFont));
//                cell.HorizontalAlignment = Element.ALIGN_RIGHT;
//                cell.VerticalAlignment = Element.ALIGN_TOP;
//                cell.Border = border;
//                cell.MinimumHeight = 10;
//                table.AddCell(cell);
//            }

//            table.AddCell(buildingExpenses());

//            return table;
//        }

//        private PdfPTable buildingExpenses()
//        {
//            PdfPTable table = new PdfPTable(2);
//            table.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.WidthPercentage = 100;
//            table.DefaultCell.Border = border;

//            {
//                PdfPCell cell = new PdfPCell(expensesInfo(1));
//                cell.HorizontalAlignment = Element.ALIGN_CENTER;
//                cell.Border = border;
//                cell.Rowspan = 2;
//                cell.PaddingRight = 10f;
//                table.AddCell(cell);
//            }

//            {
//                PdfPCell cell = new PdfPCell(expensesInfo(3));
//                cell.HorizontalAlignment = Element.ALIGN_CENTER;
//                cell.Border = border;
//                table.AddCell(cell);
//            }

//            {
//                PdfPCell cell = new PdfPCell(expensesInfo(4));
//                cell.HorizontalAlignment = Element.ALIGN_CENTER;
//                cell.Border = border;
//                table.AddCell(cell);
//            }

//            {
//                PdfPCell cell = new PdfPCell(expensesInfo(2));
//                cell.HorizontalAlignment = Element.ALIGN_CENTER;
//                cell.Border = border;
//                cell.Rowspan = 2;
//                cell.PaddingRight = 10f;
//                table.AddCell(cell);
//            }

//            {
//                PdfPCell cell = new PdfPCell(expensesInfo(5));
//                cell.HorizontalAlignment = Element.ALIGN_CENTER;
//                cell.Border = border;
//                table.AddCell(cell);
//            }

//            return table;
//        }

//        private PdfPTable expensesInfo(int sn)
//        {
//            PdfPTable table = new PdfPTable(2);
//            table.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.WidthPercentage = 100;
//            table.SetWidths(new float[] { 80, 20 });
//            table.DefaultCell.Border = border;

//            if (!building.Expenses.Any(t => t.CatId == sn))
//            {
//                var t = new ExpenseInfo() { CatId = sn, Category = categories[sn - 1].Category };
//                t.Details = new List<ExpenseInfo>(categories[sn - 1].Rows);
//                building.Expenses.Add(t);
//            }
//            var list = building.Expenses.Where(t => t.CatId == sn).ToList();

//            string title = string.Format("{1}", sn, list.First().Category);
//            PdfPCell cell1 = new PdfPCell(new Phrase(title, boldFont));
//            cell1.HorizontalAlignment = Element.ALIGN_LEFT;
//            cell1.Border = border;
//            table.AddCell(cell1);

//            string amount = list.Sum(t => t.Amount).ToString("#,##0.00");
//            PdfPCell cell2 = new PdfPCell(new Phrase(amount, boldFont));
//            cell2.HorizontalAlignment = Element.ALIGN_RIGHT;
//            cell2.Border = border;
//            table.AddCell(cell2);

//            int i = 0;
//            foreach (var s in list)
//            {
//                foreach (var o in s.Details)
//                {
//                    i += 1;

//                    string titleb = string.Format("{0:00}. {1}", i, o.Title);
//                    PdfPCell cellb1 = new PdfPCell(new Phrase(titleb, bodyFont));
//                    cellb1.HorizontalAlignment = Element.ALIGN_LEFT;
//                    cellb1.Border = border;
//                    cellb1.PaddingLeft = 10f;
//                    table.AddCell(cellb1);

//                    string amountb = o.Amount.ToString("#,##0.00");
//                    PdfPCell cellb2 = new PdfPCell(new Phrase(amountb, bodyFont));
//                    cellb2.HorizontalAlignment = Element.ALIGN_RIGHT;
//                    cellb2.Border = border;
//                    table.AddCell(cellb2);
//                }
//            }

//            if (i < categories[sn - 1].Rows)
//            {
//                while (i < categories[sn - 1].Rows)
//                {
//                    i += 1;
//                    string titleb = string.Format("{0:00}.", i);
//                    PdfPCell cellb1 = new PdfPCell(new Phrase(titleb, bodyFont));
//                    cellb1.HorizontalAlignment = Element.ALIGN_LEFT;
//                    cellb1.Border = border;
//                    cellb1.PaddingLeft = 10f;
//                    cellb1.Colspan = 2;
//                    table.AddCell(cellb1);
//                }
//            }

//            return table;
//        }

//        private PdfPTable appartmentsInfo(int page)
//        {
//            PdfPTable table = new PdfPTable(15);
//            table.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.WidthPercentage = 100;
//            table.SetWidths(new float[] { 220, 54, 54, 54, 54, 54, 45, 45, 60, 60, 60, 60, 60, 60, 60 });
//            table.SpacingBefore = 7;

//            #region Header

//            table.DefaultCell.VerticalAlignment = Element.ALIGN_MIDDLE;
//            table.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.DefaultCell.Border = border;

//            table.AddCell(new PdfPCell() { Border = border, Colspan = 15 });
//            table.AddCell(new PdfPCell() { Border = border, Colspan = 15 });
//            table.HeaderRows = 2;
//            table.FooterRows = 1;

//            table.DefaultCell.Rowspan = 2;
//            {
//                var cell = new PdfPCell(new Phrase(template ? "" : "ΔΙΑΜΕΡΙΣΜΑ", boldTableFont));
//                cell.MinimumHeight = 32;
//                cell.Rowspan = 2;
//                cell.Border = border;
//                table.AddCell(cell);
//            }
//            table.DefaultCell.Rowspan = 1;

//            table.DefaultCell.Colspan = 4;
//            table.AddCell(new Phrase(template ? "" : "ΧΙΛΙΟΣΤΑ", boldTableFont));

//            table.DefaultCell.Colspan = 3;
//            table.AddCell(new Phrase(template ? "" : "ΘΕΡΜΑΝΣΗ", boldTableFont));

//            table.DefaultCell.Colspan = 4;
//            table.AddCell(new Phrase(template ? "" : "ΑΞΙΑ", boldTableFont));

//            table.DefaultCell.Colspan = 2;
//            table.AddCell(new Phrase(template ? "" : "ΘΕΡΜΑΝΣΗ", boldTableFont));

//            table.DefaultCell.Colspan = 1;
//            table.DefaultCell.Rowspan = 2;
//            table.AddCell(new Phrase(template ? "" : "ΣΥΝΟΛΟ", boldTableFont));

//            #endregion

//            #region Header2

//            table.DefaultCell.VerticalAlignment = Element.ALIGN_MIDDLE;
//            table.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
//            table.DefaultCell.Border = border;
//            table.DefaultCell.Colspan = 1;
//            table.DefaultCell.Rowspan = 1;

//            table.AddCell(new Phrase(template ? "" : "ΚΟΙΝΟΧΡΗΣΤΩΝ", boldTableFont));
//            table.AddCell(new Phrase(template ? "" : "ΑΝΕΛΚΥΣΤΗΡΑ", boldTableFont));
//            table.AddCell(new Phrase(template ? "" : "ΙΔΙΟΚΤΗΤΩΝ", boldTableFont));
//            table.AddCell(new Phrase(template ? "" : "ΕΙΔΙΚΩΝ ΔΑΠΑΝΩΝ", boldTableFont));

//            if (building.CentralHeat)
//            {
//                table.AddCell(new Phrase(template ? "" : "ΧΙΛΙΟΣΤΑ", boldTableFont));
//                table.AddCell("");
//                table.AddCell("");
//            }
//            else
//            {
//                table.AddCell(new Phrase(template ? "" : "ΕΙ", boldTableFont));
//                table.AddCell(new Phrase("FI", boldTableFont));
//                table.AddCell(new Phrase("ΩΡΕΣ", boldTableFont));
//            }

//            table.AddCell(new Phrase(template ? "" : "ΚΟΙΝΟΧΡΗΣΤΩΝ", boldTableFont));
//            table.AddCell(new Phrase(template ? "" : "ΑΝΕΛΚΥΣΤΗΡΑ", boldTableFont));
//            table.AddCell(new Phrase(template ? "" : "ΙΔΙΟΚΤΗΤΩΝ", boldTableFont));
//            table.AddCell(new Phrase(template ? "" : "ΕΙΔΙΚΩΝ ΔΑΠΑΝΩΝ", boldTableFont));
//            table.AddCell(new Phrase(template ? "" : "ΘΕΡΜΑΝΣΗ", boldTableFont));
//            table.AddCell(new Phrase(template ? "" : "ΕΠΙΒΑΡΥΝΣΗ ΛΟΓΩ ΚΛΕΙΣΤΩΝ", boldTableFont));

//            #endregion

//            #region Body

//            table.DefaultCell.VerticalAlignment = Element.ALIGN_MIDDLE;
//            table.DefaultCell.Border = border;
//            table.DefaultCell.Colspan = 1;
//            table.DefaultCell.Rowspan = 1;

//            int[] ci = { 1, 2, 4, 5 };
//            int i = (page - 1) * rowsPerPage;

//            var list = building.Appartments.Skip(i).Take(rowsPerPage);

//            foreach (var app in list)
//            {
//                i += 1;

//                table.DefaultCell.HorizontalAlignment = Element.ALIGN_LEFT;
//                string s = string.Format("{0}. ({1}) {2}", i, app.FullTitle, app.FullName);
//                table.AddCell(new Phrase(s, bodyFont));
//                table.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;

//                foreach (int r in ci)
//                {
//                    table.AddCell(new Phrase(building.GetQuota(r) > 0 ? string.Format("{0:#,##0.00}", app.GetQuota(r)) : "", bodyFont));
//                }

//                if (building.CentralHeat)
//                {
//                    table.AddCell(new Phrase(building.GetQuota(3) > 0 ? string.Format("{0:#,##0.00}", app.GetQuota(3)) : "", bodyFont));
//                    table.AddCell("");
//                    table.AddCell("");
//                }
//                else
//                {
//                    table.AddCell(new Phrase(building.Hours > 0 ? string.Format("{0:#,##0.0000}", app.Ei) : "", bodyFont));
//                    table.AddCell(new Phrase(building.Hours > 0 ? string.Format("{0:#,##0.00}", app.Fi) : "", bodyFont));
//                    table.AddCell(new Phrase(building.Hours > 0 ? string.Format("{0:#,##0.00}", app.Hours) : "", bodyFont));
//                }

//                foreach (int r in ci)
//                {
//                    table.AddCell(new Phrase(building.GetExpense(r) > 0 ? string.Format("{0:#,##0.00}", app.GetExpense(r)) : "", bodyFont));
//                }

//                table.AddCell(new Phrase(building.GetExpense(3) > 0 ? string.Format("{0:#,##0.00}", app.GetExpense(3)) : "", bodyFont));
//                table.AddCell(new Phrase(building.Additional > 0 ? string.Format("{0:#,##0.00}", app.Additional) : "", bodyFont));
//                table.AddCell(new Phrase(string.Format("{0:#,##0.00}", app.ExpensesSum), bodyFont));
//            }

//            #endregion

//            #region Footer
//            if ((page * rowsPerPage) >= building.Appartments.Count)
//            {

//                table.DefaultCell.VerticalAlignment = Element.ALIGN_MIDDLE;
//                table.DefaultCell.HorizontalAlignment = Element.ALIGN_CENTER;
//                table.DefaultCell.Border = border;
//                table.DefaultCell.Colspan = 1;
//                table.DefaultCell.Rowspan = 1;

//                table.AddCell(new Phrase("ΣΥΝΟΛΑ", bodyFont));

//                table.DefaultCell.HorizontalAlignment = Element.ALIGN_RIGHT;

//                foreach (int r in ci)
//                {
//                    table.AddCell(new Phrase(building.GetQuota(r) > 0 ? string.Format("{0:#,##0.00}", building.GetQuota(r)) : "", bodyFont));
//                }

//                if (building.CentralHeat)
//                {
//                    table.AddCell(new Phrase(building.GetQuota(3) > 0 ? string.Format("{0:#,##0.00}", building.GetQuota(3)) : "", bodyFont));
//                    table.AddCell("");
//                    table.AddCell("");
//                }
//                else
//                {
//                    table.AddCell(new Phrase(building.Hours > 0 ? string.Format("{0:#,##0.0000}", building.Ei) : "", bodyFont));
//                    table.AddCell(new Phrase(building.Hours > 0 ? string.Format("{0:#,##0.00}", building.Fi) : "", bodyFont));
//                    table.AddCell(new Phrase(building.Hours > 0 ? string.Format("{0:#,##0.00}", building.Hours) : "", bodyFont));
//                }

//                foreach (int r in ci)
//                {
//                    table.AddCell(new Phrase(building.GetExpense(r) > 0 ? string.Format("{0:#,##0.00}", building.GetExpense(r)) : "", bodyFont));
//                }

//                table.AddCell(new Phrase(building.GetExpense(3) > 0 ? string.Format("{0:#,##0.00}", building.GetExpense(3)) : "", bodyFont));
//                table.AddCell(new Phrase(building.Additional > 0 ? string.Format("{0:#,##0.00}", building.Additional) : "", bodyFont));
//                table.AddCell(new Phrase(string.Format("{0:#,##0.00}", building.ExpensesSum), bodyFont));
//            }
//            #endregion

//            return table;
//        }
//    }

//    public class HeaderFooter : PdfPageEventHelper
//    {
//        PdfContentByte cb;
//        PdfTemplate pages;
//        BaseFont bf;
//        Rectangle pageSize;
//        int bottom = 16;
//        float width = 16;
//        float height = 16;

//        public override void OnOpenDocument(PdfWriter writer, Document document)
//        {
//            FontFactory.RegisterDirectory(Environment.GetFolderPath(Environment.SpecialFolder.Fonts));
//            bf = FontFactory.GetFont("Calibri", BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED, 8, Font.BOLD).BaseFont;
//            pages = writer.DirectContent.CreateTemplate(width, height);
//            cb = writer.DirectContent;
//            pageSize = document.PageSize;

//            base.OnOpenDocument(writer, document);
//        }

//        public override void OnStartPage(PdfWriter writer, Document document)
//        {
//            base.OnStartPage(writer, document);
//        }

//        public override void OnEndPage(PdfWriter writer, Document document)
//        {
//            String text = "Σελίδα " + writer.PageNumber + " από ";
//            float len = bf.GetWidthPoint(text, 8);

//            cb.BeginText();
//            cb.SetFontAndSize(bf, 8);
//            cb.ShowTextAligned(PdfContentByte.ALIGN_RIGHT, text, pageSize.GetRight(document.RightMargin + width), pageSize.GetBottom(bottom), 0);
//            cb.EndText();
//            cb.AddTemplate(pages, pageSize.GetRight(document.RightMargin + width), pageSize.GetBottom(bottom));

//            base.OnEndPage(writer, document);
//        }

//        public override void OnCloseDocument(PdfWriter writer, Document document)
//        {
//            base.OnCloseDocument(writer, document);
//            pages.BeginText();
//            pages.SetFontAndSize(bf, 8);
//            pages.SetTextMatrix(0, 0);
//            pages.ShowText("" + (writer.PageNumber - 1));
//            pages.EndText();
//        }
//    }

//}