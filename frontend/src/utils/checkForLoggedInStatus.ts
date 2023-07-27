import { useCookies } from 'react-cookie'
// eslint-disable-next-line camelcase
import jwt_decode, { JwtPayload } from 'jwt-decode'
import { usePathname } from 'next/navigation'

export const checkForLoggedInStatus = (): void => {
  const [cookie] = useCookies(['jwtToken'])

  const loggedIn =
    cookie &&
    cookie?.jwtToken &&
    Math.floor(Date.now() / 1000) <
      ((jwt_decode(cookie?.jwtToken) as JwtPayload)?.exp || 0)

  const pathname = usePathname()

  if (loggedIn && pathname.includes('auth')) window.location.href = '/'
  else if (!loggedIn && !pathname.includes('auth'))
    window.location.href = '/auth/'
}
