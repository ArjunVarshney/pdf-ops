# Pdf-Ops

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
  - [Convert Pdf to Image](#convert-pdf-to-image)
    - [Convert all pages of a PDF to images](#convert-all-pages-of-a-pdf-to-images)
    - [Possible values in render Options](#possible-values-in-render-options)
    - [Convert pages of different PDFs with range specification](#convert-pages-of-different-pdfs-with-range-specification)
    - [Render images of many different PDFs with single object](#render-images-of-many-different-pdfs-with-single-object)
    - [Get buffer of the resultant Images](#get-buffer-of-the-resultant-images)

## Description

This node js package is able to perform various pdf tasks as desired and is able to save the resultant pdf as a new file or return a file Buffer.

## Installation

`npm install --save pdf-ops`

## Features

- Split PDFs
- Merge PDFs
- Rotate PDFs
- Resize PDFs
- Render PDFs to Images

## Usage Examples

> **Note** - All the pdf files in these examples are not kept directly inside of the root folder but in a folder named "test_files" inside the root folder

### Split Pdfs

#### **Split PDF into single paged PDFs**

```js
import { PdfSplitter } from 'pdf-ops';

(async () => {
  // Make an object of the PdfSplitter class
  const splitter = new PdfSplitter();

  // Split the desired pdf
  await splitter.split('test_files/pdf1.pdf');

  // Save the folder carrying all the pdfs
  // The first parameter is the path of the directory in which it will get stored
  // The second parameter is the name of the folder
  await splitter.save('./test_files', 'split');
})();
```

For [pdf1](/example-files/pdf1.pdf) the folder formed will be [split](/example-files/split/) inside the directory "test_files"

#### **Split PDF with range specification**

```js
import { PdfSplitter } from 'pdf-ops';

(async () => {
  // Make an object of the PdfSplitter class
  const splitter = new PdfSplitter();

  // Split the desired pdf into desired parts
  await splitter.splitWithRange('test_files/pdf2.pdf', [
    [0, 1],
    [1, 3],
    [3, 6],
  ]);

  // Save the folder carrying all the pdfs
  // The first parameter is the path of the directory in which it will get stored
  // The second parameter is the name of the folder
  await splitter.save('./test_files', 'splitWithRange');
})();
```

For [pdf2](/example-files/pdf2.pdf) the folder formed will be [splitWithRange](/example-files/splitWithRange/) inside the directory "test_files"

#### **Split multiple PDFs with a single object**

- You can keep on adding more and more pdf files in the same object, when you will save the pdfs, all of them will be in the same folder, in the order in which they were splitted

- Saving the file does not clear out the existing object, as you populate more and more pdfs in the same object they will keep on getting accumulated.

- For clearing all the pdfs stored in the object you can use `splitter.clearDoc()` to reinitialize a new empty PdfSplitter object

- Let us put all the above into a expample for explanation

```js
import { PdfSplitter } from 'pdf-ops';

(async () => {
  // Make an object of the PdfSplitter class
  const splitter = new PdfSplitter();

  // Splitting pdf1 into two pdfs
  await splitter.splitWithRange('test_files/pdf1.pdf', [
    [0, 3],
    [3, 6],
  ]);

  // Splitting pdf2 into single paged pdfs
  // The splitted pdf1 and pdf2 are now in the same object
  await splitter.split('test_files/pdf2.pdf');

  // Saving the pdfs in the folder named split1
  await splitter.save('./test_files', 'split1');

  // Splitting pdf4 into 3 parts and putting it into same object
  await splitter.splitWithRange('test_files/pdf4.pdf', [
    [0, 2],
    [2, 4],
    [4, 6],
  ]);

  // Saving the pdfs in the folder named split2
  await splitter.save('./test_files', 'split2');

  // Clearing all the pdfs in the splitter object to empty it
  await splitter.clearDoc();

  // Splitting pdf3 in reverse order
  await splitter.splitWithRange('test_files/pdf3.pdf', [
    [5, 6],
    [4, 5],
    [3, 4],
    [2, 3],
    [1, 2],
    [0, 1],
  ]);

  // Saving the pdfs in the folder named split3
  await splitter.save('./test_files', 'split3');
})();
```

- If [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), [pdf3](/example-files/pdf3.pdf), and [pdf4](/example-files/pdf4.pdf) look like this.
- Then [split1](/example-files/split1/), [split2](/example-files/split2/), and [split3](/example-files/split3/) will look like this.

#### **Merge Splitted PDfs into a sigle PDF**

```js
import { PdfMerger, PdfSplitter } from 'pdf-ops';

(async () => {
  const splitter = new PdfSplitter();
  await splitter.splitWithRange('test_files/pdf1.pdf', [[0, 3]]);
  await splitter.split('test_files/pdf2.pdf');
  await splitter.splitWithRange('test_files/pdf1.pdf', [[3, 6]]);

  // To merge the pdfs in the splitter
  // Make an object of PdfMerger
  const merger = new PdfMerger();

  // Pass the docs of splitter into merger
  await merger.merge(splitter.getDocs());

  // save the merged pdf
  await merger.save('test_files/split-merged.pdf');
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
  await splitter.splitWithRange('test_files/pdf1.pdf', [[0, 3]]);
  await splitter.split('test_files/pdf2.pdf');
  await splitter.splitWithRange('test_files/pdf1.pdf', [[3, 6]]);

  // Get pdf buffer
  const bufferList = await splitter.getPdfBuffer();

  console.log(bufferList);
})();
```

### Merge Pdfs

#### **Merge multiple PDFs (all pages of all PDFs) into a single PDF**

```js
import { PdfMerger } from 'pdf-ops';

(async () => {
  // Make an object of the PdfMerger class
  const merger = new PdfMerger();

  // Give the paths of all the pdfs inside an array
  await merger.merge(['test_files/pdf1.pdf', 'test_files/pdf2.pdf', 'test_files/pdf3.pdf']);

  // Save the resultant file on the desired location
  await merger.save('test_files/merged.pdf');
})();
```

In this example [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), and [pdf3](/example-files/pdf3.pdf) will generate [merged.pdf](/example-files/merged.pdf)

#### **Merge multiple PDFs with range specification**

```js
import { PdfMerger } from 'pdf-ops';

(async () => {
  // Make an object of the PdfMerger class
  const merger = new PdfMerger();

  // Specify the filepath with the range
  // The range works just like array indexing
  // [start, end] start page is included and end page is excluded
  await merger.mergeWithRange([
    {
      filepath: 'test_files/pdf4.pdf',
      range: [
        [0, 1],
        [5, 6],
      ],
    },
    {
      filepath: 'test_files/pdf1.pdf',
      range: [[0, 2]],
    },
    {
      filepath: 'test_files/pdf2.pdf',
      range: [[2, 4]],
    },
    {
      filepath: 'test_files/pdf3.pdf',
      range: [[4, 6]],
    },
  ]);

  // Save the resultant file on the desired path
  await merger.save('test_files/mergedWithRange.pdf');
})();
```

In this example [pdf1](/example-files/pdf1.pdf), [pdf2](/example-files/pdf2.pdf), [pdf3](/example-files/pdf3.pdf), and [pdf4](/example-files/pdf4.pdf) will generate [mergedWithRange.pdf](/example-files/mergedWithRange.pdf)

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
      filepath: 'test_files/pdf1.pdf',
      range: [[0, 2]],
    },
    {
      filepath: 'test_files/pdf2.pdf',
      range: [[4, 6]],
    },
  ]);

  // merging all the pages of pdf4 into the already populated object
  await merger.merge(['test_files/pdf4.pdf']);

  // saving it as merge1.pdf
  await merger.save('test_files/merge1.pdf');

  // merging some pages of pdf3 into the already populated object
  await merger.mergeWithRange([
    {
      filepath: 'test_files/pdf3.pdf',
      range: [[1, 4]],
    },
  ]);

  // saving it as merge2.pdf
  await merger.save('test_files/merge2.pdf');

  // clearing all the pages from the object
  await merger.clearDoc();

  // merging first and last page of pdf1, pdf2, pdf3, pdf4
  await merger.mergeWithRange([
    {
      filepath: 'test_files/pdf1.pdf',
      range: [
        [0, 1],
        [5, 6],
      ],
    },
    {
      filepath: 'test_files/pdf2.pdf',
      range: [
        [0, 1],
        [5, 6],
      ],
    },
    {
      filepath: 'test_files/pdf3.pdf',
      range: [
        [0, 1],
        [5, 6],
      ],
    },
    {
      filepath: 'test_files/pdf4.pdf',
      range: [
        [0, 1],
        [5, 6],
      ],
    },
  ]);
  // saving it as merge3.pdf
  await merger.save('test_files/merge3.pdf');
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
    { filepath: 'test_files/pdf1.pdf', range: [[0, 2]] },
    { filepath: 'test_files/pdf2.pdf', range: [[4, 6]] },
  ]);
  await merger.merge(['test_files/pdf4.pdf']);

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
  await rotator.rotate('test_files/pdf1.pdf', 90);

  // Save the rotated Pdf
  await rotator.save('test_files/rotated.pdf');
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
      // give the filepath inside the file field
      file: 'test_files/pdf1.pdf',
      // range is a list of range of pages
      // the range is specified as [start, end]
      // start page is included and end page is excluded
      range: [
        [0, 2],
        [4, 6],
      ],
      // degree should be a multiple of 90
      degree: 90,
    },
    {
      file: 'test_files/pdf2.pdf',
      range: [
        [0, 1],
        [4, 5],
      ],
      degree: -90,
    },
    {
      file: 'test_files/pdf3.pdf',
      range: [
        [4, 6],
        [0, 2],
      ],
      degree: 180,
    },
  ]);

  // Save the rotated Pdf
  await rotator.save('test_files/rotatedWithRange.pdf');
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
  await rotator.rotate('test_files/pdf1.pdf', 90);

  // rotating some pages of pdf3 180 degrees and merging into previous pdf
  await rotator.rotateWithRange([
    {
      file: 'test_files/pdf3.pdf',
      range: [[1, 5]],
      degree: 180,
    },
  ]);

  // saving the resultant pdf file as rotated1.pdf
  await rotator.save('test_files/rotated1.pdf');

  // rotating some pages and merging pdf2 and rotating it -90 degrees
  await rotator.rotateWithRange([
    {
      file: 'test_files/pdf2.pdf',
      range: [
        [0, 1],
        [5, 6],
      ],
      degree: -90,
    },
  ]);

  // saving the resultant file as rotated2.pdf
  await rotator.save('test_files/rotated2.pdf');

  // clearing all the pages of the object
  await rotator.clearDoc();

  // rotating pdf4 by 0 degrees
  await rotator.rotate('test_files/pdf4.pdf', 0);

  // saving the resultant file as rotated3.pdf
  await rotator.save('test_files/rotated3.pdf');
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
  await rotator.rotate('test_files/pdf1.pdf', 90);
  await rotator.rotateWithRange([
    {
      file: 'test_files/pdf3.pdf',
      range: [[1, 5]],
      degree: 180,
    },
  ]);
  await rotator.rotate('test_files/pdf4.pdf', 0);

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
  await resizer.resize('test_files/pdf3.pdf', options);

  // save the resized pdf
  await resizer.save('./test_files/resized.pdf');
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
  // multiple resized pdf will be merged into one during save
  await resizer.resizeWithRange([
    {
      file: 'test_files/pdf1.pdf',
      range: [[2, 5]],
      // refer to the resize options for possible allowed values
      options: {
        size: 'Letter',
        orientation: 'landscape',
      },
    },
    {
      file: 'test_files/pdf4.pdf',
      range: [[1, 3]],
      options: {
        size: 'A5',
        mode: 'crop',
      },
    },
  ]);

  // save the resized pdf
  await resizer.save('./test_files/resizedWithRange.pdf');
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
  await resizer.resize('test_files/pdf3.pdf', {
    size: 'A3',
    mode: 'crop',
    position: 'top-left',
  });

  // resize some pages of pdf4
  await resizer.resizeWithRange([
    {
      file: 'test_files/pdf4.pdf',
      range: [
        [0, 2],
        [4, 5],
      ],
      options: { size: 'A5' },
    },
  ]);

  // save resultant pdf as resized1.pdf
  await resizer.save('test_files/resized1.pdf');

  // resize pdf1
  await resizer.resize('test_files/pdf1.pdf', {
    size: 'A4',
    orientation: 'landscape',
    position: 'center-right',
  });

  // save resultant pdf as resized2.pdf
  await resizer.save('test_files/resized2.pdf');

  // clear all the pages from the object
  await resizer.clearDoc();

  // resize some pages of pdf2
  await resizer.resizeWithRange([
    {
      file: 'test_files/pdf2.pdf',
      range: [[1, 3]],
    },
  ]);

  // save resultant pdf as resized3.pdf
  await resizer.save('test_files/resized3.pdf');
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
  await resizer.resize('test_files/pdf3.pdf', { size: 'A3', mode: 'crop' });
  await resizer.resizeWithRange([
    {
      file: 'test_files/pdf4.pdf',
      range: [[0, 2]],
      options: { size: 'A5' },
    },
  ]);

  // To get the pdfBuffer
  const buffer = await resizer.getPdfBuffer();

  console.log(buffer);
})();
```

### Convert Pdf to Image

#### **Convert all pages of a PDF to images**

```js
import { PdfToImageConverter } from 'pdf-ops';

