import { extendPdf } from '../pdf-micro-tools/extendPdf';
import { splitPdf } from '../pdf-micro-tools/splitPdf';
import { rotatePdf } from '../pdf-micro-tools/rotatePdf';
import PdfManipulator from '../PdfManipulator';
import { fileType, range } from '../types';

export default class PdfRotator extends PdfManipulator {
  // To rotate the pdf(all pages)
  async rotate(file: fileType, degree: number) {
    let pdf;
    pdf = await this.readDoc(file);

    pdf = await rotatePdf(pdf, degree);

    await this.ensureDoc();
    if (this.pdfDoc) {
      this.pdfDoc = await extendPdf(this.pdfDoc, [pdf]);
    }
  }

  // To rotate the pdf with the specified range and angle
  async rotateWithRange(orderList: { file: fileType; range: range; degree: number }[]) {
    for (const part of orderList) {
      let pdf;
      pdf = await this.readDoc(part.file);

      const r = this.processOrder(part.range, pdf.getPageCount());
      const splitted = await splitPdf(pdf, r);

      for (const doc of splitted) {
        await this.rotate(doc, part.degree);
      }
    }
  }
}
