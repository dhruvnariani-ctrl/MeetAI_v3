import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import SearchIcon from '@mui/icons-material/Search'

import { formatDate } from '../utils/time'

export const MAX_RESULTS = 6

const ellipsis = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

/* Dropdown under the header search box. */
export default function SearchResults({ meetings, onSelect }) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'absolute',
        top: 48,
        left: 0,
        right: 0,
        zIndex: 1300,
        border: '1px solid #dce3eb',
        borderRadius: 2.5,
        bgcolor: '#fff',
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
        overflow: 'hidden',
        animation: 'searchDropdownIn 140ms ease-out',
        '@keyframes searchDropdownIn': {
          from: { opacity: 0, transform: 'translateY(-4px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {meetings.length > 0 ? (
        <Box>
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography
              sx={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#7b8ba1',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Meetings
            </Typography>
          </Box>

          <Divider />

          {meetings.map((meeting) => (
            <Box
              key={meeting.id}
              component="button"
              type="button"
              onClick={() => onSelect(meeting)}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                px: 2,
                py: 1.25,
                border: 0,
                bgcolor: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background-color 140ms ease',
                '&:hover': { bgcolor: '#f5f8fc' },
                '&:focus-visible': { outline: '2px solid #0d68c9', outlineOffset: -2 },
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 1.5,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: '#eaf2fd',
                  color: '#0d68c9',
                  flexShrink: 0,
                }}
              >
                <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#172b46', ...ellipsis }}
                >
                  {meeting.title || 'Untitled meeting'}
                </Typography>

                <Typography
                  sx={{ mt: 0.25, fontSize: '0.7rem', color: '#718198', ...ellipsis }}
                >
                  {meeting.platform || 'Meeting'}
                  {meeting.start ? ` · ${formatDate(meeting.start)}` : ''}
                </Typography>
              </Box>
            </Box>
          ))}

          {meetings.length >= MAX_RESULTS && (
            <>
              <Divider />
              <Box sx={{ px: 2, py: 1 }}>
                <Typography sx={{ fontSize: '0.68rem', color: '#8793a3' }}>
                  Showing the first {MAX_RESULTS} matching meetings
                </Typography>
              </Box>
            </>
          )}
        </Box>
      ) : (
        <Box sx={{ px: 2.5, py: 2.5, textAlign: 'center' }}>
          <SearchIcon sx={{ fontSize: 26, color: '#a5b0be', mb: 0.75 }} />

          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#42546b' }}>
            No meetings found
          </Typography>

          <Typography sx={{ mt: 0.35, fontSize: '0.7rem', color: '#8793a3' }}>
            Try searching for a meeting title or person.
          </Typography>
        </Box>
      )}
    </Paper>
  )
}