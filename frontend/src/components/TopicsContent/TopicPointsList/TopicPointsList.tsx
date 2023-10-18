import { FC, useContext, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp } from 'assets'
import TopicPointCard from './TopicPointCard'
import {
  getCrumbsFromPathname,
  getCurrentSelectedTopic,
  useOutsideAlerter,
  sortMethods,
} from 'utils'
import {
  Pagination,
  NextAppContext,
  SortType,
  TopicPoint,
  TopicPointList,
} from 'components'
import { usePathname } from 'next/navigation'

interface TopicPointsListProps {
  title?: string
  topicPointsList: TopicPointList
  setShowSortDropDown: (value: boolean) => void
  showSortDropDown: boolean
  selectedSortMethod: SortType
  setSelectedSortMethod: (value: SortType) => void
}

const TopicPointsList: FC<TopicPointsListProps> = ({
  title,
  topicPointsList,
  setShowSortDropDown,
  showSortDropDown,
  selectedSortMethod,
  setSelectedSortMethod,
}): JSX.Element => {
  const { topicList } = useContext(NextAppContext)

  const pathnameArray = getCrumbsFromPathname(usePathname())

  const currentSelectedTopic = getCurrentSelectedTopic(pathnameArray)

  const [topicPointsPerPage] = useState<number>(3)
  const [currentPage, setCurrentPage] = useState<number>(0)

  const [actualTopicPointsList, setActualTopicPointsList] =
    useState<TopicPointList>({} as TopicPointList)

  const divRef = useRef(null)
  useOutsideAlerter(divRef, setShowSortDropDown, showSortDropDown)

  useEffect(() => {
    if (showSortDropDown && topicPointsList) {
      if (selectedSortMethod === 'Z - A') {
        setActualTopicPointsList({
          ...actualTopicPointsList,
          topicPointList: actualTopicPointsList.topicPointList.sort((a, b) =>
            a.topicPointTitle.toLowerCase() > b.topicPointTitle.toLowerCase()
              ? -1
              : 1
          ),
        })
      }
      if (selectedSortMethod === 'A - Z') {
        setActualTopicPointsList({
          ...actualTopicPointsList,
          topicPointList: actualTopicPointsList.topicPointList.sort((a, b) =>
            a.topicPointTitle.toLowerCase() > b.topicPointTitle.toLowerCase()
              ? 1
              : -1
          ),
        })
      }
      if (selectedSortMethod === 'Alt zuerst') {
        setActualTopicPointsList({
          ...actualTopicPointsList,
          topicPointList: actualTopicPointsList.topicPointList.sort(
            (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
          ),
        })
      }
      if (selectedSortMethod === 'Neu zuerst') {
        setActualTopicPointsList({
          ...actualTopicPointsList,
          topicPointList: actualTopicPointsList.topicPointList.sort(
            (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
          ),
        })
      }
      setShowSortDropDown(!showSortDropDown)
    }
  }, [selectedSortMethod])

  useEffect(() => {
    if (topicList && topicList.subjectTitle && currentSelectedTopic) {
      setActualTopicPointsList(
        currentSelectedTopic === topicList.subjectTitle
          ? topicPointsList
          : {
              ...topicPointsList,
              topicPointList: topicPointsList?.topicPointList?.filter(
                (topicPoint) =>
                  topicPoint.topicTitle === currentSelectedTopic.toString()
              ),
            }
      )
    }
    setCurrentPage(0)
  }, [currentSelectedTopic, topicPointsList])

  return (
    <div
      className={`flex flex-col w-full gap-8 h-full overflow-hidden ${
        actualTopicPointsList?.topicPointList?.length === 0
          ? 'pb-40'
          : actualTopicPointsList?.topicPointList?.length === 1
          ? 'pb-20'
          : ''
      }`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <p
            style={{ columnSpan: 'all' }}
            className={`dark:text-brightModeColor text-darkModeColor text-3xl xl:text-4xl`}
          >
            {title ? title : 'Beiträge aus ' + currentSelectedTopic}
          </p>
          <div className="flex flex-col self-start w-40 h-10" ref={divRef}>
            <div
              onClick={() => setShowSortDropDown(!showSortDropDown)}
              className={`dark:text-brightModeColor dark:bg-darkModeColor text-darkModeColor bg-brightModeColor flex cursor-pointer justify-center flex-row items-center z-20 gap-2`}
            >
              <span className="py-4 text-sm hover:underline">
                {selectedSortMethod && sortMethods.includes(selectedSortMethod)
                  ? selectedSortMethod
                  : 'Sortieren'}
              </span>
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
                !showSortDropDown ? 'translate-y-[-100%]' : 'translate-y-0'
              } flex flex-col duration-200 ease-in-out rounded z-10 justify-center text-center items-center bg-slate-200 border-lg border border-black`}
            >
              {sortMethods.map((method: SortType, index: number) => (
                <div key={index} className="flex flex-col w-full">
                  <span
                    onClick={() => {
                      setSelectedSortMethod(method)
                    }}
                    key={index}
                    className={`text-xs hover:bg-red-500 py-4 cursor-pointer w-full dark:bg-darkModeColor dark:text-brightModeColor bg-brightModeColor text-darkModeColor hover:text-white`}
                  >
                    {method}
                  </span>
                  <div
                    style={{ height: '1px' }}
                    className="w-full bg-black rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{ height: '1px' }}
          className={`dark:bg-brightModeColor bg-darkModeColor w-full bg-black rounded`}
        />
      </div>
      {topicList &&
      topicList?.topicList?.length > 0 &&
      actualTopicPointsList &&
      actualTopicPointsList?.topicPointList?.length > 0 ? (
        <div className="flex flex-col gap-8">
          {actualTopicPointsList?.topicPointList
            .slice(
              currentPage * topicPointsPerPage,
              (currentPage + 1) * topicPointsPerPage
            )
            .map((topicPoint: TopicPoint, index: number) => (
              <TopicPointCard
                key={index}
                topicPoint={topicPoint}
                actualTopicPointsList={actualTopicPointsList}
              />
            ))}
          {actualTopicPointsList &&
            actualTopicPointsList?.topicPointList &&
            actualTopicPointsList?.topicPointList?.length && (
              <Pagination
                arrayLength={actualTopicPointsList?.topicPointList?.length}
                itemsPerPage={topicPointsPerPage}
                currentPage={currentPage}
                setCurrentPage={(currentPage: number) =>
                  setCurrentPage(currentPage)
                }
              />
            )}
        </div>
      ) : (
        <span
          className={`text-lg dark:text-brightModeColor text-darkModeColor`}
        >
          Keine Beiträge vorhanden
        </span>
      )}
    </div>
  )
}

export default TopicPointsList
