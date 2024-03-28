import { SetMetadata } from '@nestjs/common';
import { UserStatus } from '../../api/users/enums/user-status.enum';

export const Accept_Status  = 'Accept_Status';
export const AcceptedStatus =(...accepted: UserStatus[])=> SetMetadata(Accept_Status , accepted);