import { Controller, Delete, Param } from '@nestjs/common';
import { RoleBackService } from './role-back.service';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { StatusDTO } from 'src/global/models/dtos/status.dto';
@Roles(Role.Admin)
@Controller('api/roleBack')
export class RoleBackController {

    constructor(private roleBackService:RoleBackService) {}
    
    @Delete("service/:id")
    async deleteService(@Param("id") id: string): Promise<StatusDTO> {
        return this.roleBackService.deleteService(id);
    }

    @Delete('sideOrder/:id')
    async deleteSideOrder(@Param("id") id: string): Promise<StatusDTO> {
        return this.roleBackService.deleteSideOrder(id);
    } 
}
