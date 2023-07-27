import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'
// eslint-disable-next-line camelcase
import { getCurrentUserId } from '../utils'

export const useGetRecentTopicPoints = () => {
  const [cookies] = useCookies(['jwtToken'])

  const url =
    'http://185.237.15.64:5000/getRecentTopicPoints/?userId=' +
    getCurrentUserId(cookies.jwtToken)

  const { data, error, isLoading, mutate } = useSWR(url, () =>
    fetcher(url, cookies.jwtToken)
  )

  return {
    recentTopicPointList: data?.recentTopicPointList,
    isLoading,
    error,
    mutateRecentTopicPoints: mutate,
  }
}
