'use client'

import { useMemo, useState } from 'react'
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
  { id: 'dart-notes', title: 'Basic Dart — Complete Notes', description: 'Complete Dart programming notes and examples', size: '4.8 MB', pages: 1, color: 'blue', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Jul%2013%2C%202026%2C%2003_16_17%20PM-Ja1vqhBu5HErLrJRbNA5MvggG9KAos.png', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Jul%2013%2C%202026%2C%2003_16_17%20PM-Ja1vqhBu5HErLrJRbNA5MvggG9KAos.png' },
  { id: 'dart-explanation', title: 'Basic Dart — Complete Explanation', description: 'Dart fundamentals, operators, collections, and practice', size: '3.9 MB', pages: 1, color: 'coral', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jul%2013%2C%202026%2C%2001_06_28%20PM-pBVJiquez2UpvMhJRsjqtQBFTxTLde.png', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jul%2013%2C%202026%2C%2001_06_28%20PM-pBVJiquez2UpvMhJRsjqtQBFTxTLde.png' },
]

const chapters = ['Introduction to Flutter', 'Setting up your environment', 'Widgets and layouts', 'State management', 'Navigation and routing', 'Working with APIs']

function Logo({ small = false }: { small?: boolean }) {
  return <div className={`logo-mark ${small ? 'logo-small' : ''}`}><FileText size={small ? 18 : 25} strokeWidth={2.4} /><span>QR</span></div>
}

function Header({ onHome }: { onHome: () => void }) {
  return <header className="site-header"><button className="brand-button" onClick={onHome}><Logo small /><span>PDF QR Viewer</span></button><nav><button className="nav-link active">Library</button><button className="nav-link">About</button><button className="icon-button menu-button" aria-label="Open menu"><Menu size={20} /></button></nav></header>
}

function HomeScreen({ onBrowse }: { onBrowse: () => void }) {
  return <main className="home-screen"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><section className="hero-content"><div className="eyebrow"><Sparkles size={15} /> A calmer way to read</div><Logo /><h1>Every document,<br /><em>within reach.</em></h1><p>Keep your essential PDFs close, readable, and easy to share. Scan once and pick up exactly where you left off.</p><button className="primary-button hero-button" onClick={onBrowse}>View PDF Documents <ArrowRight size={18} /></button><div className="hero-note"><span className="avatar-stack"><i /><i /><i /></span> Trusted by curious readers everywhere</div></section><aside className="hero-card"><div className="card-label">Featured document <span>01 / 02</span></div><img className="hero-document-image" src={documents[0].image} alt="Preview of Basic Dart complete notes" /><div className="hero-card-caption"><div><strong>{documents[0].title}</strong><span>{documents[0].description}</span></div><ChevronRight size={19} /></div></aside></main>
}

function DocumentList({ onBack, onSelect }: { onBack: () => void; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [refreshed, setRefreshed] = useState(false)
  const filtered = useMemo(() => documents.filter((doc) => `${doc.title} ${doc.description}`.toLowerCase().includes(query.toLowerCase())), [query])
  return <main className="library-page"><div className="page-heading"><button className="back-link" onClick={onBack}><ArrowLeft size={17} /> Back</button><div className="heading-row"><div><div className="eyebrow">Your reading shelf</div><h1>PDF Documents</h1><p>{documents.length} carefully collected guides</p></div><button className={`refresh-button ${refreshed ? 'spinning' : ''}`} onClick={() => { setRefreshed(true); setTimeout(() => setRefreshed(false), 700) }} aria-label="Refresh documents"><RefreshCw size={18} /></button></div></div><div className="search-wrap"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search PDF documents..." /><kbd>⌘ K</kbd></div><div className="document-list">{filtered.map((doc, index) => <button className="document-card" key={doc.id} onClick={() => onSelect(doc.id)} style={{ animationDelay: `${index * 70}ms` }}><span className={`doc-icon ${doc.color}`}><FileText size={23} /></span><span className="doc-info"><strong>{doc.title}</strong><span>{doc.description}</span><small>{doc.size} <i /> {doc.pages} pages</small></span><span className="card-arrow"><ChevronRight size={19} /></span></button>)}{!filtered.length && <div className="empty-state"><Search size={28} /><strong>No documents found</strong><span>Try another search term.</span></div>}</div><p className="library-footer"><span className="status-dot" /> All documents available offline</p></main>
}

function FakePage({ zoom, doc }: { zoom: number; doc: typeof documents[number] }) {
  return <div className="pdf-page image-pdf-page" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', marginBottom: `${(zoom - 100) * 5}px` }}><img src={doc.image} alt={`${doc.title} document page`} /></div>
}

function QrPattern() { return <div className="qr-pattern" aria-label="QR code"><div className="finder f1" /><div className="finder f2" /><div className="finder f3" /><div className="qr-noise" /></div> }

function QrModal({ doc, onClose, onFullscreen }: { doc: typeof documents[number]; onClose: () => void; onFullscreen: () => void }) {
  const [copied, setCopied] = useState(false)
  return <div className="modal-backdrop" onClick={onClose}><section className="qr-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close QR dialog"><X size={18} /></button><div className="eyebrow">Instant access</div><h2>Download this PDF</h2><p>Scan the QR code using another phone to download it.</p><button className="qr-tap" onClick={onFullscreen}><QrPattern /><span><Maximize2 size={14} /> Tap to expand</span></button><strong className="qr-title">{doc.title}</strong><div className="modal-actions"><button className="primary-button"><Download size={16} /> Download PDF</button><button className="secondary-button"><Share2 size={16} /> Share</button></div><button className="save-qr" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1800) }}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'QR link copied' : 'Save QR Code'}</button></section></div>
}

