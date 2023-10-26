import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'

export const redirectToUserPage = (
  userId: string,
  myUserId: string,
  router: AppRouterInstance
) => {
  if (userId.toString() === myUserId) router.push('/myTopicPoints')
  else router.push('/users/' + userId)
}
