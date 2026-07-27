'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const SIGNATURE_FONT = '"Dancing Script", cursive'

type SignaturePadProps = {
  signerName: string
  signatureImage: string | null
  onSignatureChange: (dataUrl: string | null) => void
  label?: string
}

export default function SignaturePad({
  signerName,
  signatureImage,
  onSignatureChange,
  label = 'Signature *',
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  const getCanvasPoint = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      if ('touches' in e) {
        const touch = e.touches[0]
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        }
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      }
    },
    []
  )

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      const point = getCanvasPoint(e)
      if (point) {
        isDrawingRef.current = true
        lastPointRef.current = point
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
          }
        }
      }
    },
    [getCanvasPoint]
  )

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      if (!isDrawingRef.current) return
      const point = getCanvasPoint(e)
      if (!point) return
      const canvas = canvasRef.current
      if (canvas && lastPointRef.current) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.lineTo(point.x, point.y)
          ctx.stroke()
        }
        lastPointRef.current = point
      }
    },
    [getCanvasPoint]
  )

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false
    lastPointRef.current = null
  }, [])

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    onSignatureChange(null)
  }, [onSignatureChange])

  const acceptDrawnSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const hasContent = ctx
      .getImageData(0, 0, canvas.width, canvas.height)
      .data.some((v, i) => i % 4 === 3 && v > 0)
    if (hasContent) onSignatureChange(canvas.toDataURL('image/png'))
  }, [onSignatureChange])

  const acceptTypedSignature = useCallback(async () => {
    const name = signerName.trim()
    if (!name) return
    const canvas = document.createElement('canvas')
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    canvas.width = Math.round(280 * dpr)
    canvas.height = Math.round(80 * dpr)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    ctx.fillStyle = '#1a1a1a'
    ctx.font = `700 36px ${SIGNATURE_FONT}`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    try {
      await document.fonts.load(`36px ${SIGNATURE_FONT}`)
    } catch {
      /* ignore */
    }
    ctx.fillText(name, 8, 40)
    onSignatureChange(canvas.toDataURL('image/png'))
  }, [signerName, onSignatureChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }, [])

  return (
    <div className="agreement-client-field agreement-signature-field">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap"
        rel="stylesheet"
      />
      <span className="agreement-cap-label">{label}</span>
      {signerName.trim() && (
        <div className="agreement-proposed-signature">
          <p className="agreement-signature-pad-label">Proposed signature</p>
          <div
            className="agreement-proposed-signature-preview"
            style={{ fontFamily: SIGNATURE_FONT }}
          >
            {signerName.trim()}
          </div>
          <button
            type="button"
            onClick={acceptTypedSignature}
            className="agreement-sig-btn agreement-sig-accept"
          >
            Use this signature
          </button>
        </div>
      )}
      <div className="agreement-signature-pad-wrap">
        <p className="agreement-signature-pad-label">
          Or draw your signature below, then click Accept
        </p>
        <canvas
          ref={canvasRef}
          className="agreement-signature-pad"
          width={400}
          height={120}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          aria-label="Signature pad"
        />
        <div className="agreement-signature-actions">
          <button
            type="button"
            onClick={clearSignature}
            className="agreement-sig-btn agreement-sig-clear"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={acceptDrawnSignature}
            className="agreement-sig-btn agreement-sig-accept"
          >
            Accept signature
          </button>
        </div>
      </div>
      {signatureImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={signatureImage}
          alt="Accepted signature"
          className="agreement-sig-image"
          style={{ marginTop: '0.75rem' }}
        />
      )}
    </div>
  )
}
