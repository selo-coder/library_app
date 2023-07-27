'use client'

import { FC, memo, useRef } from 'react'
import { ArrowRight, Book, Cross } from '../../assets'
import { useBreakpoint, useOutsideAlerter } from '../../utils'
import { useRouter } from 'next/navigation'
import { Subject, SubjectList } from '../'

interface SidebarProps {
  setShowSideBar: (showSideBar: boolean) => void
  showSideBar: boolean
  subjectList: SubjectList
}

const Sidebar: FC<SidebarProps> = ({
  setShowSideBar,
  showSideBar,
  subjectList,
}): JSX.Element => {
  const [breakpoint] = useBreakpoint()
  const router = useRouter()
  const divRef = useRef(null)
  useOutsideAlerter(divRef, setShowSideBar, showSideBar)

  return (
    <div
      ref={divRef}
      className={`fixed h-screen  items-center duration-300 ease-in-out
        ${showSideBar ? 'translate-x-0' : 'translate-x-full'} ${
        breakpoint.width > 768 ? 'w-80' : 'w-screen'
      }  z-50 bg-red-500 right-0 border-l-4 top-0 border-black flex flex-row`}
    >
      {breakpoint.width > 768 && (
        <button
          className="h-32 rounded"
          onClick={() => setShowSideBar(!showSideBar)}
        >
          <ArrowRight className="w-10 h-10" />
        </button>
      )}
      <div className="w-full h-screen sticky flex gap-4  flex-col">
        {breakpoint.width < 768 && (
          <div className="w-full flex row justify-between p-3">
            <div className="flex flex-row items-center px-2 gap-3">
              <span className="font-bold text-xl text-white">Library App</span>
              <Book className="w-20 h-20 text-white stroke-white" />
            </div>
            <button
              className="h-10 w-10 self-start	 hover:bg-red-400 flex items-center justify-center text-white rounded"
              onClick={() => setShowSideBar(!showSideBar)}
            >
              <Cross />
            </button>
          </div>
        )}
        <div className="flex flex-col w-full overflow-hidden md:py-8 gap-6 md:gap-10 px-8 md:px-4">
          <span className="text-xl md:text-2xl font-bold">Fächer</span>
          <div
            style={{ height: '1px' }}
            className={`w-full bg-black rounded`}
          />
          {subjectList &&
            subjectList.map((subject: Subject, index: number) => (
              <div
                onClick={() => {
                  setShowSideBar(false)
                  router.push('/' + subject.subjectTitle)
                }}
                key={index}
                className="flex flex-row hover:underline cursor-pointer justify-between items-center "
              >
                <span> {subject.subjectTitle}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default memo(Sidebar)
