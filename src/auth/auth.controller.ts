import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req } from '@nestjs/common';
import { SignInReqDTO, SignInResDTO } from './dtos/auth.signin.DTO';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { SignUpReqDTO } from './dtos/auth.signup.DTO';
import { AcceptedStatus } from './decorators/status.decorator';
import { UserStatus } from '../api/users/enums/user-status.enum';
import { StatusDTO } from '../global/models/dtos/status.dto';
import { JWT_Data } from './types/jwt-data.type';
import { PasswordResetRequestRes } from './types/password_reset_req.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }


  @Post('login')
  @Public()
  signIn(@Body() signInDto: SignInReqDTO,@Req() request:any): Promise<SignInResDTO> {
    return this.authService.signIn(signInDto);
  }
  @Post('signup')
  @Public()
  signup(@Body() signUoDto: SignUpReqDTO,@Req() request:any): Promise<SignInResDTO> {
    return this.authService.signUp(signUoDto);
  }
  @Get('refresh')
  refresh(@Req() request:any): Promise<SignInResDTO> {
    let payload:JWT_Data = request.payload;
    return this.authService.refresh(payload);
  }
  @Get('ping')
  @Public()
  bing() {
    return { Status: true };
  }

  @Get('logout')
  signOut(@Req() request: any,):Promise<StatusDTO> {
    let payload:JWT_Data = request.payload;
    return this.authService.signOut(payload.userId);
  }
  @Get('verifyEmail')
  @AcceptedStatus(UserStatus.VerifyEmail)
  async verifyEmail(@Req() request: any, @Query("code") code: string): Promise<StatusDTO> {
    let payload:JWT_Data = request.payload;
    return await this.authService.verifEmail(payload.userId, code);
  }
  @Get('reqPasswordReset')
  @Public()
  async reqPasswordReset(@Query("email") email: string): Promise<PasswordResetRequestRes> {
    return await this.authService.requestPasswordReset(email);
  }
  @Post('resetPassword')
  @AcceptedStatus(UserStatus.ForgotPassword)
  async resetPassword(@Req() request: any, @Query("code") code: string,@Body("password")password:string): Promise<StatusDTO> {
    let payload:JWT_Data = request.payload;
    return await this.authService.resetPassword(payload.userId,code,password);
  }
  


}
