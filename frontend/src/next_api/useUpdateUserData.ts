import axios from 'axios'

type useUpdateUserDataProps = {
  jwtToken: string
  userId: string
  oldPassword?: string
  newPassword?: string
  oldEmail?: string
  newEmail?: string
}

export type GenericResponseType = {
  statusCode: number
  message?: string
}

export const useUpdateUserData = (): (({
  jwtToken,
  oldPassword,
  newPassword,
  userId,
  newEmail,
  oldEmail,
}: useUpdateUserDataProps) => Promise<GenericResponseType>) => {
  return async ({
    jwtToken,
    oldPassword,
    newPassword,
    userId,
    newEmail,
    oldEmail,
  }: useUpdateUserDataProps): Promise<GenericResponseType> => {
    const requestBody = {
      userId,
      ...(oldPassword && newPassword && { oldPassword, newPassword }),
      ...(newEmail && oldEmail && { newEmail, oldEmail }),
    }

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + '/updateUserData/',
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
