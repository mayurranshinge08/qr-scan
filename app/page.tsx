'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import QRCode from 'qrcode'

const PdfDocumentPreview = dynamic(() => import('@/components/pdf-document-preview').then((module) => module.PdfDocumentPreview), { ssr: false, loading: () => <div className="pdf-loading">Loading document…</div> })

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Home,
  Maximize2,
  Menu,
  QrCode,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

const documents = [
  { id: 'flutter-interview', title: 'Top 50 Flutter Interview Questions & Answers', description: 'A practical Flutter interview preparation guide', size: '1.2 MB', pages: 12, color: 'coral', url: '/documents/flutter-interview-questions.pdf' },
  { id: 'dart-patterns', title: 'Dart Star Patterns', description: 'Dart star pattern programs with examples', size: '420 KB', pages: 5, color: 'blue', url: '/documents/dart-star-patterns.pdf' },
  { id: 'internship-assignment', title: 'Internship Assignment — Flutter Developer', description: 'Flutter recreation assignment and deliverables', size: '680 KB', pages: 3, color: 'gold', url: '/documents/internship-assignment.pdf' },
]

function Logo({ small = false }: { small?: boolean }) {
  return <div className={`logo-mark ${small ? 'logo-small' : ''}`}><FileText size={small ? 18 : 25} strokeWidth={2.4} /><span>QR</span></div>
}

function Header({ onHome }: { onHome: () => void }) {
  return <header className="site-header"><button className="brand-button" onClick={onHome}><Logo small /><span>PDF QR Viewer</span></button><nav><button className="nav-link active">Library</button><button className="nav-link">About</button><button className="icon-button menu-button" aria-label="Open menu"><Menu size={20} /></button></nav></header>
}

function HomeScreen({ onBrowse }: { onBrowse: () => void }) {
  return <main className="home-screen"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><section className="hero-content"><div className="eyebrow"><Sparkles size={15} /> A calmer way to read</div><Logo /><h1>Every document,<br /><em>within reach.</em></h1><p>Keep your essential PDFs close, readable, and easy to share. Scan once and pick up exactly where you left off.</p><button className="primary-button hero-button" onClick={onBrowse}>View PDF Documents <ArrowRight size={18} /></button><div className="hero-note"><span className="avatar-stack"><i /><i /><i /></span> Trusted by curious readers everywhere</div></section><aside className="hero-card"><div className="card-label">Featured document <span>01 / 02</span></div><div className="hero-document-image"><FileText size={44} /><span>PDF DOCUMENT</span></div><div className="hero-card-caption"><div><strong>{documents[0].title}</strong><span>{documents[0].description}</span></div><ChevronRight size={19} /></div></aside></main>
}

function DocumentList({ onBack, onSelect }: { onBack: () => void; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [refreshed, setRefreshed] = useState(false)
  const filtered = useMemo(() => documents.filter((doc) => `${doc.title} ${doc.description}`.toLowerCase().includes(query.toLowerCase())), [query])
  return <main className="library-page"><div className="page-heading"><button className="back-link" onClick={onBack}><ArrowLeft size={17} /> Back</button><div className="heading-row"><div><div className="eyebrow">Your reading shelf</div><h1>PDF Documents</h1><p>{documents.length} carefully collected guides</p></div><button className={`refresh-button ${refreshed ? 'spinning' : ''}`} onClick={() => { setRefreshed(true); setTimeout(() => setRefreshed(false), 700) }} aria-label="Refresh documents"><RefreshCw size={18} /></button></div></div><div className="search-wrap"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search PDF documents..." /><kbd>⌘ K</kbd></div><div className="document-list">{filtered.map((doc, index) => <button className="document-card" key={doc.id} onClick={() => onSelect(doc.id)} style={{ animationDelay: `${index * 70}ms` }}><span className={`doc-icon ${doc.color}`}><FileText size={23} /></span><span className="doc-info"><strong>{doc.title}</strong><span>{doc.description}</span><small>{doc.size} <i /> {doc.pages} pages</small></span><span className="card-arrow"><ChevronRight size={19} /></span></button>)}{!filtered.length && <div className="empty-state"><Search size={28} /><strong>No documents found</strong><span>Try another search term.</span></div>}</div><p className="library-footer"><span className="status-dot" /> All documents available offline</p></main>
}

function FakePage({ zoom, doc, pageNumber, onLoad }: { zoom: number; doc: typeof documents[number]; pageNumber: number; onLoad: (count: number) => void }) {
  return <div className="pdf-page image-pdf-page" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', marginBottom: `${(zoom - 100) * 5}px` }}><PdfDocumentPreview url={doc.url} title={doc.title} pageNumber={pageNumber} onLoad={onLoad} /></div>
}

function getDocumentUrl(path: string) { return typeof window === 'undefined' ? path : new URL(path, window.location.origin).href }

function QrPattern({ value, size = 220 }: { value: string; size?: number }) {
  const [src, setSrc] = useState('')
  useEffect(() => { QRCode.toDataURL(value, { width: size, margin: 2, errorCorrectionLevel: 'H', color: { dark: '#17212b', light: '#ffffff' } }).then(setSrc) }, [value, size])
  return src ? <img className="qr-image" src={src} width={size} height={size} alt="Scannable QR code for downloading this PDF" /> : <div className="qr-loading" style={{ width: size, height: size }} aria-label="Generating QR code" />
}

function QrModal({ doc, onClose, onFullscreen }: { doc: typeof documents[number]; onClose: () => void; onFullscreen: () => void }) {
  const [copied, setCopied] = useState(false)
  const downloadPdf = () => { const link = document.createElement('a'); link.href = getDocumentUrl(doc.url); link.download = `${doc.id}.pdf`; link.setAttribute('aria-label', `Download ${doc.title}`); document.body.appendChild(link); link.click(); link.remove() }
  const sharePdf = async () => { if (navigator.share) await navigator.share({ title: doc.title, text: `Download ${doc.title}`, url: getDocumentUrl(doc.url) }); else { await navigator.clipboard.writeText(getDocumentUrl(doc.url)); setCopied(true); setTimeout(() => setCopied(false), 1800) } }
  return <div className="modal-backdrop" onClick={onClose}><section className="qr-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close QR dialog"><X size={18} /></button><div className="eyebrow">Instant access</div><h2>Download this PDF</h2><p>Scan this high-contrast QR code using another phone to open the document.</p><button className="qr-tap" onClick={onFullscreen}><QrPattern value={getDocumentUrl(doc.url)} size={220} /><span><Maximize2 size={14} /> Tap to expand</span></button><strong className="qr-title">{doc.title}</strong><div className="modal-actions"><button className="primary-button" onClick={downloadPdf}><Download size={16} /> Download PDF</button><button className="secondary-button" onClick={sharePdf}><Share2 size={16} /> Share</button></div><button className="save-qr" onClick={() => { navigator.clipboard.writeText(getDocumentUrl(doc.url)); setCopied(true); setTimeout(() => setCopied(false), 1800) }}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'QR link copied' : 'Copy download link'}</button></section></div>
}

