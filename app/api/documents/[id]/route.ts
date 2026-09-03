import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

const files: Record<string, string> = {
  'flutter-interview': 'flutter-interview-questions.pdf',
  'dart-patterns': 'dart-star-patterns.pdf',
  'internship-assignment': 'internship-assignment.pdf',
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const filename = files[id]
  if (!filename) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

  try {
    const file = await readFile(path.join(process.cwd(), 'public', 'documents', filename))
    const download = new URL(request.url).searchParams.get('download') === '1'
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${filename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Document unavailable' }, { status: 404 })
  }
}
