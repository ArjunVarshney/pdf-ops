# Pdf-Ops

## Demo website

![Website Image](/example-files/website-image.png)
- URL: https://pdfz-phi.vercel.app/
- Website Code: https://github.com/ArjunVarshney/PDFz

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Features](#features)
- [Usage Example](#usage-examples)
  - [Split Pdfs](#split-pdfs)
    - [Split PDF into single paged PDFs](#split-pdf-into-single-paged-pdfs)
    - [Split PDF with range specification](#split-pdf-with-range-specification)
    - [Split multiple PDFs with a single object](#split-multiple-pdfs-with-a-single-object)
    - [Merge Splitted PDfs into a sigle PDF](#merge-splitted-pdfs-into-a-sigle-pdf)
    - [Get array of buffer of the resultant PDFs](#get-array-of-buffer-of-the-resultant-pdfs)
  - [Merge Pdfs](#merge-pdfs)
    - [Merge multiple PDFs (all pages of all PDFs) into a single PDF](#merge-multiple-pdfs-all-pages-of-all-pdfs-into-a-single-pdf)
    - [Merge multiple PDFs with range specification](#merge-multiple-pdfs-with-range-specification)
    - [Merge multiple PDFs multiple times with a single object](#merge-multiple-pdfs-multiple-times-with-a-single-object)
    - [Get buffer of the resultant merged PDF](#get-buffer-of-the-resultant-pdf)
  - [Rotate Pdfs](#rotate-pdf)
    - [Rotate all pages of a PDF](#rotate-all-pages-of-a-pdf)
    - [Rotate pages of different PDFs with range specification](#rotate-pages-of-different-pdfs-with-range-specification)
    - [Merge multiple rotated pdf with single object](#merge-multiple-rotated-pdf-with-single-object)
    - [Get buffer of the resultant rotated PDF](#get-buffer-of-the-resultant-rotated-pdf)
  - [Resize Pdfs](#resize-pdfs)
    - [Resize all pages of a PDF](#resize-all-pages-of-a-pdf)
    - [Possible values in resize options](#possible-values-in-resize-options)
    - [Resize pages of different PDFs with range specification](#resize-pages-of-different-pdfs-with-range-specification)
    - [Merge multiple resized pdf with single object](#merge-multiple-resized-pdf-with-single-object)
    - [Get buffer of the resultant resized PDF](#get-buffer-of-the-resultant-resized-pdf)
  - [Add Margin to the Pdf](#add-margin-to-the-pdf)
    - [Add margin to all the pages of the pdf](#add-margin-to-all-the-pages-of-the-pdf)
    - [Add margin to pages of different PDFs with a range specification](#add-margin-to-pages-of-different-pdfs-with-a-range-specification)
    - [Merge multiple pdfs with added margin with single object](#merge-multiple-pdfs-with-added-margin-with-single-object)
    - [Get buffer of the resultant pdf with added margin](#get-buffer-of-the-resultant-pdf-with-added-margin)
  - [Convert images to PDF](#convert-images-to-pdf)
    - [Convert all images to pdf](#convert-all-images-to-pdf)
    - [Possible values in image to pdf options](#possible-values-in-image-to-pdf-options)
    - [Merge the converted images with single object](#merge-the-converted-images-with-single-object)
    - [Get buffer of the resultant image inserted pdf](#get-buffer-of-the-resultant-image-inserted-pdf)
  - [Rules for specifying the range array](#rules-for-specifying-range)
  - [File Input](#file-input)

## Description

This node js package is able to perform various pdf tasks as desired and is able to save the resultant pdf as a new file or return a file Buffer.

## Installation

`npm install --save pdf-ops`

## Features

- Split PDFs
- Merge PDFs
- Rotate PDFs
- Resize PDFs
- Add Margin to the PDFs
- Convert images to Pdf

## Usage Examples

> **Note** - Some of the functions in this module only work on the clients side, not on server side
> **Note** - All the pdf files in these examples are not kept directly inside of the root folder but in a folder named "test_files" inside the root folder

### Split Pdfs

#### **Split PDF into single paged PDFs**

```js
import { PdfSplitter } from 'pdf-ops';

(async () => {
  // Make an object of the PdfSplitter class
  const splitter = new PdfSplitter();

  // inputFile can be a instance of File or Blob or PdfDocument(pdf-lib) or it can be a Uint8Arrayor ArrayBuffer
  await splitter.split(pdf1);

  // This will give the Uint8Array of the processed Pdf
  const split = await splitter.getPdfBuffer();
})();
```

For [pdf1](/example-files/pdf1.pdf) the pdfs formed will be [split](/example-files/split/)

#### **Split PDF with range specification**

```js
import { PdfSplitter } from 'pdf-ops';

(async () => {
  // Make an object of the PdfSplitter class
  const splitter = new PdfSplitter();

  // inputFile can be a instance of File or Blob or PdfDocument(pdf-lib) or it can be a Uint8Array or ArrayBuffer
  // read the rules for specifying range
  await splitter.splitWithRange(pdf2, [1, [2, 3], [4, 6], ['end', 3]]);

  const splitWithRange = await splitter.getPdfBuffer();
  // This will give the Uint8Array of the processed Pdf
})();
```

For [pdf2](/example-files/pdf2.pdf) the files formed will be [splitWithRange](/example-files/splitWithRange/)

#### **Split multiple PDFs with a single object**

- You can keep on adding more and more pdf files in the same object, when you will save the pdfs, all of them will be in the same folder, in the order in which they were splitted

- Saving the file does not clear out the existing object, as you populate more and more pdfs in the same object they will keep on getting accumulated.

- For clearing all the pdfs stored in the object you can use `splitter.clearDoc()` to reinitialize a the PdfSplitter object

- Let us put all the above into a expample for explanation

```js
import { PdfSplitter } from 'pdf-ops';

(async () => {
  // Make an object of the PdfSplitter class
  const splitter = new PdfSplitter();

  // Splitting pdf1 into two pdfs
  await splitter.splitWithRange(pdf1, [
    [1, 3],
    [4, 6],
  ]);

  // Splitting pdf2 into single paged pdfs
  // The splitted pdf1 and pdf2 are now in the same object
  await splitter.split(pdf2);

  // Saving the pdfs in the folder named split1
  const split1 = await splitter.getPdfBuffer();

  // Splitting pdf4 into 3 parts and putting it into same object
  await splitter.split(pdf4);

  // Saving the pdfs in the folder named split2
  const split2 = await splitter.getPdfBuffer();

  // Clearing all the pdfs in the splitter object to empty it
  await splitter.clearDoc();

  // Splitting pdf3 in reverse order
  await splitter.splitWithRange(pdf3, [['end', 'start']]);

  // Saving the pdfs in the folder named split3
  const split3 = await splitter.getPdfBuffer();
})();
```

- If [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), [pdf3](/example-files/pdf3.pdf), and [pdf4](/example-files/pdf4.pdf) look like this.
- Then [split1](/example-files/split1/), [split2](/example-files/split2/), and [split3](/example-files/split3/) will look like this.

#### **Merge Splitted PDfs into a sigle PDF**

```js
import { PdfMerger, PdfSplitter } from 'pdf-ops';

(async () => {
  const splitter = new PdfSplitter();
  await splitter.splitWithRange(pdf1, [[1, 3]]);
  await splitter.split(pdf2);
  await splitter.splitWithRange(pdf1, [[4, 6]]);

  // To merge the pdfs in the splitter
  // Make an object of PdfMerger
  const merger = new PdfMerger();

  // Pass the docs of splitter into merger
  await merger.merge(splitter.getDocs());

  const split_merged = await merger.getPdfBuffer();
})();
```

- If [pdf1](/example-files/pdf1.pdf), and [pdf2](/example-files/pdf2.pdf) look like this.
- Then [split-merged.pdf](/example-files/split-merged.pdf) will look like this.

#### **Get array of buffer of the resultant PDFs**

- Getting the buffer (Uint8Array) is pretty straight foward. You can access buffer by `await splitter.getPdfBuffer()` and it will return you the array of buffers of all the splitted pdfs

```js
import { PdfSplitter } from 'pdf-ops';

(async () => {
  const splitter = new PdfSplitter();

  // Split the desired pdfs
  await splitter.splitWithRange(pdf1, [[1, 3]]);
  await splitter.split(pdf2);
  await splitter.splitWithRange(pdf1, [[4, 6]]);

  // Get pdf buffer
  const bufferList = await splitter.getPdfBuffer();
})();
```

### Merge Pdfs

#### **Merge multiple PDFs (all pages of all PDFs) into a single PDF**

```js
import { PdfMerger } from 'pdf-ops';

(async () => {
  // Make an object of the PdfMerger class
  const merger = new PdfMerger();

  // inputFile(pdf1, pdf2, pdf3) can be a instance of File or Blob or PdfDocument(pdf-lib) or it can be a Uint8Array
  await merger.merge([pdf1, pdf2, pdf3]);

  // This will give the Uint8Array of the processed Pdf
  const merged = await merger.getPdfBuffer();
})();
```

In this example [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), and [pdf3](/example-files/pdf3.pdf) will generate [merged.pdf](/example-files/merged.pdf)

#### **Merge multiple PDFs with range specification**

```js
import { PdfMerger } from 'pdf-ops';

(async () => {
  // Make an object of the PdfMerger class
  const merger = new PdfMerger();

  // inputFile can be a instance of File or Blob or PdfDocument(pdf-lib) or it can be a Uint8Array
  // read the rules to specify range
  await merger.mergeWithRange([
    {
      filepath: pdf4,
      range: [1, 5],
    },
    {
      filepath: pdf1,
      range: [1, 2],
    },
    {
      filepath: pdf2,
      range: [3, 4],
    },
    {
      filepath: pdf3,
      range: [5, 6],
    },
  ]);

  // This will give the Uint8Array of the processed Pdf
  const mergedWithRange = await merger.getPdfBuffer();
})();
```

In this example [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), [pdf3](/example-files/pdf3.pdf), and [pdf4](/example-files/pdf4.pdf) will generate [mergedWithRange.pdf](/example-files/mergedWithRange.pdf)

[rules to specify range](#rules-for-specifying-range)

#### **Merge multiple PDFs multiple times with a single object**

- You can keep on adding more and more pdfs in the same object and save whenever you want.

- Saving the pdf file does not clear the object and if you add new pages into it, they will succeed the pages already present in the object

- For clearing the object you can use `merger.clearDoc()`. This will remove all the pages from the object

- Let's put all the above into one example for explanation

```js
import { PdfMerger } from 'pdf-ops';

(async () => {
  // Make an object of the PdfMerger class
  const merger = new PdfMerger();

  // first merging some pages of pdf1 and pdf2
  await merger.mergeWithRange([
    {
      filepath: pdf1,
      range: [1, 2],
    },
    {
      filepath: pdf2,
      range: [5, 6],
    },
  ]);

  // merging all the pages of pdf4 into the already populated object
  await merger.merge([pdf4]);

  // saving it as merge1
  const merge1 = await merger.getPdfBuffer();

  // merging some pages of pdf3 into the already populated object
  await merger.mergeWithRange([
    {
      filepath: pdf3,
      range: [[2, 4]],
    },
  ]);

  // saving it as merge2
  const merge2 = await merger.getPdfBuffer();

  // clearing all the pages from the object
  await merger.clearDoc();

  // merging first and last page of pdf1, pdf2, pdf3, pdf4
  await merger.mergeWithRange([
    {
      filepath: pdf1,
      range: [1, 6],
    },
    {
      filepath: pdf2,
      range: [1, 6],
    },
    {
      filepath: pdf3,
      range: [1, 6],
    },
    {
      filepath: pdf4,
      range: [1, 6],
    },
  ]);
  // saving it as merge3
  const merge3 = await merger.getPdfBuffer();
})();
```

- If [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), [pdf3](/example-files/pdf3.pdf), and [pdf4](/example-files/pdf4.pdf) look like this.
- Then [merge1](/example-files/merge1.pdf), [merge2](/example-files/merge2.pdf), and [merge3](/example-files/merge3.pdf) will look like this.

#### **Get buffer of the resultant PDF**

- Getting the buffer (Uint8Array) is pretty straight foward. You can access buffer by `await merger.getPdfBuffer()` and it will return you the buffer of the merged pdf

```js
import { PdfMerger } from 'pdf-ops';

(async () => {
  const merger = new PdfMerger();

  // Merge the desired pdfs
  await merger.mergeWithRange([
    { filepath: pdf1, range: [1, 2] },
    { filepath: pdf2, range: [5, 6] },
  ]);
  await merger.merge([pdf4]);

  // Get the buffer of the merged pdfs
  const buffer = await merger.getPdfBuffer();

  console.log(buffer);
})();
```

### Rotate Pdfs

#### **Rotate all pages of a PDF**

```js
import { PdfRotator } from 'pdf-ops';

(async () => {
  // Make an object of the class PdfRotator
  const rotator = new PdfRotator();

  // rotate the desired pdf
  // the angle should be a multiple of 90
  await rotator.rotate(pdf1, 90);

  // Save the rotated Pdf
  const rotated = await rotator.getPdfBuffer();
})();
```

In this example [pdf1](/example-files/pdf1.pdf) will generate [rotated.pdf](/example-files/rotated.pdf)

#### **Rotate pages of different PDFs with range specification**

```js
import { PdfRotator } from 'pdf-ops';

(async () => {
  // Make an object of the class PdfRotator
  const rotator = new PdfRotator();

  // Give an array of objects which contains
  // file, range, degree
  // as given in the example
  await rotator.rotateWithRange([
    {
      // inputFile can be a instance of File or Blob or PdfDocument(pdf-lib) or it can be a Uint8Array
      file: pdf1,
      // range is a list to specify the pages of the pdf (read the rules for specifying this list)
      range: [1, 2, 5, 6],
      // degree should be a multiple of 90
      degree: 90,
    },
    {
      file: pdf2,
      range: [1, 5],
      degree: -90,
    },
    {
      file: pdf3,
      range: [5, 6, 1, 2],
      degree: 180,
    },
  ]);

  // Save the rotated Pdf
  await rotator.getPdfBuffer();
})();
```

In this example [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), and [pdf3](/example-files/pdf3.pdf) will generate [rotatedWithRange.pdf](/example-files/rotatedWithRange.pdf)

#### **Merge multiple rotated pdf with single object**

- The rotated pdfs rotated with a single object will be automatically merged in order in which they were rotated

- The object will not be cleared after saving the file, therefore the pdfs will keep on getting merged into the previously rotated pdf files

- For clearing the pages in the object use `await rotator.clearDoc()`

- Lets put all this into an example for explanation

```js
import { PdfRotator } from 'pdf-ops';

(async () => {
  // Make an object of the class PdfRotator
  const rotator = new PdfRotator();

  // rotating pdf1 90 degrees
  await rotator.rotate(pdf1, 90);

  // rotating some pages of pdf3 180 degrees and merging into previous pdf
  await rotator.rotateWithRange([
    {
      file: pdf3,
      range: [[2, 5]],
      degree: 180,
    },
  ]);

  // saving the resultant pdf file as rotated1
  const rotated1 = await rotator.getPdfBuffer();

  // rotating some pages and merging pdf2 and rotating it -90 degrees
  await rotator.rotateWithRange([
    {
      file: pdf2,
      range: [1, 6],
      degree: -90,
    },
  ]);

  // saving the resultant file as rotated2.pdf
  const rotated2 = await rotator.getPdfBuffer();

  // clearing all the pages of the object
  await rotator.clearDoc();

  // rotating pdf4 by 0 degrees
  await rotator.rotate(pdf4, 0);

  // saving the resultant file as rotated3.pdf
  const rotated3 = await rotator.getPdfBuffer();
})();
```

- If [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), and [pdf3](/example-files/pdf3.pdf), and [pdf4](/example-files/pdf4.pdf) look like this.
- Then [rotated1.pdf](/example-files/rotated1.pdf), [rotated2.pdf](/example-files/rotated2.pdf), and [rotated3.pdf](/example-files/rotated3.pdf) will look like this

#### **Get buffer of the resultant rotated PDF**

- Getting the buffer (Uint8Array) is pretty straight foward. You can access buffer by `await rotator.getPdfBuffer()` and it will return you the buffer of the resultant pdf

```js
import { PdfRotator } from 'pdf-ops';

(async () => {
  const rotator = new PdfRotator();

  // Rotate the pdfs as desired
  await rotator.rotate(pdf1, 90);
  await rotator.rotateWithRange([
    {
      file: pdf3,
      range: [[2, 5]],
      degree: 180,
    },
  ]);
  await rotator.rotate(pdf4, 0);

  // To the the buffer of the resultant pdf
  const buffer = await rotator.getPdfBuffer();

  console.log(buffer);
})();
```

### Resize Pdfs

#### **Resize all pages of a PDF**

```js
import { PdfResizer } from 'pdf-ops';

(async () => {
  // Make an object of the PdfResizer class
  const resizer = new PdfResizer();

  // resize pdf as desired
  // The second parameter are the options(optional) refer to details below this block
  const options = {
    // You can also give custom sizes
    //eg- size: [900, 900],
    size: 'A3',
  };

  // The specification of options is not necessary, if not given, default values will take over
  await resizer.resize(pdf3, options);

  // save the resized pdf
  const resized = await resizer.getPdfBuffer();
})();
```

In this example [pdf3](/example-files/pdf3.pdf) will generate [resized.pdf](/example-files/resized.pdf)

#### **Possible values in resize options**

```ts
// default values if not specified in the options variable
default_option_values = {
  orientation: 'portrait',
  mode: 'shrink-to-fit',
  position: 'center',
  size: 'A4',
};

// allowed options
type resizeOptions = {
  orientation: 'portrait' | 'landscape';
  mode: 'shrink-to-fit' | 'fit-to-page' | 'crop';
  position:
    | 'center'
    | 'top-left'
    | 'top-right'
    | 'bottom-right'
    | 'bottom-left'
    | 'center-left'
    | 'center-right'
    | 'center-top'
    | 'center-bottom';
  size:
    | [number, number] // this is for custom size
    | 'do-not-change'
    | '4A0'
    | '2A0'
    | 'A0'
    | 'A1'
    | 'A2'
    | 'A3'
    | 'A4'
    | 'A5'
    | 'A6'
    | 'A7'
    | 'A8'
    | 'A9'
    | 'A10'
    | 'B0'
    | 'B1'
    | 'B2'
    | 'B3'
    | 'B4'
    | 'B5'
    | 'B6'
    | 'B7'
    | 'B8'
    | 'B9'
    | 'B10'
    | 'C0'
    | 'C1'
    | 'C2'
    | 'C3'
    | 'C4'
    | 'C5'
    | 'C6'
    | 'C7'
    | 'C8'
    | 'C9'
    | 'C10'
    | 'RA0'
    | 'RA1'
    | 'RA2'
    | 'RA3'
    | 'RA4'
    | 'SRA0'
    | 'SRA1'
    | 'SRA2'
    | 'SRA3'
    | 'SRA4'
    | 'Executive'
    | 'Folio'
    | 'Legal'
    | 'Letter'
    | 'Tabloid';
};
```

#### **Resize pages of different PDFs with range specification**

```js
import { PdfResizer } from 'pdf-ops';

(async () => {
  // Make an object of the PdfResizer class
  const resizer = new PdfResizer();

  // resize pdf as desired
  // multiple resized pdf will be merged into one
  await resizer.resizeWithRange([
    {
      // inputFile can be a instance of File or Blob or PdfDocument(pdf-lib) or it can be a Uint8Array
      file: pdf1,
      // refer to the rules to pecify range
      range: [[3, 5]],
      // refer to the resize options for possible allowed values
      options: {
        size: 'Letter',
        orientation: 'landscape',
      },
    },
    {
      file: pdf4,
      range: [[2, 3]],
      options: {
        size: 'A5',
        mode: 'crop',
      },
    },
  ]);

  const resizedWithRange = await resizer.getPdfBuffer();
})();
```

In this example [pdf1](/example-files/pdf1.pdf) and [pdf4](/example-files/pdf4.pdf) will generate [resizedWithRange.pdf](/example-files/resizedWithRange.pdf)

#### **Merge multiple resized pdf with single object**

- The resized pdfs resized with a single object will be automatically merged in order in which they were resized

- The object will not be cleared after saving the file, therefore the pdfs will keep on getting merged into the previously resized pdf files

- For clearing the pages in the object use `await resizer.clearDoc()`

- Lets put all this into an example for explanation

```js
import { PdfResizer } from 'pdf-ops';

(async () => {
  // Make an object of the PdfResizer class
  const resizer = new PdfResizer();

  // resize pdf3
  await resizer.resize(pdf3, {
    size: 'A3',
    mode: 'crop',
    position: 'top-left',
  });

  // resize some pages of pdf4
  await resizer.resizeWithRange([
    {
      file: pdf4,
      range: [1, 2, 5],
      options: { size: 'A5' },
    },
  ]);

  // save resultant pdf as resized1
  const resized1 = await resizer.getPdfBuffer();

  // resize pdf1
  await resizer.resize(pdf1, {
    size: 'A4',
    orientation: 'landscape',
    position: 'center-right',
  });

  // save resultant pdf as resized2
  const resized2 = await resizer.getPdfBuffer();

  // clear all the pages from the object
  await resizer.clearDoc();

  // resize some pages of pdf2
  await resizer.resizeWithRange([
    {
      file: pdf2,
      range: [2, 3],
    },
  ]);

  // save resultant pdf as resized3
  const resized3 = await resizer.getPdfBuffer();
})();
```

- If [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), [pdf3](/example-files/pdf3.pdf), and [pdf4](/example-files/pdf4.pdf) look like this
- Then [resized1](/example-files/resized1.pdf), [resized2](/example-files/resized2.pdf), and [resized3](/example-files/resized3.pdf) will look like this

#### **Get buffer of the resultant resized PDF**

- Getting the buffer (Uint8Array) is pretty straight foward. You can access buffer by `await resizer.getPdfBuffer()` and it will return you the buffer of the resultant pdf

```js
import { PdfResizer } from 'pdf-ops';

(async () => {
  const resizer = new PdfResizer();
  await resizer.resize(pdf3, { size: 'A3', mode: 'crop' });
  await resizer.resizeWithRange([
    {
      file: pdf4,
      range: [1, 2],
      options: { size: 'A5' },
    },
  ]);

  // To get the pdfBuffer
  const buffer = await resizer.getPdfBuffer();

  console.log(buffer);
})();
```

### Add Margin to the Pdf

#### **Add margin to all the pages of the pdf**

```js
import { PdfMarginManipulator } from 'pdf-ops';

(async () => {
  // create a new object of the PdfMarginManipulator class
  const marginManipulator = new PdfMarginManipulator();

  // add margin to the pdf in [top, right, bottom, left] fashion
  // inputFile can be a instance of File or Blob or PdfDocument(pdf-lib) or it can be a Uint8Array
  await marginManipulator.addMargin(pdf3, [20, 10, 5, 15]);

  // save the resultant pdf
  const addedMargin = await marginManipulator.getPdfBuffer();
})();
```

In this example [pdf3](/example-files/pdf3.pdf) will generate [addedMargin.pdf](/example-files/addedMargin.pdf)

#### **Add margin to pages of different PDFs with a range specification**

```js
import { PdfMarginManipulator } from 'pdf-ops';

(async () => {
  // create a new object of the PdfMarginManipulator class
  const marginManipulator = new PdfMarginManipulator();

  // add the margin to different pages of different pdfs like as follows
  await marginManipulator.addMarginWithRange([
    {
      // inputFile can be a instance of File or Blob or PdfDocument(pdf-lib) or it can be a Uint8Array
      file: pdf1,
      // read the rules to specify range of the pages
      range: [1, 2],
      // [top, right, bottom, left]
      margin: [10, 10, 10, 10],
    },
    {
      file: pdf2,
      range: [3, 4],
      margin: [20, 20, 20, 20],
    },
    {
      file: pdf3,
      range: [5, 6],
      margin: [30, 30, 30, 30],
    },
  ]);

  // save the resultant merged file
  const addedMarginWithRange = await marginManipulator.getPdfBuffer();
})();
```

In this example [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf) and [pdf3](/example-files/pdf3.pdf) will generate [addedMarginWithRange.pdf](/example-files/addedMarginWithRange.pdf)

#### **Merge multiple pdfs with added margin with single object**

- The pdfs with added margin with a single object will be automatically merged in order in which they were manipulated

- The object will not be cleared after saving the file, therefore the pdfs will keep on getting merged into the previously manipulated pdf files

- For clearing the pages in the object use `await marginManipulator.clearDoc()`

- Lets put all this into an example for explanation

```js
import { PdfMarginManipulator } from 'pdf-ops';

(async () => {
  // create a new object of the PdfMarginManipulator class
  const marginManipulator = new PdfMarginManipulator();

  // adding margin to pdf1
  // the margin should be in the format [top, right, bottom, left]
  await marginManipulator.addMargin(pdf1, [0, 10, 10, 10]);

  // adding margin to some pages of pdf2
  await marginManipulator.addMarginWithRange([
    {
      file: pdf2,
      range: [[2, 4]],
      margin: [10, 0, 10, 10],
    },
  ]);

  // saving as addMargin1
  const addMargin1 = await marginManipulator.getPdfBuffer();

  // adding margin to pdf3
  await marginManipulator.addMargin(pdf3, [10, 10, 0, 10]);

  // saving as addMargin2
  const addMargin2 = await marginManipulator.getPdfBuffer();

  // clearing add the pages with in the object
  await marginManipulator.clearDoc();

  // adding margin to some pages of pdf3
  await marginManipulator.addMarginWithRange([
    {
      file: pdf4,
      range: [1, 5, 6],
      margin: [10, 10, 10, 0],
    },
  ]);

  // saving as addMargin3
  const addMargin3 = await marginManipulator.getPdfBuffer();
})();
```

- If [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), [pdf3](/example-files/pdf3.pdf) and [pdf4](/example-files/pdf4.pdf) look like this.
- then [addMargin1](/example-files/addMargin1.pdf), [addMargin2](/example-files/addMargin2.pdf) and [addMargin3](/example-files/addMargin3.pdf) will look like this.

#### **Get buffer of the resultant pdf with added margin**

- Getting the buffer (Uint8Array) is pretty straight foward. You can access buffer by `await marginManipulator.getPdfBuffer()` and it will return you the buffer of the resultant pdf

```js
import { PdfMarginManipulator } from 'pdf-ops';

(async () => {
  const marginManipulator = new PdfMarginManipulator();
  await marginManipulator.addMargin(pdf1, [0, 10, 10, 10]);
  await marginManipulator.addMarginWithRange([
    {
      file: pdf2,
      range: [[2, 4]],
      margin: [10, 0, 10, 10],
    },
  ]);

  // to get the buffer of the resultant pdf
  const buffer = await marginManipulator.getPdfBuffer();

  console.log(buffer);
})();
```

### Convert images to PDF

#### **Convert all images to pdf**

```js
import { ImageToPdfConverter } from 'pdf-ops';

(async () => {
  // create an object of the ImageToPdfConverter class
  const converter = new ImageToPdfConverter();

  // initialize the options for converting images to pdf
  const options = {
    size: 'B3',
    orientation: 'portrait',
    mode: 'crop',
    position: 'bottom-left',
    opacity: 0.8,
    margin: [0, 10, 20, 30],
  };

  // convert the images to pdf
  await converter.createPdf(
    ['test_files/images3/img1.png', 'test_files/images3/img2.png', 'test_files/images3/img3.png'],
    options, // optional to pass see the block below for default values and possible values
  );

  // save the resultant pdf to desired locations
  await converter.getPdfBuffer();
})();
```

If [img1](/example-files/images1/img1.png), [img2](/example-files/images1/img2.png) and [img3](/example-files/images1/img3.png) then [imgToPdf.pdf](/example-files/imgToPdf.pdf) will look like this

#### **Possible values in image to pdf options**

```js
export type createOptions = resizeOptions & {
  //refer to resize options for resize options
  opacity?: number,
  margin?: [number, number, number, number],
};

default_create_options = {
  size: 'do-not-change',
  orientation: 'portrait',
  mode: 'shrink-to-fit',
  position: 'center',
  opacity: 1,
  margin: [0, 0, 0, 0],
};
```

For resize option click on [this](#possible-values-in-resize-options)

#### **Merge the converted images with single object**

- The images will keep on accumulating if not cleared

- For clearing the object use `await converter.clearDoc()`

```js
import { ImageToPdfConverter } from 'pdf-ops';

(async () => {
  // create an object of the ImageToPdfConverter class
  const converter = new ImageToPdfConverter();

  // convert the images to pdf
  await converter.createPdf(
    ['test_files/images3/img1.png', 'test_files/images3/img2.png', 'test_files/images3/img3.png'],
    {
      size: 'B3',
      orientation: 'portrait',
      margin: [0, 10, 20, 30],
    },
  );

  // add images to the already present pages in the object
  await converter.createPdf(
    ['test_files/images2/img5.png', 'test_files/images2/img6.png', 'test_files/images2/img7.png'],
    {
      size: 'A4',
      position: 'center-top',
      margin: [20, 20, 20, 20],
    },
  );

  // save the resultant mergeed pdf to desired locations
  await converter.getPdfBuffer();
})();
```

If [img1](/example-files/images1/img1.png), [img2](/example-files/images1/img2.png), [img3](/example-files/images1/img3.png), [img5](/example-files/images2/img5.png), [img6](/example-files/images2/img6.png), [img7](/example-files/images2/img7.png) then [imgToPdfMerged.pdf](/example-files/imgToPdf.pdf) will look like this

#### **Get buffer of the resultant image inserted pdf**

- Getting the buffer (Uint8Array) is pretty straight foward. You can access buffer by `converter.getImageBuffer()` and it will return you the array of buffers of the resultant pdf

```js
import { ImageToPdfConverter } from 'pdf-ops';

(async () => {
  // create an object of the ImageToPdfConverter class
  const converter = new ImageToPdfConverter();

  // convert the images to pdf
  await converter.createPdf(
    ['test_files/images3/img1.png', 'test_files/images3/img2.png', 'test_files/images3/img3.png'],
    {
      size: 'B3',
      orientation: 'portrait',
      margin: [0, 10, 20, 30],
    },
  );

  const buffer = await converter.getPdfBuffer();

  console.log(buffer);
})();
```

### Rules for specifying range

- Single Page Selection: To select a single page, specify the page number as an integer. For example: [1] selects page 1.

- Multiple Page Selection: To select multiple non-consecutive pages, list the page numbers as separate integers within square brackets. For example: [1, 2, 3] selects pages 1, 2, and 3.

- Page Range Selection: To select a range of consecutive pages, specify the starting and ending page numbers as a two-element array within square brackets. For example: [5, 10] selects pages 5 to 10, inclusive.

- Mixed Page Selection: To select a combination of single pages, page ranges, and the start or end of the PDF, provide them as separate elements in the array. For example: [1, 2, 3, [6, 10], [7, "end"]] selects pages 1, 2, 3, 6 to 10, page 7 to the end of the PDF.

  - To select from a specific page to the end of the PDF, use the string "end" as the second element in the array. For example: [7, "end"] selects page 7 to the end of the PDF.

  - To select from the start of the PDF to a specific page, use the string "start" as the first element in the array. For example: ["start", 3] selects from the start of the PDF to page 3.

- Reverse Page Selection: To select pages in reverse order, specify the page numbers in reverse order within a two-element array.

  - To select a range of pages in reverse order, provide the ending page number as the first element and the starting page number as the second element in the array. For example: [10, 6] selects pages 10 to 6 in reverse order.

  - To select from a specific page to the beginning of the PDF in reverse, use the "start" keyword as the second element and the page number as the first element in the array. For example: [4, "start"] selects page 4 to the beginning of the PDF in reverse order.

### File input

- You can give any of the follow type as input to the variable:
  - Blob: raw file.
  - File: input file from the DOM
  - ArrayBuffer: Input file using fs module
  - Uint8Array: Input file using fs module
  - PDFDocument: PDFDocument object from pdf-lib
