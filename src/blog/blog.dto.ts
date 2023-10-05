export interface CreatePostDTO {
  title: string;
  text: string;
  postAssets?: PostAssetDTO[];
  userId: string;
}

export interface EditPostDTO {
  userId: string;
  postId: string;
  newData: {
    text?: string;
    title?: string;
  };
  newAssets?: PostAssetDTO[];
}

/* eslint-disable */
enum AssetType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}
/* eslint-enable */

export interface PostAssetDTO {
  id?: number;
  path: string;
  postId?: string;
  type?: AssetType;
}
