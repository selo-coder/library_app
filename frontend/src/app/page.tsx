'use client'

import { useGetRecentTopicPoints } from '../next_api'
import dynamic from 'next/dynamic'

const TopicSlider = dynamic(() => import('../next_components/TopicSlider'))

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
