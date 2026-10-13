
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'

import MenuIcon from '@mui/icons-material/Menu'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'

import AccountMenu from './AccountMenu'
import HeaderSearch from './HeaderSearch'
import useCurrentUser from '../hooks/useCurrentUser'

export default function Header({
  navOpen,
  onToggleNav,
  query,
  onQueryChange,
}) {
  const currentUser = useCurrentUser()

  const navLabel = navOpen
    ? 'Collapse navigation'
    : 'Expand navigation'

  return (
    <AppBar
      component="header"
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        flexShrink: 0,
        width: '100%',
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #DFE7EC',
        color: '#123A59',
        overflow: 'visible',
        zIndex: 10,
      }}
    >
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          minHeight: '68px !important',
          height: 68,
          px: { xs: 1.25, md: 2.25 },
          gap: { xs: 1, md: 2 },
          overflow: 'visible',
        }}
      >
        <Tooltip title={navLabel}>
          <IconButton
            aria-label={navLabel}
            aria-expanded={navOpen}
            aria-controls="sidebar"
            onClick={onToggleNav}
            sx={{
              flexShrink: 0,
              width: 38,
              height: 38,
              color: '#123A59',
              borderRadius: '10px',
              '&:hover': { bgcolor: '#EFF6FB' },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>

        <Box sx={{ flex: 1, minWidth: 0, maxWidth: 760 }}>
          <HeaderSearch
            query={query}
            onQueryChange={onQueryChange}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1 },
            ml: 'auto',
            flexShrink: 0,
          }}
        >
          <Tooltip title="Notifications">
            <IconButton
              aria-label="Notifications"
              sx={{
                color: '#123A59',
                width: 38,
                height: 38,
                '&:hover': { bgcolor: '#EFF6FB' },
              }}
            >
              <NotificationsNoneOutlinedIcon />
            </IconButton>
          </Tooltip>

          <AccountMenu
            user={currentUser}
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
