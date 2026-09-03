'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type PdfDocumentPreviewProps = {
  url: string
  title: string
  pageNumber: number
  onLoad: (count: number) => void
}

export function PdfDocumentPreview({ url, title, pageNumber, onLoad }: PdfDocumentPreviewProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <Document
      file={url}
      onLoadSuccess={({ numPages }) => { setLoaded(true); onLoad(numPages) }}
      loading={<div className="pdf-loading">Loading document…</div>}
      error={<div className="pdf-error"><strong>PDF preview unavailable</strong><a href={url} target="_blank" rel="noreferrer">Open PDF in a new tab</a></div>}
    >
      <Page pageNumber={pageNumber} width={760} renderAnnotationLayer renderTextLayer />
      {loaded && <span className="sr-only">Showing page {pageNumber} of {title}</span>}
    </Document>
  )
}
