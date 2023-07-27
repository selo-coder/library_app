import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'

export const useGetFavoriteTopicPointsByUserId = (userId: string) => {
  const [cookies] = useCookies(['jwtToken'])

  const url =
    'http://192.168.0.172:5000/getFavoriteTopicPointsByUserId/?userId=' + userId

  const { data, error, isLoading, mutate } = useSWR(url, () =>
    fetcher(url, cookies.jwtToken)
  )

  return {
    favoriteTopicPointsList: data?.favoriteTopicList,
    isLoading,
    error,
    mutateFavoriteTopicPoints: mutate,
  }
}
