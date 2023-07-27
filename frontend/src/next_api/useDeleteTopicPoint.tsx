import axios from 'axios'

type useDeleteTopicPointProps = {
  jwtToken: string
  topicPointId: string
}

export type GenericResponseType = {
  statusCode: number
  message?: string
}

export const useDeleteTopicPoint = (): (({
  jwtToken,
  topicPointId,
}: useDeleteTopicPointProps) => Promise<GenericResponseType>) => {
  return async ({
    jwtToken,
    topicPointId,
  }: useDeleteTopicPointProps): Promise<GenericResponseType> => {
    const requestBody = {
      topicPointId,
    }

    try {
      const registrationResponse = await axios.post(
        'http://192.168.0.172:5000/deleteTopicPoint/',
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
