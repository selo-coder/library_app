import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'

export const useGetTopicsBySubjectTitle = (subjectTitle: string) => {
  const [cookies] = useCookies(['jwtToken'])

  const url =
    'http://127.0.0.1:5000/getTopicsBySubjectTitle/?subjectTitle=' +
    subjectTitle

  const { data, error, isLoading, mutate } = useSWR(url, () =>
    fetcher(url, cookies.jwtToken)
  )

  return {
    topicList: data?.topicList,
    isLoading,
    error,
    mutateTopics: mutate,
  }
}
