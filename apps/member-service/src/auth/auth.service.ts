import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { LoginUserDto } from './dto/login-user.dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    createUserDto = { ...createUserDto, password: hashedPassword };
    return this.authRepository.createUser(createUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.authRepository.getUser(email);
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return { success: false, message: 'Invalid credentials' };
    }

    const { password: _, ...userWithoutPassword } = user;

    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepository.saveRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: expiresAt,
    });

    return {
      success: true,
      token: accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async logout(userId: number, res: Response) {
    await this.authRepository.clearRefreshToken(userId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    return { message: 'Cookie Clear' };
  }
}
