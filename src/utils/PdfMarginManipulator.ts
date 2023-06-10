import { extendPdf } from '../pdf-micro-tools/extendPdf';
import { marginPdf } from '../pdf-micro-tools/marginPdf';
import { splitPdf } from '../pdf-micro-tools/splitPdf';
import PdfManipulator from '../PdfManipulator';
import { fileType, range } from '../types';

export default class PdfMarginManipulator extends PdfManipulator {
  // To add margin to the pdf
  async addMargin(file: fileType, margin: [number, number, number, number]) {
    let pdf;
    pdf = await this.readDoc(file);

    pdf = await marginPdf(pdf, margin);

    await this.ensureDoc();
    if (this.pdfDoc) {
      try {
        this.pdfDoc = await extendPdf(this.pdfDoc, [pdf]);
      } catch (err) {
        throw new Error(`Error mergin PDFs: ${err}`);
      }
    }
  }

  // To add the margin to the pdf with specified range
  async addMarginWithRange(
    orderList: {
      file: fileType;
      range: range;
      margin: [number, number, number, number];
    }[],
  ) {
    try {
      for (const part of orderList) {
        let pdf;
        pdf = await this.readDoc(part.file);

        const r = this.processOrder(part.range, pdf.getPageCount());
        const splitted = await splitPdf(pdf, r);

        for (const doc of splitted) {
          await this.addMargin(doc, part.margin);
        }
      }
    } catch (err) {
      throw new Error(`Error adding margin to the PDF: ${err}`);
    }
  }
}
