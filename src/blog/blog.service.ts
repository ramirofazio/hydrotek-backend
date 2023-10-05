import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePostDTO } from "./blog.dto";
import { Response } from "../commonDTO";

@Injectable()
export class BlogService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  async getPosts() {
    const posts = await this.prisma.post.findMany();
    return posts;
  }

  async getPostDetail(postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new HttpException(
        `no se encontro ningun post con el id: ${postId}`,
        HttpStatus.NOT_FOUND
      );
    }
    return post;
  }

  async createPost(body: CreatePostDTO): Promise<Response> {
    const { userId, text, title, postAssets } = body;

    const isValidUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: { select: { type: true } },
      },
    });

    if (!isValidUser || isValidUser.role.type !== "ADMIN") {
      throw new HttpException(
        "Usuario no autorizado a crear posts",
        HttpStatus.UNAUTHORIZED
      );
    }

    const post = await this.prisma.post.create({
      data: {
        title,
        text,
        userId,
      },
    });

    if (postAssets?.length) {
      const bulkAssets = postAssets.map((p) => {
        return { ...p, postId: post.id };
      });
      console.log(bulkAssets);
      await this.prisma.postAsset.createMany({ data: bulkAssets });
    }

    return {
      res: `post "${title}" creado con exito`,
      payload: post,
    };
  }

  // async editPost() {

  // }
  // async deletePost() {

  // }
}
