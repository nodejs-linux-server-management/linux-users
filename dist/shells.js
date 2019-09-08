"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const linux_shell_command_1 = require("linux-shell-command");
const linux_command_exists_1 = require("linux-command-exists");
class Shells {
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
                linux_shell_command_1.execute('grep -v "#" /etc/shells').then(({ shellCommand, success }) => {
                    if (success) {
                        let shells = shellCommand.stdout.trim().split('\n');
                        shells.push('/bin/false', '/sbin/nologin');
                        resolve(shells);
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
            result.then((shells) => {
                callback(null, shells);
            }).catch((e) => {
                //@ts-ignore
                callback(e);
            });
        }
    }
    exists(shell, callback) {
        var result = new Promise((resolve, reject) => {
            this.list().then((shells) => {
                resolve(shells.includes(shell));
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
}
exports.Shells = Shells;
