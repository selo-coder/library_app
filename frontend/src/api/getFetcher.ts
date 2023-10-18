export const fetcher = (url: string, jwtToken: string) =>
  fetch(url, {
    headers: {
      Authorization: 'Bearer ' + jwtToken,
    },
  }).then((res) => res.json())
