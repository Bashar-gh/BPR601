import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EmailingService } from "./services/mail/emailing-service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigModule],
            useFactory: (configService: ConfigService)=>{
                return {
                    transport: {
                        host: "smtp.gmail.com",
                        secure: false,
                        auth: {
                            user: configService.get("EMAIL"),
                            pass: configService.get("PASSWORD"),
                        },

                    },
                    defaults: {
                        from: `"No Reply" <$noreply@reserver.com>`,
                    },
                };
            }




        }),
    ],

    providers: [
        EmailingService,
    ],
    exports: [

        EmailingService,

    ]
})
export class MasterModule { }
