import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginBodyDto } from './dto/login-body.dto';
import { SignupBodyDto } from './dto/signup-body.dto';
import { SignupResultDto } from './dto/signup-result.dto';
import { Profession } from '../../entities/profession.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

   @Get()
   async getAllProfessions(): Promise<Profession[]> {
    return await this.authService.getAllProfessions();
   }

  @Post('login')
  async login(@Body() body: LoginBodyDto): Promise<{token: string}> {
    return await this.authService.login(body);
  }

  @Post('signup')
  async signup(@Body() body: SignupBodyDto): Promise<SignupResultDto> {
    return await this.authService.signup(body);
  }
}