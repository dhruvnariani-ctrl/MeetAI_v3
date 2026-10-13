import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { COLORS, formatTime, formatDuration, joinUrlOf, participantCount, platformOf } from './dashboardUtils'

export default function FocusMeetingCard({ meeting, status, now, progress, onOpen }) {
  const live = status === 'live'
  const url = meeting ? joinUrlOf(meeting) : null
  return <Box component="section" aria-label={live ? 'Happening now' : 'Up next'} data-tour="dashboard-next-meeting" sx={{ position: 'relative', overflow: 'hidden', borderRadius: '14px', p: 2.25, color: '#fff', background: 'linear-gradient(145deg, #123A59 0%, #0967B2 75%, #16815B 145%)', '&::after': { content: '""', position: 'absolute', right: -60, top: -60, width: 190, height: 190, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.16), rgba(255,255,255,0) 70%)', pointerEvents: 'none' } }}>
    <Typography sx={{ fontSize: '.75rem', fontWeight: 750, letterSpacing: '.1em', textTransform: 'uppercase', color: live ? '#7CE0B0' : '#B9DFFF' }}>{live ? 'Happening now' : 'Up next'}</Typography>
    {meeting ? <>
      <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 750, lineHeight: 1.25, mt: .8 }}>{meeting.title}</Typography>
      <Typography sx={{ fontSize: '.86rem', mt: .75, color: '#D5E6F2' }}>{formatTime(meeting._start)} – {formatTime(meeting._end)}{platformOf(meeting) ? ` · ${platformOf(meeting)}` : ''}{participantCount(meeting) ? ` · ${participantCount(meeting)} participants` : ''}</Typography>
      <Box sx={{ mt: 2 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', mb: .7, color: '#EAF4FB' }}><span>{live ? `Ends in ${formatDuration(meeting._end - now)}` : `Starts in ${formatDuration(meeting._start - now)}`}</span>{live && <span>{Math.round(progress)}%</span>}</Box><LinearProgress variant="determinate" value={live ? progress : 0} aria-label="Meeting progress" sx={{ height: 6, borderRadius: 99, bgcolor: 'rgba(255,255,255,.22)', '& .MuiLinearProgress-bar': { borderRadius: 99, bgcolor: '#7CE0B0' } }} /></Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2.25 }}><Button variant="contained" disableElevation component={url ? 'a' : 'button'} {...(url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : { onClick: () => onOpen(meeting) })} startIcon={<VideocamOutlinedIcon />} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '9px', minHeight: 39, px: 1.75, color: COLORS.navy, bgcolor: '#fff', '&:hover': { bgcolor: '#E8F2FB' } }}>{live ? 'Join now' : 'Open meeting'}</Button><Button variant="outlined" onClick={() => onOpen(meeting)} endIcon={<ArrowForwardRoundedIcon />} sx={{ textTransform: 'none', fontWeight: 650, borderRadius: '9px', minHeight: 39, color: '#fff', borderColor: 'rgba(255,255,255,.45)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.08)' } }}>Details</Button></Box>
    </> : <Typography sx={{ mt: 1, fontSize: '1rem', fontWeight: 650 }}>You’re all clear for the rest of the day.</Typography>}
  </Box>
}
