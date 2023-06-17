import { PDFDocument, PDFImage } from 'pdf-lib';

function check(headers: any[]) {
  return (
    buffers: Uint8Array,
    options = {
      offset: 0,
    },
  ) => headers.every((header, index) => header === buffers[options.offset + index]);
}

const isPNG = check([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const isJPEG = check([0xff, 0xd8, 0xff]);
const isJPG = check([0xff, 0xd8]);

export const imageToPdf = async (images: Uint8Array[]) => {
  try {
    // create a new pdf
    const newPdf = await PDFDocument.create();

    // traverse over all the images
    for (const image of images) {
      let drawable: PDFImage;

      if (isPNG(image)) {
        // if png then use embedPng
        drawable = await newPdf.embedPng(image);
      } else if (isJPEG(image) || isJPG(image)) {
        // if jpeg of jpg use embedJpg
        drawable = await newPdf.embedJpg(image);
      } else {
        throw new Error('No image found');
      }
      // find the height and width of the image
      const { width, height } = drawable.scale(1);

      // add a page of the size of image
      const page = newPdf.addPage([width, height]);

      // draw the image on the page
      page.drawImage(drawable, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }
    return newPdf;
  } catch (err) {
    throw new Error(`Error converting image to pdf: ${err}`);
  }
};
