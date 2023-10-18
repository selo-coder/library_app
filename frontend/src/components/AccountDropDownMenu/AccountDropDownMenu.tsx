import { usePathname, useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { ArrowDown, ArrowUp } from 'assets'
import { getCrumbsFromPathname, useBreakpoint } from 'utils'

interface AccountDropDownMenuProps {
  accountMenuPoints: { key: string; display: string }[]
}

const AccountDropDownMenu: FC<AccountDropDownMenuProps> = ({
  accountMenuPoints,
}): JSX.Element => {
  const router = useRouter()
  const [breakpoint] = useBreakpoint()
  const currentSelectedItem = getCrumbsFromPathname(usePathname())[1]

  const [showDropDown, setShowDropDown] = useState<boolean>(false)

  return breakpoint.width >= 768 ? (
    <div className="flex flex-row">
      {accountMenuPoints.map((item, index: number) => (
        <div className="flex flex-col gap-4" key={index}>
          <span
            onClick={() => {
              router.push('/account/' + item.key)
            }}
            className="px-4 lg:px-6 cursor-pointer lg:text-lg dark:text-brightModeColor text-darkModeColor hover:dark:text-red-500"
          >
            {item.display}
          </span>

          <div
            style={{ height: '2px' }}
            className={`w-full ${
              currentSelectedItem === item.key ? 'bg-red-500' : 'bg-gray-600'
            } rounded`}
          />
        </div>
      ))}
    </div>
  ) : (
    <div className={`w-full overflow-hidden flex flex-col`}>
      <div
        onClick={() => {
          setShowDropDown(!showDropDown)
        }}
        className={`py-4 px-4 cursor-pointer border-2 z-20 flex flex-row justify-between items-center dark:text-brightModeColor dark:border-brightModeColor dark:bg-darkModeColor text-darkModeColor border-darkModeColor bg-brightModeColor`}
      >
        <span>
          {
            accountMenuPoints.find(
              (menuPoint) => menuPoint.key === currentSelectedItem
            )?.display
          }
        </span>
        {showDropDown ? (
          <ArrowDown
            className={`dark:fill-brightModeColor fill-darkModeColor w-3 h-3`}
          />
        ) : (
          <ArrowUp
            className={`dark:fill-brightModeColor fill-darkModeColor w-3 h-3`}
          />
        )}
      </div>

      <div
        className={`${
          showDropDown ? 'h-[224px]' : 'h-0'
        } duration-250 px-4 mt-4 ease-in-out z-10 transition-[height]`}
      >
        {accountMenuPoints.length > 0 ? (
          <div className="flex flex-col gap-2">
            {accountMenuPoints.map((menuPoint, index: number) => (
              <span
                onClick={() => {
                  setShowDropDown(false)
                  router.push('/account/' + menuPoint.key)
                }}
                key={index}
                className={`${
                  currentSelectedItem === menuPoint.key && 'font-bold'
                } hover:underline cursor-pointer text-lg dark:text-brightModeColor text-darkModeColor`}
              >
                {menuPoint.display}
              </span>
            ))}
          </div>
        ) : (
          <span
            className={`dark:text-brightModeColor text-darkModeColor text-lg`}
          >
            Keine Themen vorhanden
          </span>
        )}
      </div>
    </div>
  )
}

export default AccountDropDownMenu
