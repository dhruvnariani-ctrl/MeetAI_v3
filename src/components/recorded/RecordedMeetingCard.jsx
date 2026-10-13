import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined'

import AvailabilityBadge from './AvailabilityBadge'
import {formatTime} from '../../utils/time'
const outlinedButtonSx = {
  textTransform: 'none',
  fontSize: '0.76rem',
  fontWeight: 500,
  minHeight: 34,
  px: 1.5,
  borderColor: '#d1dae5',
}

export default function RecordedMeetingCard({
  meeting,
  onWatchRecording,
  onViewTranscript,
}) {
  const start = new Date(meeting.start)
  const end = new Date(meeting.end)

  const dateText = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(start)

  const timeText = `${formatTime(start)} – ${formatTime(end)}`
  const participantCount = meeting.participants?.length || 0

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #dce3eb',
        borderRadius: 2.5,
        bgcolor: '#fff',
        px: { xs: 1.75, sm: 2.5 },
        py: { xs: 1.75, sm: 2 },
        transition: 'border-color 160ms ease, box-shadow 160ms ease',
        '&:hover': {
          borderColor: '#bdc9d8',
          boxShadow: '0 4px 14px rgba(15,23,42,0.06)',
        },
      }}
    >
      <Stack spacing={1.75}>
        {/* Heading */}
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, minWidth: 0 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                bgcolor: '#f5f7fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: '0.92rem', sm: '0.98rem' },
                  fontWeight: 650,
                  lineHeight: 1.4,
                  color: '#172b46',
                }}
              >
                {meeting.title}
              </Typography>

              <Typography sx={{ mt: 0.35, fontSize: '0.72rem', color: '#66778d' }}>
                {meeting.platform} · {dateText}, {timeText}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              px: 1.1,
              py: 0.5,
              borderRadius: '20px',
              bgcolor: '#eaf7ef',
              color: '#287a4d',
              fontSize: '0.68rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Recording available
          </Box>
        </Box>

        {/* Participants and duration */}
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
          <Typography sx={{ fontSize: '0.72rem', color: '#52657d' }}>
            {participantCount}{' '}
            {participantCount === 1 ? 'participant' : 'participants'}
          </Typography>

          {meeting.recording?.duration && (
            <Typography sx={{ fontSize: '0.72rem', color: '#52657d' }}>
              {meeting.recording.duration}
            </Typography>
          )}
        </Stack>

        {/* Available content */}
        <Stack
          data-tour="recorded-actions"
          direction="row"
          spacing={1}
          sx={{ flexWrap: 'wrap', rowGap: 0.75 }}
        >
          <AvailabilityBadge
            icon={<PlayArrowOutlinedIcon />}
            label="Recording available"
            available={meeting.recording?.available}
          />
          <AvailabilityBadge
            icon={<DescriptionOutlinedIcon />}
            label="Transcript available"
            available={meeting.transcript?.available}
          />
          <AvailabilityBadge
            icon={<NotesOutlinedIcon />}
            label="Meeting notes available"
            available={meeting.meetingNotes?.available}
          />
        </Stack>

        {/* Action buttons */}
        <Box
          data-tour="recorded-content-actions"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', pt: 0.25 }}
        >
          <Button
            size="small"
            variant="contained"
            startIcon={<PlayArrowOutlinedIcon />}
            disabled={!meeting.recording?.available}
            onClick={onWatchRecording}
            sx={{
              textTransform: 'none',
              fontSize: '0.76rem',
              fontWeight: 600,
              minHeight: 34,
              px: 1.5,
            }}
          >
            Watch recording
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<DescriptionOutlinedIcon />}
            disabled={!meeting.transcript?.available}
            onClick={onViewTranscript}
            sx={outlinedButtonSx}
          >
            View transcript
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<NotesOutlinedIcon />}
            disabled={!meeting.meetingNotes?.available}
            sx={outlinedButtonSx}
          >
            Meeting notes
          </Button>
        </Box>
      </Stack>
    </Paper>
  )
}