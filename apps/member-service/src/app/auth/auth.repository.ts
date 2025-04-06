import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { Prisma } from '@prisma/client';

interface RefreshToken {
  userId: number;
  token: string;
  expiresAt: Date;
}

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data,
        select: {
          id: true,
        },
      });

      return user;
    } catch (error) {
      console.log('[prisma error]', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`User with this email already exists`);
        }
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Invalid date format for dob. Please use a valid date format (ISO 8601)',
        );
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getUser(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          role: true,
          password: true,
          username: true,
          dob: true,
        },
      });
      return user;
    } catch (error) {
      console.log('[get user error]', error);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async saveRefreshToken(data: RefreshToken) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.refreshToken.deleteMany({ where: { userId: data.userId } });
        await tx.refreshToken.create({ data });
      });
    } catch (error) {
      console.log('[Failed to update refresh token]', error);
      throw new InternalServerErrorException('Could not save refresh token');
    }
  }

  async clearRefreshToken(userId: number) {
    try {
      const deletedRefreshToken = await this.prisma.refreshToken.deleteMany({
        where: { userId: userId },
      });

      return deletedRefreshToken;
    } catch (error) {
      console.log('[failed to clear refresh token]', error);
      throw new InternalServerErrorException('Failed to clear token');
    }
  }
}
