"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const linux_shell_command_1 = require("linux-shell-command");
const linux_command_exists_1 = require("linux-command-exists");
class Groups {
    constructor() {
        this.packages = {
            grep: null
        };
        if (os_1.platform() !== 'linux') {
            throw new Error("This module only runs on linux");
        }
    }
    setup() {
        return new Promise((resolve, reject) => {
            var p = [];
            var commands = Object.keys(this.packages);
            for (var i = 0; i < commands.length; i++) {
                p.push(new Promise((resolve, reject) => {
                    let c = commands[i];
                    linux_command_exists_1.commandExists(c).then((exists) => {
                        resolve({ command: c, exists: exists });
                    }).catch((e) => {
                        reject(e);
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
    commandsExists() {
        return new Promise((resolve, reject) => {
            var values = Object.values(this.packages);
            if (values.every((exists) => { return exists === null; })) {
                this.setup().then(() => {
                    this.commandsExists().then(() => resolve()).catch((e) => reject(e));
                }).catch((e) => {
                    reject(e);
                });
            }
            else if (values.every((exists) => { return exists === true; })) {
                resolve();
            }
            else {
                var keys = [];
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
    list(callback) {
        var result = new Promise((resolve, reject) => {
            this.commandsExists().then(() => {
                linux_shell_command_1.execute('cut -d: -f1 /etc/group').then(({ shellCommand, success }) => {
                    if (success) {
                        resolve(shellCommand.stdout.trim().split('\n'));
                    }
                    else {
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
        }
        else {
            result.then((groups) => {
                callback(null, groups);
            }).catch((e) => {
                //@ts-ignore
                callback(e);
            });
        }
    }
    exists(groups, callback) {
        var result = new Promise((resolve, reject) => {
            this.list().then((list) => {
                if (Array.isArray(groups)) {
                    let r = {};
                    for (var i = 0; i < groups.length; i++) {
                        let group = groups[i];
                        r[group] = list.includes(group);
                    }
                    resolve(r);
                }
                else {
                    resolve(list.includes(groups));
                }
            }).catch((e) => {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then((exists) => {
                callback(null, exists);
            }).catch((e) => {
                //@ts-ignore
                callback(e);
            });
        }
    }
    create(name, id, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(name).then((exists) => {
                if (exists) {
                    resolve();
                }
                else {
                    var command = `sudo groupadd ${id ? '-g \'!?!\'' : ''} '!?!'`;
                    var args = [];
                    if (id) {
                        args.push(String(Math.floor(id)));
                    }
                    args.push(name);
                    linux_shell_command_1.execute(command, args).then(({ shellCommand, success }) => {
                        if (success) {
                            resolve();
                        }
                        else {
                            switch (shellCommand.exitStatus) {
                                case 2:
                                    reject(new Error(`Error 2: Invalid Command Syntax\n${shellCommand.error}`));
                                    break;
                                case 3:
                                    reject(new Error(`Error 3: invalid argument to option\n${shellCommand.error}`));
                                    break;
                                case 4:
                                    reject(new Error(`Error 4: GID not unique\n${shellCommand.error}`));
                                    break;
                                case 9:
                                    reject(new Error(`Error 9: group name not unique\n${shellCommand.error}`));
                                    break;
                                case 10:
                                    reject(new Error(`Error 10: can't update group file\n${shellCommand.error}`));
                                    break;
                                default:
                                    reject(new Error(`Unknown error:\n${shellCommand.error}`));
                                    break;
                            }
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(() => {
                callback(null);
            }).catch((e) => {
                callback(e);
            });
        }
    }
    delete(group, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(group).then((exists) => {
                if (exists) {
                    linux_shell_command_1.execute('sudo groupdel \'!?!\'', [group]).then(({ shellCommand, success }) => {
                        if (success) {
                            resolve();
                        }
                        else {
                            switch (shellCommand.exitStatus) {
                                case 2:
                                    reject(new Error(`Error 2: invalid command syntax\n${shellCommand.error}`));
                                    break;
                                case 6:
                                    reject(new Error(`Error 6: specified group doesn't exist\n${shellCommand.error}`));
                                    break;
                                case 8:
                                    reject(new Error(`Error 8: can't remove user's primary group\n${shellCommand.error}`));
                                    break;
                                case 10:
                                    reject(new Error(`Error 10: can't update group file\n${shellCommand.error}`));
                                    break;
                                default:
                                    reject(new Error(`Unknown error:\n${shellCommand.error}`));
                                    break;
                            }
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(`The group "${group}" doesn\'t exists`);
                }
            }).catch((e) => {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then(() => {
                callback(null);
            }).catch((e) => {
                callback(e);
            });
        }
    }
    members(group, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(group).then((exists) => {
                if (exists) {
                    linux_shell_command_1.execute('getent group \'!?!\' | cut -d: -f4', [group]).then(({ shellCommand, success }) => {
                        if (success) {
                            resolve(shellCommand.stdout.trim().split(','));
                        }
                        else {
                            switch (shellCommand.exitStatus) {
                                case 1:
                                    reject(new Error(`Error 1: Missing arguments, or database unknown.\n${shellCommand.error}`));
                                    break;
                                case 2:
                                    reject(new Error(`Error 2: One or more supplied key could not be found in the database.\n${shellCommand.error}`));
                                    break;
                                default:
                                    reject(new Error(`Unknown error:\n${shellCommand.error}`));
                                    break;
                            }
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject('This group doesn\'t exists');
                }
            }).catch((e) => {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then((members) => {
                callback(null, members);
            }).catch((e) => {
                //@ts-ignore
                callback(e);
            });
        }
    }
}
exports.Groups = Groups;
