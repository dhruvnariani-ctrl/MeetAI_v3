import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'

import SearchIcon from '@mui/icons-material/Search'

import SearchResults, { MAX_RESULTS } from './SearchResults'
import { getTodaysMeetings } from '../data/meetings'

/* Matches title, platform, participant name or participant email. */
function matches(meeting, searchValue) {
  const title = meeting.title?.toLowerCase() || ''
  const platform = meeting.platform?.toLowerCase() || ''
  const participants = Array.isArray(meeting.participants)
    ? meeting.participants
        .map((person) => `${person.name || ''} ${person.email || ''}`)
        .join(' ')
        .toLowerCase()
    : ''

  return (
    title.includes(searchValue) ||
    platform.includes(searchValue) ||
    participants.includes(searchValue)
  )
}

/* Header search box + results dropdown. The parent owns the query. */
export default function HeaderSearch({ query, onQueryChange }) {
  const navigate = useNavigate()

  const meetings = useMemo(() => getTodaysMeetings(), [])

  const matchingMeetings = useMemo(() => {
    const searchValue = query.trim().toLowerCase()
    if (!searchValue) return []

    return meetings
      .filter((meeting) => matches(meeting, searchValue))
      .slice(0, MAX_RESULTS)
  }, [meetings, query])

  const showDropdown = query.trim().length > 0

  const handleMeetingClick = (meeting) => {
    onQueryChange('')
    navigate(`/meetings/${meeting.id}` )
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onQueryChange('')
      return
    }

    if (event.key === 'Enter' && matchingMeetings.length > 0) {
      event.preventDefault()
      handleMeetingClick(matchingMeetings[0])
    }
  }

  return (
    <Box
      data-tour="header-search"
      sx={{ position: 'relative', flex: 1, maxWidth: 720 }}
    >
      <Paper
        component="form"
        role="search"
        elevation={0}
        onSubmit={(event) => event.preventDefault()}
        sx={{
          width: '100%',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          borderRadius: '12px',
          border: '1px solid',
          borderColor: showDropdown ? '#0967B2' : 'divider',
          color: 'text.secondary',
          transition: 'border-color 160ms ease, box-shadow 160ms ease',
          '&:focus-within': {
            outline: '3px solid rgba(13, 98, 201, 0.12)',
            outlineOffset: 1,
            borderColor: '#0967B2',
          },
        }}
      >
        <SearchIcon sx={{ fontSize: 22, flexShrink: 0, color: '#718198' }} />

        <InputBase
          type="search"
          placeholder="Search meetings"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={handleKeyDown}
          inputProps={{ 'aria-label': 'Search meetings', autoComplete: 'off' }}
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: '0.875rem',
            '& input::placeholder': { opacity: 1, color: 'text.secondary' },
          }}
        />
      </Paper>

      {showDropdown && (
        <SearchResults meetings={matchingMeetings} onSelect={handleMeetingClick} />
      )}
    </Box>
  )
}