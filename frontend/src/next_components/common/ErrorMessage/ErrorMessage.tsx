import { FC } from 'react'

interface ErrorMessageProps {
  errorMessages: string[]
}

const ErrorMessage: FC<ErrorMessageProps> = ({
  errorMessages,
}): JSX.Element => {
  return (
    <>
      {errorMessages?.length >= 1 && (
        <div className="flex flex-col gap-2 text-left text-xs border rounded p-2 border-slate-700">
          {errorMessages.map((errorMessage: string, index: number) => (
            <span key={index}>• {errorMessage}</span>
          ))}
        </div>
      )}
    </>
  )
}

export default ErrorMessage
