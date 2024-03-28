import { Role } from "../../auth/enums/role.enum";
import { Roles } from "../../auth/decorators/role.decorator";
import { Controller } from "@nestjs/common";
import { UsersService } from "./users.service";

@Roles(Role.Admin)
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

}
