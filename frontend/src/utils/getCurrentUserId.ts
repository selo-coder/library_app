// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'

export const getCurrentUserId = (jwtToken: string): string => {
  return jwtToken
    ? (jwt_decode(jwtToken) as { userId: string }).userId.toString()
    : ''
}
