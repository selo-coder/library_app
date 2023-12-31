import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'
import { getCurrentUserId } from 'utils'

export const useGetTopicPointsBySubjectTitle = (subjectTitle: string) => {
  const [cookies] = useCookies(['jwtToken'])

  const url =
    process.env.NEXT_PUBLIC_API_URL +
    `/getTopicPointsBySubjectTitle/?subjectTitle=${subjectTitle}&userId=${getCurrentUserId(
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
