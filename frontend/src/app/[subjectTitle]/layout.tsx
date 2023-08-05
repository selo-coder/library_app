'use client'

import { getCrumbsFromPathname } from '../../utils'
import { Suspense, useContext, useEffect } from 'react'
import {
  useGetTopicsBySubjectTitle,
  useGetTopicPointsBySubjectTitle,
} from '../../next_api'
import { NextAppContext } from '../../next_components'
import { usePathname } from 'next/navigation'
import { Spinner } from '../../assets'

import dynamic from 'next/dynamic'

const TopicsContent = dynamic(
  () => import('../../next_components/TopicsContent')
)

export default function RootLayout({ children }: { children: JSX.Element }) {
  const pathnameArray = getCrumbsFromPathname(usePathname())

  const { setTopicPointsList, setTopicList } = useContext(NextAppContext)

  const {
    subjectId,
    subjectTitle,
    topicPointList,
    isLoading: isLoadingTopicPoints,
  } = useGetTopicPointsBySubjectTitle(pathnameArray[0])

  const { topicList, isLoading: isLoadingTopics } = useGetTopicsBySubjectTitle(
    pathnameArray[0]
  )

  useEffect(() => {
    if (topicPointList)
      setTopicPointsList({ subjectId, subjectTitle, topicPointList })
  }, [subjectId, subjectTitle, topicPointList])

  useEffect(() => {
    if (topicList) setTopicList({ subjectId, subjectTitle, topicList })
  }, [subjectId, subjectTitle, topicList])

  return pathnameArray.length >= 3 ? (
    <>{children}</>
  ) : !isLoadingTopics && !isLoadingTopicPoints ? (
    <Suspense
      fallback={
        <div className="w-full h-full flex justify-center py-40 items-center">
          <Spinner className="w-12 text-gray-200 animate-spin dark:text-gray-600 fill-white" />
        </div>
      }
    >
      <TopicsContent />
    </Suspense>
  ) : (
    <div className="w-full h-full flex justify-center py-40 items-center">
      <Spinner className="w-12 text-gray-200 animate-spin dark:text-gray-600 fill-white" />
    </div>
  )
}
