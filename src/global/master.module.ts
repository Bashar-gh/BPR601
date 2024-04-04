import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EmailingService } from "./services/mail/emailing-service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],

            useFactory: (configService: ConfigService) => {
                return {
                    transport: {
                        host: configService.get("HOST"),
                        secure: false,
                        auth: {
                            user: configService.get("EMAIL"),
                            pass: configService.get("PASSWORD"),
                        },
                    },
                    defaults: {
                        from: `"No Reply" <${configService.get("FROM")}>`,
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
