import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { GenericResponseDto } from './dto/generic-response.dto/generic-response.dto';
import { LoginUserDto } from './dto/login-user.dto/login-user.dto';
import type { Response } from 'express';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 4 requests
  // have to implement passport js
  // /register
  // /login
  // /refresh-tokens
  // /authenticate

  @Post('register')
  async registerUsers(@Body() createUserDto: CreateUserDto) {
    const registeredUser = await this.authService.register(createUserDto);
    return new GenericResponseDto(
      true,
      'User Registered Successfully',
      registeredUser,
    );
  }

  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginUserDto);

    if (!result.success) {
      res.status(HttpStatus.UNAUTHORIZED);
      return new GenericResponseDto(
        false,
        result.message || 'Authentication failed',
      );
    }

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false, // process.env.NODE_ENV === 'production'
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return new GenericResponseDto(true, 'Login successful', {
      token: result.token,
      redirectUrl: '/',
    });
  }

  @Post('refresh-token')
  async refreshToken() {}

  @Post('logout')
  async logoutUser(@Body() id: string, @Res() res: Response) {
    await this.authService.logout(Number(id), res);
    return new GenericResponseDto(true, 'Logout Successful', {
      redirectUrl: '/login',
    });
  }
}
