import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
}

export function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  }

  function zoomOut() {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  }

  if (!pdfUrl) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">PDF not available for this book.</p>
        <p className="text-sm text-muted-foreground mt-2">
          The PDF file will be available soon, Insha'Allah.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={previousPage}
              disabled={pageNumber <= 1}
              size="sm"
              variant="outline"
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm" data-testid="text-page-info">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              size="sm"
              variant="outline"
              data-testid="button-next-page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={zoomOut} size="sm" variant="outline" data-testid="button-zoom-out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button onClick={zoomIn} size="sm" variant="outline" data-testid="button-zoom-in">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button size="sm" variant="outline" asChild data-testid="button-download">
            <a href={pdfUrl} download={title || "book.pdf"}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
        </div>
      </Card>

      {/* PDF Document */}
      <Card className="p-4 overflow-auto max-h-[800px]">
        <div className="flex justify-center">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="p-8 text-center text-muted-foreground">Loading PDF...</div>}
            error={<div className="p-8 text-center text-destructive">Failed to load PDF</div>}
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </Card>
    </div>
  );
}
