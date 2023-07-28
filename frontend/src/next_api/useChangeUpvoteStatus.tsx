import axios from 'axios'

type useChangeUpvoteStatusProps = {
  jwtToken: string
  userId: string
  userCommentId: string
}

export type GenericResponseType = {
  statusCode: number
  message?: string
}

export const useChangeUpvoteStatus = (): (({
  jwtToken,
  userCommentId,
  userId,
}: useChangeUpvoteStatusProps) => Promise<GenericResponseType>) => {
  return async ({
    jwtToken,
    userCommentId,
    userId,
  }: useChangeUpvoteStatusProps): Promise<GenericResponseType> => {
    const requestBody = {
      userCommentId,
      userId,
    }

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + '/changeUpvoteStatus/',
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
