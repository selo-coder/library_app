import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'

export const useGetSearchResults = (searchText: string) => {
  const [cookies] = useCookies(['jwtToken'])
  const url =
    process.env.NEXT_PUBLIC_API_URL +
    '/getSearchResults/?searchText=' +
    searchText

  const { data, error, isLoading, mutate } = useSWR(url, () =>
    fetcher(url, cookies.jwtToken)
  )

  return {
    searchResults: data?.search_results,
    isLoading,
    error,
    mutateSearchResults: mutate,
  }
}
