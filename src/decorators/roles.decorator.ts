import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = Symbol('roles');

export const Role = (role?: number) => SetMetadata(ROLE_KEY, role);
