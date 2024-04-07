import { Role } from "../../auth/enums/role.enum";
import { Roles } from "../../auth/decorators/role.decorator";
import { Controller, Get, Param, Put, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDetails } from "./models/types/user_details.type";
import { JWT_Data } from "src/auth/types/jwt-data.type";
import { ArrayReturn } from "src/global/models/dtos/return_type.dto";
import { UserListItem } from "./models/types/user_list_item.type";
import { StatusDTO } from "src/global/models/dtos/status.dto";

@Roles(Role.Admin)
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }
    @Get(':id')
    async getDetails(@Param('id') userId: string): Promise<UserDetails> {
        return this.usersService.getDetails(userId);

    }

    @Get('')
    async getList(): Promise<ArrayReturn<UserListItem>> {
        return this.usersService.getUserList();
    }
    @Get('Owners/all')
    async getOwners(): Promise<ArrayReturn<UserListItem>> {
        return this.usersService.getOwners();
    }
    @Put('disable/:id')
    async disableUser(@Param('id') userId: string): Promise<StatusDTO> {
        return this.usersService.disableUser(userId);
    }
    @Put('enable/:id')
    async enableUser(@Param('id') userId: string): Promise<StatusDTO> {
        return this.usersService.enableUser(userId);
    }

    @Roles(Role.Owner, Role.User)
    @Get('me')
    async getMe(@Req() request: any): Promise<UserDetails> {
        let payload: JWT_Data = request.payload;
        return this.usersService.getDetails(payload.userId);

    }

}
