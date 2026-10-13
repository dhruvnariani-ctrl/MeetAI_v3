import { useEffect, useMemo, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined'

import { getStatusKey, getStatusStyle } from '../meetings/meetingHelpers'

const pad = (value) => String(value).padStart(2, '0')
const dateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/* Same palette as the status chips and the meeting list sections. */
const statusColor = (meeting) => getStatusStyle(getStatusKey(meeting)).color

/* What a day cell highlights first: Live, then Upcoming, then Done. */
const STATUS_PRIORITY = { Live: 0, Upcoming: 1, Done: 2 }

/*
 * The highlighted range for the current view:
 * day   -> just the selected day
 * week  -> Sunday to Saturday of the selected week
 * month -> the 1st to the last day of the selected month
 *
 * Keys are YYYY-MM-DD so they can be compared as strings.
 */
function getRangeKeys(view, selectedDate) {
  if (view === 'week') {
    const start = new Date(selectedDate)
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - start.getDay())

    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    return { start: dateKey(start), end: dateKey(end) }
  }

  if (view === 'month') {
    const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)

    return { start: dateKey(start), end: dateKey(end) }
  }

  const key = dateKey(selectedDate)
  return { start: key, end: key }
}

export default function CalendarSidebar({
  selectedDate,
  view = 'day',
  meetings = [],
  onSelectDate,
  onOpenDay,
  onToday,
}) {
  const [displayMonth, setDisplayMonth] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  )

  /* Follow the selected date whenever it changes (toolbar, Today, etc.). */
  const selectedTime = selectedDate.getTime()
  useEffect(() => {
    setDisplayMonth(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTime])

  const year = displayMonth.getFullYear()
  const month = displayMonth.getMonth()
  const selectedKey = dateKey(selectedDate)
  const todayKey = dateKey(new Date())
  const range = getRangeKeys(view, selectedDate)

  const monthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(displayMonth)

  const cells = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const previousMonthDays = new Date(year, month, 0).getDate()
    const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7

    return Array.from({ length: totalCells }, (_, index) => {
      const dayNumber = index - firstWeekday + 1

      if (dayNumber < 1) {
        const date = new Date(year, month - 1, previousMonthDays + dayNumber)
        return { date, day: date.getDate(), outside: true }
      }

      if (dayNumber > daysInMonth) {
        const date = new Date(year, month + 1, dayNumber - daysInMonth)
        return { date, day: date.getDate(), outside: true }
      }

      return {
        date: new Date(year, month, dayNumber),
        day: dayNumber,
        outside: false,
      }
    })
  }, [year, month])

  const weekCount = cells.length / 7

  const meetingsByDate = useMemo(() => {
    const result = {}

    meetings.forEach((meeting) => {
      if (!meeting.date) return
      if (!result[meeting.date]) result[meeting.date] = []
      result[meeting.date].push(meeting)
    })

    return result
  }, [meetings])

  /*
   * The arrows only browse months. They never change the selected
   * date, so the Day / Week / Month selection stays where it is.
   */
  const moveMonth = (offset) => {
    setDisplayMonth(new Date(year, month + offset, 1))
  }

  const jumpToToday = () => {
    const today = new Date()
    setDisplayMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    onSelectDate?.(today)
    onToday?.()
  }

  const arrowSx = {
    width: 30,
    height: 30,
    color: '#456079',
    '&:hover': { bgcolor: '#EFF6FB' },
  }

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 1.25, md: 1.5 },
        border: '1px solid #DFEAF4',
        borderRadius: '14px',
        bgcolor: '#FFFFFF',
        boxSizing: 'border-box',
      }}
    >
      {/* Month label + arrows on the left, Today on the right */}
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          px: 0.25,
          mb: 1.25,
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: 'center', gap: 0.75, minWidth: 0 }}
        >
          <Typography
            sx={{
              fontSize: '0.98rem',
              fontWeight: 700,
              lineHeight: 1,
              color: '#123A59',
              whiteSpace: 'nowrap',
            }}
          >
            {monthLabel}
          </Typography>

          <Stack direction="row" sx={{ alignItems: 'center', gap: 0.25 }}>
            <IconButton
              size="small"
              aria-label="Previous month"
              onClick={() => moveMonth(-1)}
              sx={arrowSx}
            >
              <ChevronLeftIcon sx={{ fontSize: 21 }} />
            </IconButton>
            <IconButton
              size="small"
              aria-label="Next month"
              onClick={() => moveMonth(1)}
              sx={arrowSx}
            >
              <ChevronRightIcon sx={{ fontSize: 21 }} />
            </IconButton>
          </Stack>
        </Stack>

        <Button
          size="small"
          onClick={jumpToToday}
          startIcon={<TodayOutlinedIcon sx={{ fontSize: 17 }} />}
          sx={{
            flexShrink: 0,
            minWidth: 0,
            height: 32,
            px: 1.3,
            border: '1px solid #DCE8F3',
            borderRadius: '999px',
            bgcolor: '#FFFFFF',
            color: '#0967B2',
            textTransform: 'none',
            fontSize: '0.78rem',
            fontWeight: 650,
            '&:hover': { bgcolor: '#EFF6FB', borderColor: '#B9D3E8' },
          }}
        >
          Today
        </Button>
      </Stack>

      {/* Weekday header + day cells share one grid so rows fill the height */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gridTemplateRows: `34px repeat(${weekCount}, minmax(64px, 1fr))`,
          border: '1px solid #E4EEF7',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {WEEKDAYS.map((day, index) => (
          <Box
            key={day}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#F7FAFD',
              color: '#456079',
              fontSize: '0.74rem',
              fontWeight: 700,
              borderRight: index === 6 ? 0 : '1px solid #E4EEF7',
              borderBottom: '1px solid #E4EEF7',
            }}
          >
            {day}
          </Box>
        ))}

        {cells.map(({ date, day, outside }, index) => {
          const key = dateKey(date)
          const column = index % 7
          const lastRow = index >= cells.length - 7

          const inRange = key >= range.start && key <= range.end
          const isToday = key === todayKey
          const isSelectedDay = view === 'day' && key === selectedKey

          const dayMeetings = meetingsByDate[key] ?? []
          const count = dayMeetings.length

          /* The most relevant meeting of the day sets the chip colour. */
          const top = count
            ? [...dayMeetings].sort(
                (a, b) =>
                  STATUS_PRIORITY[getStatusKey(a)] -
                  STATUS_PRIORITY[getStatusKey(b)],
              )[0]
            : null
          const topStyle = top ? getStatusStyle(getStatusKey(top)) : null

          const uniqueDots = [...new Set(dayMeetings.map(statusColor))].slice(0, 3)

          const label = `${date.toDateString()}${
            count ? `, ${count} ${count === 1 ? 'meeting' : 'meetings'}` : ''
          }`

          return (
            <Button
              key={key}
              onClick={() => onSelectDate?.(date)}
              onDoubleClick={() => onOpenDay?.(date)}
              aria-label={label}
              aria-pressed={inRange}
              sx={{
                minWidth: 0,
                minHeight: 0,
                height: '100%',
                p: 0.6,
                borderRadius: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: 0.35,
                textAlign: 'left',
                textTransform: 'none',
                overflow: 'hidden',
                color: outside && !inRange ? '#6B8097' : '#123A59',
                bgcolor: inRange
                  ? view === 'day'
                    ? '#EAF5FF'
                    : '#E6F2FD'
                  : 'transparent',
                borderRight: column === 6 ? 0 : '1px solid #E4EEF7',
                borderBottom: lastRow ? 0 : '1px solid #E4EEF7',
                '&:hover': { bgcolor: inRange ? '#DAEBFB' : '#F4F9FD' },
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 25,
                  height: 25,
                  flexShrink: 0,
                  boxSizing: 'border-box',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: '1.5px solid',
                  borderColor:
                    isToday && !isSelectedDay ? '#0878DF' : 'transparent',
                  bgcolor: isSelectedDay ? '#0878DF' : 'transparent',
                  color: isSelectedDay
                    ? '#FFFFFF'
                    : isToday
                      ? '#0878DF'
                      : 'inherit',
                  fontSize: '0.78rem',
                  fontWeight: isSelectedDay || isToday || inRange ? 700 : 500,
                }}
              >
                {day}
              </Box>

              {/*
               * Wider screens: one meeting shows its title (up to 2 lines);
               * several meetings show a count, so nothing is cut to "Weekly …".
               */}
              {top && (
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 0.4,
                    width: '100%',
                    minWidth: 0,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: count === 1 ? 2 : 1,
                      maxWidth: '100%',
                      px: 0.7,
                      py: 0.15,
                      borderRadius: '6px',
                      bgcolor: topStyle.backgroundColor,
                      color: topStyle.color,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      lineHeight: 1.35,
                      overflow: 'hidden',
                      wordBreak: 'break-word',
                    }}
                  >
                    {count === 1 ? top.title : `${count} meetings`}
                  </Box>

                  {count > 1 && (
                    <Box sx={{ display: 'flex', gap: '4px', pl: 0.5 }}>
                      {uniqueDots.map((color) => (
                        <Box
                          key={color}
                          component="span"
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: color,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {/* Small screens: status dots only */}
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  gap: '3px',
                  pl: 0.45,
                  minHeight: 5,
                }}
              >
                {uniqueDots.map((color) => (
                  <Box
                    key={color}
                    component="span"
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      bgcolor: color,
                    }}
                  />
                ))}
              </Box>
            </Button>
          )
        })}
      </Box>

      {/* Legend */}
      <Stack
        direction="row"
        sx={{
          pt: 1.25,
          px: 0.25,
          alignItems: 'center',
          flexWrap: 'wrap',
          columnGap: 1.6,
          rowGap: 0.5,
        }}
      >
        {['Live', 'Upcoming', 'Done'].map((label) => (
          <Stack
            key={label}
            direction="row"
            sx={{ alignItems: 'center', gap: 0.6 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: getStatusStyle(label).color,
              }}
            />
            <Typography sx={{ fontSize: '0.74rem', color: '#456079' }}>
              {label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  )
}