import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req } from '@nestjs/common';
import { SignInReqDTO, SignInResDTO } from './dtos/auth.signin.DTO';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { SignUpReqDTO } from './dtos/auth.signup.DTO';
import { AcceptedStatus } from './decorators/status.decorator';
import { UserStatus } from '../api/users/enums/user-status.enum';
import { StatusDTO } from '../global/models/dtos/status.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }


  @Post('login')
  @Public()
  signIn(@Body() signInDto: SignInReqDTO,@Req() request:any): Promise<SignInResDTO> {
    return this.authService.signIn(signInDto,request.DID);
  }
  @Post('signup')
  @Public()
  signup(@Body() signUoDto: SignUpReqDTO,@Req() request:any): Promise<SignInResDTO> {
    return this.authService.signUp(signUoDto,request.DID);
  }
  @Get('ping')
  @Public()
  bing() {
    return { Status: true };
  }

  @Get('logout/:id')
  signOut(@Param('id') id: string):Promise<StatusDTO> {
    return this.authService.signOut(id);
  }
  @Get('verifyEmail/:id')
  @AcceptedStatus(UserStatus.VerifyEmail)
  async verifyEmail(@Param("id") id: string, @Query("code") code: string) {
    return await this.authService.verifEmail(id, code);
  }
  


}
