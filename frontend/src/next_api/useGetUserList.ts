import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'

export const useGetUserList = () => {
  const [cookies] = useCookies(['jwtToken'])

  const url = 'http://185.237.15.64:5000/getUserList/'

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
