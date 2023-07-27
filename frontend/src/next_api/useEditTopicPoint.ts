import axios from 'axios'

type useEditTopicPointProps = {
  jwtToken: string
  topicPointId: string
  topicId?: string
  topicTitle?: string
  topicPointTitle?: string
  content?: string
  subjectId?: string
  createNewTopic?: string
}

export type GenericResponseType = {
  statusCode: number
  message?: string
}

export const useEditTopicPoint = (): (({
  jwtToken,
  topicPointId,
  topicId,
  topicTitle,
  topicPointTitle,
  content,
  subjectId,
  createNewTopic,
}: useEditTopicPointProps) => Promise<GenericResponseType>) => {
  return async ({
    jwtToken,
    topicPointId,
    topicId,
    topicTitle,
    topicPointTitle,
    content,
    subjectId,
    createNewTopic = 'false',
  }: useEditTopicPointProps): Promise<GenericResponseType> => {
    const requestBody = {
      topicPointTitle,
      createNewTopic,
      ...(topicPointId && { topicPointId }),
      ...(topicId && { topicId: topicId.toString() }),
      ...(topicTitle && { topicTitle }),
      ...(subjectId && { subjectId }),
      ...(content && { content }),
    }

    try {
      const registrationResponse = await axios.post(
        'http://192.168.0.172:5000/editTopicPoint/',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwtToken,
          },
        }
      )
      return {
        statusCode: registrationResponse?.status,
        message: registrationResponse?.data?.message,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        statusCode: error?.response?.status || 500,
        message: error?.response?.data?.message,
      }
    }
  }
}
