export class Principal {
	id: string;
	authorities: number;
	isEnabled: boolean;

	constructor(id: string, isEnabled?: boolean, authorities?: number) {
		this.id = id;
		this.authorities = authorities ?? 0;
		this.isEnabled = isEnabled ?? true;
	}
}
