import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = Symbol('roles');

export const Roles = (...roles: number[]) => SetMetadata(ROLE_KEY, roles);
export class ROLES_KEY {}
