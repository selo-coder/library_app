type RegisterProps = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export const register = async ({ body }: { body: RegisterProps }) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/auth/register/',
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
    message: data?.message,
    statusCode: response.status,
  }
}
