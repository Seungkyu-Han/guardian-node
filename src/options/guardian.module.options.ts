import { StringValue } from 'ms';

export interface GuardianModuleOptions {
	algorithm:
		| 'HS256'
		| 'HS384'
		| 'HS512'
		| 'RS256'
		| 'RS384'
		| 'RS512'
		| 'ES256'
		| 'ES384'
		| 'ES512'
		| 'PS256'
		| 'PS384'
		| 'PS512'
		| undefined;

	accessTokenOptions: {
		secretKey: string;
		expiresIn?: StringValue;
	};
	refreshTokenOptions: {
		secretKey?: string;
		expiresIn?: StringValue;
	};

	authorityHierarchy?: boolean;
}
