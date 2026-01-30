import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '../assets/images/logoArteBrilla.png';

const COLORS = {
  primary: [181, 107, 199], 
  dark: [90, 42, 110],
  gray: [120, 120, 120],
  light: [245, 242, 247]
};

const loadImageBase64 = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = url;
});


export async function generateInvoicePDF({
  studentName,
  identification,
  groupName,
  period,
  paymentDate,
  paymentMethod,
  reference,
  amountPaid,
  totalPaid,
  balanceAfter
}) {
  const doc = new jsPDF();
  const logoBase64 = await loadImageBase64(logo);

  // ===== Header =====

  // Logo
  doc.addImage(logoBase64, "PNG", 14, 10, 35, 35);

  // Título
  doc.setFontSize(22);
  doc.setTextColor(...COLORS.primary);
  doc.text("FACTURA", 195, 25, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor(...COLORS.gray);
  doc.text(`Fecha de emisión: ${paymentDate}`, 195, 32, { align: "right" });

  // Línea separadora
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.8);
  doc.line(14, 50, 195, 50);

  doc.setFontSize(14);
  doc.setTextColor(...COLORS.dark);
  doc.text("Datos del Estudiante", 14, 60);

  autoTable(doc, {
    startY: 64,
    theme: "plain",
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: COLORS.dark }
    },
    body: [
      ["Nombre", studentName],
      ["Identificación", identification || "—"],
      ["Grupo", groupName],
      ["Periodo", period]
    ]
  });

  // ===== Pago =====
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.dark);
  doc.text("Detalle del Pago", 14, doc.lastAutoTable.finalY + 12);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 16,
    theme: "striped",
    styles: { fontSize: 10 },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: 255
    },
    body: [
      ["Monto pagado", `${amountPaid.toLocaleString()} colones`],
      ["Método de pago", paymentMethod],
      ["Referencia", reference || "—"],
      ["Total abonado al periodo", `${totalPaid.toLocaleString()} colones`],
      ["Saldo restante", `${balanceAfter.toLocaleString()} colones`]
    ]
  });

  const y = doc.lastAutoTable.finalY + 12;

  doc.setFillColor(...COLORS.light);
  doc.roundedRect(14, y, 180, 22, 5, 5, "F");

  doc.setFontSize(14);
  doc.setTextColor(...COLORS.dark);
  doc.text("Total Pagado", 20, y + 14);

  doc.setFontSize(18);
  doc.setTextColor(...COLORS.primary);
  doc.text(`${amountPaid.toLocaleString()} colones`, 190, y + 14, { align: "right" });

  // ===== Footer =====
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.text(
    "Gracias por confiar en Arte Brilla",
    105,
    doc.internal.pageSize.height - 18,
    { align: "center" }
  );

  // ===== Descargar =====
  doc.save(`Factura_${studentName.replaceAll(" ", "_")}_${Date.now()}.pdf`);
}
