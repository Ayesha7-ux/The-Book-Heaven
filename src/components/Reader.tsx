'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface ReaderProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export default function Reader({ pdfUrl, title, onClose }: ReaderProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.9)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Reader Header */}
      <div style={{
        padding: '1rem 2rem',
        background: '#1a1a1a',
        color: 'white',
        display: 'flex',
        justify-content: space-between,
        alignItems: 'center',
        borderBottom: '1px solid #333',
      }}>
        <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--serif-font)' }}>{title}</h2>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} style={{ color: 'white' }}><ZoomOut size={20} /></button>
            <span style={{ fontSize: '0.9rem', width: '40px', textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(2, s + 0.1))} style={{ color: 'white' }}><ZoomIn size={20} /></button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setPageNumber(p => Math.max(1, p - 1))} 
              disabled={pageNumber <= 1}
              style={{ color: 'white', opacity: pageNumber <= 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={24} />
            </button>
            <span style={{ fontSize: '0.9rem' }}>
              Page {pageNumber} of {numPages || '...'}
            </span>
            <button 
              onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))} 
              disabled={numPages ? pageNumber >= numPages : true}
              style={{ color: 'white', opacity: numPages && pageNumber >= numPages ? 0.5 : 1 }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <button onClick={onClose} style={{ color: 'white' }}><X size={24} /></button>
      </div>

      {/* PDF Content */}
      <div style={{
        flexGrow: 1,
        overflow: 'auto',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div style={{ color: 'white' }}>Loading document...</div>}
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            renderAnnotationLayer={false}
            renderTextLayer={true}
          />
        </Document>
      </div>
    </div>
  );
}
