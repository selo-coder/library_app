import { FC, useEffect } from 'react'
import { Moon, Sun } from '../../assets/'

interface FooterProps {
  darkModeActive: boolean | undefined
  setDarkModeActive: (active: boolean) => void
}

const Footer: FC<FooterProps> = ({
  darkModeActive,
  setDarkModeActive,
}): JSX.Element => {
  const handleSetDarkMode = (): void => {
    if (localStorage.theme === 'light') {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setDarkModeActive(true)
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setDarkModeActive(false)
    }
  }

  useEffect(() => {
    setDarkModeActive(localStorage.theme === 'dark' ? true : false)
  }, [])

  return (
    <>
      <div className="w-full mt-auto justify-self-end py-12"></div>
      <div className="w-full overflow-hidden bg-red-500 bottom-0 p-6">
        <div className="flex flex-row w-full justify-between items-center text-sm">
          <span className="dark:text-darkModeColor text-brightModeColor">
            by Selahattin Yesilöz
          </span>

          {darkModeActive !== undefined && (
            <div
              className={`h-8 w-16 dark:bg-darkModeColor bg-brightModeColor rounded-full cursor-pointer flex`}
              onClick={() => handleSetDarkMode()}
            >
              <div
                className={`h-8 w-8 bg-red-500 duration-300 flex items-center justify-center ease-in-out border-2 dark:border-darkModeColor border-brightModeColor rounded-full dark:translate-x-full translate-x-0`}
              >
                {darkModeActive ? <Moon /> : <Sun />}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Footer
