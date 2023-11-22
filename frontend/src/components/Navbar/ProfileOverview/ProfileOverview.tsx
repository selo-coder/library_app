import { FC, useRef, useState } from 'react'
import { Person } from 'assets'
import { useOutsideAlerter } from 'utils'
import ProfileOverviewDropdown from '../ProfileOverviewDropdown'
import { useCookies } from 'react-cookie'
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'

const ProfileOverview: FC = (): JSX.Element => {
  const [cookie] = useCookies(['jwtToken'])
  const [showPersonSortDropDown, setShowPersonSortDropDown] =
    useState<boolean>(false)

  const divRef = useRef(null)
  useOutsideAlerter(divRef, setShowPersonSortDropDown, showPersonSortDropDown)

  return (
    <div
      ref={divRef}
      className={`overflow-x-clip h-32 px-4 flex z-30 overflow-y-visible`}
    >
      <div className="relative flex text-center z-30">
        <button
          className={`dark:bg-darkModeColor cursor-default flex flex-col items-center bg-brightModeColor text-xl h-full w-full absolute text-center items-end py-2 z-100 flex flex-row justify-end gap-2 z-30`}
        >
          <span
            onClick={() => {
              setShowPersonSortDropDown(!showPersonSortDropDown)
            }}
            className={`truncate text-xs cursor-pointer lg:text-sm 2xl:text-lg`}
          >
            <Person className="w-12 h-12 fill-red-500 rounded-full" />
          </span>
          {cookie && cookie.jwtToken && (
            <span className="text-xs text-darkModeColor dark:text-brightModeColor">
              Angemeldet als{' '}
              {(jwt_decode(cookie.jwtToken) as { user: string })?.user}
            </span>
          )}
        </button>
        <ProfileOverviewDropdown
          setShowPersonSortDropdown={setShowPersonSortDropDown}
          showPersonSortDropDown={showPersonSortDropDown}
        />
      </div>
    </div>
  )
}

export default ProfileOverview
