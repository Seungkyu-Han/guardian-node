import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationGuard implements CanActivate {
	private readonly accessTokenSecret: string;

	constructor(private readonly jwtService: JwtService) {
		this.accessTokenSecret = '';
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();

		const token = this.extractTokenFromHeader(request);

		try {
			request['user'] = await this.jwtService.verifyAsync(token, {
				secret: this.accessTokenSecret,
			});
		} catch (error: any) {
			if (error.name === 'TokenExpiredError')
				throw new UnauthorizedException('token expired');

			throw new UnauthorizedException('invalid token');
		}

		return true;
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
}
