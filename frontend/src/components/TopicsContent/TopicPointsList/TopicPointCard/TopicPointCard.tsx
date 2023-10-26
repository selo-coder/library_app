import { FC, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { NextAppContext, TopicPoint, TopicPointList } from 'components'
import { redirectToUserPage } from 'utils'

interface TopicPointCardProps {
  topicPoint: TopicPoint
  actualTopicPointsList: TopicPointList
}

const TopicPointCard: FC<TopicPointCardProps> = ({
  topicPoint,
  actualTopicPointsList,
}): JSX.Element => {
  const router = useRouter()
  const { myUserId } = useContext(NextAppContext)

  return (
    <div className="border-4 px-4 py-4 flex gap-3 flex-col bg-red-500 rounded-md border-red-600">
      <div className="flex flex-row items-center gap-2">
        <span className="min-w-fit text-white text-lg">
          {topicPoint.topicPointTitle}
        </span>
        <div style={{ height: '1px' }} className="w-full bg-white rounded" />
      </div>
      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row justify-between">
        <span
          onClick={() =>
            redirectToUserPage(topicPoint.userId, myUserId, router)
          }
          className={`hover:underline cursor-pointer`}
        >
          Erstellt von: {topicPoint.createdBy}
        </span>
        <span> {topicPoint.createdAt}</span>
        <span
          onClick={() =>
            router.push(
              '/' +
                actualTopicPointsList.subjectTitle +
                '/' +
                topicPoint.topicTitle +
                '/' +
                topicPoint.topicPointTitle
            )
          }
          className="text-white hover:underline cursor-pointer"
        >
          Anzeigen ➔
        </span>
      </div>
    </div>
  )
}

export default TopicPointCard
