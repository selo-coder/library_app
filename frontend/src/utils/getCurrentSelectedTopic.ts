export const getCurrentSelectedTopic = (pathnameArray: string[]): string => {
  return decodeURIComponent(pathnameArray[pathnameArray.length - 1])
}
