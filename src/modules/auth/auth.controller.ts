import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginBodyDto } from './dto/login-body.dto';
import { SignupBodyDto } from './dto/signup-body.dto';
import { SignupResultDto } from './dto/signup-result.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post('login')
  async login(@Body() body: LoginBodyDto): Promise<{token: string}> {
    return await this.authService.login(body);
  }

  @Post('signup')
  async signup(@Body() body: SignupBodyDto): Promise<SignupResultDto> {
    return await this.authService.signup(body);
  }
}