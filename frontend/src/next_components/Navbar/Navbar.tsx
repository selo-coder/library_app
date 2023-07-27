'use client'

import { FC, memo, useContext, useEffect, useState } from 'react'
import { Book } from '../../assets'
import { useBreakpoint } from '../../utils'
import ProfileOverview from './ProfileOverview'
import NavbarItem from './NavbarItem'
import { useRouter } from 'next/navigation'
import { useGetSubjects } from '../../next_api'
import { NextAppContext, Sidebar, Subject } from '../'

const Navbar: FC = (): JSX.Element => {
  const [currentActiveNavbarItem, setCurrentActiveNavbarItem] =
    useState<number>(-1)

  const { subjectList, setSubjectList } = useContext(NextAppContext)

  const [showSideBar, setShowSideBar] = useState<boolean>(false)

  const [breakpoint] = useBreakpoint()

  const count =
    breakpoint.width >= 1800
      ? 5
      : breakpoint.width >= 1450
      ? 4
      : breakpoint.width >= 850
      ? 3
      : 2

  const router = useRouter()

  const { subjectList: list, isLoading } = useGetSubjects()

  useEffect(() => {
    if (!isLoading) setSubjectList(list)
  }, [list])

  return (
    <>
      {subjectList && (
        <Sidebar
          subjectList={subjectList}
          setShowSideBar={setShowSideBar}
          showSideBar={showSideBar}
        />
      )}

      <div
        className={`w-full h-32 flex z-40 flex-row justify-between dark:bg-darkModeColor bg-brightModeColor`}
      >
        <div
          onClick={() => router.push('/')}
          className="flex flex-row cursor-pointer justify-center items-center gap-3 ml-6"
        >
          <span className="font-bold text-xl text-red-500">Library App</span>
          <Book className="w-20 h-20 text-red-500 stroke-red-500" />
        </div>
        <ProfileOverview />
      </div>
      <div
        style={{ minHeight: '128px' }}
        className="w-full h-16 md:h-32 bg-red-500 shadow-md flex px-4 flex-row items-center text-white overflow-visible"
      >
        <div className="flex-1 flex-row h-full relative overflow-x-clip overflow-y-visible">
          {breakpoint.width !== 0 && (
            <div className="flex flex-row relative w-full h-full">
              {subjectList &&
                subjectList.map((subject: Subject, index: number) => {
                  return (
                    subjectList &&
                    index <= count && (
                      <NavbarItem
                        count={count + 1}
                        key={index}
                        onClickTopic={(
                          topicTitle: string,
                          subjectTitle: string
                        ) => {
                          router.push('/' + subjectTitle + '/' + topicTitle)
                        }}
                        index={index}
                        setCurrentActiveNavbarItem={setCurrentActiveNavbarItem}
                        currentActiveNavbarItem={currentActiveNavbarItem}
                        subject={subject}
                        onClick={(subjectTitle: string) =>
                          router.push('/' + subjectTitle)
                        }
                      />
                    )
                  )
                })}
              <div
                onClick={() => setShowSideBar(!showSideBar)}
                className="h-full relative w-full text-center cursor-pointer z-10 hover:underline"
              >
                <button
                  disabled={showSideBar}
                  className={
                    'text-xl h-full w-full flex flex-row text-center items-center flex flex-row justify-center gap-2 z-10 hover:bg-red-600 bg-red-500'
                  }
                >
                  <span
                    className={'truncate text-xs lg:text-sm hover:underline'}
                  >
                    {'Alle Fächer ➔'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default memo(Navbar)
