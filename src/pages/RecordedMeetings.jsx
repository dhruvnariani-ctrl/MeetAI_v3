import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell, { EmptyPanel } from '../components/PageShell'
import PaginationBar from '../components/PaginationBar'
import usePagination from '../hooks/usePagination'
import RecordedFilters from '../components/recorded/RecordedFilters'
import AvailabilityBadge from '../components/recorded/AvailabilityBadge'
import { getAllMeetings } from '../data/meetings'
import {
  getRecordedMeetings,
  RECORDED_SORT_OPTIONS,
} from '../data/recorded'
import { DATE_FILTERS } from '../utils/dateFilters'
import usePageTitle from '../hooks/usePageTitle'
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined'
const COLORS = {
  navy: '#123A59',
  blue: '#0967B2',
  green: '#16815B',
  text: '#304858',
  muted: '#5A7189',
  border: '#DFE7EC',
  paleBlue: '#EFF6FB',
  paleGreen: '#F0F7F1',
  background: '#F7F9FB',
}
const formatMeetingDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
const formatMeetingTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
const getMeetingDuration = (meeting) => {
  if (meeting.recording?.duration) {
    return meeting.recording.duration
  }
  const start = new Date(meeting.start).getTime()
  const end = new Date(meeting.end).getTime()
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return ''
  }
  const minutes = Math.max(0, Math.round((end - start) / 60000))
  return `${minutes} min`
}
export default function RecordedMeetings() {
  usePageTitle('Recorded Meetings')
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')
  const [selectedMeetingId, setSelectedMeetingId] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const meetings = useMemo(() => getAllMeetings(), [])
  const recordedMeetings = useMemo(
    () => getRecordedMeetings(meetings, search, dateFilter, sortBy),
    [meetings, search, dateFilter, sortBy],
  )
  const pager = usePagination(
    recordedMeetings,
    6,
    [search, dateFilter, sortBy].join('|'),
  )

  const selectedMeeting =
    recordedMeetings.find(
      (meeting) => meeting.id === selectedMeetingId,
    ) || recordedMeetings[0]
  const openMeetingTab = (tab) => {
    if (!selectedMeeting) return
    navigate(
      tab
        ? `/meetings/${selectedMeeting.id}?tab=${tab}`
        : `/meetings/${selectedMeeting.id}`,
      { state: { meeting: selectedMeeting } },
    )
  }
  return (
    <PageShell
      title="Recorded Meetings"
      subtitle="Find recordings, transcripts and meeting notes from your meetings."
    >
      <Stack spacing={1.5} sx={{ minWidth: 0 }}>
        <RecordedFilters
          search={search}
          onSearchChange={setSearch}
          dateFilters={DATE_FILTERS}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          sortOptions={RECORDED_SORT_OPTIONS}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              lg: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)',
            },
            gap: 1.5,
            alignItems: 'stretch',
            minWidth: 0,
          }}
        >
          {/* Meeting archive */}
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              boxSizing: 'border-box',
              minWidth: 0,
              overflow: 'hidden',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '12px',
              bgcolor: '#fff',
            }}
          >
            <Box
              sx={{
                px: 1.75,
                py: 1.4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 750,
                    color: COLORS.navy,
                  }}
                >
                  Meeting archive
                </Typography>
                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: '0.75rem',
                    color: COLORS.muted,
                  }}
                >
                  Select a meeting to view its content.
                </Typography>
              </Box>
              <Chip
                size="small"
                label={`${recordedMeetings.length} ${
                  recordedMeetings.length === 1 ? 'meeting' : 'meetings'
                }`}
                sx={{
                  height: 27,
                  flexShrink: 0,
                  borderRadius: '8px',
                  bgcolor: COLORS.paleBlue,
                  color: COLORS.navy,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              />
            </Box>
            <Divider sx={{ borderColor: COLORS.border }} />
            {recordedMeetings.length === 0 ? (
              <Box sx={{ p: 2 }}>
                <EmptyPanel
                  title="No recorded meetings"
                  minHeight={140}
                  action={
                    search || dateFilter !== 'All' ? (
                      <Button
                        onClick={() => {
                          setSearch('')
                          setDateFilter('All')
                        }}
                      >
                        Clear filters
                      </Button>
                    ) : undefined
                  }
                >
                  {search || dateFilter !== 'All'
                    ? 'No recorded meetings match your search or filters.'
                    : 'Meetings that MeetAI records will appear here.'}
                </EmptyPanel>
              </Box>
            ) : (
              <Stack
                data-tour="recorded-meeting-list"
                spacing={0}
                divider={<Divider sx={{ borderColor: '#EDF1F5' }} />}
              >
                {pager.pageItems.map((meeting) => {
                  const selected = meeting.id === selectedMeeting?.id
                  const participantCount = meeting.participants?.length || 0
                  const available = Boolean(meeting.recording?.available)
                  return (
                    <Box
                      key={meeting.id}
                      component="button"
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setSelectedMeetingId(meeting.id)
                        setActiveTab('overview')
                      }}
                      sx={{
                        display: 'block',
                        width: '100%',
                        minWidth: 0,
                        boxSizing: 'border-box',
                        border: 0,
                        borderLeft: selected
                          ? `3px solid ${COLORS.blue}`
                          : '3px solid transparent',
                        bgcolor: selected ? '#F0F7FD' : '#fff',
                        px: 1.5,
                        py: 1.25,
                        textAlign: 'left',
                        cursor: 'pointer',
                        font: 'inherit',
                        transition: 'background-color 140ms ease',
                        '&:hover': { bgcolor: '#F5F9FC' },
                        '&:focus-visible': {
                          outline: `2px solid ${COLORS.blue}`,
                          outlineOffset: '-2px',
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.1}
                        sx={{ alignItems: 'center', minWidth: 0 }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            display: 'grid',
                            placeItems: 'center',
                            border: '1px solid #DCEAF6',
                            borderRadius: '8px',
                            bgcolor: COLORS.paleBlue,
                            color: COLORS.blue,
                          }}
                        >
                          <VideoLibraryOutlinedIcon sx={{ fontSize: 19 }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            noWrap
                            sx={{
                              fontSize: '0.75rem',
                              lineHeight: 1.4,
                              fontWeight: 750,
                              color: COLORS.navy,
                            }}
                          >
                            {meeting.title}
                          </Typography>
                          <Typography
                            noWrap
                            sx={{
                              mt: 0.35,
                              fontSize: '0.75rem',
                              color: COLORS.muted,
                            }}
                          >
                            {meeting.platform}
                            {' · '}
                            {formatMeetingDate(meeting.start)}
                            {' · '}
                            {formatMeetingTime(meeting.start)}
                            {' – '}
                            {formatMeetingTime(meeting.end)}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1.25}
                            sx={{
                              mt: 0.6,
                              flexWrap: 'wrap',
                              rowGap: 0.35,
                            }}
                          >
                            <Typography
                              sx={{ fontSize: '0.75rem', color: COLORS.text }}
                            >
                              <GroupsOutlinedIcon
                                sx={{
                                  mr: 0.35,
                                  fontSize: 13,
                                  verticalAlign: 'middle',
                                }}
                              />
                              {participantCount} participants
                            </Typography>
                            <Typography
                              sx={{ fontSize: '0.75rem', color: COLORS.muted }}
                            >
                              <AccessTimeOutlinedIcon
                                sx={{
                                  mr: 0.35,
                                  fontSize: 13,
                                  verticalAlign: 'middle',
                                }}
                              />
                              {getMeetingDuration(meeting)}
                            </Typography>
                          </Stack>
                        </Box>
                        <Stack
                          spacing={0.75}
                          sx={{ alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch',
                            flexShrink: 0,
                            minWidth: 0, }}
                        >
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              maxWidth: '100%',
                              px: 0.9,
                              py: 0.45,
                              borderRadius: '12px',
                              bgcolor: available ? COLORS.paleGreen : '#F2F4F6',
                              color: available ? COLORS.green : COLORS.muted,
                              fontSize: '0.75rem',
                              lineHeight: 1.2,
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {available ? 'Recording ready' : 'No recording'}
                          </Box>
                          <ChevronRightRoundedIcon
                            sx={{
                              fontSize: 17,
                              color: selected ? COLORS.blue : '#66788A',
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            )}

            <PaginationBar pager={pager} label="meetings" />
          </Paper>
          {/* Selected meeting preview */}
          {selectedMeeting && (
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                boxSizing: 'border-box',
                minWidth: 0,
                overflow: 'hidden',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '12px',
                bgcolor: '#fff',
                position: { lg: 'sticky' },
                top: { lg: 12 },
              }}
            >
              <Box sx={{ p: 1.6 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'flex-start', justifyContent: 'space-between', minWidth: 0 }}
                >
                  <Box sx={{ flex: '1 1 150px', minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '0.9375rem',
                        lineHeight: 1.35,
                        fontWeight: 750,
                        color: COLORS.navy,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {selectedMeeting.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.35,
                        fontSize: '0.75rem',
                        color: COLORS.muted,
                      }}
                    >
                      {selectedMeeting.platform}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: '0 0 auto',
                      width: 'fit-content',
                      maxWidth: '100%',
                      px: 1,
                      py: 0.55,
                      borderRadius: '12px',
                      bgcolor: selectedMeeting.recording?.available
                        ? COLORS.paleGreen
                        : '#F2F4F6',
                      color: selectedMeeting.recording?.available
                        ? COLORS.green
                        : COLORS.muted,
                      fontSize: '0.75rem',
                      lineHeight: 1.2,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {selectedMeeting.recording?.available
                      ? 'Recording available'
                      : 'Recording unavailable'}
                  </Box>
                </Stack>
                <Stack spacing={0.9} sx={{ mt: 1.5 }}>
                  <Stack direction="row" spacing={0.9} sx={{ alignItems: 'center' }}>
                    <CalendarTodayOutlinedIcon
                      sx={{ fontSize: 16, color: COLORS.blue }}
                    />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text }}>
                      {formatMeetingDate(selectedMeeting.start)}
                      {' · '}
                      {formatMeetingTime(selectedMeeting.start)}
                      {' – '}
                      {formatMeetingTime(selectedMeeting.end)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.9} sx={{ alignItems: 'center' }}>
                    <GroupsOutlinedIcon
                      sx={{ fontSize: 16, color: COLORS.blue }}
                    />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text }}>
                      {selectedMeeting.participants?.length || 0} participants
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.9} sx={{ alignItems: 'center' }}>
                    <AccessTimeOutlinedIcon
                      sx={{ fontSize: 16, color: COLORS.blue }}
                    />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text }}>
                      {getMeetingDuration(selectedMeeting)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
              <Divider sx={{ borderColor: COLORS.border }} />
              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value)}
                variant="fullWidth"
                sx={{
                  minHeight: 38,
                  px: 0.75,
                  '& .MuiTab-root': {
                    flex: '1 1 0',
                    minWidth: 0,
                    minHeight: 38,
                    px: 0.35,
                    py: 0.75,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 650,
                    color: COLORS.muted,
                    whiteSpace: 'nowrap',
                  },
                  '& .Mui-selected': {
                    color: `${COLORS.blue} !important`,
                  },
                  '& .MuiTabs-indicator': {
                    bgcolor: COLORS.blue,
                    height: 2,
                  },
                }}
              >
                <Tab value="overview" label="Overview" />
                <Tab
                  value="recording"
                  label="Recording"
                  disabled={!selectedMeeting.recording?.available}
                />
                <Tab
                  value="transcript"
                  label="Transcript"
                  disabled={!selectedMeeting.transcript?.available}
                />
                <Tab
                  value="notes"
                  label="Notes"
                  disabled={!selectedMeeting.meetingNotes?.available}
                />
              </Tabs>
              <Box sx={{ p: 1.6, minHeight: 145 }}>
                {activeTab === 'overview' && (
                  <Stack spacing={1.2}>
                    <Typography
                      sx={{
                        fontSize: '0.8125rem',
                        fontWeight: 750,
                        color: COLORS.navy,
                      }}
                    >
                      Meeting content
                    </Typography>
                    <Stack spacing={0.7} sx={{ width: '100%' }}>
                      <AvailabilityBadge
                        icon={<PlayArrowRoundedIcon />}
                        label="Recording"
                        available={selectedMeeting.recording?.available}
                      />
                      <AvailabilityBadge
                        icon={<DescriptionOutlinedIcon />}
                        label="Transcript"
                        available={selectedMeeting.transcript?.available}
                      />
                      <AvailabilityBadge
                        icon={<NotesOutlinedIcon />}
                        label="Meeting notes"
                        available={selectedMeeting.meetingNotes?.available}
                      />
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        lineHeight: 1.55,
                        color: COLORS.muted,
                      }}
                    >
                      Select an available item to open it in the meeting workspace.
                    </Typography>
                  </Stack>
                )}
                {activeTab === 'recording' && (
                  <Stack spacing={1}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.navy }}>
                      Recording ready to view
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.55, color: COLORS.muted }}>
                      Open the meeting workspace to watch this recording.
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<PlayArrowRoundedIcon />}
                      onClick={() => openMeetingTab('recording')}
                      sx={{
                        alignSelf: 'flex-start',
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        bgcolor: COLORS.blue,
                        boxShadow: 'none',
                      }}
                    >
                      Watch recording
                    </Button>
                  </Stack>
                )}
                {activeTab === 'transcript' && (
                  <Stack spacing={1}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.navy }}>
                      Transcript available
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.55, color: COLORS.muted }}>
                      Open the meeting workspace to read the transcript.
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<DescriptionOutlinedIcon />}
                      onClick={() => openMeetingTab('transcript')}
                      sx={{ alignSelf: 'flex-start', textTransform: 'none', fontSize: '0.75rem' }}
                    >
                      View transcript
                    </Button>
                  </Stack>
                )}
                {activeTab === 'notes' && (
                  <Stack spacing={1}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.navy }}>
                      Meeting notes available
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.55, color: COLORS.muted }}>
                      Open the meeting workspace to review its notes.
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<NotesOutlinedIcon />}
                      onClick={() => openMeetingTab('notes')}
                      sx={{ alignSelf: 'flex-start', textTransform: 'none', fontSize: '0.75rem' }}
                    >
                      View meeting notes
                    </Button>
                  </Stack>
                )}
              </Box>
              <Divider sx={{ borderColor: COLORS.border }} />
              <Box sx={{ p: 1.4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  endIcon={<ChevronRightRoundedIcon />}
                  onClick={() => openMeetingTab('')}
                  sx={{
                    minHeight: 36,
                    borderColor: '#C9DDED',
                    borderRadius: '8px',
                    color: COLORS.blue,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    '&:hover': {
                      borderColor: COLORS.blue,
                      bgcolor: COLORS.paleBlue,
                    },
                  }}
                >
                  View full meeting details
                </Button>
              </Box>
            </Paper>
          )}
        </Box>
      </Stack>
    </PageShell>
  )
}
