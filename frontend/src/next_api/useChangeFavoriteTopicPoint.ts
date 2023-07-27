import axios from 'axios'

type useChangeFavoriteTopicPointProps = {
  jwtToken: string
  userId: string
  topicPointId: string
  favorite: string
}

export type GenericResponseType = {
  statusCode: number
  message?: string
}

export const useChangeFavoriteTopicPoint = (): (({
  jwtToken,
  userId,
  topicPointId,
  favorite,
}: useChangeFavoriteTopicPointProps) => Promise<GenericResponseType>) => {
  return async ({
    jwtToken,
    userId,
    topicPointId,
    favorite,
  }: useChangeFavoriteTopicPointProps): Promise<GenericResponseType> => {
    const requestBody = {
      jwtToken,
      userId,
      topicPointId,
      favorite,
    }
    try {
      const registrationResponse = await axios.post(
        'http://192.168.0.172:5000/changeFavoriteTopicPoint/',
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
