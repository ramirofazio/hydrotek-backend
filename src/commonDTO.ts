
export interface Response {
  res: string,
  payload: object
}

export interface Error {
  message: string
  name: string
  status: string | number
}