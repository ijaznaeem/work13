import jsPDF from "jspdf";
import QRCode from "qrcode";

export interface StickerItem {
  ProductName?: string;
  Weight?: string;
  BigStone?: string;
  BarCode?: string;
  Qty?: number;
}

export interface Options {
  shopName?: string;
  debug?: boolean;
  padMm?: number;
}

/**
 * Generates PDF where each page is 83 x 37 mm and contains two sticker designs:
 * - each sticker design box = 20 x 25 mm
 * - left box lower (y=12), right box higher (y=0) -> facing offset
 * - upper half of each box = QR code, lower half = product info
 */
export function generateStickerReel(
  data: StickerItem[],
  { shopName = "Al-Madina Jewellers", debug = false, padMm = 1.5 }: Options = {}
) {
  // exact sizes (mm)
  const PAGE_W = 83;
  const PAGE_H = 37;

  const BOX_W = 20;
  const BOX_H = 25;

  // Box positions (mm) inside the single 83x37 page
  const leftBox = { x: 0, y: PAGE_H - BOX_H, w: BOX_W, h: BOX_H };    // (0,12)
  const rightBox = { x: PAGE_W - BOX_W, y: 0, w: BOX_W, h: BOX_H };    // (63,0)

  // Create a jsPDF page = 83 x 37 mm
  const doc = new jsPDF({
    unit: "mm",
    format: [PAGE_W, PAGE_H],
    orientation: "landscape",
  });

  // Expand items by Qty
  const expanded: StickerItem[] = [];
  for (const it of data) {
    const q = Number(it.Qty) > 0 ? Number(it.Qty) : 1;
    for (let k = 0; k < q; k++) expanded.push(it);
  }

  // For every two items we produce one page (left + right inside that 83x37 page)
  for (let i = 0; i < expanded.length; i += 2) {
    if (i > 0) doc.addPage([PAGE_W, PAGE_H], "landscape");

    // place left item (if exists)
    if (expanded[i]) {
      // QRCode generation is async, so we need to await it
      // But jsPDF is sync, so we need to use Promise.all and async/await outside this function
      // For simplicity, we use a helper function below
      // You must call generateStickerReelAsync instead of generateStickerReel
      throw new Error("Use generateStickerReelAsync instead for QRCode support.");
    }

    // place right item (if exists)
    if (expanded[i + 1]) {
      throw new Error("Use generateStickerReelAsync instead for QRCode support.");
    }
  }

  // Save file
  doc.save("sticker_page_83x37.pdf");
}

/** Async version to support QRCode generation */
export async function generateStickerReelAsync(
  data: StickerItem[],
  { shopName = "A M J", debug = false, padMm = 1.5 }: Options = {}
) {
  const PAGE_W = 83;
  const PAGE_H = 37;
  const BOX_W = 20;
  const BOX_H = 25;
  const leftBox = { x: 0, y: PAGE_H - BOX_H, w: BOX_W, h: BOX_H };
  const rightBox = { x: PAGE_W - BOX_W, y: 0, w: BOX_W, h: BOX_H };

  const doc = new jsPDF({
    unit: "mm",
    format: [PAGE_W, PAGE_H],
    orientation: "landscape",
  });

  const expanded: StickerItem[] = [];
  for (const it of data) {
    const q = Number(it.Qty) > 0 ? Number(it.Qty) : 1;
    for (let k = 0; k < q; k++) expanded.push(it);
  }

  for (let i = 0; i < expanded.length; i += 2) {
    if (i > 0) doc.addPage([PAGE_W, PAGE_H], "landscape");

    if (expanded[i]) {
      await placeDesignAsync(doc, expanded[i], leftBox, shopName, padMm, debug);
    }
    if (expanded[i + 1]) {
      await placeDesignAsync(doc, expanded[i + 1], rightBox, shopName, padMm, debug);
    }
  }

  doc.save("sticker_page_83x37.pdf");
}

/** Draw one sticker design inside provided box (all mm units) with QR code */
async function placeDesignAsync(
  doc: jsPDF,
  item: StickerItem,
  box: { x: number; y: number; w: number; h: number },
  shopName: string,
  padMm: number,
  debug: boolean
) {
  const upperH = box.h / 2; // split box into upper and lower halves

  if (debug) {
    doc.setDrawColor(150);
    doc.setLineWidth(0.25);
    doc.rect(box.x, box.y, box.w, box.h);               // box border
    doc.setDrawColor(180);
    doc.line(box.x, box.y + upperH, box.x + box.w, box.y + upperH); // midline
    doc.setDrawColor(0);
  }

  // --- Upper half: QR code area inside the box ---
  const qrX = box.x + padMm;
  const qrY = box.y + padMm;
  // Make QR code square: use min of width and height
  const qrSize = Math.min(box.w - 2 * padMm, upperH - 2 * padMm);
  const qrW = qrSize;
  const qrH = qrSize;

  try {
    // Generate QR code as DataURL
    const qrValue = String(item.BarCode ?? "");
    const qrOptions = {
      width: Math.round(qrW * 4), // pxPerMm = 4
      margin: 0,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    };
    const imgData = await QRCode.toDataURL(qrValue, qrOptions);
    doc.addImage(imgData, "PNG", qrX, qrY, qrW, qrH);
  } catch (e) {
    // fallback: draw placeholder
    if (debug) {
      doc.setDrawColor(200, 0, 0);
      doc.rect(qrX, qrY, qrW, qrH);
      doc.text("QRCODE", qrX + qrW / 2 - 6, qrY + qrH / 2 + 1);
      doc.setDrawColor(0);
    }
  }

  // --- Lower half: product info inside the box ---
  const infoStartY = box.y + upperH + padMm; // small padding from midline
  const textX = box.x + padMm;
  const textMaxW = box.w - 2 * padMm;

  doc.setFontSize(7); // small fonts to fit in narrow box
  if (shopName) {
    doc.text(String(shopName), textX, infoStartY + 3, { maxWidth: textMaxW }); // first line
  }

  // Draw rotated text (e.g., barcode) at 90 degrees
  if (item.BarCode) {
    doc.saveGraphicsState();
    // Calculate position for rotated text (right edge, lower half)
    const rotatedX = box.x + box.w + padMm * 2 + 2;
    const rotatedY = infoStartY - 2;
    doc.setFontSize(6);
    doc.text(String(item.BarCode), rotatedX, rotatedY, {
      maxWidth: textMaxW,
      angle: 90,
      align: "right"
    });
    doc.restoreGraphicsState();
  }


  doc.setFontSize(6);
  doc.text(String(item.ProductName ?? ""), textX, infoStartY + 6, { maxWidth: textMaxW });
  doc.setFontSize(5);
  doc.text(`Wt: ${item.Weight ?? ""}`, textX, infoStartY + 8);
  doc.text(`Stone: ${item.BigStone ?? ""}`, textX, infoStartY + 10);
}
