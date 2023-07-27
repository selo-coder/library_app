import useSWR from 'swr'
import { fetcher } from './getFetcher'
import { useCookies } from 'react-cookie'

export const useGetCommentsByTopicPointId = (topicPointId?: string) => {
  const [cookies] = useCookies(['jwtToken'])

  const url = `http://185.237.15.64:5000/getCommentsByTopicPointId/?topicPointId=${topicPointId}`

  const { data, error, isLoading, mutate } = useSWR(
    topicPointId ? url : null,
    () => fetcher(url, cookies.jwtToken)
  )

  return {
    commentList: data?.commentList,
    isLoading,
    error,
    mutate,
  }
}
