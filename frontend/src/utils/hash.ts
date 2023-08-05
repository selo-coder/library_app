import SHA256 from 'crypto-js/sha256'

export const hash = (value: string) => {
  return SHA256(value).toString()
}
