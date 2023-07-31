type CreateCommentProps = {
  jwtToken: string
  body: {
    userId: string
    topicPointId: string
    comment: string
    imageBase64String?: string
  }
}

export const createComment = async ({ jwtToken, body }: CreateCommentProps) => {
  const requestBody = {
    userId: body.userId,
    topicPointId: body.topicPointId,
    comment: body.comment,
    ...(body.imageBase64String && {
      imageBase64String: body.imageBase64String,
    }),
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/createComment/',
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
