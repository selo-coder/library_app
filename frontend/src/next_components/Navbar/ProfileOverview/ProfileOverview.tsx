import { FC, useRef, useState } from 'react'
import { Person } from '../../../assets'

import ProfileOverviewDropdown from '../ProfileOverviewDropdown'
import { useOutsideAlerter } from '../../../utils'

const ProfileOverview: FC = (): JSX.Element => {
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
          onClick={() => {
            setShowPersonSortDropDown(!showPersonSortDropDown)
          }}
          className={`dark:bg-darkModeColor bg-brightModeColor text-xl h-full w-full absolute text-center items-end py-2 z-100 flex flex-row justify-end gap-2 z-30`}
        >
          <span className={`truncate text-xs lg:text-sm 2xl:text-lg `}>
            <Person className="w-12 h-12 fill-red-500 rounded-full" />
          </span>
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
