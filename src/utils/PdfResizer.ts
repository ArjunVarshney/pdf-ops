import { extendPdf } from '../pdf-micro-tools/extendPdf';
import { splitPdf } from '../pdf-micro-tools/splitPdf';
import { resizePdf } from '../pdf-micro-tools/resizePdf';
import { fileType, range, resizeOptions } from '../types';
import PdfManipulator from '../PdfManipulator';

export default class PdfResizer extends PdfManipulator {
  // to resize all the pages of the Given pdf
  async resize(file: fileType, options?: resizeOptions) {
    try {
      let pdf;
      pdf = await this.readDoc(file);

      await this.ensureDoc();
      if (!this.pdfDoc) return;

      pdf = await resizePdf(pdf, options);

      this.pdfDoc = await extendPdf(this.pdfDoc, [pdf]);
    } catch (err) {
      throw new Error(`Error resizing the pdf: ${err}`);
    }
  }

  // Resize the pdf using a range specified by the user
  async resizeWithRange(
    orderList: {
      file: fileType;
      range: range;
      options?: resizeOptions;
    }[],
  ) {
    try {
      for (const part of orderList) {
        let pdf;
        pdf = await this.readDoc(part.file);

        const r = this.processOrder(part.range, pdf.getPageCount());
        const splitted = await splitPdf(pdf, r);

        for (const doc of splitted) {
          await this.resize(doc, part.options);
        }
      }
    } catch (err) {
      throw new Error(`Error resizing the pdf: ${err}`);
    }
  }
}
