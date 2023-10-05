
export interface CreatePostDTO {
  title: string,
  text: string,
  postAssets?: string[],
  userId: string,
}