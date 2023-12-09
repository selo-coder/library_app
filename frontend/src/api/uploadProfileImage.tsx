type UploadProfileImageProps = {
  jwtToken: string
  body: {
    userId: string
    imageBase64String?: string
  }
}

export const uploadProfileImage = async ({
  jwtToken,
  body,
}: UploadProfileImageProps) => {
  const requestBody = {
    userId: body.userId,
    ...(body.imageBase64String && {
      imageBase64String: body.imageBase64String,
    }),
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/uploadProfileImage/',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + jwtToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  )

  const data = await response.json()

  return {
    message: data?.message,
    statusCode: response.status,
  }
}