(async () => {
  // Make an object of the PdfToImageConverter class
  const converter = new PdfToImageConverter();

  // resize pdf as desired
  // Specify the desired options(optional) refer to details below this block
  const options = {
    // You can also give custom sizes
    //eg- size: [900, 900],
    size: 'A3',
    orientation: 'landscape',
    mode: 'crop',
    position: 'center-right',
  };

  // The specification of options is not necessary, if not given, default values will take over
  await converter.renderToImage('test_files/pdf4.pdf', options);

  // Save the folder carrying all the images
  // The first parameter is the path of the directory in which it will get stored
  // The second parameter is the name of the folder
  await converter.save('./test_files', 'images');
})();
```

In this example [pdf4](/example-files/pdf4.pdf) will generate [images folder](/example-files/images/)

#### **Possible values in render Options**

```js
// default values in the render options
default_render_options = {
  size: 'do-not-change',
  orientation: 'portrait',
  mode: 'shrink-to-fit',
  position: 'center',
};

// possible values in the options
// all the resize options can be applied as renderOptions
type renderOptions = {
  ...resizeOptions,
};
```

Refer to [resizeOptions](#possible-values-in-resize-options) for all the list of all the options

#### **Convert pages of different PDFs with range specification**

```js
import { PdfToImageConverter } from 'pdf-ops';

