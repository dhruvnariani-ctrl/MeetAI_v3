import { useId, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import FormField from './FormField'
import ParticipantPicker from './ParticipantPicker'
import DialogShell, { ACCENTS, COLORS, ChoiceCard, Section, controlSx } from './DialogShell'

const LABEL_SIZE = '0.75rem'
const GREEN = '#1b7f4f'
const STEP_ACCENTS = [ACCENTS.green, ACCENTS.blue, ACCENTS.purple, ACCENTS.orange, ACCENTS.pink]

const MEETING_HOSTS = /(^|\.)(zoom\.us|zoom\.com|zoomgov\.com|meet\.google\.com|teams\.microsoft\.com|teams\.live\.com)$/i

// Accepts links with or without https:// ; returns a clean URL string or null.
function normalizeMeetingLink(value) {
  const raw = value.trim()
  if (!raw) return null
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
    return MEETING_HOSTS.test(url.hostname) ? url.href : null
  } catch {
    return null
  }
}

const STEPS = (n) => [
  'Avaada Meet Companion joins with your meeting link',
  'Avaada Meet Companion appears in the meeting as a participant',
  'Real-time transcription with speaker identification',
  'When meeting ends — AI generates MoM & action items',
  `Emails sent to all ${n} ${n === 1 ? 'participant' : 'participants'} automatically`,
]

export default function InstantJoinDialog({ open, onClose, onSubmit, currentUser, searchDirectory }) {
  const titleId = useId()
  const descId = useId()
  const linkRef = useRef(null)

  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')
  const [linkError, setLinkError] = useState(false)
  const [participants, setParticipants] = useState([{ ...currentUser, you: true }])
  const [recordVideo, setRecordVideo] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = normalizeMeetingLink(link)
    if (!url) {
      setLinkError(true)
      linkRef.current?.focus()
      return
    }
    onSubmit({ link: url, title: title.trim(), participants, recordVideo })
  }

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      titleId={titleId}
      descId={descId}
      icon={<BoltOutlinedIcon />}
      title="Record instant meeting"
      subtitle="Fill in the details — Avaada Meet Companion joins when you start"
      accent={ACCENTS.green}
      sideLabel="What happens when you start"
      side={<AfterStart titleId={titleId} count={participants.length} />}
    >
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2.25 }}>
        {/* LINK */}
        <Section accent={ACCENTS.blue} icon={<LinkOutlinedIcon />} title="Meeting">
          <FormField
            label="Meeting Link"
            required
            labelFontSize={LABEL_SIZE}
            ref={linkRef}
            autoFocus
            type="url"
            value={link}
            onChange={(e) => { setLink(e.target.value); if (linkError) setLinkError(false) }}
            error={linkError}
            placeholder="https://meet.google.com/abc-xyz  or  zoom.us/j/123456789"
            startIcon={<LinkOutlinedIcon sx={{ fontSize: 20 }} />}
            helper={linkError ? 'Enter a valid Zoom, Google Meet, or Microsoft Teams link' : 'Paste a Zoom, Google Meet, or Microsoft Teams link'}
          />

          <FormField
            label="Meeting Title"
            optional
            labelFontSize={LABEL_SIZE}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Quick sync with design team"
          />
        </Section>

        {/* WHO */}
        <Section accent={ACCENTS.orange} icon={<GroupsOutlinedIcon />} title="Who">
          <ParticipantPicker
            labelFontSize={LABEL_SIZE}
            participants={participants}
            searchDirectory={searchDirectory}
            onAdd={(p) => setParticipants((list) => [...list, p])}
            onRemove={(email) => setParticipants((list) => list.filter((p) => p.email !== email))}
          />
        </Section>

        {/* RECORDING */}
        <Section accent={ACCENTS.pink} icon={<FiberManualRecordOutlinedIcon />} title="Recording">
          <Stack
            direction="row"
            spacing={1}
            alignItems="flex-start"
            sx={{ p: 1.25, borderRadius: '10px', bgcolor: ACCENTS.green.bg, border: '1px solid #cfe8da' }}
          >
            <CheckCircleOutlinedIcon sx={{ fontSize: 18, mt: 0.1, color: ACCENTS.green.color }} aria-hidden="true" />
            <Typography sx={{ fontSize: '.78rem', lineHeight: 1.55, color: COLORS.navy }}>
              <strong>Meet AI / transcription:</strong> Always enabled for instant meetings. Avaada Meet Companion joins to
              capture the transcript and generate MoM / insights.
            </Typography>
          </Stack>

          <ChoiceCard
            accent={ACCENTS.pink}
            checked={recordVideo}
            control={
              <Checkbox
                size="small"
                checked={recordVideo}
                onChange={(e) => setRecordVideo(e.target.checked)}
                sx={controlSx(ACCENTS.pink)}
              />
            }
          >
            <Typography sx={{ fontSize: '.82rem', fontWeight: 700 }}>Also enable Video Recording</Typography>
            <Typography sx={{ fontSize: '.74rem', color: COLORS.muted }}>
              Saves a video file separately (7-day retention).
            </Typography>
          </ChoiceCard>
        </Section>

        <Box>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            fullWidth
            startIcon={<BoltOutlinedIcon />}
            sx={{
              height: 44,
              borderRadius: '10px',
              bgcolor: GREEN,
              fontSize: '.92rem',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: '#166a42' },
            }}
          >
            Record meeting
          </Button>
          <Typography sx={{ mt: 1, textAlign: 'center', fontSize: '.76rem', color: COLORS.muted }}>
            {recordVideo
              ? 'Starts Meet AI transcription and saves a video file (7-day retention)'
              : 'Starts Meet AI transcription only (no video file unless you check Video Recording)'}
          </Typography>
        </Box>
      </Box>
    </DialogShell>
  )
}

