import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { BlogService } from "./blog.service";
import {
  CreatePostDTO,
  EditPostDTO,
  DeletePostDTO,
  CreateCommmentDTO,
  DeleteCommentDTO,
  SavePostsDTO,
} from "./blog.dto";

@Controller("blog")
export class BlogController {
  /* eslint-disable */
  constructor(private blogService: BlogService) {}
  /* eslint-enable */
  @Get()
  getPosts() {
    return this.blogService.getPosts();
  }

  @Get("/:id")
  getPostDetail(@Param("id") id: string) {
    return this.blogService.getPostDetail(id);
  }

  @Post()
  createPost(@Body() body: CreatePostDTO) {
    return this.blogService.createPost(body);
  }

  @Put()
  editPost(@Body() body: EditPostDTO) {
    return this.blogService.editPost(body);
  }

  @Delete()
  deletePost(@Body() body: DeletePostDTO) {
    return this.blogService.deletePost(body);
  }

  @Post("/comment")
  uploadComment(@Body() data: CreateCommmentDTO) {
    return this.blogService.uploadComment(data);
  }

  @Delete("/comment")
  deleteComment(@Body() data: DeleteCommentDTO) {
    return this.blogService.deleteComment(data);
  }

  @Post("/savePost")
  savePost(@Body() data: SavePostsDTO) {
    return this.blogService.handleSavedPosts(data);
  } // post comments
}
