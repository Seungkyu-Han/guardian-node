import { DynamicModule, Module } from '@nestjs/common';
import { GuardianModuleOptions } from '../options/guardian.module.options';
import { GUARDIAN_OPTION_TOKEN } from '../tokens/guardian.option.token';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenGenerator } from '../generators/jwt-token.generator';
import { AuthenticationGuard } from '../guards/authentication.guard';

@Module({})
export class GuardianModule {
	static forRoot(
		guardianModuleOptions: GuardianModuleOptions,
	): DynamicModule {
		const optionsProvider = {
			provide: GUARDIAN_OPTION_TOKEN,
			useValue: guardianModuleOptions,
		};

		return {
			module: GuardianModule,
			imports: [JwtModule.register({})],
			providers: [
				optionsProvider,
				JwtTokenGenerator,
				AuthenticationGuard,
			],
			exports: [
				optionsProvider,
				JwtTokenGenerator,
				AuthenticationGuard,
				JwtModule,
			],
		};
	}
}
