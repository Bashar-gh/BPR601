import { Role } from "../../auth/enums/role.enum";
import { Roles } from "../../auth/decorators/role.decorator";
import { Controller, Get, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDetails } from "./models/types/user_details.type";
import { JWT_Data } from "src/auth/types/jwt-data.type";

@Roles(Role.Admin)
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    async getDetails(@Req() request: any): Promise<UserDetails> {
        let payload: JWT_Data = request.payload;
        return this.usersService.getDetails(payload.userId);

    }

}
