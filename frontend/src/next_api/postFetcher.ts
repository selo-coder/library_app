import axios from 'axios'

export const fetcher = (url: string, jwtToken: string, body: any) =>
  axios
    .post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtToken,
      },
    })
    .then((res) => res.data)
