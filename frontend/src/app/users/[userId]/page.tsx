'use client'

import {
  TopicSlider,
  TopicPoint,
  TopicPointList,
} from '../../../next_components'
import { useGetTopicPointsByUserId } from '../../../next_api'
import { getCurrentUserId } from '../../../utils'
import { useCookies } from 'react-cookie'

export default function Page({ params }: { params: { userId: string } }) {
  const { userTopicPointsList, isLoading } = useGetTopicPointsByUserId(
    params.userId
  )

  const [cookie] = useCookies(['jwtToken'])

  return !isLoading && userTopicPointsList.length > 0 ? (
    <div className=" py-8 flex flex-col items-center">
      <span
        className={`text-4xl mt-8 dark:text-brightModeColor text-darkModeColor`}
      >
        {getCurrentUserId(cookie.jwtToken) ===
        userTopicPointsList[0]?.topicPointList[0]?.userId.toString()
          ? 'Meine Beiträge'
          : 'Alle Beiträge von ' +
            userTopicPointsList[0]?.topicPointList[0]?.createdBy}
      </span>
      {userTopicPointsList.map(
        (userTopicPoint: TopicPointList, index: number) =>
          userTopicPoint.topicPointList.length > 0 && (
            <TopicSlider
              key={index}
              title={userTopicPoint.subjectTitle}
              topicPoints={userTopicPoint.topicPointList.map(
                (topicPoint: TopicPoint) => {
                  return {
                    ...topicPoint,
                    subjectTitle: userTopicPoint.subjectTitle,
                    subjectId: userTopicPoint.subjectId,
                  }
                }
              )}
            />
          )
      )}
    </div>
  ) : (
    <div className="flex flex-col py-8 text-center">
      <span
        className={`text-lg mt-8 dark:text-brightModeColor text-darkModeColor`}
      >
        Aktuell keine Beiträge
      </span>
    </div>
  )
}
