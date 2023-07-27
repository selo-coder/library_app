import { SHA256} from 'crypto-js'

export  const hash = (value: string) => {
    return SHA256(value).toString()
  }