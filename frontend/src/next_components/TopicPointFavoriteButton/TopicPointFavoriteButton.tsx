import { FC } from 'react'
import { Star } from '../../assets'
import { useCookies } from 'react-cookie'
import {
  useChangeFavoriteTopicPoint as useChangeFavoriteTopicPointHook,
  useGetRecentTopicPoints,
  useGetTopicPointsBySubjectTitle,
} from '../../next_api'
import { getCrumbsFromPathname, getCurrentUserId } from '../../utils'
import { TopicPoint } from '../'

interface TopicPointFavoriteButtonProps {
  selectedTopicPoint: TopicPoint
}

const TopicPointFavoriteButton: FC<TopicPointFavoriteButtonProps> = ({
  selectedTopicPoint,
}): JSX.Element => {
  const pathnameArray = getCrumbsFromPathname()

  const [cookie] = useCookies(['jwtToken'])

  const useChangeFavoriteTopicPoint = useChangeFavoriteTopicPointHook()

  const { mutateTopicPoints } = useGetTopicPointsBySubjectTitle(
    pathnameArray[0]
  )

  const { mutateRecentTopicPoints } = useGetRecentTopicPoints()

  const handleChangeFavoriteTopicPoint = async (): Promise<void> => {
    try {
      const response = await useChangeFavoriteTopicPoint({
        jwtToken: cookie.jwtToken,
        userId: getCurrentUserId(cookie.jwtToken),
        topicPointId: selectedTopicPoint?.topicPointId.toString() || '',
        favorite: selectedTopicPoint?.favorite === true ? 'true' : 'false',
      })
      if (response.statusCode === 200) {
        mutateTopicPoints()
        mutateRecentTopicPoints()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div onClick={() => handleChangeFavoriteTopicPoint()}>
      <Star
        className={`${
          selectedTopicPoint.favorite ? 'fill-red-500' : ''
        } w-8 h-8 stroke-red-500 cursor-pointer`}
      />
    </div>
  )
}

export default TopicPointFavoriteButton
