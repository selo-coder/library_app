import { FC } from 'react'

interface TextareaInputProps {
  content: string
  setContent: (content: string) => void
  size?: 'big' | 'small'
}

const TextareaInput: FC<TextareaInputProps> = ({
  content,
  setContent,
  size = 'big',
}): JSX.Element => {
  return (
    <textarea
      style={{ minHeight: '75px' }}
      className={size === 'big' ? 'h-96 w-full p-1' : 'p-1 h-64 w-full'}
      value={content}
      onChange={(e) => setContent(e.currentTarget.value)}
    />
  )
}

export default TextareaInput
