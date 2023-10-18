type ChangeUpvoteStatusProps = {
  jwtToken: string
  body: {
    userId: string
    userCommentId: string
  }
}

export const changeUpvoteStatus = async ({
  jwtToken,
  body,
}: ChangeUpvoteStatusProps) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/changeUpvoteStatus/',
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
