import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'

export const useGetTopicPointsByUserId = (userId: string) => {
  const [cookies] = useCookies(['jwtToken'])

  const url =
    process.env.NEXT_PUBLIC_API_URL +
    '/getTopicPointsByUserId/?userId=' +
    userId

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
