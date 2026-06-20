import { jsPDF } from "jspdf";

export interface CertificateData {
  certificate_number: string;
  recipient_name: string;
  title: string;
  kind: "course" | "workshop" | "competition";
  issued_at: string; // ISO
  issuer_name?: string;
  issuer_title?: string;
}

const BG = "#F5EBD6";
const BROWN = "#3D2A14";
const BROWN_SOFT = "#8B6A3D";
const GREEN = "#5C7A52";
const ORANGE = "#E8915E";

const KIND_LABEL: Record<CertificateData["kind"], string> = {
  course: "COURSE",
  workshop: "WORKSHOP",
  competition: "COMPETITION",
};

const KIND_SUBTITLE: Record<CertificateData["kind"], string> = {
  course: "OF COMPLETION",
  workshop: "OF COMPLETION",
  competition: "OF PARTICIPATION",
};

function drawDaisy(doc: jsPDF, cx: number, cy: number, r: number) {
  // petals
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 210, 190);
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    doc.circle(px, py, r * 0.8, "F");
  }
  // center
  doc.setFillColor(232, 145, 94);
  doc.circle(cx, cy, r * 0.55, "F");
}

function drawLeaf(doc: jsPDF, cx: number, cy: number, r: number) {
  doc.setFillColor(92, 122, 82);
  doc.ellipse(cx, cy, r * 1.4, r * 0.6, "F");
}

function drawCornerCluster(
  doc: jsPDF,
  x: number,
  y: number,
  flipX = false,
  flipY = false,
) {
  const sx = flipX ? -1 : 1;
  const sy = flipY ? -1 : 1;
  drawLeaf(doc, x + sx * 30, y + sy * 22, 8);
  drawLeaf(doc, x + sx * 60, y + sy * 14, 7);
  drawDaisy(doc, x + sx * 20, y + sy * 14, 6);
  drawDaisy(doc, x + sx * 45, y + sy * 20, 6);
  drawDaisy(doc, x + sx * 70, y + sy * 12, 5);
  drawDaisy(doc, x + sx * 35, y + sy * 32, 5);
}

function drawCornerBrackets(doc: jsPDF, w: number, h: number) {
  doc.setDrawColor(BROWN_SOFT);
  // outer thick line
  doc.setLineWidth(1.5);
  // Top-left
  doc.line(40, 60, 180, 60);
  doc.line(40, 60, 40, 200);
  doc.setLineWidth(0.6);
  doc.line(50, 70, 170, 70);
  doc.line(50, 70, 50, 190);
  // small square accent
  doc.rect(170, 60, 12, 12);

  // Top-right
  doc.setLineWidth(1.5);
  doc.line(w - 180, 60, w - 40, 60);
  doc.line(w - 40, 60, w - 40, 200);
  doc.setLineWidth(0.6);
  doc.line(w - 170, 70, w - 50, 70);
  doc.line(w - 50, 70, w - 50, 190);
  doc.rect(w - 182, 60, 12, 12);

  // Bottom-left
  doc.setLineWidth(1.5);
  doc.line(40, h - 60, 180, h - 60);
  doc.line(40, h - 200, 40, h - 60);
  doc.setLineWidth(0.6);
  doc.line(50, h - 70, 170, h - 70);
  doc.line(50, h - 190, 50, h - 70);
  doc.rect(170, h - 72, 12, 12);

  // Bottom-right
  doc.setLineWidth(1.5);
  doc.line(w - 180, h - 60, w - 40, h - 60);
  doc.line(w - 40, h - 200, w - 40, h - 60);
  doc.setLineWidth(0.6);
  doc.line(w - 170, h - 70, w - 50, h - 70);
  doc.line(w - 50, h - 190, w - 50, h - 70);
  doc.rect(w - 182, h - 72, 12, 12);
}

export function generateCertificatePdf(cert: CertificateData) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(BG);
  doc.rect(0, 0, w, h, "F");

  // Decorative corners
  drawCornerBrackets(doc, w, h);
  drawCornerCluster(doc, 60, 80, false, false);
  drawCornerCluster(doc, w - 60, 80, true, false);
  drawCornerCluster(doc, 60, h - 80, false, true);
  drawCornerCluster(doc, w - 60, h - 80, true, true);

  // CERTIFICATE
  doc.setFont("times", "bold");
  doc.setTextColor(BROWN);
  doc.setFontSize(58);
  doc.text("CERTIFICATE", w / 2, 170, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(18);
  doc.setTextColor(BROWN);
  doc.text(KIND_SUBTITLE[cert.kind], w / 2, 200, { align: "center" });

  // Presented to
  doc.setFont("times", "normal");
  doc.setFontSize(14);
  doc.setTextColor(60, 40, 20);
  doc.text("THIS CERTIFICATE IS PROUDLY PRESENTED TO", w / 2, 250, {
    align: "center",
  });

  // Recipient name (italic serif as script substitute) — auto-shrink to fit
  doc.setFont("times", "italic");
  doc.setTextColor(BROWN);
  const recipient = cert.recipient_name || "Sorix Scholar";
  const maxNameWidth = w - 240; // keep clear of decorative corners
  let nameSize = 58;
  doc.setFontSize(nameSize);
  while (doc.getTextWidth(recipient) > maxNameWidth && nameSize > 22) {
    nameSize -= 2;
    doc.setFontSize(nameSize);
  }
  doc.text(recipient, w / 2, 325, { align: "center" });

  // Body
  doc.setFont("times", "normal");
  doc.setFontSize(13);
  doc.setTextColor(60, 40, 20);
  const verb =
    cert.kind === "competition"
      ? "for enthusiastic participation in"
      : "for successfully completing";
  const body = `${verb} the ${cert.kind} "${cert.title}" organized by AI Sorix Limited,\nshowing curiosity, effort and a passion for learning. Keep exploring the wonderful\nworld of artificial intelligence!`;
  doc.text(body, w / 2, 380, { align: "center", lineHeightFactor: 1.5 });

  // Signature
  doc.setFont("times", "italic");
  doc.setFontSize(28);
  doc.setTextColor(BROWN);
  doc.text(cert.issuer_name || "Rakib Eslam", w / 2, 470, { align: "center" });

  // Divider
  doc.setDrawColor(BROWN);
  doc.setLineWidth(0.6);
  doc.line(w / 2 - 110, 482, w / 2 + 110, 482);
  // tiny diamonds
  doc.setFillColor(BROWN);
  doc.triangle(w / 2 - 116, 482, w / 2 - 110, 478, w / 2 - 110, 486, "F");
  doc.triangle(w / 2 + 116, 482, w / 2 + 110, 478, w / 2 + 110, 486, "F");

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  doc.setTextColor(BROWN);
  doc.text(
    cert.issuer_title || "Founder & CEO, AI Sorix Limited",
    w / 2,
    500,
    { align: "center" },
  );

  // Footer: number / issued / verify
  const issued = new Date(cert.issued_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 90, 50);
  doc.text(`Certificate No: ${cert.certificate_number}`, 60, h - 40);
  doc.text(`Issued: ${issued}`, w / 2, h - 40, { align: "center" });
  doc.text(
    `Verify at aisorix.com/sorixscholars/verify/${cert.certificate_number}`,
    w - 60,
    h - 40,
    { align: "right" },
  );

  doc.save(`sorix-scholars-${cert.certificate_number}.pdf`);
}