(async () => {
  // Make an object of the PdfToImageConverter class
  const converter = new PdfToImageConverter();

  // convert the pdf to image as desired
  await converter.renderToImageWithRange([
    {
      file: 'test_files/pdf2.pdf',
      range: [
        [0, 2],
        [5, 6],
      ],
      options: { size: 'A4' },
    },
    {
      file: 'test_files/pdf3.pdf',
      range: [[2, 4]],
    },
  ]);

  // save the forlder of images
  await converter.save('./test_files', 'imagesWithRange');
})();
```

In this example [pdf2](/example-files/pdf2.pdf) and [pdf3](/example-files/pdf3.pdf) will generate [imagesWithRange folder](/example-files/imagesWithRange/)

#### **Render images of many different PDFs with single object**

- You can keep on adding more and more image files in the same object, when you will save the images, all of them will be in the same folder, in the order in which they were splitted

- Saving the file does not clear out the existing images, as you populate more and more images in the same object they will keep on getting accumulated.

- For clearing all the images stored in the object you can use `converter.clearDoc()` to reinitialize a new empty PdfToImageConverter object

- Let us put all the above into a expample for explanation

```js
import { PdfToImageConverter } from 'pdf-ops';

(async () => {
  const converter = new PdfToImageConverter();

  // render pdf1
  await converter.renderToImage('test_files/pdf1.pdf');

  // some pages of pdf2
  await converter.renderToImageWithRange([
    {
      file: 'test_files/pdf2.pdf',
      range: [
        [1, 2],
        [4, 6],
      ],
    },
  ]);

  // save inside images1 folder
  await converter.save('./test_files', 'images1');

  // render pdf3
  await converter.renderToImage('test_files/pdf3.pdf');

  // save inside images2 folder
  await converter.save('./test_files', 'images2');

  // clear the documents
  await converter.clearDoc();

  // render some pages of pdf4
  await converter.renderToImageWithRange([{ file: 'test_files/pdf4.pdf', range: [[1, 5]] }]);

  // save inside images3 folder
  await converter.save('./test_files', 'images3');
})();
```

#### **Get buffer of the resultant Images**

- Getting the buffer (Uint8Array) is pretty straight foward. You can access buffer by `converter.getImageBuffer()` and it will return you the array of buffers of all the images in the resultant object

```js
import { PdfToImageConverter } from 'pdf-ops';

(async () => {
  const converter = new PdfToImageConverter();
  await converter.renderToImage('test_files/pdf1.pdf');
  await converter.renderToImageWithRange([
    {
      file: 'test_files/pdf2.pdf',
      range: [
        [1, 2],
        [4, 6],
      ],
    },
  ]);

  // To get the list of all the image buffers
  const bufferList = converter.getImageBuffer();

  console.log(bufferList);
})();
```
