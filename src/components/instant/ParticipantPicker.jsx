import { useEffect, useId, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { visuallyHidden } from '@mui/utils'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { labelSx, inputSx } from './FormField'

const avatarSx = { width: 36, height: 36, bgcolor: '#45586b', fontSize: '1rem' }

const DEFAULT_HINT = '(transcript & action items emailed to these people)'
const DEFAULT_NOTE = 'After the meeting, each participant receives their personalized transcript and the action items assigned to them.'

// labelFontSize: label size override. hint: grey text next to the label.
// note: text under the helper line; undefined = default sentence, null = hide it.
export default function ParticipantPicker({
  participants, onAdd, onRemove, searchDirectory,
  labelFontSize, hint = DEFAULT_HINT, note = DEFAULT_NOTE,
}) {
  const labelId = useId()
  const helpId = useId()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  // Debounced directory search; people already added are filtered out.
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return undefined }
    let cancelled = false
    const t = setTimeout(async () => {
      const found = await searchDirectory(query.trim())
      if (!cancelled) setResults(found.filter((p) => !participants.some((s) => s.email === p.email)))
    }, 250)
    return () => { cancelled = true; clearTimeout(t) }
  }, [query, searchDirectory, participants])

  return (
    <Box component="section" aria-labelledby={labelId}>
      <FormLabel id={labelId} component="h3" sx={{ ...labelSx, m: 0, mb: 1, ...(labelFontSize && { fontSize: labelFontSize }) }}>
        Participants{' '}
        <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary' }}>
          {hint}
        </Box>
      </FormLabel>

      <Box component="ul" role="list" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1 }}>
        {participants.map((p) => (
          <Box
            component="li"
            key={p.email}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, bgcolor: '#e9eef6', border: '1px solid #cdd7e4', borderRadius: '10px' }}
          >
            <Avatar sx={avatarSx} aria-hidden="true">{p.name.charAt(0)}</Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }} noWrap>{p.name}</Typography>
                {p.you && (
                  <Box component="span" sx={{ px: 0.75, borderRadius: '6px', bgcolor: '#c5d4e6', fontSize: '0.75rem', fontWeight: 600 }}>You</Box>
                )}
              </Box>
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }} noWrap>{p.email}</Typography>
            </Box>
            {p.you ? (
              <>
                <CheckIcon sx={{ fontSize: 18, mr: 0.5 }} aria-hidden="true" />
                <span style={visuallyHidden}>Always included</span>
              </>
            ) : (
              <IconButton size="small" aria-label={`Remove ${p.name}`} onClick={() => onRemove(p.email)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>

      <Autocomplete
        size="small"
        value={null}
        inputValue={query}
        onInputChange={(_, v) => setQuery(v)}
        options={results}
        filterOptions={(x) => x /* already filtered by the directory search */}
        getOptionLabel={(o) => o.name}
        isOptionEqualToValue={(a, b) => a.email === b.email}
        forcePopupIcon={false}
        noOptionsText={query.trim().length < 2 ? 'Type at least 2 characters' : 'No matching people'}
        onChange={(_, person) => { if (person) { onAdd(person); setQuery(''); setResults([]) } }}
        renderOption={({ key, ...props }, o) => (
          <Box component="li" key={key} {...props} sx={{ display: 'block !important' }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{o.name}</Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{o.email}</Typography>
          </Box>
        )}
        sx={{ mt: 1.25 }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search participants by name or email…"
            inputprops={{
              ...params.inputprops,
              'aria-label': 'Search participants by name or email',
              'aria-describedby': helpId,
            }}
            sx={{ '& .MuiOutlinedInput-root': { ...inputSx, py: '3px' } }}
          />
        )}
      />

      <Typography id={helpId} sx={{ mt: 1, fontSize: '0.78rem', color: 'text.secondary' }}>
        Search by name or email — results come from the Darwin employee directory.
      </Typography>
      {note && (
        <Typography sx={{ mt: 1, fontSize: '0.8125rem', color: 'text.secondary', lineHeight: 1.6 }}>{note}</Typography>
      )}
    </Box>
  )
}