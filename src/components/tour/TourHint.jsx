import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

/* Small grey box with a bold label, e.g. "Try this" / "Helpful tip". */
export default function TourHint({ label, children }) {
  return (
    <Box
      sx={{
        p: 1.4,
        borderRadius: 2,
        bgcolor: '#f6f9fc',
        border: '1px solid #e3eaf2',
      }}
    >
      <Typography sx={{ fontSize: '.68rem', fontWeight: 700, color: '#53667d' }}>
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.25,
          fontSize: '.75rem',
          lineHeight: 1.5,
          color: '#65768b',
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}