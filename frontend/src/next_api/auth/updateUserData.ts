type UpdateUserDataProps = {
  jwtToken: string
  body: {
    userId: string
    oldPassword?: string
    newPassword?: string
    oldEmail?: string
    newEmail?: string
  }
}

export const updateUserData = async ({
  jwtToken,
  body,
}: UpdateUserDataProps) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/updateUserData/',
    {
      method: 'POST',
      keepalive: true,
      headers: {
        Authorization: 'Bearer ' + jwtToken,
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
