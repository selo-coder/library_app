'use client'

import { useGetTopicPointsByUserId } from 'api'
import {
  NextAppContext,
  TopicPoint,
  TopicPointList,
  TopicSlider,
} from 'components'
import { useContext } from 'react'

export default function Page() {
  const { myUserId } = useContext(NextAppContext)
  const { userTopicPointsList } = useGetTopicPointsByUserId(myUserId)

  return userTopicPointsList && userTopicPointsList.length > 0 ? (
    <div className=" py-8 flex flex-col items-center">
      <span
        className={`text-4xl mt-8 dark:text-brightModeColor text-darkModeColor`}
      >
        {myUserId ===
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
        Aktuell keine eigenen Beiträge
      </span>
    </div>
  )
}
