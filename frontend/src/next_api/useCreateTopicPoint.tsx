import axios from 'axios'

type useCreateTopicPointProps = {
  jwtToken: string
  userId: string
  topicId?: string
  topicTitle?: string
  topicPointTitle: string
  subjectId: string
  content: string
  createNewTopic: boolean
}

export type GenericResponseType = {
  statusCode: number
  message?: string
}

type LoginResponseType = GenericResponseType

export const useCreateTopicPoint = (): (({
  jwtToken,
  userId,
  topicId,
  topicTitle,
  topicPointTitle,
  subjectId,
  content,
  createNewTopic,
}: useCreateTopicPointProps) => Promise<LoginResponseType>) => {
  return async ({
    jwtToken,
    userId,
    topicId,
    topicTitle,
    topicPointTitle,
    subjectId,
    content,
    createNewTopic,
  }: useCreateTopicPointProps): Promise<LoginResponseType> => {
    const requestBody = {
      userId,
      topicPointTitle,
      subjectId: subjectId.toString(),
      content,
      createNewTopic: createNewTopic.toString(),
      ...(createNewTopic
        ? { topicTitle: topicTitle || '' }
        : { topicId: topicId?.toString() || '' }),
    }

    try {
      const loginResponse = await axios.post(
        'http://185.237.15.64:5000/createTopicPoint/',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwtToken,
          },
        }
      )

      return {
        statusCode: loginResponse?.status,
        message: loginResponse?.data?.message,
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
