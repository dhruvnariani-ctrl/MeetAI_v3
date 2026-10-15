import { Suspense, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'

import CompanionBot from '../components/companion/CompanionBot'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import InstantJoinDialog from '../components/instant/InstantJoinDialog'
import CreateEventDialog from '../components/event/CreateEventDialog'
import { ErrorBoundary, PageSkeleton } from '../components/StateViews'

import { getAllMeetings } from '../data/meetings'
import { searchDirectory } from '../data/Directory'
import useCurrentUser from '../hooks/useCurrentUser'

export default function AppLayout() {
  const [navOpen, setNavOpen] = useState(() => window.matchMedia('(min-width: 900px)').matches)
  const [lastSynced, setLastSynced] = useState(() => new Date())
  const [createOpen, setCreateOpen] = useState(false)
  const [createKey, setCreateKey] = useState(0)
  const [instantOpen, setInstantOpen] = useState(false)
  const [instantKey, setInstantKey] = useState(0)
  const [toast, setToast] = useState('')
  const [query, setQuery] = useState('')

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

  // A new key remounts the dialog, so every open starts with a blank form.
  const openCreate = () => {
    setCreateKey((key) => key + 1)
    setCreateOpen(true)
  }

  const openInstant = () => {
    setInstantKey((key) => key + 1)
    setInstantOpen(true)
  }

  const handleCreate = (event) => {
    setCreateOpen(false)
    setToast(`"${event.title}" was created`)
  }

  const handleRecord = (details) => {
    setInstantOpen(false)
    setToast(`MeetAI is joining${details.title ? ` "${details.title}"` : ' your meeting'}`)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100dvh',
        minHeight: 0,
        overflow: 'hidden',
        bgcolor: 'background.default',
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
          borderRadius: '12px',
          bgcolor: 'text.primary',
          color: '#fff',
          '&:focus': { top: 12 },
        }}
      >
        Skip to main content
      </Box>

      <Sidebar
        open={navOpen}
        onToggle={() => setNavOpen((open) => !open)}
        onInstantJoin={openInstant}
        lastSynced={lastSynced}
        onSync={() => setLastSynced(new Date())}
      />

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
          onToggleNav={() => setNavOpen((open) => !open)}
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
            bgcolor: 'background.default',
            p: { xs: 1.5, md: 2 },
            pb: { xs: 11, md: 2 },
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
          }}
        >
          <ErrorBoundary resetKey={pathname}>
            <Suspense fallback={<PageSkeleton />}>
              <Outlet context={{ openCreate, openInstant, currentUser }} />
            </Suspense>
          </ErrorBoundary>
        </Box>
      </Box>

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
        imageSrc={`${import.meta.env.BASE_URL}images/companion-robot.svg`}
        onCreateMeeting={openCreate}
        onInstantMeeting={openInstant}
        routes={{ tasks: '/tasks', recorded: '/recorded' }}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  )
}
