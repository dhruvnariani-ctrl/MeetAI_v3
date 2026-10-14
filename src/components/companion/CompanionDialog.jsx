import { useEffect, useId, useRef, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import { SUGGESTIONS } from './companionEngine'

const NAVY = '#123A59'
const BLUE = '#0967B2'
const BORDER = '#DFE7EC'
const MUTED = '#5A7189'
const CHIP_COLORS = ['#1b8a55', '#2f6fe4', '#7a4de0', '#e8820c', '#d6336c']

function BotAvatar({ size = 28, imageSrc }) {
  return imageSrc ? (
    <Avatar src={imageSrc} alt="" sx={{ width: size, height: size, bgcolor: '#fff', border: `1px solid ${BORDER}` }} />
  ) : (
    <Box
      aria-hidden="true"
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        borderRadius: '50%',
        bgcolor: '#fff',
        color: BLUE,
        border: `1px solid ${BORDER}`,
        '& svg': { fontSize: size * 0.62 },
      }}
    >
      <SmartToyOutlinedIcon />
    </Box>
  )
}

function Bubble({ message, imageSrc, onAction }) {
  const bot = message.role === 'bot'

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end', justifyContent: bot ? 'flex-start' : 'flex-end' }}>
      {bot && <BotAvatar imageSrc={imageSrc} />}

      <Box sx={{ maxWidth: '82%', minWidth: 0 }}>
        <Box
          sx={{
            px: 1.4,
            py: 1,
            borderRadius: bot ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
            bgcolor: bot ? '#fff' : BLUE,
            color: bot ? NAVY : '#fff',
            border: bot ? `1px solid ${BORDER}` : 0,
            fontSize: '0.8125rem',
            lineHeight: 1.55,
            whiteSpace: 'pre-line',
            overflowWrap: 'anywhere',
          }}
        >
          <span style={visuallyHidden}>{bot ? 'Companion: ' : 'You: '}</span>
          {message.text}
        </Box>

        {bot && message.actions?.length > 0 && (
          <Stack direction="row" spacing={0.75} sx={{ mt: 0.75, flexWrap: 'wrap', rowGap: 0.75 }}>
            {message.actions.map((action) => (
              <Button
                key={action.label}
                size="small"
                variant="outlined"
                endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
                onClick={() => onAction(action)}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 650,
                  py: 0.25,
                  borderRadius: '8px',
                  color: BLUE,
                  borderColor: '#b9d4ea',
                  bgcolor: '#fff',
                  '&:hover': { borderColor: BLUE, bgcolor: '#EFF6FB' },
                }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  )
}

function Typing({ imageSrc }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end' }}>
      <BotAvatar imageSrc={imageSrc} />
      <Box
        role="status"
        sx={{
          display: 'flex',
          gap: 0.6,
          px: 1.5,
          py: 1.35,
          borderRadius: '12px 12px 12px 4px',
          bgcolor: '#fff',
          border: `1px solid ${BORDER}`,
          '@keyframes companionBlink': { '0%, 80%, 100%': { opacity: 0.25 }, '40%': { opacity: 1 } },
        }}
      >
        <span style={visuallyHidden}>Companion is typing</span>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            aria-hidden="true"
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: '#9fb0c6',
              animation: 'companionBlink 1s infinite',
              animationDelay: `${i * 0.15}s`,
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          />
        ))}
      </Box>
    </Stack>
  )
}

