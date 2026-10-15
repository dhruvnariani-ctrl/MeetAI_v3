
import { useState } from 'react'

import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'

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
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{
        minWidth: 0,
        flexShrink: 0,
        alignItems: { xs: 'stretch', sm: 'center' },
      }}
    >
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
  )
}
