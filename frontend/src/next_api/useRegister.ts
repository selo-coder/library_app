import axios from 'axios'

type useRegisterProps = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type GenericResponseType = {
  statusCode: number
  message?: string
}

export const useRegister = (): (({
  email,
  password,
  firstName,
  lastName,
}: useRegisterProps) => Promise<GenericResponseType>) => {
  return async ({
    email,
    password,
    firstName,
    lastName,
  }: useRegisterProps): Promise<GenericResponseType> => {
    const requestBody = {
      email,
      password,
      firstName,
      lastName,
    }
    try {
      const registrationResponse = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + '/auth/register/',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
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
