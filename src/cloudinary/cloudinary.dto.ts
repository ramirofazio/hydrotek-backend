
export interface DeleteOneProductImgDTO {
  productImgId: string;
  publicId: string
}

export interface DeletedImgsDTO {
  deleted_cloud: object;
  deleted_db: object;
}