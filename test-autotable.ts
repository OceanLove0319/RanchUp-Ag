import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const doc = new jsPDF();
autoTable(doc, {
  head: [['Name', 'Email']],
  body: [['John', 'john@example.com']]
});
console.log("Success");
