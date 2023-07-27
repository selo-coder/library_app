import axios from 'axios'

type useCreateCommentProps = {
  jwtToken: string
  userId: string
  topicPointId: string
  comment: string
  imageBase64String?: string
}

export type GenericResponseType = {
  statusCode: number
  message?: string
}

export const useCreateComment = (): (({
  jwtToken,
  userId,
  topicPointId,
  comment,
  imageBase64String,
}: useCreateCommentProps) => Promise<GenericResponseType>) => {
  return async ({
    jwtToken,
    userId,
    topicPointId,
    comment,
    imageBase64String,
  }: useCreateCommentProps): Promise<GenericResponseType> => {
    const requestBody = {
      userId,
      topicPointId,
      comment,
      ...(imageBase64String && { imageBase64String }),
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/createComment/',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwtToken,
          },
        }
      )
      return {
        statusCode: response?.status,
        message: response?.data?.message,
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
