import { Inject, Injectable } from '@nestjs/common';
import { GuardianModuleOptions } from '../options/guardian.module.options';
import { GUARDIAN_OPTION_TOKEN } from '../tokens/guardian.option.token';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Principal } from '../types/principal';

@Injectable()
export class JwtTokenGenerator {
	private readonly accessJwtSignOptions: JwtSignOptions;
	private readonly refreshJwtSignOptions: JwtSignOptions;

	constructor(
		@Inject(GUARDIAN_OPTION_TOKEN)
		guardianModuleOptions: GuardianModuleOptions,
		private readonly jwtService: JwtService,
	) {
		const algorithm = guardianModuleOptions.algorithm ?? 'HS256';

		const accessTokenSecret =
			guardianModuleOptions.accessTokenOptions.secretKey;
		const accessTokenExpiresIn =
			guardianModuleOptions.accessTokenOptions.expiresIn ?? '30m';

		const refreshTokenSecret =
			guardianModuleOptions.refreshTokenOptions.secretKey ??
			accessTokenSecret;
		const refreshTokenExpiresIn =
			guardianModuleOptions.refreshTokenOptions.expiresIn ?? '40m';

		this.accessJwtSignOptions = {
			secret: accessTokenSecret,
			expiresIn: accessTokenExpiresIn,
			algorithm: algorithm,
		};

		this.refreshJwtSignOptions = {
			secret: refreshTokenSecret,
			expiresIn: refreshTokenExpiresIn,
			algorithm: algorithm,
		};
	}

	async generateAccessToken(principal: Principal): Promise<string> {
		return await this.jwtService.signAsync(
			{ ...principal, type: 'access' },
			this.accessJwtSignOptions,
		);
	}

	async generateRefreshToken(principal: Principal): Promise<string> {
		return await this.jwtService.signAsync(
			{ ...principal, type: 'refresh' },
			this.refreshJwtSignOptions,
		);
	}
}
