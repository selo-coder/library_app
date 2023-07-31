import { FC, useRef, useState } from 'react'
import { Trash } from '../../assets'
import {
  deleteTopicPoint,
  useGetRecentTopicPoints,
  useGetSubjects,
  useGetTopicPointsBySubjectTitle,
  useGetTopicsBySubjectTitle,
} from '../../next_api'
import { useCookies } from 'react-cookie'
import { getCrumbsFromPathname, useOutsideAlerter } from '../../utils'
import { useRouter } from 'next/navigation'
import { TopicPoint } from '../'

interface TopicPointDeletionButtonProps {
  selectedTopicPoint: TopicPoint
}

const TopicPointDeletionButton: FC<TopicPointDeletionButtonProps> = ({
  selectedTopicPoint,
}): JSX.Element => {
  const router = useRouter()

  const pathnameArray = getCrumbsFromPathname()

  const [showDeleteTopicPointModal, setShowDeleteTopicPointModal] =
    useState<boolean>(false)

  const [cookie] = useCookies(['jwtToken'])

  const divRef = useRef(null)
  useOutsideAlerter(
    divRef,
    setShowDeleteTopicPointModal,
    showDeleteTopicPointModal
  )

  const { mutateRecentTopicPoints } = useGetRecentTopicPoints()
  const { mutateSubjects } = useGetSubjects()
  const { mutateTopicPoints } = useGetTopicPointsBySubjectTitle(
    pathnameArray[0]
  )
  const { mutateTopics } = useGetTopicsBySubjectTitle(pathnameArray[0])

  const handleDeleteTopicPoint = async (): Promise<void> => {
    try {
      const response = await deleteTopicPoint({
        jwtToken: cookie.jwtToken,
        body: {
          topicPointId: selectedTopicPoint?.topicPointId.toString() || '',
        },
      })
      if (response.statusCode === 200 && pathnameArray[0] && pathnameArray[1]) {
        mutateRecentTopicPoints()
        mutateSubjects()
        mutateTopicPoints()
        mutateTopics()

        router.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      ref={divRef}
      className="flex flex-col gap-2 items-end"
      onClick={() => setShowDeleteTopicPointModal(!showDeleteTopicPointModal)}
    >
      <Trash className={`w-8 h-8 stroke-red-500 cursor-pointer`} />
      {showDeleteTopicPointModal && (
        <div className="mt-10 absolute bg-darkModeColor px-2 w-48 h-48 border-2 border-red-500">
          <div className="w-full h-2/3 text-center bg-darkModeColor py-2 flex flex-col text-white justify-around">
            <span>Diesen Beitrag löschen ?</span>
            <span className="text-xs">
              Daten können nicht wiederhergestellt werden
            </span>
          </div>
          <div
            style={{ height: '1px' }}
            className={`w-full rounded dark:bg-brightModeColor bg-darkModeColor`}
          />
          <div className="w-full bg-darkModeColor flex flex-row px-2 py-3 justify-around items-center text-xs text-white">
            <button
              onClick={() => handleDeleteTopicPoint()}
              className="border border-red-500 rounded p-2 hover:bg-red-500"
            >
              Bestätigen
            </button>
            <button
              onClick={() => setShowDeleteTopicPointModal(false)}
              className="border border-red-500 rounded p-2 hover:bg-red-500"
            >
              Abbruch
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TopicPointDeletionButton
