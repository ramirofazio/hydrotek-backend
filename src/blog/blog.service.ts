import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePostDTO, DeletePostDTO, EditPostDTO } from "./blog.dto";
import { Response } from "../commonDTO";

@Injectable()
export class BlogService {
  /* eslint-disable */
  constructor(private prisma: PrismaService) {}
  /* eslint-enable */

  async isAdmin(userId: string) {
    const isValidUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: { select: { type: true } },
      },
    });
    if (!isValidUser || isValidUser.role.type !== "ADMIN") {
      throw new HttpException(
        `El usuario ${isValidUser.name} no esta habilitado para esta acción`,
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async getPosts() {
    const posts = await this.prisma.post.findMany();
    return posts;
  }

  async getPostDetail(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { postAssets: { select: { type: true, path: true } } },
    });
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

    await this.isAdmin(userId);

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
      await this.prisma.postAsset.createMany({ data: bulkAssets });
    }

    return {
      res: `post "${title}" creado con exito`,
      payload: post,
    };
  }

  async editPost(body: EditPostDTO) {
    const { newData, postId, userId, newAssets } = body;

    await this.isAdmin(userId);

    if (!Object.values(newData).length) {
      throw new HttpException(
        "No se recibieron datos que actualizar",
        HttpStatus.BAD_REQUEST
      );
    }

    const updatedPost = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...newData,
      },
    });

    // ? Hay una forma mas efectiva para updatear?
    if (newAssets.length) {
      const oldAssets = await this.prisma.postAsset.findMany({
        where: { postId },
      });
      oldAssets.map(async (a) => {
        await this.prisma.postAsset.delete({
          where: {
            postId,
            id: a.id,
          },
        });
      });

      const bulkAssets = newAssets.map((p) => {
        return { ...p, postId };
      });
      await this.prisma.postAsset.createMany({ data: bulkAssets });
    }

    return updatedPost;
  }
  async deletePost(body: DeletePostDTO) {
    const { userId, postId } = body;

    await this.isAdmin(userId);

    await this.prisma.post.delete({ where: { id: postId } });
    //await this.prisma.postAsset.deleteMany({ where: { postId:} }); onCascade
  }
}
