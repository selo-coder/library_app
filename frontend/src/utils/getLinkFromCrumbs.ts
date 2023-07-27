export const getLinkFromCrumbs = (
  crumbs: { pathname: string; display: string }[],
  depth: number
): string => {
  return (
    '/' +
    crumbs
      .map((crumb) => crumb.pathname)
      .slice(0, depth)
      .join('/')
  )
}
