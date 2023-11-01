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

export interface DeletePostDTO {
  userId: string;
  postId: string;
}

export interface CreateCommmentDTO {
  comment: string;
  postId: string;
  userId: string;
}

export interface DeleteCommentDTO {
  commentId: number;
  userId: string;
}

export interface SavePostsDTO {
  userId: string;
  postIds: string[];
}