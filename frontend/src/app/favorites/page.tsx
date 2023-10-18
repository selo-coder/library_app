'use client'

import { useCookies } from 'react-cookie'
import { useGetFavoriteTopicPointsByUserId } from 'api'
import { TopicPoint, TopicPointList, TopicSlider } from 'components'
import { getCurrentUserId } from 'utils'

export default function Page() {
  const [cookie] = useCookies(['jwtToken'])

  const { favoriteTopicPointsList, isLoading } =
    useGetFavoriteTopicPointsByUserId(getCurrentUserId(cookie.jwtToken))

  return !isLoading && favoriteTopicPointsList.length > 0 ? (
    <div className=" py-8 flex flex-col items-center">
      <span
        className={`text-4xl mt-8 dark:ext-brightModeColor text-darkModeColor`}
      >
        Favorisierte Beiträge
      </span>
      {favoriteTopicPointsList.map(
        (favoriteTopicPoint: TopicPointList, index: number) =>
          favoriteTopicPoint.topicPointList.length > 0 && (
            <TopicSlider
              key={index}
              title={favoriteTopicPoint.subjectTitle}
              topicPoints={favoriteTopicPoint.topicPointList.map(
                (topicPoint: TopicPoint) => {
                  return {
                    ...topicPoint,
                    subjectTitle: favoriteTopicPoint.subjectTitle,
                    subjectId: favoriteTopicPoint.subjectId,
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
        Aktuell keine Favoriten
      </span>
    </div>
  )
}
