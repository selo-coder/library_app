'use client'

import { useGetRecentTopicPoints } from 'api'
import dynamic from 'next/dynamic'

const TopicSlider = dynamic(() => import('../components/TopicSlider'))

export default function Home() {
  const { recentTopicPointList } = useGetRecentTopicPoints()
  return (
    recentTopicPointList && (
      <TopicSlider
        title={'Neueste Beiträge'}
        topicPoints={recentTopicPointList}
      />
    )
  )
}