export default function CompanionDialog({ open, onClose, messages, busy, onSend, onAction, onReset, imageSrc ,isAtBottom = false}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const titleId = useId()
  const listRef = useRef(null)
  const [text, setText] = useState('')

  /* Keep the newest message in view. */
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, busy, open])

  const send = (value) => {
    const v = value.trim()
    if (!v || busy) return
    setText('')
    onSend(v)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      aria-labelledby={titleId}
      sx={{
        '& .MuiBackdrop-root': {
          bgcolor: 'rgba(18, 58, 89, .18)',
        },
        '& .MuiDialog-container': {
          alignItems: isAtBottom ? 'flex-start' : 'flex-end',
          justifyContent: 'flex-end',
        },
        '& .MuiDialog-paper': {
          m: 0,
          mr: fullScreen ? 0 : { sm: '27px' },
          mt: isAtBottom ? { xs: 0, sm: '104px' } : 0,
          mb: isAtBottom ? 0 : { sm: '104px' },
          width: fullScreen ? '100%' : 400,
          maxWidth: '100%',
          height: { xs: '100%', sm: 580 },
          maxHeight: {
            xs: '100%',
            sm: 'calc(100% - 130px)',
          },
          borderRadius: fullScreen ? 0 : '14px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
<Stack
  direction="row"
  spacing={1.25}
  sx={{ alignItems: 'center', px: 2,
    py: 1.5,
    bgcolor: '#e8f0fd',
    borderBottom: `1px solid ${BORDER}`,
    minHeight: 72,
    boxSizing: 'border-box', }}
>
  <BotAvatar size={38} imageSrc={imageSrc} />

  <Stack
    spacing={0.35}
    sx={{
      flex: 1,
      minWidth: 0,
      justifyContent: 'center',
    }}
  >
    <Typography
      id={titleId}
      component="h2"
      sx={{
        fontSize: '0.9375rem',
        fontWeight: 750,
        lineHeight: 1.3,
        color: NAVY,
      }}
    >
      MeetAI Companion
    </Typography>

    <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
      <Box
        aria-hidden="true"
        sx={{
          width: 7,
          height: 7,
          flexShrink: 0,
          borderRadius: '50%',
          bgcolor: '#1b8a55',
        }}
      />
      <Typography
        sx={{
          fontSize: '0.75rem',
          lineHeight: 1.4,
          color: MUTED,
        }}
      >
        Online · answers from your meetings
      </Typography>
    </Stack>
  </Stack>

  <Stack
    direction="row"
    spacing={0.25}
    sx={{ alignItems: 'center', flexShrink: 0 }}
  >
    <IconButton
      size="small"
      aria-label="Start a new chat"
      onClick={onReset}
      sx={{ color: MUTED }}
    >
      <RestartAltIcon fontSize="small" />
    </IconButton>

    <IconButton
      size="small"
      aria-label="Close"
      onClick={onClose}
      sx={{ color: MUTED }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  </Stack>
</Stack>

      {/* Messages */}
      <Stack
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        spacing={1.5}
        sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2, bgcolor: '#F7F9FB' }}
      >
        {messages.map((message) => (
          <Bubble key={message.id} message={message} imageSrc={imageSrc} onAction={onAction} />
        ))}
        {busy && <Typing imageSrc={imageSrc} />}
      </Stack>

{/* Suggestions */}
<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 0.75,
    px: 1.5,
    py: 1,
    borderTop: `1px solid ${BORDER}`,
  }}
>
  {SUGGESTIONS.map((label, i) => (
    <Chip
      key={label}
      label={label}
      size="small"
      variant="outlined"
      clickable
      disabled={busy}
      onClick={() => send(label)}
      sx={{
        width: '100%',
        minWidth: 0,
        fontSize: '0.75rem',
        fontWeight: 650,
        color: CHIP_COLORS[i % CHIP_COLORS.length],
        borderColor: CHIP_COLORS[i % CHIP_COLORS.length],
        bgcolor: '#fff',
        '& .MuiChip-label': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      }}
    />
  ))}
</Box>

      {/* Input */}
      <Box
        component="form"
        onSubmit={(e) => { e.preventDefault(); send(text) }}
        sx={{ display: 'flex', gap: 1, px: 1.5, pb: 1.5, pt: 0.25 }}
      >
        <OutlinedInput
          autoFocus
          fullWidth
          size="small"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about meetings, tasks, recordings…"
          inputProps={{ 'aria-label': 'Message the Companion', maxLength: 300 }}
          sx={{ borderRadius: '8px', fontSize: '0.8125rem', bgcolor: '#fff', '& input': { py: '9px' } }}
        />

        <IconButton
          type="submit"
          aria-label="Send message"
          disabled={!text.trim() || busy}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '8px',
            color: '#fff',
            bgcolor: BLUE,
            '&:hover': { bgcolor: '#075A9D' },
            '&.Mui-disabled': { bgcolor: '#dfe7ec', color: '#9fb0c6' },
          }}
        >
          <SendRoundedIcon sx={{ fontSize: 19 }} />
        </IconButton>
      </Box>
    </Dialog>
  )
}