import { Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import Dashboard from './pages/Dashboard'
import CalendarPage from './pages/CalendarPage'
import RecordedMeetings from './pages/RecordedMeetings'
import MyTasks from './pages/MyTasks'
import NotFound from './pages/NotFound'
import MeetingDetails from './pages/MeetingDetails'
import HowItWorks from './pages/HowItWorks'
// Header + sidebar live in AppLayout and stay put; only the page inside <Outlet /> changes.
export default function App() {
  return (
    <>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="recorded" element={<RecordedMeetings />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="/meetings/:meetingId" element={<MeetingDetails />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </>
  )
}