type CreateTopicPointProps = {
  jwtToken: string
  body: {
    userId: string
    topicId?: string
    topicTitle?: string
    topicPointTitle: string
    subjectId: string
    content: string
    createNewTopic: boolean
  }
}

export const createTopicPoint = async ({
  jwtToken,
  body,
}: CreateTopicPointProps) => {
  const requestBody = {
    userId: body.userId,
    topicPointTitle: body.topicPointTitle,
    subjectId: body.subjectId.toString(),
    content: body.content,
    createNewTopic: body.createNewTopic.toString(),
    ...(body.createNewTopic
      ? { topicTitle: body.topicTitle || '' }
      : { topicId: body.topicId?.toString() || '' }),
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/createTopicPoint/',
    {
      method: 'POST',
      keepalive: true,
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
