import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'
import { getCurrentUserId } from '../utils'

export const useGetTopicPointsBySubjectTitle = (subjectTitle: string) => {
  const [cookies] = useCookies(['jwtToken'])

  const url = `http://192.168.0.172:5000/getTopicPointsBySubjectTitle/?subjectTitle=${subjectTitle}&userId=${getCurrentUserId(
    cookies.jwtToken
  )}`

  const { data, error, isLoading, mutate } = useSWR(url, () =>
    fetcher(url, cookies.jwtToken)
  )

  return {
    subjectId: data?.subjectId,
    subjectTitle: data?.subjectTitle,
    topicPointList: data?.topicPointList,
    isLoading,
    error,
    mutateTopicPoints: mutate,
  }
}
