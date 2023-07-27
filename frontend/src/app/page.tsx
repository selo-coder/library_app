'use client'

import { TopicSlider } from '../next_components/'
import { useGetRecentTopicPoints } from '../next_api'

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
