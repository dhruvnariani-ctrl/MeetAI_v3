import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'

const FILTERS = ['All', 'Live', 'Upcoming', 'Done']

export default function CalendarFilters({ value, onChange, counts = {} }) {
  return (
    <Box
      role="tablist"
      aria-label="Filter meetings by status"
      sx={{
        display: 'flex',
        gap: 0.4,
        p: 0.4,
        mb: 0.25,
        borderRadius: '999px',
        bgcolor: '#F1F6FB',
      }}
    >
      {FILTERS.map((filter) => {
        const selected = value === filter
        const count = counts[filter]

        return (
          <ButtonBase
            key={filter}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(filter)}
            sx={{
              flex: 1,
              minWidth: 0,
              height: 30,
              gap: 0.6,
              px: 0.8,
              borderRadius: '999px',
              fontFamily: 'inherit',
              fontSize: '0.7rem',
              fontWeight: 650,
              whiteSpace: 'nowrap',
              color: selected ? '#FFFFFF' : '#4E6D89',
              bgcolor: selected ? '#0967B2' : 'transparent',
              boxShadow: selected
                ? '0 2px 6px rgba(9, 103, 178, 0.25)'
                : 'none',
              transition: 'background-color 160ms ease, color 160ms ease',
              '&:hover': {
                bgcolor: selected ? '#075797' : '#E6EFF8',
              },
              '&:focus-visible': {
                outline: '2px solid #0967B2',
                outlineOffset: '2px',
              },
            }}
          >
            {filter}

            {typeof count === 'number' && (
              <Box
                component="span"
                sx={{
                  minWidth: 18,
                  height: 18,
                  px: 0.55,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  borderRadius: '999px',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: selected ? '#FFFFFF' : '#52708D',
                  bgcolor: selected
                    ? 'rgba(255, 255, 255, 0.22)'
                    : '#E1EBF5',
                }}
              >
                {count}
              </Box>
            )}
          </ButtonBase>
        )
      })}
    </Box>
  )
}