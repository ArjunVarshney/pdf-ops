import { extendPdf } from '../pdf-micro-tools/extendPdf';
import { marginPdf } from '../pdf-micro-tools/marginPdf';
import { splitPdf } from '../pdf-micro-tools/splitPdf';
import PdfManipulator from '../PdfManipulator';
import { fileType, range } from '../types';

type restType = 'include' | 'exclude' | undefined | null;

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
      rest?: restType;
    }[],
  ) {
    try {
      for (const part of orderList) {
        let pdf;
        pdf = await this.readDoc(part.file);
        const pageCount = pdf.getPageCount();

        if (part.rest === undefined || part.rest === null || part.rest === 'include') {
          let r = this.processOrder(part.range, pageCount, false);
          const temp = [...r];

          const rtemp = [...r];
          rtemp.sort((a, b) => a[0] - b[0]);

          if (rtemp.length === r.length && rtemp.every((value, index) => value === r[index])) {
            for (let i = 0; i < r.length - 1; i++) {
              if (r[i][1] < r[i + 1][0]) {
                r.splice(i + 1, 0, [r[i][1], r[i + 1][0]]);
              }
            }
            if (r[0][0] > 0) {
              r.splice(0, 0, [0, r[0][0]]);
            }
            if (r[r.length - 1][1] < pageCount) {
              r.push([r[r.length - 1][1], pageCount - 1]);
            }
          } else {
            let includedPages = new Set<number>();
            let allPages = [...Array(pageCount).keys()];
            for (let i = 0; i < r.length; i++) {
              for (let j = r[i][0]; j < r[i][1]; j++) {
                includedPages.add(j);
              }
            }
            for (const page of includedPages) {
              if (allPages.includes(page)) {
                allPages.splice(allPages.indexOf(page), 1);
              }
            }
            r = r.concat(allPages.map((page) => [page, page + 1]));
          }

          for (const pages of r) {
            const split = await splitPdf(pdf, [pages]);
            if (temp.includes(pages)) {
              await this.addMargin(split[0], part.margin);
            } else {
              if (this.pdfDoc) {
                this.pdfDoc = await extendPdf(this.pdfDoc, split);
              }
            }
          }
        } else {
          const r = this.processOrder(part.range, pdf.getPageCount());
          const splitted = await splitPdf(pdf, r);

          for (const doc of splitted) {
            await this.addMargin(doc, part.margin);
          }
        }
      }
    } catch (err) {
      throw new Error(`Error adding margin to the PDF: ${err}`);
    }
  }
}
