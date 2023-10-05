export interface CreatePostDTO {
  title: string;
  text: string;
  postAssets?: PostAssetDTO[];
  userId: string;
}

export interface EditPostDTO {
  userId: string;
  text?: string;
  title?: string;
  postAssets?: PostAssetDTO[];
}

/* eslint-disable */
enum AssetType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}
/* eslint-enable */

export interface PostAssetDTO {
  path: string;
  postId?: string;
  type?: AssetType;
}
