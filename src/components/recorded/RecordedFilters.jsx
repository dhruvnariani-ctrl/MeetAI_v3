
import { useState } from 'react'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const COLORS = {
  blue: '#0967B2',
  text: '#304858',
  muted: '#71818D',
  border: '#DFE7EC',
}

const dropdownButtonSx = {
  minWidth: { xs: '100%', sm: 132 },
  minHeight: 40,
  justifyContent: 'space-between',
  textTransform: 'none',
  fontSize: '0.76rem',
  fontWeight: 600,
  color: COLORS.text,
  borderColor: COLORS.border,
  borderRadius: '9px',
  whiteSpace: 'nowrap',
  '&:hover': {
    borderColor: '#B7CDDF',
    bgcolor: '#F7FAFC',
  },
}

export default function RecordedFilters({
  search,
  onSearchChange,
  dateFilters,
  dateFilter,
  onDateFilterChange,
  sortOptions,
  sortBy,
  onSortChange,
}) {
  const [dateAnchorEl, setDateAnchorEl] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)

  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 0,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '14px',
        bgcolor: '#fff',
        p: { xs: 1.25, sm: 1.5 },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ minWidth: 0 }}
      >
        <TextField
          data-tour="recorded-search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search meetings or people"
          size="small"
          fullWidth
          inputProps={{ 'aria-label': 'Search meetings or people' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon
                  sx={{ fontSize: 19, color: COLORS.muted }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: '1 1 auto',
            minWidth: 0,
            '& .MuiOutlinedInput-root': {
              minHeight: 40,
              borderRadius: '9px',
              fontSize: '0.76rem',
              color: COLORS.text,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: COLORS.border,
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#9AA9B8',
              opacity: 1,
            },
          }}
        />

        <Button
          data-tour="recorded-filters"
          size="small"
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={(event) => setDateAnchorEl(event.currentTarget)}
          sx={dropdownButtonSx}
        >
          {dateFilter}
        </Button>

        <Menu
          anchorEl={dateAnchorEl}
          open={Boolean(dateAnchorEl)}
          onClose={() => setDateAnchorEl(null)}
          slotProps={{
            paper: {
              sx: {
                minWidth: 160,
                mt: 0.5,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(18,58,89,0.10)',
              },
            },
          }}
        >
          {dateFilters.map((item) => (
            <MenuItem
              key={item}
              selected={dateFilter === item}
              onClick={() => {
                onDateFilterChange(item)
                setDateAnchorEl(null)
              }}
              sx={{
                minHeight: 38,
                fontSize: '0.76rem',
                '&.Mui-selected': {
                  bgcolor: '#EFF6FB',
                  color: COLORS.blue,
                },
              }}
            >
              {item}
            </MenuItem>
          ))}
        </Menu>

        <Button
          data-tour="recorded-sort"
          size="small"
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={(event) => setSortAnchorEl(event.currentTarget)}
          sx={dropdownButtonSx}
        >
          Sort: {sortBy}
        </Button>

        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
          slotProps={{
            paper: {
              sx: {
                minWidth: 175,
                mt: 0.5,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(18,58,89,0.10)',
              },
            },
          }}
        >
          {sortOptions.map((item) => (
            <MenuItem
              key={item}
              selected={sortBy === item}
              onClick={() => {
                onSortChange(item)
                setSortAnchorEl(null)
              }}
              sx={{
                minHeight: 38,
                fontSize: '0.76rem',
                '&.Mui-selected': {
                  bgcolor: '#EFF6FB',
                  color: COLORS.blue,
                },
              }}
            >
              {item}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Paper>
  )
}