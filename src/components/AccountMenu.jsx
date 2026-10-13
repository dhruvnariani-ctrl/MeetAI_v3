import { useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'

import useCurrentUser from '../hooks/useCurrentUser'

export default function AccountMenu({
  onStartTour,
  onLogout,
}) {
  const currentUser = useCurrentUser()

  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleTour = () => {
    handleClose()

    if (onStartTour) {
      onStartTour()
    }
  }

  const handleLogout = () => {
    handleClose()

    if (onLogout) {
      onLogout()
    }
  }

  const displayName =
    currentUser?.name || 'User'

  const displayEmail =
    currentUser?.email || ''

  const initials =
    currentUser?.initials ||
    displayName
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

  return (
    <>
      {/* Account button */}
      <Tooltip title="Account">
        <IconButton
          id="account-menu-button"
          aria-controls={
            open ? 'account-menu' : undefined
          }
          aria-haspopup="true"
          aria-expanded={
            open ? 'true' : undefined
          }
          onClick={handleOpen}
          sx={{
            width: 42,
            height: 42,
            p: 0,

            borderRadius: '50%',

            bgcolor: '#172437',
            color: '#fff',

            transition:
              'background-color 160ms ease, transform 160ms ease, box-shadow 160ms ease',

            '&:hover': {
              bgcolor: '#243650',
              transform: 'translateY(-1px)',
            },

            '&:focus-visible': {
              outline:
                '2px solid rgba(13, 104, 201, 0.45)',
              outlineOffset: 2,
            },
          }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,

              bgcolor: 'transparent',
              color: '#fff',

              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          >
            {initials}
          </Avatar>
        </IconButton>
      </Tooltip>

      {/* Account dropdown */}
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby':
            'account-menu-button',
          disablePadding: true,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1.1,

              width: 270,

              overflow: 'hidden',

              borderRadius: '14px',

              border:
                '1px solid rgba(16, 42, 70, 0.09)',

              bgcolor: '#fff',

              boxShadow:
                '0 12px 35px rgba(18, 43, 70, 0.14), 0 3px 10px rgba(18, 43, 70, 0.06)',

              '& .MuiList-root': {
                p: 0,
              },
            },
          },
        }}
      >
        {/* USER INFORMATION */}
        <Box
          sx={{
            px: 2,
            py: 1.7,

            display: 'flex',
            alignItems: 'center',
            gap: 1.25,

            bgcolor: '#f8fafc',
          }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,

              flexShrink: 0,

              bgcolor: '#172437',

              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {initials}
          </Avatar>

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.9rem',
                fontWeight: 650,
                color: '#142942',

                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </Typography>

            <Typography
              sx={{
                mt: 0.25,

                fontSize: '0.75rem',
                color: '#718198',

                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayEmail}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* APP TOUR */}
        <MenuItem
          onClick={handleTour}
          sx={{
            minHeight: 46,

            px: 1.75,

            color: '#243b5a',

            '&:hover': {
              bgcolor: '#f3f7fc',
            },

            '&:focus': {
              bgcolor: '#f3f7fc',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 38,
              color: '#526b89',
            }}
          >
            <PlayCircleOutlineOutlinedIcon
              sx={{ fontSize: 20 }}
            />
          </ListItemIcon>

          <ListItemText
            primary="App tour"
            secondary="Learn how MeetAI works"
            slotProps={{
              primary: {
                sx: {
                  fontSize: '0.84rem',
                  fontWeight: 600,
                },
              },
              secondary: {
                sx: {
                  mt: 0.15,
                  fontSize: '0.7rem',
                  color: '#8997a9',
                },
              },
            }}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        {/* LOGOUT */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            minHeight: 46,

            mx: 0.75,
            mb: 0.75,

            px: 1,

            borderRadius: '9px',

            color: '#b42318',

            '&:hover': {
              bgcolor: '#fff2f1',
            },

            '&:focus': {
              bgcolor: '#fff2f1',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 38,
              color: '#b42318',
            }}
          >
            <LogoutOutlinedIcon
              sx={{ fontSize: 20 }}
            />
          </ListItemIcon>

          <ListItemText
            primary="Log out"
            slotProps={{
              primary: {
                sx: {
                  fontSize: '0.84rem',
                  fontWeight: 600,
                },
              },
            }}
          />
        </MenuItem>
      </Menu>
    </>
  )
}