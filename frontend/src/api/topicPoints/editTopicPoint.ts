type EditTopicPointProps = {
  jwtToken: string
  body: {
    topicPointId: string
    topicId?: string
    topicTitle?: string
    topicPointTitle?: string
    content?: string
    subjectId?: string
    createNewTopic?: string
  }
}

export const editTopicPoint = async ({
  jwtToken,
  body,
}: EditTopicPointProps) => {
  const requestBody = {
    topicPointTitle: body.topicPointTitle,
    createNewTopic: body.createNewTopic === 'true' ? 'true' : 'false',
    ...(body.topicPointId && { topicPointId: body.topicPointId }),
    ...(body.topicId && { topicId: body.topicId.toString() }),
    ...(body.topicTitle && { topicTitle: body.topicTitle }),
    ...(body.subjectId && { subjectId: body.subjectId }),
    ...(body.content && { content: body.content }),
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/editTopicPoint/',
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
