import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { RenderBlock } from "@/lib/packets/packetSchemas";

export function generatePdfFromBlocks(blocks: RenderBlock[], filename: string = "Packet.pdf"): string {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 20;

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = 20;
    }
  };

  blocks.forEach(block => {
    switch (block.type) {
      case "HEADING":
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        if (block.level === 1) {
          doc.setFontSize(18);
          doc.text(block.text || "", margin, y);
          y += 10;
        } else {
          doc.setFontSize(14);
          doc.text(block.text || "", margin, y);
          y += 8;
        }
        break;

      case "PARAGRAPH":
        checkPageBreak(10);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const lines = doc.splitTextToSize(block.text || "", pageWidth - margin * 2);
        doc.text(lines, margin, y);
        y += lines.length * 6 + 4;
        break;

      case "KEY_VALUE":
        if (block.items) {
          block.items.forEach(item => {
            checkPageBreak(8);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(`${item.key}: `, margin, y);
            
            doc.setFont("helvetica", "normal");
            const keyWidth = doc.getTextWidth(`${item.key}: `);
            doc.text(item.value, margin + keyWidth, y);
            y += 8;
          });
          y += 4;
        }
        break;

      case "TABLE":
        if (block.columns && block.rows) {
          (doc as any).autoTable({
            startY: y,
            head: [block.columns],
            body: block.rows,
            theme: 'grid',
            headStyles: { fillColor: [46, 50, 46], textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 3 },
            margin: { left: margin, right: margin }
          });
          y = (doc as any).lastAutoTable.finalY + 10;
        }
        break;

      case "TOC":
        if (block.tocItems) {
          block.tocItems.forEach(item => {
            checkPageBreak(8);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.text(item.title, margin, y);
            y += 8;
          });
          y += 4;
        }
        break;

      case "PAGE_BREAK":
        doc.addPage();
        y = 20;
        break;
    }
  });

  // Remove last empty page if PAGE_BREAK was the last block
  const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : doc.internal.pages.length - 1;
  if (blocks.length > 0 && blocks[blocks.length - 1].type === "PAGE_BREAK") {
     doc.deletePage(pageCount);
  }

  // Add footers
  const finalPageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : doc.internal.pages.length - 1;
  for (let i = 1; i <= finalPageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`KEBB Ag™ - Page ${i} of ${finalPageCount}`, margin, pageHeight - 10);
  }

  return doc.output('bloburl') as unknown as string;
}
