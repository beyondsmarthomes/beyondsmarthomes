'use client'
import { useState } from 'react'
export default function Gallery({ images }) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <button key={i} onClick={() => { setIdx(i); setOpen(true) }} className="aspect-square border rounded overflow-hidden">
            <img src={src} alt="" className="w-full h-full object-contain p-4" />
          </button>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setOpen(false)}>
          <img src={images[idx]} alt="" className="max-h-[80vh] max-w-[90vw] rounded shadow-lg" />
        </div>
      )}
    </>
  )
}
