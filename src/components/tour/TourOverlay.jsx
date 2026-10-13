import Box from '@mui/material/Box'

const OVERLAY = 'rgba(20, 34, 50, .42)'
const PAD = 7

/*
 * Dims the whole screen except the target: four dark panels around it,
 * plus a blue outline on the target itself.
 */
export default function TourOverlay({ targetRect }) {
  const topH = Math.max(targetRect.top - PAD, 0)
  const bottomTop = Math.min(targetRect.bottom + PAD, window.innerHeight)
  const leftW = Math.max(targetRect.left - PAD, 0)
  const rightLeft = Math.min(targetRect.right + PAD, window.innerWidth)
  const midH = Math.max(bottomTop - topH, 0)

  return (
    <>
      {/* Dark overlay (4 panels around the target) */}
      <Box
        sx={{ position: 'fixed', inset: 0, zIndex: 1400, pointerEvents: 'none' }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: topH, bgcolor: OVERLAY }} />
        <Box sx={{ position: 'absolute', top: bottomTop, left: 0, right: 0, bottom: 0, bgcolor: OVERLAY }} />
        <Box sx={{ position: 'absolute', top: topH, left: 0, width: leftW, height: midH, bgcolor: OVERLAY }} />
        <Box sx={{ position: 'absolute', top: topH, left: rightLeft, right: 0, height: midH, bgcolor: OVERLAY }} />
      </Box>

      {/* Highlight */}
      <Box
        sx={{
          position: 'fixed',
          zIndex: 1401,
          top: targetRect.top - PAD,
          left: targetRect.left - PAD,
          width: targetRect.width + PAD * 2,
          height: targetRect.height + PAD * 2,
          borderRadius: 2,
          border: '2px solid',
          borderColor: 'primary.main',
          boxShadow: '0 2px 12px rgba(25,118,210,.22)',
          transition:
            'top 180ms ease, left 180ms ease, width 180ms ease, height 180ms ease',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}