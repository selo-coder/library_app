import { FC, memo, useContext } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'
import { NextAppContext } from 'components'

interface ProfileOverviewDropdownProps {
  showPersonSortDropDown: boolean
  setShowPersonSortDropdown: (value: boolean) => void
}

const ProfileOverviewDropdown: FC<ProfileOverviewDropdownProps> = ({
  showPersonSortDropDown,
  setShowPersonSortDropdown,
}): JSX.Element => {
  const [, , removeCookie] = useCookies(['jwtToken'])
  const router = useRouter()

  const { setLoggedIn } = useContext(NextAppContext)

  return (
    <div
      className={`flex-col duration-200 min-w-[84px] flex z-10 ease-in-out dark:bg-darkModeColor bg-brightModeColor ${
        showPersonSortDropDown ? 'translate-y-[100%]' : 'translate-y-[-100%]'
      }`}
    >
      <div
        onClick={() => {
          setShowPersonSortDropdown(false)
          router.push('/account/')
        }}
        className={`dark:bg-darkModeColor dark:text-white dark:border-x-white border-t-white bg-brightModeColor text-black border-x-black border-t-black w-full flex flex-col gap-4 cursor-pointer border border-y-transparent pt-4 px-4 2xl:px-10`}
      >
        <span className="break-all text-center text-xs lg:text-sm">
          Account
        </span>
        <div>
          <div
            style={{ height: '1px' }}
            className="w-full flex z-50 bg-red-500 rounded"
          />
          <div
            style={{ height: '1px' }}
            className="w-full flex z-50 bg-red-500 rounded"
          />
        </div>
      </div>

      <div
        onClick={() => {
          setShowPersonSortDropdown(false)
          router.push('/favorites')
        }}
        className={`w-full flex flex-col gap-4 cursor-pointer border border-y-transparent pt-4 px-4 2xl:px-10 dark:bg-darkModeColor dark:text-white dark:border-x-white bg-brightModeColor text-black border-x-black`}
      >
        <span className="break-all text-center text-xs lg:text-sm">
          Favoriten
        </span>
        <div>
          <div
            style={{ height: '1px' }}
            className="w-full flex z-50 bg-red-500 rounded"
          />
          <div
            style={{ height: '1px' }}
            className="w-full flex z-50 bg-red-500 rounded"
          />
        </div>
      </div>

      <div
        onClick={() => {
          setShowPersonSortDropdown(false)
          router.push('/myTopicPoints')
        }}
        className={`w-full flex flex-col gap-4 cursor-pointer border border-y-transparent pt-4 px-4 2xl:px-10 dark:bg-darkModeColor dark:text-white dark:border-x-white bg-brightModeColor text-black border-x-black`}
      >
        <span className="break-all text-center text-xs lg:text-sm">
          Meine Beiträge
        </span>
        <div>
          <div
            style={{ height: '1px' }}
            className="w-full flex z-50 bg-red-500 rounded"
          />
          <div
            style={{ height: '1px' }}
            className="w-full flex z-50 bg-red-500 rounded"
          />
        </div>
      </div>

      <div
        onClick={() => {
          setShowPersonSortDropdown(false)
          removeCookie('jwtToken', { path: '/' })

          setLoggedIn(false)
          router.push('/auth/login')
        }}
        className={`dark:bg-darkModeColor dark:text-white dark:border-x-white dark:border-b-white bg-brightModeColor text-black border-x-black border-b-black w-full cursor-pointer border border-y-transparent py-4 px-4 2xl:px-10`}
      >
        <span className="break-all text-center text-xs lg:text-sm">
          Abmelden
        </span>
      </div>
    </div>
  )
}

export default memo(ProfileOverviewDropdown)
