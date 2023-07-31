type LoginProps = {
  email: string
  password: string
}

export const login = async ({ body }: { body: LoginProps }) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/auth/login/',
    {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  const data = await response.json()
  return {
    jwtToken: data?.jwt_token,
    message: data?.message,
    statusCode: response.status,
  }
}
