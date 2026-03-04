import { jsPDF } from "jspdf";
const doc = new jsPDF();
try {
  doc.addPage();
  const count = doc.internal.getNumberOfPages ? doc.internal.getNumberOfPages() : doc.internal.pages.length - 1;
  console.log("Page count:", count);
} catch (e) {
  console.error("Error:", e);
}
