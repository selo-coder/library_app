import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'

export const useGetUserList = () => {
  const [cookies] = useCookies(['jwtToken'])

  const url = process.env.NEXT_PUBLIC_API_URL + '/getUserList/'

  const { data, error, isLoading, mutate } = useSWR(url, () =>
    fetcher(url, cookies.jwtToken)
  )

  return {
    userList: data?.userList,
    isLoading,
    error,
    mutateUserList: mutate,
  }
}
