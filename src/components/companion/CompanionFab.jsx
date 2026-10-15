
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'

export default function CompanionFab({
  onClick,
  imageSrc,
  open = false,
  isAtBottom = false,
  placement = 'floating',
}) {
  const inHeader = placement === 'header'

  return (
    <Box
      sx={{
        position: inHeader ? 'static' : 'fixed',
        right: { xs: 16, md: 27 },
        top: 'auto',
        bottom: inHeader
          ? 'auto'
          : isAtBottom
            ? { xs: 80, md: 90 }
            : { xs: 16, md: 27 },
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: inHeader
          ? 'auto'
          : (theme) => theme.zIndex.modal + 1,
        transition: inHeader ? 'none' : 'top 200ms ease, bottom 200ms ease',
      }}
    >
      <Paper
        aria-hidden="true"
        elevation={0}
        sx={{
          display: inHeader ? 'none' : { xs: 'none', sm: 'block' },
          px: 2,
          height: 32,
          lineHeight: '32px',
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'divider',
          fontSize: '0.875rem',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 14px rgba(11,37,69,.08)',
        }}
      >
        Ask your Companion
      </Paper>

      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Tooltip title="Ask your Companion">
          <Fab
            aria-label="Ask your Companion"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={onClick}
            sx={{
              width: inHeader ? 40 : 64,
              height: inHeader ? 40 : 64,
              color: 'primary.main',
              border: inHeader ? '1px solid #DCE8F3' : '3px solid #fff',
              background:
                'radial-gradient(circle at 30% 25%, #fff, #cfe0f5)',
              boxShadow: inHeader ? 'none' : '0 6px 20px rgba(11,37,69,.25)',
              transition: 'transform 200ms ease',
              '&:hover': {
                filter: 'brightness(.97)',
              },
            }}
          >
            {imageSrc ? (
              <Avatar
                src={imageSrc}
                alt=""
                sx={{
                  width: '100%',
                  height: '100%',
                }}
              />
            ) : (
              <SmartToyOutlinedIcon sx={{ fontSize: 30 }} />
            )}
          </Fab>
        </Tooltip>

        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: inHeader ? 2 : 4,
            right: inHeader ? 2 : 4,
            width: inHeader ? 11 : 14,
            height: inHeader ? 11 : 14,
            borderRadius: '50%',
            bgcolor: '#1b8a55',
            border: '2px solid #fff',
            pointerEvents: 'none',
          }}
        />
      </Box>
    </Box>
  )
}