function FullscreenQr({ doc, onClose }: { doc: typeof documents[number]; onClose: () => void }) { return <div className="fullscreen-qr"><button className="back-link" onClick={onClose}><ArrowLeft size={17} /> QR Code</button><div className="fullscreen-content"><div className="eyebrow">Scan to download</div><h1>{doc.title}</h1><div className="large-qr"><QrPattern /></div><p>Point your camera at the code to open this document.</p><span className="url-chip">{doc.url}</span></div></div> }

function Viewer({ doc, onList, onQr }: { doc: typeof documents[number]; onList: () => void; onQr: () => void }) {
  const [zoom, setZoom] = useState(100)
  return <main className="viewer-page"><div className="viewer-top"><button className="back-link" onClick={onList}><ArrowLeft size={17} /> Documents</button><div className="viewer-title"><span className={`mini-doc-icon ${doc.color}`}><FileText size={16} /></span><strong>{doc.title}</strong><span className="view-page-count">1 / {doc.pages}</span></div><div className="viewer-tools"><button className="icon-button" onClick={() => setZoom(Math.max(80, zoom - 10))} aria-label="Zoom out"><ZoomOut size={18} /></button><span>{zoom}%</span><button className="icon-button" onClick={() => setZoom(Math.min(130, zoom + 10))} aria-label="Zoom in"><ZoomIn size={18} /></button></div></div><div className="viewer-body"><aside className="chapter-list"><span className="chapter-label">Contents</span>{chapters.map((chapter, i) => <button key={chapter} className={i === 0 ? 'selected' : ''}><span>{String(i + 1).padStart(2, '0')}</span>{chapter}</button>)}<div className="viewer-tip"><Sparkles size={15} /><span>Reading tip</span><p>Use the QR code to continue reading on another device.</p></div></aside><section className="paper-stage"><FakePage zoom={zoom} doc={doc} /></section></div><div className="viewer-actionbar"><button onClick={onList}><ArrowLeft size={17} /> Back</button><button onClick={onList}><Home size={17} /> Home</button><button className="qr-action" onClick={onQr}><QrCode size={17} /> QR Code</button></div></main>
}

export default function Page() {
  const [screen, setScreen] = useState<'home' | 'list' | 'viewer'>('home')
  const [selectedId, setSelectedId] = useState('flutter')
  const [qrOpen, setQrOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const selected = documents.find((doc) => doc.id === selectedId) ?? documents[0]
  return <div className="app-shell"><Header onHome={() => setScreen('home')} />{screen === 'home' && <HomeScreen onBrowse={() => setScreen('list')} />}{screen === 'list' && <DocumentList onBack={() => setScreen('home')} onSelect={(id) => { setSelectedId(id); setScreen('viewer') }} />}{screen === 'viewer' && <Viewer doc={selected} onList={() => setScreen('list')} onQr={() => setQrOpen(true)} />}{qrOpen && !fullscreen && <QrModal doc={selected} onClose={() => setQrOpen(false)} onFullscreen={() => setFullscreen(true)} />}{fullscreen && <FullscreenQr doc={selected} onClose={() => setFullscreen(false)} />}</div>
}
