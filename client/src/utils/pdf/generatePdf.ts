import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { RenderBlock } from "@/lib/packets/packetSchemas";
import { PDF_THEME } from "./pdfStyles";

export function generatePdfFromBlocks(blocks: RenderBlock[], filename: string = "Packet.pdf"): string {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const margin = 16;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - (margin * 2);
  let y = 24;

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - margin - 15) { // Leave room for footer
      doc.addPage();
      y = 24;
      return true;
    }
    return false;
  };

  // Helper to draw a stylized header
  const drawHeader = (text: string) => {
    doc.setFillColor(PDF_THEME.colors.primary[0], PDF_THEME.colors.primary[1], PDF_THEME.colors.primary[2]);
    doc.rect(margin, y, 3, 8, 'F');
    
    doc.setFont(PDF_THEME.fonts.main, "bold");
    doc.setFontSize(PDF_THEME.fonts.sizes.h1);
    doc.setTextColor(30, 30, 30); // Dark text for headings to look professional on white paper
    doc.text(text.toUpperCase(), margin + 6, y + 6);
    y += 14;
    
    // Add a subtle separator line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, y - 2, pageWidth - margin, y - 2);
    y += 6;
  };

  blocks.forEach(block => {
    switch (block.type) {
      case "HEADING":
        if (block.level === 1) {
          checkPageBreak(30);
          drawHeader(block.text || "");
        } else {
          checkPageBreak(15);
          doc.setFont(PDF_THEME.fonts.main, "bold");
          doc.setFontSize(block.level === 2 ? PDF_THEME.fonts.sizes.h2 : PDF_THEME.fonts.sizes.h3);
          doc.setTextColor(50, 50, 50);
          doc.text(block.text || "", margin, y);
          y += block.level === 2 ? 10 : 8;
        }
        break;

      case "PARAGRAPH":
        checkPageBreak(10);
        doc.setFont(PDF_THEME.fonts.main, "normal");
        doc.setFontSize(PDF_THEME.fonts.sizes.body);
        doc.setTextColor(80, 80, 80);
        const lines = doc.splitTextToSize(block.text || "", contentWidth);
        doc.text(lines, margin, y);
        y += lines.length * 5 + 4;
        break;

      case "KEY_VALUE":
        if (block.items && block.items.length > 0) {
          checkPageBreak(block.items.length * 8 + 10);
          
          // Draw a subtle background box for the grid
          const boxHeight = block.items.length * 8 + 4;
          doc.setFillColor(250, 250, 250);
          doc.setDrawColor(230, 230, 230);
          doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');
          
          y += 6;
          
          block.items.forEach(item => {
            doc.setFont(PDF_THEME.fonts.main, "bold");
            doc.setFontSize(PDF_THEME.fonts.sizes.body);
            doc.setTextColor(100, 100, 100);
            doc.text(`${item.key.toUpperCase()}`, margin + 4, y);
            
            doc.setFont(PDF_THEME.fonts.main, "normal");
            doc.setTextColor(30, 30, 30);
            doc.text(item.value, margin + 60, y);
            y += 8;
          });
          y += 4; // Extra space after box
        }
        break;

      case "TABLE":
        if (block.columns && block.rows) {
          (doc as any).autoTable({
            startY: y,
            head: [block.columns],
            body: block.rows,
            theme: 'grid',
            headStyles: { 
              fillColor: [40, 42, 45], // Dark header
              textColor: [255, 255, 255], 
              fontStyle: 'bold',
              fontSize: 9,
              halign: 'left'
            },
            bodyStyles: {
              fontSize: 9,
              textColor: [60, 60, 60],
              lineColor: [230, 230, 230]
            },
            alternateRowStyles: {
              fillColor: [248, 248, 248]
            },
            styles: { 
              cellPadding: 4,
              font: PDF_THEME.fonts.main
            },
            margin: { left: margin, right: margin },
            didDrawPage: function (data: any) {
              // Only update Y if this is the last page the table draws on
              y = data.cursor.y;
            }
          });
          y = (doc as any).lastAutoTable.finalY + 12;
        }
        break;

      case "TOC":
        if (block.tocItems) {
          checkPageBreak(block.tocItems.length * 8 + 10);
          
          block.tocItems.forEach((item, index) => {
            doc.setFont(PDF_THEME.fonts.main, "bold");
            doc.setFontSize(PDF_THEME.fonts.sizes.body);
            doc.setTextColor(60, 60, 60);
            
            // Draw number badge
            doc.setFillColor(240, 240, 240);
            doc.roundedRect(margin, y - 4, 6, 6, 1, 1, 'F');
            doc.setFontSize(PDF_THEME.fonts.sizes.small);
            doc.text(`${index + 1}`, margin + 3, y, { align: 'center' });
            
            // Draw title
            doc.setFontSize(PDF_THEME.fonts.sizes.body);
            doc.text(item.title.toUpperCase(), margin + 10, y);
            y += 10;
          });
          y += 6;
        }
        break;

      case "PAGE_BREAK":
        doc.addPage();
        y = 24;
        break;
    }
  });

  // Remove last empty page if PAGE_BREAK was the last block
  const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : doc.internal.pages.length - 1;
  if (blocks.length > 0 && blocks[blocks.length - 1].type === "PAGE_BREAK") {
     doc.deletePage(pageCount);
  }

  // Add Headers & Footers to all pages
  const finalPageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : doc.internal.pages.length - 1;
  for (let i = 1; i <= finalPageCount; i++) {
    doc.setPage(i);
    
    // Header Logo/Branding
    doc.setFont(PDF_THEME.fonts.main, "bold");
    doc.setFontSize(PDF_THEME.fonts.sizes.small);
    doc.setTextColor(PDF_THEME.colors.primary[0], PDF_THEME.colors.primary[1], PDF_THEME.colors.primary[2]);
    doc.text("KEBB AG™", margin, 12);
    
    // Document Type in Header
    doc.setFont(PDF_THEME.fonts.main, "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("SYSTEM OF RECORD", pageWidth - margin, 12, { align: "right" });
    
    // Top border line
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, 14, pageWidth - margin, 14);

    // Footer
    doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
    doc.setFont(PDF_THEME.fonts.main, "normal");
    doc.setFontSize(PDF_THEME.fonts.sizes.tiny);
    doc.setTextColor(150, 150, 150);
    
    const timestamp = new Date().toLocaleString();
    doc.text(`Generated on: ${timestamp}`, margin, pageHeight - 10);
    doc.text(`Page ${i} of ${finalPageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  }

  return doc.output('bloburl') as unknown as string;
}
