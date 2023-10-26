import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'

export const useGetSuggestions = (searchText: string | undefined) => {
  const [cookies] = useCookies(['jwtToken'])
  const url =
    process.env.NEXT_PUBLIC_API_URL +
    '/getSuggestions/?searchText=' +
    searchText

  const { data, error, isLoading, mutate } = useSWR(
    searchText ? url : null,
    () => fetcher(url, cookies.jwtToken)
  )

  return {
    suggestionsList: data?.suggestions_List,
    isLoading,
    error,
    mutateSuggestions: mutate,
  }
}
