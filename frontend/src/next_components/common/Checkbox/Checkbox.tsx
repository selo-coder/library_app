import { FC } from 'react'

interface CheckboxProps {
  label: string
  onCheck: (checked: boolean) => void
  color?: string
  checked?: boolean
}

const Checkbox: FC<CheckboxProps> = ({
  label,
  onCheck,
  color = 'accent-slate-700',
  checked = false,
}): JSX.Element => {
  return (
    <div className="flex gap-6 items-center">
      <input
        checked={checked}
        onChange={(event) => onCheck(event.target.checked)}
        type="checkbox"
        className={`${color} w-6 h-6 border-dark-500 cursor-pointer`}
      />
      {label && <span className="text-white">{label}</span>}
    </div>
  )
}

export default Checkbox
