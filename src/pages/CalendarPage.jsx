import { useOutletContext } from 'react-router-dom'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'

import PageShell from '../components/PageShell'
import CalendarSidebar from '../components/calendar/CalendarSidebar'
import CalendarToolbar from '../components/calendar/CalendarToolbar'
import CalendarMeetingList from '../components/calendar/CalendarMeetingList'

import useCalendarState from '../hooks/useCalenderState'
import useCurrentUser from '../hooks/useCurrentUser'

const format = (date, options) =>
  new Intl.DateTimeFormat('en-US', options).format(date)

/* Heading shown at the top of the meetings panel. */
function getPanelHeading(view, selectedDate) {
  if (view === 'day') {
    return format(selectedDate, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (view === 'week') {
    const start = new Date(selectedDate)
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - start.getDay())

    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    return `${format(start, {
      month: 'short',
      day: 'numeric',
    })} – ${format(end, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`
  }

  return format(selectedDate, { month: 'long', year: 'numeric' })
}

const AGENDA_LABELS = {
  day: 'Daily agenda',
  week: 'Weekly agenda',
  month: 'Monthly agenda',
}

export default function CalendarPage() {
  const outletContext = useOutletContext() || {}
  const { openCreate } = outletContext

  const currentUser = useCurrentUser()
  const calendar = useCalendarState(currentUser)

  const {
    selectedDate,
    view,
    visibleMeetings,
    filteredMeetings,
    filters,
    setFilters,
    clearFilters,
    platforms,
    activeFilterCount,
    setView,
    settings,
    onSettingsChange,
  } = calendar

  const pageHeading = getPanelHeading(view, selectedDate)
  const meetingCount = visibleMeetings.length

  const agendaLabel = `${AGENDA_LABELS[view] ?? 'Agenda'}${
    activeFilterCount > 0
      ? ` · ${activeFilterCount} ${activeFilterCount === 1 ? 'filter' : 'filters'} on`
      : ''
  }`

  return (
      <Stack spacing={1.5} sx={{ minWidth: 0, width: '100%' }}>
        <Box data-tour="calendar-date-navigation" sx={{ width: '100%' }}>
          <CalendarToolbar
            view={view}
            selectedDate={selectedDate}
            onViewChange={setView}
            onPrevious={calendar.handlePrevious}
            onNext={calendar.handleNext}
            onToday={calendar.handleToday}
            onYesterday={calendar.handleYesterday}
            onTomorrow={calendar.handleTomorrow}
            onCurrentPeriod={calendar.handleCurrentPeriod}
            onNewMeeting={() => openCreate?.()}
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            platforms={platforms}
            activeFilterCount={activeFilterCount}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              lg: 'minmax(0, 1.45fr) minmax(340px, 1fr)',
            },
            gap: { xs: 1.5, md: 2 },
            alignItems: 'stretch',
            minWidth: 0,
          }}
        >
          {/* Mini calendar: highlights the selected day / week / month */}
          <Box
            data-tour="calendar-month-grid"
            sx={{
              minWidth: 0,
              display: 'flex',
              '& > *': { flex: 1 },
            }}
          >
            <CalendarSidebar
              selectedDate={selectedDate}
              view={view}
              meetings={filteredMeetings}
              onSelectDate={calendar.selectDate}
              onOpenDay={calendar.selectDay}
              onToday={calendar.handleCurrentPeriod}
            />
          </Box>

          {/*
           * Meetings panel. On large screens the panel is positioned inside
           * this wrapper, so its height always equals the calendar's height
           * and the list scrolls inside it instead of stretching the page.
           */}
          <Box
            data-tour="calendar-meeting-list"
            sx={{
              position: 'relative',
              minWidth: 0,
              minHeight: { lg: 460 },
            }}
          >
            <Box
              sx={{
                position: { xs: 'static', lg: 'absolute' },
                top: { lg: 0 },
                right: { lg: 0 },
                bottom: { lg: 0 },
                left: { lg: 0 },
                maxHeight: { xs: 620, lg: 'none' },
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                border: '1px solid #DFEAF4',
                borderRadius: '14px',
                bgcolor: '#FFFFFF',
                overflow: 'hidden',
              }}
            >
              {/* Panel header: title and total count */}
              <Box
                sx={{
                  flexShrink: 0,
                  px: { xs: 1.5, md: 1.9 },
                  py: { xs: 1.5, md: 1.75 },
                  borderBottom: '1px solid #E8F0F7',
                  bgcolor: '#FFFFFF',
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.25,
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', gap: 1.25, minWidth: 0 }}
                  >
                    <Box
                      aria-hidden="true"
                      sx={{
                        flexShrink: 0,
                        width: 38,
                        height: 38,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '11px',
                        bgcolor: '#EAF3FC',
                        color: '#0967B2',
                      }}
                    >
                      <EventNoteOutlinedIcon sx={{ fontSize: 21 }} />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        component="h2"
                        sx={{
                          m: 0,
                          color: '#123A59',
                          fontSize: '1rem',
                          lineHeight: 1.3,
                          fontWeight: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {pageHeading}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.2,
                          color: '#5A7189',
                          fontSize: '0.78rem',
                          lineHeight: 1.4,
                        }}
                      >
                        {agendaLabel}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      flexShrink: 0,
                      px: 1.3,
                      py: 0.5,
                      borderRadius: '999px',
                      bgcolor: '#EAF3FC',
                      color: '#0967B2',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {meetingCount} {meetingCount === 1 ? 'meeting' : 'meetings'}
                  </Box>
                </Stack>
              </Box>

              {/* Scrollable list: Live / Upcoming / Done sections */}
              <Box
                data-tour="calendar-filters"
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  px: { xs: 1.25, md: 1.5 },
                  py: 1.5,
                  bgcolor: '#F7FAFD',
                }}
              >
                <CalendarMeetingList
                  meetings={visibleMeetings}
                  view={view}
                  settings={settings}
                  onSettingsChange={onSettingsChange}
                  compact
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
  )
}