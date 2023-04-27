import { PDFDocument, PDFImage } from 'pdf-lib';
import sharp from 'sharp';

export const imageToPdf = async (images: Uint8Array[]) => {
  try {
    // create a new pdf
    const newPdf = await PDFDocument.create();

    // traverse over all the images
    for (const image of images) {
      let drawable: PDFImage;

      // check if the image is a jpeg of png
      const type = (await sharp(image).metadata()).format;

      if (type === 'png') {
        // if png then use embedPng
        drawable = await newPdf.embedPng(image);
      } else if (type === 'jpg' || type === 'jpeg') {
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
