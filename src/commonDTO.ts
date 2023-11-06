
export interface Response {
  res: string,
  payload: object
}

export interface Error {
  message: string | undefined
  name: string | undefined
  status: string | number | undefined
}