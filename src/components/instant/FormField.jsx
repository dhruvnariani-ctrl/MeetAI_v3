import { forwardRef, useId } from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import OutlinedInput from '@mui/material/OutlinedInput'

export const inputSx = {
  borderRadius: '12px',
  bgcolor: '#fff',
  fontSize: '0.875rem',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cfd8e3' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9fb0c6' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: 2 },
  '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: 'error.main' },
  '& input': { py: '10px' },
  '& input::placeholder': { opacity: 1, color: 'text.secondary' },
}

export const labelSx = {
  display: 'block',
  mb: 0.75,
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'text.primary',
  '&.Mui-focused, &.Mui-error': { color: 'text.primary' },
}

// Label above the input, optional/required marker, helper or error text wired up with aria-describedby.
// labelFontSize: override the label size (e.g. '0.75rem' = 12px).
// inputAttrs: extra attributes for the native <input> (min, max, step...).
const FormField = forwardRef(function FormField(
  { label, optional, required, helper, error, startIcon, labelFontSize, inputAttrs, ...rest },
  ref,
) {
  const id = useId()
  const helperId = `${id}-help`
  return (
    <FormControl fullWidth required={required} error={error}>
      <FormLabel htmlFor={id} sx={{ ...labelSx, ...(labelFontSize && { fontSize: labelFontSize }) }}>
        {label}
        {optional && (
          <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary' }}> (optional)</Box>
        )}
      </FormLabel>
      <OutlinedInput
        {...rest}
        id={id}
        inputRef={ref}
        startAdornment={startIcon && <Box sx={{ display: 'flex', mr: 1, color: 'text.secondary' }}>{startIcon}</Box>}
        inputprops={{ 'aria-describedby': helper ? helperId : undefined, ...inputAttrs }}
        sx={inputSx}
      />
      {helper && (
        <FormHelperText id={helperId} role={error ? 'alert' : undefined} sx={{ mx: 0, mt: 0.75, fontSize: '0.75rem', color: error ? 'error.main' : 'text.secondary' }}>
          {helper}
        </FormHelperText>
      )}
    </FormControl>
  )
})

export default FormField