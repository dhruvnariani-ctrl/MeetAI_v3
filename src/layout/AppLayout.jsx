
import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import CompanionBot from '../components/companion/CompanionBot'
import { getAllMeetings } from '../data/meetings'
import Box from '@mui/material/Box'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import InstantJoinDialog from '../components/instant/InstantJoinDialog'
import CreateEventDialog from '../components/event/CreateEventDialog'

import { searchDirectory } from '../data/Directory'
import useCurrentUser from '../hooks/useCurrentUser'

export default function AppLayout() {
  const [navOpen, setNavOpen] = useState(() =>
    window.matchMedia('(min-width: 900px)').matches,
  )
  const [query, setQuery] = useState('')
  const [lastSynced, setLastSynced] = useState(() => new Date())
  const [createOpen, setCreateOpen] = useState(false)
  const [createKey, setCreateKey] = useState(0)
  const [instantOpen, setInstantOpen] = useState(false)
  const [instantKey, setInstantKey] = useState(0)

  const currentUser = useCurrentUser()
  const mainRef = useRef(null)
  const firstRender = useRef(true)
  const { pathname } = useLocation()

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    mainRef.current?.scrollTo(0, 0)
    mainRef.current?.focus()
  }, [pathname])

  const openCreate = () => {
    setCreateKey((key) => key + 1)
    setCreateOpen(true)
  }

  const openInstant = () => {
    setInstantKey((key) => key + 1)
    setInstantOpen(true)
  }

  const handleCreate = (event) => {
    console.log('Create event', event)
    setCreateOpen(false)
  }

  const handleRecord = (details) => {
    console.log('Start recording', details)
    setInstantOpen(false)
  }

  const toggleNav = () => {
    setNavOpen((open) => !open)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100dvh',
        minHeight: 0,
        overflow: 'hidden',
        bgcolor: '#F7F9FB',
      }}
    >
      <Box
        component="a"
        href="#main"
        sx={{
          position: 'fixed',
          left: 12,
          top: -60,
          zIndex: 2000,
          px: 2,
          py: 1.25,
          borderRadius: 2,
          bgcolor: '#123A59',
          color: '#fff',
          '&:focus': { top: 12 },
        }}
      >
        Skip to main content
      </Box>

      {/* Full-height sidebar on desktop */}
      <Sidebar
        open={navOpen}
        onToggle={toggleNav}
        onInstantJoin={openInstant}
        lastSynced={lastSynced}
        onSync={() => setLastSynced(new Date())}
      />

      {/* Header and page content occupy the area to the right */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        <Header
          navOpen={navOpen}
          onToggleNav={toggleNav}
          query={query}
          onQueryChange={setQuery}
        />

        <Box
          component="main"
          id="main"
          ref={mainRef}
          tabIndex={-1}
          sx={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: 'auto',
            outline: 'none',
            bgcolor: '#F7F9FB',
            p: { xs: 1.5, md: 2.5 },
            '&:focus-visible': {
              outline: '2px solid #0967B2',
              outlineOffset: -2,
            },
          }}
        >
          <Outlet
            context={{
              openCreate,
              openInstant,
              onCreateMeeting: openCreate,
              openCreateMeeting: openCreate,
              onInstantJoin: openInstant,
              openInstantJoin: openInstant,
              currentUser,
              query,
            }}
          />
        </Box>
      </Box>

      {/* Shared dialogs available to all pages */}
      <CreateEventDialog
        key={`create-${createKey}`}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        currentUser={currentUser}
        searchDirectory={searchDirectory}
      />

      <InstantJoinDialog
        key={`instant-${instantKey}`}
        open={instantOpen}
        onClose={() => setInstantOpen(false)}
        onSubmit={handleRecord}
        currentUser={currentUser}
        searchDirectory={searchDirectory}
      />

      

<CompanionBot
  meetings={getAllMeetings()}
  imageSrc="public/images/companion-robot.svg"            
  onCreateMeeting={() => setCreateOpen(true)}   
  onInstantMeeting={() => setInstantOpen(true)} 
  routes={{ tasks: '/tasks', recorded: '/recorded' }}
/>
    </Box>
  )
}