import { useId, useRef, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import FormField, { labelSx } from '../instant/FormField'
import ParticipantPicker from '../instant/ParticipantPicker'
import DialogShell, {
  ACCENTS,
  COLORS,
  ChoiceCard,
  Section,
  SummaryRow,
  controlSx,
} from '../instant/DialogShell'
import SelectField from './SelectedField'

const LABEL_SIZE = '0.75rem' // 12px labels
const BLUE = '#0967B2'

const PLATFORMS = [
  { id: 'teams', label: 'Microsoft Teams' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'meet', label: 'Google Meet' },
]

const DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
]

const pad = (n) => String(n).padStart(2, '0')
const toDateInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const toTimeInput = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

function defaultTimes() {
  const s = new Date()
  s.setSeconds(0, 0)
  s.setMinutes(s.getMinutes() < 30 ? 30 : 60) // next half hour
  return { start: toTimeInput(s), end: toTimeInput(new Date(s.getTime() + 30 * 60000)) }
}

/* Display helpers for the live summary. */
function formatDay(value) {
  const d = new Date(`${value}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function formatClock(value) {
  if (!value) return null
  const [h, m] = value.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

function minutesBetween(start, end) {
  if (!start || !end || end <= start) return null
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return eh * 60 + em - (sh * 60 + sm)
}

export default function CreateEventDialog({ open, onClose, onSubmit, currentUser, searchDirectory }) {
  const titleId = useId()
  const descId = useId()

  const [initial] = useState(defaultTimes)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => toDateInput(new Date()))
  const [start, setStart] = useState(initial.start)
  const [end, setEnd] = useState(initial.end)
  const [instant, setInstant] = useState(false)
  const [duration, setDuration] = useState(30)
  const [platforms, setPlatforms] = useState({ teams: false, zoom: false, meet: true })
  const [participants, setParticipants] = useState([{ ...currentUser, you: true }])
  const [inviteMeetAI, setInviteMeetAI] = useState(false)
  const [recordVideo, setRecordVideo] = useState(false)
  const [errors, setErrors] = useState({})

  const refs = { title: useRef(null), date: useRef(null), start: useRef(null), end: useRef(null), platforms: useRef(null) }
  const clearError = (key) => setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))

  const validate = () => {
    const e = {}
    if (!title.trim()) e.title = 'Enter a title'
    if (!date) e.date = 'Pick a date'
    else if (date < toDateInput(new Date())) e.date = 'The date cannot be in the past'
    if (!instant) {
      if (!start) e.start = 'Pick a start time'
      if (!end) e.end = 'Pick an end time'
      else if (start && end <= start) e.end = 'End time must be after the start time'
    }
    if (!Object.values(platforms).some(Boolean)) e.platforms = 'Select at least one platform'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    const firstInvalid = ['title', 'date', 'start', 'end', 'platforms'].find((k) => e[k])
    if (firstInvalid) {
      refs[firstInvalid].current?.focus()
      return
    }
    onSubmit({
      title: title.trim(),
      date,
      ...(instant ? { instant: true, durationMinutes: duration } : { instant: false, start, end }),
      platforms: PLATFORMS.filter((p) => platforms[p.id]).map((p) => p.id),
      participants,
      inviteMeetAI,
      recordVideo: inviteMeetAI && recordVideo,
    })
  }

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      titleId={titleId}
      descId={descId}
      icon={<EventOutlinedIcon />}
      title="Create an event"
      subtitle="Schedule a meeting and invite participants"
      accent={ACCENTS.blue}
      sideLabel="Live summary"
      side={
        <EventSummary
          title={title}
          date={date}
          instant={instant}
          start={start}
          end={end}
          duration={duration}
          platformLabels={PLATFORMS.filter((p) => platforms[p.id]).map((p) => p.label)}
          participants={participants}
          inviteMeetAI={inviteMeetAI}
          recordVideo={recordVideo}
        />
      }
    >
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2.25 }}>
        {/* WHAT */}
        <Section accent={ACCENTS.green} icon={<EditOutlinedIcon />} title="What">
          <FormField
            label="Title"
            required
            labelFontSize={LABEL_SIZE}
            ref={refs.title}
            autoFocus
            value={title}
            onChange={(e) => { setTitle(e.target.value); clearError('title') }}
            placeholder="e.g. Weekly design review"
            error={!!errors.title}
            helper={errors.title}
          />
        </Section>

        {/* WHEN */}
        <Section accent={ACCENTS.blue} icon={<ScheduleOutlinedIcon />} title="When">
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend" sx={{ ...labelSx, fontSize: LABEL_SIZE }}>Start</FormLabel>
            <RadioGroup
              row
              value={instant ? 'now' : 'later'}
              onChange={(e) => setInstant(e.target.value === 'now')}
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}
            >
              <ChoiceCard
                accent={ACCENTS.blue}
                checked={!instant}
                control={<Radio value="later" size="small" sx={controlSx(ACCENTS.blue)} />}
              >
                <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
                  <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: ACCENTS.blue.color }} />
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 650 }}>Schedule for later</Typography>
                </Stack>
              </ChoiceCard>

              <ChoiceCard
                accent={ACCENTS.blue}
                checked={instant}
                control={<Radio value="now" size="small" sx={controlSx(ACCENTS.blue)} />}
              >
                <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
                  <BoltOutlinedIcon sx={{ fontSize: 16, color: ACCENTS.blue.color }} />
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 650 }}>Start now</Typography>
                </Stack>
              </ChoiceCard>
            </RadioGroup>
          </FormControl>

          <Typography sx={{ fontSize: '0.75rem', color: COLORS.muted, mt: -0.5 }}>
            {instant
              ? 'Start the event right away — only a duration is needed.'
              : 'Pick the date and the start and end time.'}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gap: 1.25,
              alignItems: 'start',
              gridTemplateColumns: instant
                ? { xs: '1fr', sm: '1fr 1fr' }
                : { xs: '1fr 1fr', sm: '1.4fr 1fr 1fr' },
            }}
          >
            <Box sx={{ gridColumn: { xs: instant ? 'auto' : '1 / -1', sm: 'auto' } }}>
              <FormField
                label="Date"
                required
                labelFontSize={LABEL_SIZE}
                ref={refs.date}
                type="date"
                value={date}
                onChange={(e) => { setDate(e.target.value); clearError('date') }}
                inputAttrs={{ min: toDateInput(new Date()) }}
                error={!!errors.date}
                helper={errors.date}
              />
            </Box>

            {instant ? (
              <SelectField label="Duration" labelFontSize={LABEL_SIZE} value={duration} onChange={setDuration} options={DURATIONS} />
            ) : (
              <>
                <FormField
                  label="Start time"
                  required
                  labelFontSize={LABEL_SIZE}
                  ref={refs.start}
                  type="time"
                  value={start}
                  onChange={(e) => { setStart(e.target.value); clearError('start'); clearError('end') }}
                  error={!!errors.start}
                  helper={errors.start}
                />
                <FormField
                  label="End time"
                  required
                  labelFontSize={LABEL_SIZE}
                  ref={refs.end}
                  type="time"
                  value={end}
                  onChange={(e) => { setEnd(e.target.value); clearError('end') }}
                  error={!!errors.end}
                  helper={errors.end}
                />
              </>
            )}
          </Box>
        </Section>

        {/* WHERE */}
        <Section accent={ACCENTS.purple} icon={<VideoCallOutlinedIcon />} title="Where">
          <FormControl component="fieldset" required error={!!errors.platforms} variant="standard">
            <FormLabel component="legend" sx={{ ...labelSx, fontSize: LABEL_SIZE }}>Video conferencing</FormLabel>
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
              }}
            >
              {PLATFORMS.map((p, i) => (
                <ChoiceCard
                  key={p.id}
                  accent={ACCENTS.purple}
                  checked={platforms[p.id]}
                  control={
                    <Checkbox
                      size="small"
                      checked={platforms[p.id]}
                      inputRef={i === 0 ? refs.platforms : undefined}
                      onChange={(e) => {
                        setPlatforms((cur) => ({ ...cur, [p.id]: e.target.checked }))
                        clearError('platforms')
                      }}
                      sx={controlSx(ACCENTS.purple)}
                    />
                  }
                >
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 650 }}>{p.label}</Typography>
                </ChoiceCard>
              ))}
            </Box>
            {errors.platforms && <FormHelperText role="alert" sx={{ mx: 0 }}>{errors.platforms}</FormHelperText>}
          </FormControl>
        </Section>

        {/* WHO */}
        <Section accent={ACCENTS.orange} icon={<GroupsOutlinedIcon />} title="Who">
          <ParticipantPicker
            labelFontSize={LABEL_SIZE}
            hint="(invited to this event)"
            note={inviteMeetAI ? undefined : null}
            participants={participants}
            searchDirectory={searchDirectory}
            onAdd={(p) => setParticipants((list) => [...list, p])}
            onRemove={(email) => setParticipants((list) => list.filter((p) => p.email !== email))}
          />
        </Section>

        {/* MEETAI */}
        <Section accent={ACCENTS.green} icon={<AutoAwesomeOutlinedIcon />} title="MeetAI" hint="optional">
          <ChoiceCard
            accent={ACCENTS.green}
            checked={inviteMeetAI}
            control={
              <Checkbox
                size="small"
                checked={inviteMeetAI}
                onChange={(e) => {
                  setInviteMeetAI(e.target.checked)
                  if (!e.target.checked) setRecordVideo(false)
                }}
                sx={controlSx(ACCENTS.green)}
              />
            }
          >
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>Invite MeetAI</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.muted, lineHeight: 1.5 }}>
              Avaada Meet Companion joins to capture the transcript and email MoM + action items.
            </Typography>
          </ChoiceCard>

          {inviteMeetAI && (
            <ChoiceCard
              accent={ACCENTS.green}
              checked={recordVideo}
              control={
                <Checkbox
                  size="small"
                  checked={recordVideo}
                  onChange={(e) => setRecordVideo(e.target.checked)}
                  sx={controlSx(ACCENTS.green)}
                />
              }
            >
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 650 }}>Also enable Video Recording</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.muted }}>
                Saves a video file separately (7-day retention).
              </Typography>
            </ChoiceCard>
          )}
        </Section>

        <Button
          type="submit"
          variant="contained"
          disableElevation
          fullWidth
          sx={{
            height: 44,
            borderRadius: '8px',
            bgcolor: BLUE,
            fontSize: '0.9375rem',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { bgcolor: '#075A9D' },
          }}
        >
          {instant ? 'Create & start now' : 'Create event'}
        </Button>
      </Box>
    </DialogShell>
  )
}

/* Live summary card: updates as the form changes. */
function EventSummary({
  title, date, instant, start, end, duration,
  platformLabels, participants, inviteMeetAI, recordVideo,
}) {
  const dayText = formatDay(date)
  const mins = minutesBetween(start, end)

  const timeText = instant
    ? `Starts now · ${DURATIONS.find((d) => d.value === duration)?.label ?? `${duration} min`}`
    : start && end
      ? `${formatClock(start)} – ${formatClock(end)}${mins ? ` (${mins} min)` : ''}`
      : null

  return (
    <Box sx={{ border: '1px solid', borderColor: COLORS.border, borderRadius: '12px', bgcolor: '#fff', overflow: 'hidden' }}>
      <Box sx={{ px: 2, py: 1.5, bgcolor: ACCENTS.blue.bg }}>
        <Typography
          sx={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '.07em', textTransform: 'uppercase', color: ACCENTS.blue.color }}
        >
          Live summary
        </Typography>
        <Typography
          sx={{
            mt: 0.4,
            fontSize: '1rem',
            fontWeight: 750,
            lineHeight: 1.3,
            overflowWrap: 'anywhere',
            color: title.trim() ? COLORS.navy : COLORS.muted,
          }}
        >
          {title.trim() || 'Untitled event'}
        </Typography>
      </Box>

      <Box sx={{ borderTop: '2px dashed', borderColor: COLORS.border }} />

      <Stack spacing={1.5} sx={{ p: 2 }}>
        <SummaryRow icon={<CalendarMonthOutlinedIcon />} accent={ACCENTS.blue} label="Date" muted={!dayText}>
          {dayText || 'Pick a date'}
        </SummaryRow>

        <SummaryRow icon={<AccessTimeOutlinedIcon />} accent={ACCENTS.blue} label="Time" muted={!timeText}>
          {timeText || 'Pick a start and end time'}
        </SummaryRow>

        <SummaryRow
          icon={<VideocamOutlinedIcon />}
          accent={ACCENTS.purple}
          label="Where"
          muted={platformLabels.length === 0}
        >
          {platformLabels.length ? platformLabels.join(', ') : 'No platform selected'}
        </SummaryRow>

        <SummaryRow icon={<GroupsOutlinedIcon />} accent={ACCENTS.orange} label="Who">
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Stack direction="row" aria-hidden="true">
              {participants.slice(0, 4).map((p, i) => (
                <Avatar
                  key={p.email}
                  sx={{
                    width: 22,
                    height: 22,
                    ml: i ? -0.6 : 0,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '2px solid #fff',
                    bgcolor: ACCENTS.orange.bg,
                    color: ACCENTS.orange.color,
                  }}
                >
                  {p.name.charAt(0)}
                </Avatar>
              ))}
            </Stack>
            <span>
              {participants.length} {participants.length === 1 ? 'participant' : 'participants'}
            </span>
          </Stack>
        </SummaryRow>

        <SummaryRow icon={<AutoAwesomeOutlinedIcon />} accent={ACCENTS.green} label="MeetAI" muted={!inviteMeetAI}>
          {inviteMeetAI
            ? recordVideo
              ? 'Invited · transcript, notes and video'
              : 'Invited · transcript and notes'
            : 'Not invited'}
        </SummaryRow>
      </Stack>
    </Box>
  )
}