import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'

export const useGetSubjects = () => {
  const [cookies] = useCookies(['jwtToken'])
  const url = 'http://127.0.0.1:5000/getSubjectList/'

  const { data, error, isLoading, mutate } = useSWR(url, () =>
    fetcher(url, cookies.jwtToken)
  )

  return {
    subjectList: data?.subjectList,
    isLoading,
    error,
    mutateSubjects: mutate,
  }
}
