import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined'
import AddIcon from '@mui/icons-material/Add'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'

import SlidingSegmented from '../SlidingSegmented'

const VIEWS = [
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
]

const EMPTY_FILTERS = {
  platforms: [],
  meetAIOnly: false,
  hostedByMe: false,
}

const format = (date, options) =>
  new Intl.DateTimeFormat('en-US', options).format(date)

function getPeriodLabel(view, selectedDate) {
  const date =
    selectedDate instanceof Date
      ? new Date(selectedDate)
      : new Date(selectedDate || Date.now())

  if (Number.isNaN(date.getTime())) return ''

  if (view === 'month') {
    return format(date, {
      month: 'long',
      year: 'numeric',
    })
  }

  if (view === 'week') {
    // Use Sunday through Saturday consistently.
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - start.getDay())

    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${format(start, { month: 'short' })} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`
    }

    return `${format(start, {
      month: 'short',
      day: 'numeric',
    })} – ${format(end, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`
  }

  return format(date, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const circleButtonSx = {
  flexShrink: 0,
  width: 36,
  height: 36,
  border: '1px solid #DCE8F3',
  borderRadius: '50%',
  color: '#123A59',
  bgcolor: '#FFFFFF',
  '&:hover': { bgcolor: '#EFF6FB' },
}

export default function CalendarToolbar({
  view = 'month',
  selectedDate,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onYesterday,
  onTomorrow,
  onCurrentPeriod,
  onNewMeeting,
  filters = EMPTY_FILTERS,
  onFiltersChange,
  onClearFilters,
  platforms = [],
  activeFilterCount = 0,
}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const menuOpen = Boolean(anchorEl)

  const [filterAnchor, setFilterAnchor] = useState(null)
  const filtersOpen = Boolean(filterAnchor)

  // Recalculate from the live selected date.
  const periodLabel = getPeriodLabel(view, selectedDate)

  const quickActions =
    view === 'month'
      ? [
          { label: 'This month', action: onCurrentPeriod },
          { label: 'Previous month', action: onPrevious },
          { label: 'Next month', action: onNext },
        ]
      : view === 'week'
        ? [
            { label: 'This week', action: onCurrentPeriod },
            { label: 'Previous week', action: onPrevious },
            { label: 'Next week', action: onNext },
          ]
        : [
            { label: 'Today', action: onToday },
            { label: 'Yesterday', action: onYesterday },
            { label: 'Tomorrow', action: onTomorrow },
          ]

  const updateFilters = (patch) => onFiltersChange?.({ ...filters, ...patch })

  const togglePlatform = (platform) => {
    const next = filters.platforms.includes(platform)
      ? filters.platforms.filter((item) => item !== platform)
      : [...filters.platforms, platform]

    updateFilters({ platforms: next })
  }

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        display: 'grid',
        /*
         * Left group hugs the left edge, the view switch sits in the
         * middle, and the actions hug the right edge, so the toolbar
         * lines up with the panels below it.
         */
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          lg: 'minmax(0, 1fr) auto minmax(0, 1fr)',
        },
        alignItems: 'center',
        columnGap: { xs: 1, lg: 1.5 },
        rowGap: 1,
        mb: 1.5,
      }}
    >
      {/* Date navigation */}
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          gap: 0.6,
          minWidth: 0,
          maxWidth: '100%',
          justifySelf: 'start',
        }}
      >
        <Tooltip title={`Previous ${view}`}>
          <IconButton
            aria-label={`Previous ${view}`}
            onClick={onPrevious}
            size="small"
            sx={circleButtonSx}
          >
            <ChevronLeftIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </Tooltip>

        <Button
          data-tour="calendar-date-menu"
          aria-haspopup="menu"
          aria-expanded={menuOpen ? 'true' : undefined}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          startIcon={<TodayOutlinedIcon sx={{ fontSize: 18 }} />}
          endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
          sx={{
            height: 38,
            minWidth: { xs: 0, sm: 180 },
            maxWidth: { xs: 240, sm: 300 },
            px: { xs: 1, sm: 1.5 },
            flex: '0 1 auto',
            justifyContent: 'space-between',
            border: '1px solid #DCE8F3',
            borderRadius: '22px',
            bgcolor: '#FFFFFF',
            color: '#123A59',
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 650,
            whiteSpace: 'nowrap',
            '& .MuiButton-startIcon': {
              mr: 0.8,
              ml: 0,
              flexShrink: 0,
            },
            '& .MuiButton-endIcon': {
              ml: 0.6,
              mr: 0,
              flexShrink: 0,
            },
            '&:hover': {
              bgcolor: '#F5F9FC',
              borderColor: '#B9D3E8',
            },
          }}
        >
          <Box
            component="span"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {periodLabel}
          </Box>
        </Button>

        <Tooltip title={`Next ${view}`}>
          <IconButton
            aria-label={`Next ${view}`}
            onClick={onNext}
            size="small"
            sx={circleButtonSx}
          >
            <ChevronRightIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </Tooltip>

        {/* Menu remains anchored to the date selector */}
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 0.75,
                minWidth: 180,
                border: '1px solid #DFE7EC',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(18, 58, 89, 0.13)',
                py: 0.5,
                '& .MuiMenuItem-root': {
                  minHeight: 40,
                  px: 1.75,
                  fontSize: '0.82rem',
                  color: '#123A59',
                },
                '& .MuiMenuItem-root:hover': {
                  bgcolor: '#EFF6FB',
                },
              },
            },
          }}
        >
          {quickActions.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => {
                setAnchorEl(null)
                item.action?.()
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>

      {/* Month / Week / Day */}
      <Box
        sx={{
          justifySelf: { xs: 'start', lg: 'center' },
          minWidth: 0,
          p: 0.35,
          borderRadius: '999px',
          bgcolor: '#EFF5FB',
        }}
      >
        <SlidingSegmented
          dataTour="calendar-view"
          value={view}
          onChange={onViewChange}
          options={VIEWS}
          ariaLabel="Calendar view"
          size="compact"
        />
      </Box>

      {/* Filters, then Create meeting pinned to the far right edge */}
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', lg: 'flex-end' },
          gap: 0.8,
          minWidth: 0,
          width: '100%',
          justifySelf: 'stretch',
        }}
      >
        <Button
          data-tour="calendar-filters-button"
          aria-haspopup="dialog"
          aria-expanded={filtersOpen ? 'true' : undefined}
          onClick={(event) => setFilterAnchor(event.currentTarget)}
          startIcon={<FilterListOutlinedIcon sx={{ fontSize: 17 }} />}
          sx={{
            flexShrink: 0,
            height: 38,
            px: 1.35,
            border: '1px solid',
            borderColor: activeFilterCount > 0 ? '#0967B2' : '#DCE8F3',
            borderRadius: '22px',
            bgcolor: activeFilterCount > 0 ? '#EAF3FC' : '#FFFFFF',
            color: '#0967B2',
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            '&:hover': {
              bgcolor: '#EFF6FB',
              borderColor: '#B9D3E8',
            },
          }}
        >
          Filters
          {activeFilterCount > 0 && (
            <Box
              component="span"
              sx={{
                ml: 0.8,
                minWidth: 20,
                height: 20,
                px: 0.6,
                boxSizing: 'border-box',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '999px',
                bgcolor: '#0967B2',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              {activeFilterCount}
            </Box>
          )}
        </Button>

        <Button
          data-tour="new-meeting"
          onClick={onNewMeeting}
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 19 }} />}
          sx={{
            flexShrink: 0,
            height: 38,
            px: { xs: 1.35, sm: 1.8 },
            borderRadius: '22px',
            bgcolor: '#0967B2',
            color: '#FFFFFF',
            boxShadow: 'none',
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            '&:hover': {
              bgcolor: '#075797',
              boxShadow: 'none',
            },
          }}
        >
          Create meeting
        </Button>
      </Stack>

      {/* Filters popover */}
      <Popover
        open={filtersOpen}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            role: 'dialog',
            'aria-label': 'Filter meetings',
            sx: {
              mt: 0.75,
              width: 310,
              maxWidth: 'calc(100vw - 32px)',
              p: 2,
              border: '1px solid #DFE7EC',
              borderRadius: '14px',
              boxShadow: '0 8px 24px rgba(18, 58, 89, 0.13)',
            },
          },
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          <Typography
            sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#123A59' }}
          >
            Filters
          </Typography>

          <Button
            size="small"
            disabled={activeFilterCount === 0}
            onClick={() => onClearFilters?.()}
            sx={{
              minWidth: 0,
              px: 1,
              textTransform: 'none',
              fontSize: '0.78rem',
              fontWeight: 650,
              color: '#0967B2',
            }}
          >
            Clear all
          </Button>
        </Stack>

        <Typography
          sx={{
            mb: 0.8,
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#456079',
          }}
        >
          Platform
        </Typography>

        {platforms.length === 0 ? (
          <Typography sx={{ mb: 1.5, fontSize: '0.78rem', color: '#5A7189' }}>
            No platforms found in your meetings.
          </Typography>
        ) : (
          <Stack
            direction="row"
            sx={{ flexWrap: 'wrap', gap: 0.8, mb: 1.75 }}
          >
            {platforms.map((platform) => {
              const selected = filters.platforms.includes(platform)

              return (
                <ButtonBase
                  key={platform}
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => togglePlatform(platform)}
                  sx={{
                    height: 32,
                    px: 1.4,
                    border: '1px solid',
                    borderColor: selected ? '#0967B2' : '#D8E7F5',
                    borderRadius: '999px',
                    bgcolor: selected ? '#0967B2' : '#FFFFFF',
                    color: selected ? '#FFFFFF' : '#31506B',
                    fontFamily: 'inherit',
                    fontSize: '0.78rem',
                    fontWeight: 650,
                    '&:hover': {
                      bgcolor: selected ? '#075797' : '#F3F8FD',
                    },
                    '&.Mui-focusVisible': {
                      outline: '2px solid #0967B2',
                      outlineOffset: '2px',
                    },
                  }}
                >
                  {platform}
                </ButtonBase>
              )
            })}
          </Stack>
        )}

        <Typography
          sx={{
            mb: 0.4,
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#456079',
          }}
        >
          Show only
        </Typography>

        <Stack>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={filters.meetAIOnly}
                onChange={(event) =>
                  updateFilters({ meetAIOnly: event.target.checked })
                }
              />
            }
            label={
              <Typography sx={{ fontSize: '0.84rem', color: '#123A59' }}>
                MeetAI invited
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={filters.hostedByMe}
                onChange={(event) =>
                  updateFilters({ hostedByMe: event.target.checked })
                }
              />
            }
            label={
              <Typography sx={{ fontSize: '0.84rem', color: '#123A59' }}>
                Hosted by me
              </Typography>
            }
          />
        </Stack>

        <Button
          fullWidth
          variant="contained"
          onClick={() => setFilterAnchor(null)}
          sx={{
            mt: 1.5,
            height: 38,
            borderRadius: '22px',
            bgcolor: '#0967B2',
            boxShadow: 'none',
            textTransform: 'none',
            fontSize: '0.82rem',
            fontWeight: 700,
            '&:hover': { bgcolor: '#075797', boxShadow: 'none' },
          }}
        >
          Done
        </Button>
      </Popover>
    </Box>
  )
}