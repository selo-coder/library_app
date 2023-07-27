import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'

export const useGetTopicPointsByUserId = (userId: string) => {
  const [cookies] = useCookies(['jwtToken'])

  const url = 'http://127.0.0.1:5000/getTopicPointsByUserId/?userId=' + userId

  const { data, error, isLoading, mutate } = useSWR(url, () =>
    fetcher(url, cookies.jwtToken)
  )

  return {
    userTopicPointsList: data?.topicPointList,
    isLoading,
    error,
    mutateUserTopicPoints: mutate,
  }
}
