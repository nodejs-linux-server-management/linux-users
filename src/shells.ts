import { platform } from "os";
import { execute } from "linux-shell-command";
import { commandExists } from "linux-command-exists";

export class Shells {

	private packages: {
		grep: null | boolean
	} = {
			grep: null
		}

	constructor() {
		if (platform() !== 'linux') {
			throw new Error("This module only runs on linux");
		}
	}

	private setup(): Promise<void> {
		return new Promise((resolve, reject) => {
			var p: Promise<{ command: string, exists: boolean }>[] = [];
			var commands = Object.keys(this.packages);
			for (var i = 0; i < commands.length; i++) {
				p.push(new Promise((resolve, reject) => {
					let c = commands[i];
					commandExists(c).then((exists) => {
						resolve({ command: c, exists: exists })
					}).catch((e) => {
						reject(e)
					});
				}));
			}
			Promise.all(p).then((results) => {
				for (var i = 0; i < results.length; i++) {
					var buf = results[i];
					//@ts-ignore
					this.packages[buf.command] = buf.exists;
				}
				resolve();
			}).catch((e) => {
				reject(e);
			});
		});
	}

	private commandsExists(): Promise<void> {
		return new Promise((resolve, reject) => {
			var values = Object.values(this.packages);
			if (values.every((exists) => { return exists === null })) {
				this.setup().then(() => {
					this.commandsExists().then(() => resolve()).catch((e) => reject(e));
				}).catch((e) => {
					reject(e);
				});
			} else if (values.every((exists) => { return exists === true })) {
				resolve();
			} else {
				var keys: string[] = [];
				Object.keys(this.packages).forEach((name) => {
					//@ts-ignore
					if (!this.packages[name]) {
						keys.push(name);
					}
				});
				reject(`The following commands are unknown: ${keys.join(', ')}`);
			}
		});
	}

	public list(): Promise<string[]>;
	public list(callback: (error: Error | null, shells: string[]) => void): void;
	public list(callback?: (error: Error | null, shells: string[]) => void): Promise<string[]> | void {
		var result: Promise<string[]> = new Promise((resolve, reject) => {
			this.commandsExists().then(()=> {
				execute('grep -v "#" /etc/shells').then(({ shellCommand, success }) => {
					if (success) {
						let shells = shellCommand.stdout.trim().split('\n');
						shells.push('/bin/false', '/sbin/nologin');
						resolve(shells);
					} else {
						reject(shellCommand.error);
					}
				}).catch((e) => {
					reject(e);
				});
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((shells) => {
				callback(null, shells);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			})
		}
	}

	public exists(shell: string): Promise<boolean>;
	public exists(shell: string, callback: (error: Error | null, exists: boolean) => void): void;
	public exists(shell: string, callback?: (error: Error | null, exists: boolean) => void): Promise<boolean> | void {
		var result: Promise<boolean> = new Promise((resolve, reject) => {
			this.list().then((shells) => {
				resolve(shells.includes(shell));
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((exists) => {
				callback(null, exists);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

}
