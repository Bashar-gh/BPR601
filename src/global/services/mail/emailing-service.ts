import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../../../api/users/models/schemas/user.schema';

@Injectable()
export class EmailingService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: User, token: string) {
     
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome to On Time!',
        text:`Please Confirm Your Email To Access Your Account \n Confirmation Code : ${token}`
      });
      
    }
    
}
