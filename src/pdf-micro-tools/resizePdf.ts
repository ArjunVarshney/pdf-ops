import { PDFDocument, PageSizes } from 'pdf-lib';
import { resizeOptions } from '../types';

type PaperSizes = {
  [size: string]: [number, number];
};

const paperSizes: PaperSizes = {
  ...PageSizes,
};

export const resizePdf = async (mainDoc: PDFDocument, options?: resizeOptions) => {
  // setting the default values to the exisiting object
  options = {
    ...{
      size: 'A4',
      mode: 'shrink-to-fit',
      orientation: 'portrait',
      position: 'center',
    },
    ...options,
  };

  const pages = mainDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();

    let newWidth = 0;
    let newHeight = 0;

    if (options.size === 'do-not-change') {
      newWidth = width;
      newHeight = height;
    } else if (typeof options.size === 'string') {
      [newWidth, newHeight] = paperSizes[options.size];
    } else if (typeof options.size === 'object') {
      [newWidth, newHeight] = options.size;
    }

    // set the orientation
    if (options.orientation === 'landscape') {
      const temp = newWidth;
      newWidth = newHeight;
      newHeight = temp;
    }

    // set the size of the page
    page.setSize(newWidth, newHeight);

    // scale the content of the page as specified
    let heightScale = 1;
    let widthScale = 1;

    if (options.mode === 'shrink-to-fit') {
      const s = Math.min(newHeight / height, newWidth / width);
      heightScale = s;
      widthScale = s;

      page.scaleContent(s, s);
    } else if (options.mode === 'fit-to-page') {
      heightScale = newHeight / height;
      widthScale = newWidth / width;

      page.scaleContent(widthScale, heightScale);
    }

    //   translate the content whereever specifieds
    let translate: [number, number];

    const offsetX = Math.round(newHeight - height * heightScale);
    const offsetY = Math.round(newWidth - width * widthScale);

    // if the mode is fit-to-page no need to translate the page
    if (options.mode === 'fit-to-page') {
      continue;
    }
    // if the mode is shrink-to-fit only certain options need to be activated
    if (options.mode === 'shrink-to-fit') {
      if (width * widthScale < newWidth) {
        if (options.position?.includes('left')) {
          options.position = 'center-left';
        } else if (options.position?.includes('right')) {
          options.position = 'center-right';
        }
      } else if (height * heightScale < newHeight) {
        if (options.position?.includes('top')) {
          options.position = 'center-top';
        } else if (options.position?.includes('bottom')) {
          options.position = 'center-bottom';
        }
      } else {
        continue;
      }
    }

    if (options.position === 'top-left') {
      translate = [0, offsetX];
    } else if (options.position === 'top-right') {
      translate = [offsetY, offsetX];
    } else if (options.position === 'bottom-right') {
      translate = [offsetY, 0];
    } else if (options.position === 'bottom-left') {
      translate = [0, 0];
    } else if (options.position === 'center-left') {
      translate = [0, offsetX / 2];
    } else if (options.position === 'center-right') {
      translate = [offsetY, offsetX / 2];
    } else if (options.position === 'center-top') {
      translate = [offsetY / 2, offsetX];
    } else if (options.position === 'center-bottom') {
      translate = [offsetY / 2, 0];
    } else {
      translate = [offsetY / 2, offsetX / 2];
    }
    page.translateContent(...translate);
  }

  return mainDoc;
};
