import { FC } from 'react'

interface InputProps {
  errorMessage?: string
  type?: string
  placeHolder?: string
  maxLength?: number
  className?: string
  disabled?: boolean
  value?: string
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  size?: 'small' | 'medium' | 'big'
}
const Input: FC<InputProps> = ({
  errorMessage = [],
  placeHolder,
  className,
  maxLength,
  type = 'text',
  value,
  disabled = false,
  onChange,
  onFocus,
  onBlur,
  size = 'medium',
}) => {
  return (
    <div className={className}>
      <span
        className={`text-xs text-black h-full ${!errorMessage ? 'hidden' : ''}`}
      >
        {errorMessage}
      </span>
      <input
        className={`w-full ${size === 'small' && 'h-10'} ${
          size === 'medium' && 'h-12'
        } ${
          size === 'big' && 'h-14'
        } bg-backgroundGray text-gray-500 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
        type={type}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        maxLength={maxLength || 100}
        placeholder={placeHolder}
        onChange={(e) => {
          onChange(e.currentTarget.value)
        }}
      />
    </div>
  )
}

export default Input
