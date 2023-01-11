import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'someRandomRKEY';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
