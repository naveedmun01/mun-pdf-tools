async function mergePDFs() {
    const files = document.getElementById('mergeFiles').files;
    if (files.length < 2) return alert('Select at least 2 PDF files');

    const mergedPdf = await PDFLib.PDFDocument.create();

    for (let file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    downloadPDF(mergedBytes, 'merged.pdf');
}

async function splitPDF() {
    const file = document.getElementById('splitFile').files[0];
    const pageNumber = parseInt(document.getElementById('splitPage').value);
    if (!file || isNaN(pageNumber)) return alert('Select a PDF and enter a page number');

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
    if (pageNumber < 1 || pageNumber > pdf.getPageCount()) return alert('Invalid page number');

    const newPdf = await PDFLib.PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdf, [pageNumber - 1]);
    newPdf.addPage(copiedPage);

    const newBytes = await newPdf.save();
    downloadPDF(newBytes, `page-${pageNumber}.pdf`);
}

async function jpgToPDF() {
    const files = document.getElementById('jpgFiles').files;
    if (!files.length) return alert('Select JPG images');

    const pdfDoc = await PDFLib.PDFDocument.create();

    for (let file of files) {
        const imgBytes = await file.arrayBuffer();
        const jpgImage = await pdfDoc.embedJpg(imgBytes);
        const page = pdfDoc.addPage([jpgImage.width, jpgImage.height]);
        page.drawImage(jpgImage, { x: 0, y: 0, width: jpgImage.width, height: jpgImage.height });
    }

    const pdfBytes = await pdfDoc.save();
    downloadPDF(pdfBytes, 'images.pdf');
}

function editPDF() {
    alert('Basic editing feature to be implemented');
}

function downloadPDF(bytes, filename) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
