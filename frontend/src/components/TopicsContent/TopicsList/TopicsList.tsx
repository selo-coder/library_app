import { FC, memo, useContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { NextAppContext, Topic } from 'components'
import { getCrumbsFromPathname, getCurrentSelectedTopic } from 'utils'

const TopicsList: FC = (): JSX.Element => {
  const { topicList } = useContext(NextAppContext)

  const router = useRouter()

  const pathnameArray = getCrumbsFromPathname(usePathname())
  const currentSelectedTopic = getCurrentSelectedTopic(pathnameArray)

  return (
    <div className="flex flex-col w-96">
      <span
        onClick={() => {
          router.replace('/' + topicList.subjectTitle)
        }}
        className={`text-2xl ${
          currentSelectedTopic === topicList.subjectTitle && 'font-bold'
        } hover:underline cursor-pointer dark:text-brightModeColor text-darkModeColor`}
      >
        {topicList.subjectTitle}
      </span>
      <div className="py-6">
        <div
          style={{ height: '1px' }}
          className={`w-full dark:bg-brightModeColor bg-darkModeColor rounded`}
        />
      </div>

      {topicList?.topicList?.length > 0 ? (
        <div className="flex flex-col gap-6">
          {topicList.topicList.map((topic: Topic, index: number) => (
            <div
              onClick={() => {
                router.replace(
                  '/' + topicList.subjectTitle + '/' + topic.topicTitle
                )
              }}
              key={index}
              className={`${
                currentSelectedTopic?.toString() ===
                  topic.topicTitle.toString() && 'font-bold'
              } hover:underline cursor-pointer text-lg dark:text-brightModeColor text-darkModeColor`}
            >
              {topic.topicTitle}
            </div>
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
  )
}

export default memo(TopicsList)
