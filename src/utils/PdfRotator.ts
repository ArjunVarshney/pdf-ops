import { extendPdf } from '../pdf-micro-tools/extendPdf';
import { splitPdf } from '../pdf-micro-tools/splitPdf';
import { rotatePdf } from '../pdf-micro-tools/rotatePdf';
import PdfManipulator from '../PdfManipulator';
import { fileType, range } from '../types';

type restType = 'include' | 'exclude' | undefined | null;

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
  async rotateWithRange(orderList: { file: fileType; range: range; degree: number; rest?: restType }[]) {
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
          const includedPages = new Set<number>();
          const allPages = [...Array(pageCount).keys()];
          for (const rng of r) {
            for (let j = rng[0]; j < rng[1]; j++) {
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
            await this.rotate(split[0], part.degree);
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
          await this.rotate(doc, part.degree);
        }
      }
    }
  }
}
