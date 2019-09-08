import { platform } from "os";
import { commandExists } from "linux-command-exists";
import { execute } from "linux-shell-command";
import { Groups } from "./groups";
import { Shells } from "./shells";
import { promises } from "fs";

export class Users {

	private packages: {
		sudo: null | boolean,
		useradd: null | boolean,
		usermod: null | boolean,
		userdel: null | boolean,
		passwd: null | boolean,
		gpasswd: null | boolean,
		chage: null | boolean,
		cut: null | boolean,
		awk: null | boolean
	} = {
			sudo: null,
			useradd: null,
			usermod: null,
			userdel: null,
			passwd: null,
			gpasswd: null,
			chage: null,
			cut: null,
			awk: null
		}

	private usersList: string[] | null = null;
	private groups: Groups;

	constructor() {
		if (platform() !== 'linux') {
			throw Error("This module only runs on linux");
		} else {
			this.groups = new Groups();
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

	public usernameValidator(username: string): boolean {
		return username.match(/^[a-z0-9]+$/) !== null;
	}

	public list(): Promise<string[]>;
	public list(callback: (error: Error | null, usernames: string[]) => void): void;
	public list(callback?: (error: Error | null, usernames: string[]) => void): Promise<string[]> | void {
		var result: Promise<string[]> = new Promise((resolve, reject) => {
			if (this.usersList === null) {
				this.commandsExists().then(() => {
					execute('cut -d: -f1 /etc/passwd').then(({ shellCommand, success }) => {
						if (success === true) {
							this.usersList = shellCommand.stdout.trim().split('\n');
							resolve(this.usersList);
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				}).catch((e) => {
					reject(e);
				});
			} else {
				resolve(this.usersList);
			}
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((usernames) => {
				callback(null, usernames);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

	public listSystemUsers(): Promise<string[]>;
	public listSystemUsers(callback: (error: Error | null, usernames: string[]) => void): void;
	public listSystemUsers(callback?: (error: Error | null, usernames: string[]) => void): Promise<string[]> | void {
		var result: Promise<string[]> = new Promise((resolve, reject) => {
			this.commandsExists().then(() => {
				execute('awk -F: \'$3 < 1000 { print $1 }\' /etc/passwd').then(({ shellCommand, success }) => {
					if (success === true) {
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
			result.then((usernames) => {
				callback(null, usernames);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

	public listNonSystemUsers(): Promise<string[]>;
	public listNonSystemUsers(callback: (error: Error | null, usernames: string[]) => void): void;
	public listNonSystemUsers(callback?: (error: Error | null, usernames: string[]) => void): Promise<string[]> | void {
		var result: Promise<string[]> = new Promise((resolve, reject) => {
			this.commandsExists().then(() => {
				execute('awk -F: \'$3 >= 1000 { print $1 }\' /etc/passwd').then(({ shellCommand, success }) => {
					if (success === true) {
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
			result.then((usernames) => {
				callback(null, usernames);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

	public exists(usernames: string | string[]): Promise<boolean | { [username: string]: boolean }>;
	public exists(usernames: string | string[], callback: (error: Error | null, informations: boolean | { [username: string]: boolean }) => void): void;
	public exists(usernames: string | string[], callback?: (error: Error | null, informations: boolean | { [username: string]: boolean }) => void): Promise<boolean | { [username: string]: boolean }> | void {
		var result: Promise<boolean | { [username: string]: boolean }> = new Promise((resolve, reject) => {
			this.list().then((list) => {
				if (Array.isArray(usernames)) {
					let r: { [username: string]: boolean } = {};
					for (var i = 0; i < usernames.length; i++) {
						let user = usernames[i];
						r[user] = list.includes(user);
					}
					resolve(r);
				} else {
					resolve(list.includes(usernames));
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

	public informations(usernames: string | string[]): Promise<{ [username: string]: UserInformations }>;
	public informations(usernames: string | string[], callback: (error: Error | null, informations: { [username: string]: UserInformations }) => void): void;
	public informations(usernames: string | string[], callback?: (error: Error | null, informations: { [username: string]: UserInformations }) => void): Promise<{ [username: string]: UserInformations }> | void {
		var result: Promise<{ [username: string]: UserInformations }> = new Promise((resolve, reject) => {
			this.exists(usernames).then((exists) => {
				let ok: boolean;
				if (exists === true || Object.values(exists).every((e) => e === true)) {
					if (!Array.isArray(usernames)) {
						usernames = [usernames]
					}
					let command = 'getent passwd \'!?!\' '.replace(/'\!\?\!'/, new Array(usernames.length).fill("'!?!'").join(' '));
					execute(command, usernames).then(({ shellCommand, success }) => {
						if (success) {
							var informations: { [username: string]: UserInformations } = {};
							var stdout = shellCommand.stdout.trim().split('\n');
							for (let i = 0; i < usernames.length; i++) {
								let buf = stdout[i].split(':');
								informations[usernames[i]] = {
									username: buf[0],
									shadowed: buf[1] === 'x',
									userId: Number.parseInt(buf[2]),
									groupId: Number.parseInt(buf[3]),
									comment: buf[4],
									homeDirectory: buf[5],
									defaultShell: buf[6]
								}
							}
							resolve(informations);
						} else {
							switch (shellCommand.exitStatus) {
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
				} else {
					//@ts-ignore
					reject(new Error(`The following usernames don't exists:\n\t${typeof usernames === 'string' ? usernames : usernames.filter((username) => { return exists[username] === false }).join('\n')}`));
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((informations) => {
				callback(null, informations);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

	public listWithInformations(): Promise<{ [username: string]: UserInformations }>;
	public listWithInformations(callback: (error: Error | null, informations: { [username: string]: UserInformations }) => void): void;
	public listWithInformations(callback?: (error: Error | null, informations: { [username: string]: UserInformations }) => void): Promise<{ [username: string]: UserInformations }> | void {
		var result: Promise<{ [username: string]: UserInformations }> = new Promise((resolve, reject) => {
			this.list().then((list) => {
				this.informations(list).then((informations) => {
					resolve(informations);
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
			result.then((informations) => {
				callback(null, informations);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			})
		}
	}

	public create(username: string, uid: number | 'default', password: string | null, primaryGroup: string | 'default', secondaryGroups: string[] | null, shell: string | null, homeDirectory: string | null | 'default', comment: string | null): Promise<void>;
	public create(username: string, uid: number | 'default', password: string | null, primaryGroup: string | 'default', secondaryGroups: string[] | null, shell: string | null, homeDirectory: string | null | 'default', comment: string | null, callback: (error: Error | null) => void): void;
	public create(username: string, uid: number | 'default', password: string | null, primaryGroup: string | 'default', secondaryGroups: string[] | null, shell: string | null, homeDirectory: string | null | 'default', comment: string | null, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === false) {
					if (this.usernameValidator(username)) {

						var command = 'sudo useradd ';
						var args: string[] = [];

						//Specified primaryGroup
						if (primaryGroup !== 'default') {
							command += '-N ';
						}

						//Specified uid
						if (typeof uid === 'number') {
							command += '-u \'!?!\' ';
							args.push(String(Math.floor(uid)));
						}

						if (homeDirectory === 'default') {
							command += '-m ';
						} else if (homeDirectory === null) {
							command += '-M ';
						}

						command += '\'!?!\'';
						args.push(username);

						execute(command, args).then(({ shellCommand, success }) => {
							//User created
							if (success) {
								//@ts-ignore because to get here the list have to be initialized.
								this.usersList.push(username);
								var p: Promise<void>[] = [];

								//Setup Password
								if (password !== null) {
									p.push(this.changePassword(username, password));
								}

								//Setup PrimaryGroup
								if (primaryGroup !== 'default') {
									p.push(this.changePrimaryGroup(username, primaryGroup));
								}

								//Setup secondaryGroup
								if (secondaryGroups !== null) {
									p.push(this.changeSecondaryGroups(username, secondaryGroups));
								}

								//Setup the shell
								if (shell !== null) {
									p.push(this.changeShell(username, shell));
								}

								//setup homeDirectory
								if (homeDirectory !== null && homeDirectory !== 'default') {
									p.push(this.changeHomeDirectory(username, homeDirectory));
								}

								//Setup comment
								if (comment !== null) {
									p.push(this.changeComment(username, comment));
								}

								Promise.all(p).then(() => {
									resolve();
								}).catch((e) => {
									reject(e);
								});
							} else {
								switch (shellCommand.exitStatus) {
									case 1: reject(new Error(`Error 1: Can't update password file\n${shellCommand.error}`));
										break;
									case 2: reject(new Error(`Error 2: Invalid command syntax\n${shellCommand.error}`));
										break;
									case 3: reject(new Error(`Error 3: Invalid argument to option\n${shellCommand.error}`));
										break;
									case 4: reject(new Error(`Error 4: UID already in use\n${shellCommand.error}`));
										break;
									case 6: reject(new Error(`Error 6: Specified group doesn't exists\n${shellCommand.error}`));
										break;
									case 9: reject(new Error(`Error 9: Username already in use\n${shellCommand.error}`));
										break;
									case 10: reject(new Error(`Error 10: Can't update group file\n${shellCommand.error}`));
										break;
									case 12: reject(new Error(`Error 12: Can't create home directory\n${shellCommand.error}`));
										break;
									case 14: reject(new Error(`Error 14: Can't update SELinux user mapping\n${shellCommand.error}`));
										break;
									default: reject(new Error(`Unknown error\n${shellCommand.error}`));
								}
							}
						}).catch((e) => {
							reject(e);
						});
					} else {
						reject(new Error(`"${username}" is not a valid username.`));
					}
				} else {
					reject(new Error(`The account "${username}" already exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public changePrimaryGroup(username: string, primaryGroup: string): Promise<void>;
	public changePrimaryGroup(username: string, primaryGroup: string, callback: (error: Error | null) => void): void;
	public changePrimaryGroup(username: string, primaryGroup: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					this.groups.exists(primaryGroup).then((exists) => {
						if (exists === true) {
							execute('sudo usermod -g \'!?!\' \'!?!\'', [primaryGroup, username]).then(({ shellCommand, success }) => {
								if (success) {
									resolve();
								} else {
									reject(shellCommand.error);
								}
							});
						} else {
							reject(new Error(`The group "${primaryGroup}" doesn't exists`));
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public changeSecondaryGroups(username: string, secondaryGroups: string[]): Promise<void>;
	public changeSecondaryGroups(username: string, secondaryGroups: string[], callback: (error: Error | null) => void): void;
	public changeSecondaryGroups(username: string, secondaryGroups: string[], callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					this.groups.exists(secondaryGroups).then((exists) => {
						if (Object.values(exists).every((e) => e === true)) {
							execute('sudo usermod -G \'!?!\' \'!?!\'', [secondaryGroups.join(','), username]).then(({ shellCommand, success }) => {
								if (success) {
									resolve();
								} else {
									reject(shellCommand.error);
								}
							}).catch((e) => {
								reject(e);
							});
						} else {
							//@ts-ignore
							reject(new Error(`The following groups don't exists:\n\t${secondaryGroups.filter((group) => { return exists[group] === false }).join('\n')}`));
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public addSecondaryGroup(username: string, group: string): Promise<void>;
	public addSecondaryGroup(username: string, group: string, callback: (error: Error | null) => void): void;
	public addSecondaryGroup(username: string, group: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					this.groups.exists(group).then((exists) => {
						if (exists === true) {
							execute('sudo usermod -aG \'!?!\' \'!?!\'', [group, username]).then(({ shellCommand, success }) => {
								if (success) {
									resolve();
								} else {
									reject(shellCommand.error);
								}
							}).catch((e) => {
								reject(e);
							})
						} else {
							reject(new Error(`The group "${group}" doesn't exists`));
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public removeSecondaryGroup(username: string, group: string): Promise<void>;
	public removeSecondaryGroup(username: string, group: string, callback: (error: Error | null) => void): void;
	public removeSecondaryGroup(username: string, group: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					this.groups.exists(group).then((exists) => {
						if (exists === true) {
							execute('sudo gpasswd -d \'!?!\' \'!?!\'', [username, group]).then(({ shellCommand, success }) => {
								if (success) {
									resolve();
								} else {
									reject(shellCommand.error);
								}
							}).catch((e) => {
								reject(e);
							})
						} else {
							reject(new Error(`The group "${group}" doesn't exists`));
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public lock(username: string): Promise<void>;
	public lock(username: string, callback: (error: Error | null) => void): void;
	public lock(username: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					execute('sudo usermod -L \'!?!\'', [username]).then(({ shellCommand, success }) => {
						if (success) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public unlock(username: string): Promise<void>;
	public unlock(username: string, callback: (error: Error | null) => void): void;
	public unlock(username: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					execute('sudo usermod -U \'!?!\'', [username]).then(({ shellCommand, success }) => {
						if (success) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public checkPassword(username: string, password: string | null): Promise<boolean>;
	public checkPassword(username: string, password: string | null, callback: (error: Error | null, ok: boolean) => void): void;
	public checkPassword(username: string, password: string | null, callback?: (error: Error | null, ok: boolean) => void): Promise<boolean> | void {
		var result: Promise<boolean> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists) {
					execute('sudo getent shadow \'!?!\' | cut -d: -f2', [username]).then(({ shellCommand, success }) => {
						if (success) {
							if (password === null) {
								resolve(shellCommand.stdout.trim() === '!');
							} else {
								var userShadow = shellCommand.stdout.trim();
								var buf = userShadow.split('$');
								var hash = buf[1];
								var salt = buf[2];
								execute('echo \'!?!\' | openssl passwd \'!?!\' -salt \'!?!\' -stdin', [password, `-${hash}`, salt]).then(({ shellCommand, success }) => {
									if (success) {
										var passwordHash = shellCommand.stdout.trim();
										resolve(userShadow === passwordHash)
									} else {
										reject(shellCommand.error);
									}
								}).catch((e) => {
									reject(e);
								});
							}
						} else {
							switch (shellCommand.exitStatus) {
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
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
		});

		if (typeof callback === 'undefined') {
			return result;
		} else {
			result.then((ok) => {
				callback(null, ok);
			}).catch((e) => {
				//@ts-ignore
				callback(e);
			});
		}
	}

	public changePassword(username: string, password: string): Promise<void>;
	public changePassword(username: string, password: string, callback: (error: Error | null) => void): void;
	public changePassword(username: string, password: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					execute('echo -e \'!?!\' | passwd \'!?!\'', [`${password}\n${password}`, username]).then(({ shellCommand, success }) => {
						if (success) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public changeShell(username: string, shell: string): Promise<void>;
	public changeShell(username: string, shell: string, callback: (error: Error | null) => void): void;
	public changeShell(username: string, shell: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					var shells = new Shells();
					shells.exists(shell).then((exists) => {
						if (exists) {
							execute('sudo chsh -s \'!?!\' \'!?!\'', [shell, username]).then(({ shellCommand, success }) => {
								if (success) {
									resolve();
								} else {
									reject(shellCommand.error);
								}
							}).catch((e) => {
								reject(e);
							});
						} else {
							reject(new Error(`The shell "${shell}" doesn't exists`));
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public changeHomeDirectory(username: string, homeDirectory: string, moveContent?: boolean): Promise<void>;
	public changeHomeDirectory(username: string, homeDirectory: string, moveContent: boolean | undefined, callback: (error: Error | null) => void): void
	public changeHomeDirectory(username: string, homeDirectory: string, moveContent: boolean | undefined, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					promises.access(homeDirectory).then(() => {
						reject(new Error(`The directory ${homeDirectory} already exists`));
					}).catch(() => {
						execute(`sudo usermod -${moveContent === true ? 'm' : ''}d \'!?!\' \'!?!\'`, [homeDirectory, username]).then(({ shellCommand, success }) => {
							if (success) {
								resolve();
							} else {
								reject(shellCommand.error);
							}
						}).catch((e) => {
							reject(e);
						});
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public changeName(username: string, newName: string): Promise<void>;
	public changeName(username: string, newName: string, callback: (error: Error | null) => void): void;
	public changeName(username: string, newName: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					execute('sudo usermod -l \'!?!\' \'!?!\'', [newName, username]).then(({ shellCommand, success }) => {
						if (success) {
							//@ts-ignore
							this.usersList[this.usersList.indexOf(username)] = newName;
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public changeUserId(username: string, uid: number): Promise<void>;
	public changeUserId(username: string, uid: number, callback: (error: Error | null) => void): void;
	public changeUserId(username: string, uid: number, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					execute('sudo usermod -u \'!?!\' \'!?!\'', [String(Math.floor(uid)), username]).then(({ shellCommand, success }) => {
						if (success) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public changeComment(username: string, comment: string): Promise<void>;
	public changeComment(username: string, comment: string, callback: (error: Error | null) => void): void;
	public changeComment(username: string, comment: string, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					execute('sudo usermod -c \'!?!\' \'!?!\'', [comment, username]).then(({ shellCommand, success }) => {
						if (success) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public changeAccountExpiryDate(username: string, expiryDate: Date): Promise<void>;
	public changeAccountExpiryDate(username: string, expiryDate: Date, callback: (error: Error | null) => void): void;
	public changeAccountExpiryDate(username: string, expiryDate: Date, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					var date: string = `${expiryDate.getFullYear()}-${expiryDate.getMonth() + 1}-${expiryDate.getDay()}`;
					execute('sudo chage -E \'!?!\' \'!?!\'', [date, username]).then(({ shellCommand, success }) => {
						if (success) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public changePasswordExpiryFrequency(username: string, days: number): Promise<void>;
	public changePasswordExpiryFrequency(username: string, days: number, callback: (error: Error | null) => void): void;
	public changePasswordExpiryFrequency(username: string, days: number, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists === true) {
					execute('sudo chage -M \'!?!\' \'!?!\'', [String(Math.floor(days)), username]).then(({ shellCommand, success }) => {
						if (success) {
							resolve();
						} else {
							reject(shellCommand.error);
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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

	public delete(username: string, deleteHomeDirectory?: boolean): Promise<void>;
	public delete(username: string, deleteHomeDirectory: boolean | undefined, callback: (error: Error | null) => void): void;
	public delete(username: string, deleteHomeDirectory: boolean | undefined, callback?: (error: Error | null) => void): Promise<void> | void {
		var result: Promise<void> = new Promise((resolve, reject) => {
			this.exists(username).then((exists) => {
				if (exists) {
					execute(`sudo userdel ${deleteHomeDirectory === true ? '-r' : ''} '!?!'`, [username]).then(({ shellCommand, success }) => {
						if (success) {
							//@ts-ignore because to get here the list have to be initialized.
							this.usersList = this.usersList.filter(user => user !== username);
							resolve();
						} else {
							switch (shellCommand.exitStatus) {
								case 1: reject(new Error(`Error 1: Can't update password file\n${shellCommand.error}`));
									break;
								case 2: reject(new Error(`Error 2: Invalid command syntax\n${shellCommand.error}`));
									break;
								case 6: reject(new Error(`Error 6: Specified user doesn't exists\n${shellCommand.error}`));
									break;
								case 10: reject(new Error(`Error 10: Can't update group file\n${shellCommand.error}`));
									break;
								case 12: reject(new Error(`Error 12: Can't remove home directory\n${shellCommand.error}`));
									break;
								default: reject(new Error(`Unknown error\n${shellCommand.error}`));
							}
						}
					}).catch((e) => {
						reject(e);
					});
				} else {
					reject(new Error(`The account "${username}" doesn't exists`));
				}
			}).catch((e) => {
				reject(e);
			});
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
}

export type UserInformations = {
	username: string,
	shadowed: boolean,
	userId: number,
	groupId: number,
	comment: string,
	homeDirectory: string,
	defaultShell: string
}
