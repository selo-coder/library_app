import { usePathname } from 'next/navigation'

export const getCrumbsFromPathname = (locationPathname?: string) => {
  return locationPathname
    ? locationPathname
        .split('/')
        .splice(1, 5)
        .filter((value: string) => value !== '')
    : usePathname()
        .split('/')
        .splice(1, 5)
        .filter((value: string) => value !== '')
}
