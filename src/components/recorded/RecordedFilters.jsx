
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

const dropdownButtonSx = {
  minWidth: { xs: '100%', sm: 132 },
  minHeight: 40,
  justifyContent: 'space-between',
  textTransform: 'none',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'text.primary',
  borderColor: 'divider',
  borderRadius: '8px',
  whiteSpace: 'nowrap',
  '&:hover': {
    borderColor: 'primary.main',
    bgcolor: 'primary.light',
  },
}

const menuPaperSx = {
  minWidth: 160,
  mt: 0.5,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '8px',
  boxShadow: '0 8px 24px rgba(18, 58, 89, 0.10)',
}

const menuItemSx = {
  minHeight: 38,
  fontSize: '0.8125rem',
  '&.Mui-selected': {
    bgcolor: 'primary.light',
    color: 'primary.main',
  },
  '&.Mui-selected:hover': {
    bgcolor: 'primary.light',
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
        width: '100%',
        minWidth: 0,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        bgcolor: 'background.paper',
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
          slotProps={{
            htmlInput: { 'aria-label': 'Search meetings or people' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon
                    sx={{
                      fontSize: 19,
                      color: 'text.secondary',
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            flex: '1 1 auto',
            minWidth: 0,
            '& .MuiOutlinedInput-root': {
              minHeight: 40,
              borderRadius: '8px',
              fontSize: '0.8125rem',
              color: 'text.primary',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'text.secondary',
              opacity: 0.8,
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
              sx: menuPaperSx,
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
              sx={menuItemSx}
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
                ...menuPaperSx,
                minWidth: 175,
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
              sx={menuItemSx}
            >
              {item}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Paper>
  )
}
