import { Person } from 'assets'

interface AuthHeadlineProps {
  showPersonIcon: boolean
  title: string
}

const AuthHeadline = ({
  showPersonIcon,
  title,
}: AuthHeadlineProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-2 px-8 items-center">
      {showPersonIcon && <Person className="w-32 h-32" />}
      <span className="text-2xl">{title}</span>
      <div style={{ height: '1px' }} className="w-full bg-white rounded" />
    </div>
  )
}

export default AuthHeadline
