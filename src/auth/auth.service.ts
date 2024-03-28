import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../api/users/users.service';
import { SignInReqDTO, SignInResDTO } from './dtos/auth.signin.DTO';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import CustomError from '../global/models/errors/custom.error';
import { EmailingService } from '../global/services/mail/emailing-service';
import { User } from '../api/users/models/schemas/user.schema';
import { UserStatus } from '../api/users/enums/user-status.enum';
import { JWT_Data } from './types/jwt-data.type';
import '../global/extensions/string.extensions';
import { SignUpReqDTO } from './dtos/auth.signup.DTO';
import { StatusDTO } from 'src/global/models/dtos/status.dto';
import { IncorrectUserCredentials } from './errors/incorrect_credentials.error';
import { UserAlreadyExists } from './errors/user_already_exists.error';
import { IncorrectOtpCode } from './errors/incorrect_otp_code.error';
import NotFound from 'src/global/errors/not_found.error';
type LoginUserParams = SignInReqDTO & { user: User };
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: EmailingService
  ) { }

  async signIn(signInDTO: SignInReqDTO, deviceId: string): Promise<SignInResDTO> {

    const users = await this.usersService.findByEmail(signInDTO.email);
    if (users.length == 0) {
      throw new IncorrectUserCredentials();
    }
    let user = users[0];
    if (!compareSync(signInDTO.password, user.password)) {
      throw new IncorrectUserCredentials();
    }
    return this._loginUser({ user: user, ...signInDTO }, false);

  }
  async signUp(signUpDTO: SignUpReqDTO, deviceId: string): Promise<SignInResDTO> {
    const users = await this.usersService.findByEmail(signUpDTO.email);
    if (users.length != 0) {
      throw new UserAlreadyExists();
    }
    var newUser = new User();
    newUser.email = signUpDTO.email;
    newUser.password = signUpDTO.password;
    newUser.firstName = signUpDTO.firstName;
    newUser.lastName = signUpDTO.lastName;
    newUser.dateOfBirth = new Date(signUpDTO.dateOfBirth);
    newUser.otpCode = this.generateOTPCode();


    const user = await this.usersService.create(newUser);
    return this._loginUser({ user: user, ...signUpDTO }, true);

  }
  async verifEmail(userId: string, code: string): Promise<StatusDTO> {
    const user = await this.usersService.findById(userId);
    if (user.otpCode == undefined) return { Status: false };
    if (code.trim().normalize() != user.otpCode.trim().normalize()) throw new IncorrectOtpCode();
    await this.usersService.makeEmailVerified(userId);
    return { Status: true };

  }
  async requestPasswordReset(email: string): Promise<StatusDTO> {
    const users = await this.usersService.findByEmail(email);
    if (users.length == 0) {
      throw new NotFound(User);
    }
    let code = this.generateOTPCode();
    await this.usersService.updateById(users[0].id, { otpCode: code });
    await this.mailerService.sendUserConfirmation(users[0], code);
    return { Status: true };

  }
  async resetPassword(userId: string, code: string,password:string): Promise<StatusDTO> {
    const user = await this.usersService.findById(userId);
    if (user.otpCode == undefined) return { Status: false };
    if (code.trim().normalize() != user.otpCode.trim().normalize()) throw new IncorrectOtpCode();
    await this.usersService.setPassword(userId,password);
    return { Status: true };
  }

  async resendOTPCode(userId: string) {
    const user = await this.usersService.findById(userId);

    await this.mailerService.sendUserConfirmation(user, user.otpCode);
  }
  async signOut(userId: string): Promise<StatusDTO> {

    return { Status: true };

  }

  private generateOTPCode(): string {
    return Math.floor(Math.random() * 9000 + new Date().getUTCMilliseconds() * 1321999).toString()
  }
  private generateJwtToken(data: JWT_Data): Promise<string> {
    return this.jwtService.signAsync(data);
  }
  private async _loginUser(params: LoginUserParams, signup: boolean): Promise<SignInResDTO> {

    if (params.user.accountStatus == UserStatus.VerifyEmail) {
      await this.mailerService.sendUserConfirmation(params.user, params.user.otpCode);

    }

    let jwt = await this.generateJwtToken({ userId: params.user.id, accountStatus: params.user.accountStatus, role: params.user.type });
    return { id: params.user.id, user_email: params.user.email, display_name: `${params.user.firstName} ${params.user.lastName}`, user_status: params.user.accountStatus, user_role: params.user.type, jwt: jwt };

  }
}
