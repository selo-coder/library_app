import { FC, memo, useContext, useState } from 'react'
import {
  useBreakpoint,
  getCrumbsFromPathname,
  getCurrentSelectedTopic,
} from '../../utils'
import { ArrowDown, ArrowUp } from '../../assets'
import { usePathname, useRouter } from 'next/navigation'
import { NextAppContext, SortType, Topic } from '../'

import dynamic from 'next/dynamic'

const TopicsList = dynamic(() => import('./TopicsList'))

const TopicPointsList = dynamic(() => import('./TopicPointsList'))

const TopicsContent: FC = (): JSX.Element => {
  const { topicPointsList, topicList, subjectList } = useContext(NextAppContext)

  const pathnameArray = getCrumbsFromPathname(usePathname())
  const currentSelectedTopic = getCurrentSelectedTopic(pathnameArray)

  const [breakpoint] = useBreakpoint()
  const [showTopicsDropdown, setShowTopicsDropdown] = useState(false)
  const [showSortDropDown, setShowSortDropDown] = useState(false)
  const [selectedSortMethod, setSelectedSortMethod] =
    useState<SortType>('A - Z')

  const router = useRouter()

  const dropDownCount = topicList?.topicList?.length

  const getDropDownCount = (): string => {
    return dropDownCount === 0 || dropDownCount === 1 || !dropDownCount
      ? 'h-[80px]'
      : dropDownCount === 2
      ? 'h-[116px]'
      : dropDownCount === 3
      ? 'h-[152px]'
      : dropDownCount === 4
      ? 'h-[224px]'
      : dropDownCount === 5
      ? 'h-[260px]'
      : dropDownCount === 6
      ? 'h-[296px]'
      : dropDownCount === 7
      ? 'h-[332px]'
      : dropDownCount === 8
      ? 'h-[368px]'
      : ''
  }

  return (
    <div className="px-8 md:px-12 lg:px-20 xl:px-32 2xl:px-40 flex flex-col gap-8 py-8">
      {topicList && subjectList && breakpoint.width !== 0 && (
        <>
          {breakpoint.width <= 768 && (
            <div className={`w-full overflow-hidden flex flex-col`}>
              <div
                onClick={() => {
                  setShowTopicsDropdown(!showTopicsDropdown)
                }}
                className={`py-4 px-4 cursor-pointer border-2 z-20 flex flex-row justify-between items-center dark:text-brightModeColor dark:border-brightModeColor dark:bg-darkModeColor text-darkModeColor border-darkModeColor bg-brightModeColor`}
              >
                <span>{currentSelectedTopic}</span>
                {showSortDropDown ? (
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
                  showTopicsDropdown ? getDropDownCount() : 'h-0'
                } duration-250 px-4 mt-4 ease-in-out z-10 transition-[height]`}
              >
                <div
                  onClick={() => {
                    setShowTopicsDropdown(false)
                    router.push('/' + topicList.subjectTitle)
                  }}
                  className={`text-xl ${
                    currentSelectedTopic === topicList.subjectTitle &&
                    'font-bold'
                  } hover:underline w-full cursor-pointer dark:text-brightModeColor text-darkModeColor`}
                >
                  {topicList.subjectTitle}
                </div>
                <div className="py-3">
                  <div
                    style={{ height: '1px' }}
                    className={`w-full dark:bg-brightModeColor bg-darkModeColor rounded`}
                  />
                </div>

                {topicList?.topicList?.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {topicList.topicList.map((topic: Topic, index: number) => (
                      <span
                        onClick={() => {
                          setShowTopicsDropdown(false)

                          router.push(
                            '/' +
                              topicList.subjectTitle +
                              '/' +
                              topic.topicTitle
                          )
                        }}
                        key={index}
                        className={`${
                          currentSelectedTopic ===
                            topic.topicTitle.toString() && 'font-bold'
                        } hover:underline cursor-pointer text-lg dark:text-brightModeColor text-darkModeColor`}
                      >
                        {topic.topicTitle}
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
          )}

          <div className="w-full flex gap-4 flex-row justify-end">
            <button
              onClick={() => router.push('/createTopicPoint')}
              className={`dark:text-brightModeColor text-darkModeColor border-2 border-red-500 hover:bg-red-500 hover:text-white rounded p-2`}
            >
              Beitrag verfassen
            </button>
          </div>
          <div className="flex gap-10 md:gap-20 flex-row">
            {breakpoint.width > 768 && <TopicsList />}

            <TopicPointsList
              topicPointsList={topicPointsList}
              setShowSortDropDown={setShowSortDropDown}
              showSortDropDown={showSortDropDown}
              selectedSortMethod={selectedSortMethod}
              setSelectedSortMethod={setSelectedSortMethod}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default memo(TopicsContent)
