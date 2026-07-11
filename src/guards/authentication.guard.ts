import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { GUARDIAN_OPTION_TOKEN } from '../tokens/guardian.option.token';
import { GuardianModuleOptions } from '../options/guardian.module.options';
import { Reflector } from '@nestjs/core';
import { Principal } from '../types/principal';
import { ROLE_KEY } from '../decorators/roles.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
	private readonly accessTokenSecret: string;

	constructor(
		@Inject(GUARDIAN_OPTION_TOKEN)
		guardianModuleOptions: GuardianModuleOptions,
		private readonly reflector: Reflector,
		private readonly jwtService: JwtService,
	) {
		this.accessTokenSecret =
			guardianModuleOptions.accessTokenOptions.secretKey;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();

		const token = this.extractTokenFromHeader(request);

		try {
			request.principal = await this.jwtService.verifyAsync(token, {
				secret: this.accessTokenSecret,
			});
		} catch (error: unknown) {
			if (error instanceof Error && error.name === 'TokenExpiredError') {
				throw new UnauthorizedException('token expired');
			}

			throw new UnauthorizedException('invalid token');
		}

		return this.authorizeRole(context, request.principal);
	}

	private extractTokenFromHeader(request: Request): string {
		const authorization: string | undefined = request.headers.authorization;

		if (!authorization)
			throw new UnauthorizedException('authorization header is missing');

		const splitAuthorization: string[] = authorization?.split(' ');

		if (
			splitAuthorization.length !== 2 ||
			splitAuthorization[0] !== 'Bearer'
		)
			throw new UnauthorizedException(
				'authorization header is malformed',
			);

		return splitAuthorization[1];
	}

	private authorizeRole(
		context: ExecutionContext,
		principal: Principal,
	): boolean {
		const requiredRole: number | undefined =
			this.reflector.getAllAndOverride<number>(ROLE_KEY, [
				context.getHandler(),
				context.getClass(),
			]);

		if (!requiredRole) return true;

		const userRole = principal.authorities;

		if (userRole < requiredRole)
			throw new ForbiddenException('insufficient privileges');

		return true;
	}
}
