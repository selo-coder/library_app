import React from 'react'

interface HighlightTextProps {
  fullText: string
  highlightText: string
}

const HighlightText: React.FC<HighlightTextProps> = ({
  fullText,
  highlightText,
}) => {
  const index = fullText.toLowerCase().indexOf(highlightText.toLowerCase())

  if (index === -1) {
    return <span>{fullText}</span>
  } else {
    const beforeText = fullText.substring(0, index)
    const highlightedText = fullText.substring(
      index,
      index + highlightText.length
    )
    const afterText = fullText.substring(index + highlightText.length)

    return (
      <span>
        {beforeText}
        <strong>{highlightedText}</strong>
        {afterText}
      </span>
    )
  }
}

export default HighlightText