/* Side panel: what the feature does + a timeline of what happens after you start. */
function AfterStart({ titleId, count }) {
  const steps = STEPS(count)

  return (
    <Stack spacing={2}>
      <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: ACCENTS.green.bg, border: '1px solid #cfe8da' }}>
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5, color: ACCENTS.green.color }}>
          <InfoOutlinedIcon sx={{ fontSize: 17 }} aria-hidden="true" />
          <Typography component="h3" sx={{ fontSize: '.84rem', fontWeight: 750 }}>
            What “Record meeting” does
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: '.76rem', lineHeight: 1.6, color: COLORS.navy }}>
          Starts <strong>Meet AI / transcription</strong>: Avaada Meet Companion joins, captures the live transcript,
          and emails MoM + action items when the meeting ends. Optional <strong>Video Recording</strong> saves a
          video file separately (7-day retention).
        </Typography>
      </Box>

      <Box component="section" aria-labelledby={`${titleId}-after`}>
        <Typography id={`${titleId}-after`} component="h3" sx={{ mb: 1.5, fontSize: '.86rem', fontWeight: 750, color: COLORS.navy }}>
          What happens after you start
        </Typography>

        <Box component="ol" role="list" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {steps.map((text, i) => {
            const accent = STEP_ACCENTS[i % STEP_ACCENTS.length]
            const last = i === steps.length - 1

            return (
              <Box key={text} component="li" sx={{ position: 'relative', display: 'flex', gap: 1.25, pb: last ? 0 : 1.75 }}>
                {!last && (
                  <Box
                    aria-hidden="true"
                    sx={{ position: 'absolute', left: 11, top: 24, bottom: 0, width: 2, bgcolor: COLORS.border }}
                  />
                )}

                <Box
                  aria-hidden="true"
                  sx={{
                    position: 'relative',
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    bgcolor: accent.bg,
                    color: accent.color,
                    fontSize: '.7rem',
                    fontWeight: 800,
                  }}
                >
                  {i + 1}
                </Box>

                <Typography sx={{ pt: 0.2, fontSize: '.78rem', lineHeight: 1.5, color: COLORS.navy }}>
                  {text}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Stack>
  )
}