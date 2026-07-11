import { DynamicModule, Module } from '@nestjs/common';
import { GuardianModuleOptions } from '../options/guardian.module.options';
import { GUARDIAN_OPTION_TOKEN } from '../tokens/guardian.option.token';
import { JwtModule } from '@nestjs/jwt';

@Module({})
export class GuardianModule {
	static forRoot(
		guardianModuleOptions: GuardianModuleOptions,
	): DynamicModule {
		return {
			module: GuardianModule,
			providers: [
				{
					provide: GUARDIAN_OPTION_TOKEN,
					useValue: guardianModuleOptions,
				},
			],
			imports: [JwtModule],
		};
	}
}
