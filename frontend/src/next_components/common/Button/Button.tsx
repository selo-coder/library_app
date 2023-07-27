import { FC } from 'react'
import { Spinner } from '../../../assets'

interface ButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  label: string
}

const Comp: FC<ButtonProps> = ({
  onClick,
  loading = false,
  label,
  disabled = false,
}): JSX.Element => {
  return (
    <button
      disabled={disabled}
      className={
        'border-white hover:bg-slate-700 border h-8 flex flex-row justify-center items-center rounded gap-2 w-full mt-2'
      }
      onClick={() => onClick()}
    >
      {loading && (
        <Spinner className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white" />
      )}
      {label}
    </button>
  )
}

export default Comp
