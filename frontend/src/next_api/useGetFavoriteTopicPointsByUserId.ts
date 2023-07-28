import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'

export const useGetFavoriteTopicPointsByUserId = (userId: string) => {
  const [cookies] = useCookies(['jwtToken'])

  const url =
    process.env.NEXT_PUBLIC_API_URL +
    '/getFavoriteTopicPointsByUserId/?userId=' +
    userId

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
