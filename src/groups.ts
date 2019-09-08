import { platform } from "os";
import { execute } from "linux-shell-command";
import { commandExists } from "linux-command-exists";

export class Groups {

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
	public list(callback: (error: Error | null, groups: string[]) => void): void;
	public list(callback?: (error: Error | null, groups: string[]) => void): Promise<string[]> | void {
		var result: Promise<string[]> = new Promise((resolve, reject) => {
			this.commandsExists().then(() => {
				execute('cut -d: -f1 /etc/group').then(({ shellCommand, success }) => {
					if (success) {
						resolve(shellCommand.stdout.trim().split('\n'));
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
			result.then((groups) => {
				callback(null, groups);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			})
		}
	}

	public exists(groups: string | string[]): Promise<boolean | { [username: string]: boolean }>;
	public exists(groups: string | string[], callback: (error: Error | null, exists: boolean | { [username: string]: boolean }) => void): void;
	public exists(groups: string | string[], callback?: (error: Error | null, exists: boolean | { [username: string]: boolean }) => void): Promise<boolean | { [username: string]: boolean }> | void {
		var result: Promise<boolean | { [username: string]: boolean }> = new Promise((resolve, reject) => {
			this.list().then((list) => {
				if(Array.isArray(groups)){
					let r: | { [username: string]: boolean } = {};
					for(var i = 0; i < groups.length; i++){
						let group = groups[i];
						r[group] = list.includes(group);
					}
					resolve(r);
				}else{
					resolve(list.includes(groups));
				}
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

	public create(name: string, id?: number): Promise<void>;
	public create(name: string, id: number | undefined, callback: (error: Error | null) => void): void;
	public create(name: string, id: number | undefined, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(name).then((exists) => {
				if (exists) {
					resolve();
				} else {
					var command = `sudo groupadd ${id ? '-g \'!?!\'' : ''} '!?!'`;
					var args: string[] = []
					if (id) {
						args.push(String(Math.floor(id)));
					}
					args.push(name);
					execute(command, args).then(({ shellCommand, success }) => {
						if (success) {
							resolve();
						} else {
							switch (shellCommand.exitStatus) {
								case 2: reject(new Error(`Error 2: Invalid Command Syntax\n${shellCommand.error}`));
									break;
								case 3: reject(new Error(`Error 3: invalid argument to option\n${shellCommand.error}`));
									break;
								case 4: reject(new Error(`Error 4: GID not unique\n${shellCommand.error}`));
									break;
								case 9: reject(new Error(`Error 9: group name not unique\n${shellCommand.error}`));
									break;
								case 10: reject(new Error(`Error 10: can't update group file\n${shellCommand.error}`));
									break;
								default: reject(new Error(`Unknown error:\n${shellCommand.error}`));
									break;
							}
						}
					}).catch((e) => {
						reject(e);
					});
				}
			})
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public delete(group: string): Promise<void>;
	public delete(group: string, callback: (error: Error | null) => void): void;
	public delete(group: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(group).then((exists) => {
				if(exists){
					execute('sudo groupdel \'!?!\'', [group]).then(({shellCommand, success}) => {
						if(success){
							resolve();
						}else{
							switch(shellCommand.exitStatus){
								case 2: reject(new Error(`Error 2: invalid command syntax\n${shellCommand.error}`));
									break;
								case 6: reject(new Error(`Error 6: specified group doesn't exist\n${shellCommand.error}`));
									break;
								case 8: reject(new Error(`Error 8: can't remove user's primary group\n${shellCommand.error}`));
									break;
								case 10: reject(new Error(`Error 10: can't update group file\n${shellCommand.error}`));
									break;
								default: reject(new Error(`Unknown error:\n${shellCommand.error}`));
									break;
							}
						}
					}).catch((e) => {
						reject(e);
					});
				}else{
					reject(`The group "${group}" doesn\'t exists`);
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if(typeof callback === 'undefined'){
			return result;
		}else{
			result.then(() => {
				callback(null);
			}).catch((e) => {
				callback(e);
			});
		}
	}

	public members(group: string): Promise<string[]>;
	public members(group: string, callback: (error: Error | null, members: string[]) => void): void
	public members(group: string, callback?: (error: Error | null, members: string[]) => void): Promise<string[]> | void {
		var result: Promise<string[]> = new Promise((resolve, reject) => {
			this.exists(group).then((exists) => {
				if(exists){
					execute('getent group \'!?!\' | cut -d: -f4', [group]).then(({shellCommand, success}) => {
						if(success){
							resolve(shellCommand.stdout.trim().split(','));
						}else{
							switch(shellCommand.exitStatus){
								case 1: reject(new Error(`Error 1: Missing arguments, or database unknown.\n${shellCommand.error}`));
									break;
								case 2: reject(new Error(`Error 2: One or more supplied key could not be found in the database.\n${shellCommand.error}`));
									break;
								default: reject(new Error(`Unknown error:\n${shellCommand.error}`));
									break;
							}
						}
					}).catch((e) => {
						reject(e);
					});
				}else{
					reject('This group doesn\'t exists');
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if(typeof callback === 'undefined'){
			return result;
		}else{
			result.then((members) => {
				callback(null, members);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

}
