import axios from 'axios'

type useRegisterProps = {
  email: string
  password: string
}

export type GenericResponseType = {
  statusCode: number
  message?: string
}

type LoginResponseType = GenericResponseType & { jwtToken: string }

export const useLogin = (): (({
  email,
  password,
}: useRegisterProps) => Promise<LoginResponseType>) => {
  return async ({
    email,
    password,
  }: useRegisterProps): Promise<LoginResponseType> => {
    const requestBody = {
      email,
      password,
    }

    try {
      const loginResponse = await axios.post(
        'http://127.0.0.1:5000/auth/login/',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        statusCode: loginResponse?.status,
        message: loginResponse?.data?.message,
        jwtToken: loginResponse?.data?.jwt_token,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        statusCode: error?.response?.status || 500,
        message: error?.response?.data?.message,
        jwtToken: error?.response?.data?.jwt_token,
      }
    }
  }
}
