type DeleteTopicPointProps = {
  jwtToken: string
  body: {
    topicPointId: string
  }
}

export const deleteTopicPoint = async ({
  jwtToken,
  body,
}: DeleteTopicPointProps) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/deleteTopicPoint/',
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
