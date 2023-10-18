type DeleteCommentProps = {
  jwtToken: string
  body: {
    userCommentId: string
  }
}

export const deleteComment = async ({ jwtToken, body }: DeleteCommentProps) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/deleteComment/',
    {
      method: 'POST',
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
