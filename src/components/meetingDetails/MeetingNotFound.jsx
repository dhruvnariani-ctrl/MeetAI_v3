import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'

import PageShell from '../PageShell'

export default function MeetingNotFound({ onBack }) {
  return (
    <PageShell
      title="Meeting not found"
      subtitle="We couldn't find the meeting you're looking for."
    >
      <Paper
        elevation={0}
        sx={{ border: '1px solid #dce3eb', borderRadius: 3, p: 3 }}
      >
        <Typography sx={{ fontSize: '.9rem', color: 'text.secondary', mb: 2 }}>
          The meeting may have been removed or is no longer available.
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={onBack}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Go back
        </Button>
      </Paper>
    </PageShell>
  )
}