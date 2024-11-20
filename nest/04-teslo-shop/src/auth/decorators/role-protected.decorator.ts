import { SetMetadata } from '@nestjs/common';
import { ValidRole } from '../enums/valid-role.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRole[]) => {
  return SetMetadata(META_ROLES, args);
};