function FullscreenQr({ doc, onClose }: { doc: typeof documents[number]; onClose: () => void }) { return <div className="fullscreen-qr"><button className="back-link" onClick={onClose}><ArrowLeft size={17} /> QR Code</button><div className="fullscreen-content"><div className="eyebrow">Scan to download</div><h1>{doc.title}</h1><div className="large-qr"><QrPattern value={getDocumentUrl(doc.url)} size={320} /></div><p>Point your camera at the code to open this document.</p><span className="url-chip">{doc.url}</span></div></div> }

function Viewer({ doc, onBack, onHome, onQr }: { doc: typeof documents[number]; onBack: () => void; onHome: () => void; onQr: () => void }) {
  const [zoom, setZoom] = useState(100)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageCount, setPageCount] = useState(doc.pages)
  const goToPage = (nextPage: number) => setPageNumber(Math.min(pageCount, Math.max(1, nextPage)))
  return <main className="viewer-page"><div className="viewer-top"><button className="back-link" onClick={onBack}><ArrowLeft size={17} /> Back</button><div className="viewer-title"><span className={`mini-doc-icon ${doc.color}`}><FileText size={16} /></span><strong>{doc.title}</strong><span className="view-page-count">{pageNumber} / {pageCount}</span></div><div className="viewer-tools"><button className="icon-button" onClick={() => setZoom(Math.max(80, zoom - 10))} aria-label="Zoom out"><ZoomOut size={18} /></button><span>{zoom}%</span><button className="icon-button" onClick={() => setZoom(Math.min(130, zoom + 10))} aria-label="Zoom in"><ZoomIn size={18} /></button></div></div><div className="viewer-body"><section className="paper-stage"><button className="page-nav page-nav-left" onClick={() => goToPage(pageNumber - 1)} disabled={pageNumber <= 1} aria-label="Previous page"><ArrowLeft size={22} /></button><FakePage zoom={zoom} doc={doc} pageNumber={pageNumber} onLoad={setPageCount} /><button className="page-nav page-nav-right" onClick={() => goToPage(pageNumber + 1)} disabled={pageNumber >= pageCount} aria-label="Next page"><ArrowRight size={22} /></button></section></div><div className="viewer-actionbar"><button onClick={onBack}><ArrowLeft size={17} /> Back</button><div className="page-stepper"><button onClick={() => goToPage(pageNumber - 1)} disabled={pageNumber <= 1} aria-label="Previous page"><ArrowLeft size={15} /></button><span>Page {pageNumber} of {pageCount}</span><button onClick={() => goToPage(pageNumber + 1)} disabled={pageNumber >= pageCount} aria-label="Next page"><ArrowRight size={15} /></button></div><button onClick={onHome}><Home size={17} /> Home</button><button className="qr-action" onClick={onQr}><QrCode size={17} /> QR Code</button></div></main>
}

export default function Page() {
  const [screen, setScreen] = useState<'home' | 'list' | 'viewer'>('home')
  const [selectedId, setSelectedId] = useState('dart-notes')
  const [qrOpen, setQrOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const selected = documents.find((doc) => doc.id === selectedId) ?? documents[0]
  return <div className="app-shell"><Header onHome={() => setScreen('home')} />{screen === 'home' && <HomeScreen onBrowse={() => setScreen('list')} />}{screen === 'list' && <DocumentList onBack={() => setScreen('home')} onSelect={(id) => { setSelectedId(id); setScreen('viewer') }} />}{screen === 'viewer' && <Viewer doc={selected} onBack={() => { setQrOpen(false); setFullscreen(false); setScreen('list') }} onHome={() => { setQrOpen(false); setFullscreen(false); setScreen('home') }} onQr={() => setQrOpen(true)} />}{qrOpen && !fullscreen && <QrModal doc={selected} onClose={() => setQrOpen(false)} onFullscreen={() => setFullscreen(true)} />}{fullscreen && <FullscreenQr doc={selected} onClose={() => setFullscreen(false)} />}</div>
}
