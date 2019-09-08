"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const linux_command_exists_1 = require("linux-command-exists");
const linux_shell_command_1 = require("linux-shell-command");
const groups_1 = require("./groups");
const shells_1 = require("./shells");
const fs_1 = require("fs");
class Users {
    constructor() {
        this.packages = {
            sudo: null,
            useradd: null,
            usermod: null,
            userdel: null,
            passwd: null,
            gpasswd: null,
            chage: null,
            cut: null,
            awk: null
        };
        this.usersList = null;
        if (os_1.platform() !== 'linux') {
            throw Error("This module only runs on linux");
        }
        else {
            this.groups = new groups_1.Groups();
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
    usernameValidator(username) {
        return username.match(/^[a-z0-9]+$/) !== null;
    }
    list(callback) {
        var result = new Promise((resolve, reject) => {
            if (this.usersList === null) {
                this.commandsExists().then(() => {
                    linux_shell_command_1.execute('cut -d: -f1 /etc/passwd').then(({ shellCommand, success }) => {
                        if (success === true) {
                            this.usersList = shellCommand.stdout.trim().split('\n');
                            resolve(this.usersList);
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
            }
            else {
                resolve(this.usersList);
            }
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then((usernames) => {
                callback(null, usernames);
            }).catch((e) => {
                //@ts-ignore
                callback(e);
            });
        }
    }
    listSystemUsers(callback) {
        var result = new Promise((resolve, reject) => {
            this.commandsExists().then(() => {
                linux_shell_command_1.execute('awk -F: \'$3 < 1000 { print $1 }\' /etc/passwd').then(({ shellCommand, success }) => {
                    if (success === true) {
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
            result.then((usernames) => {
                callback(null, usernames);
            }).catch((e) => {
                //@ts-ignore
                callback(e);
            });
        }
    }
    listNonSystemUsers(callback) {
        var result = new Promise((resolve, reject) => {
            this.commandsExists().then(() => {
                linux_shell_command_1.execute('awk -F: \'$3 >= 1000 { print $1 }\' /etc/passwd').then(({ shellCommand, success }) => {
                    if (success === true) {
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
            result.then((usernames) => {
                callback(null, usernames);
            }).catch((e) => {
                //@ts-ignore
                callback(e);
            });
        }
    }
    exists(usernames, callback) {
        var result = new Promise((resolve, reject) => {
            this.list().then((list) => {
                if (Array.isArray(usernames)) {
                    let r = {};
                    for (var i = 0; i < usernames.length; i++) {
                        let user = usernames[i];
                        r[user] = list.includes(user);
                    }
                    resolve(r);
                }
                else {
                    resolve(list.includes(usernames));
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
    informations(usernames, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(usernames).then((exists) => {
                let ok;
                if (exists === true || Object.values(exists).every((e) => e === true)) {
                    if (!Array.isArray(usernames)) {
                        usernames = [usernames];
                    }
                    let command = 'getent passwd \'!?!\' '.replace(/'\!\?\!'/, new Array(usernames.length).fill("'!?!'").join(' '));
                    linux_shell_command_1.execute(command, usernames).then(({ shellCommand, success }) => {
                        if (success) {
                            var informations = {};
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
                                };
                            }
                            resolve(informations);
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
                    //@ts-ignore
                    reject(new Error(`The following usernames don't exists:\n\t${typeof usernames === 'string' ? usernames : usernames.filter((username) => { return exists[username] === false; }).join('\n')}`));
                }
            }).catch((e) => {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then((informations) => {
                callback(null, informations);
            }).catch((e) => {
                //@ts-ignore
                callback(e);
            });
        }
    }
    listWithInformations(callback) {
        var result = new Promise((resolve, reject) => {
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
        }
        else {
            result.then((informations) => {
                callback(null, informations);
            }).catch((e) => {
                //@ts-ignore
                callback(e);
            });
        }
    }
    create(username, uid, password, primaryGroup, secondaryGroups, shell, homeDirectory, comment, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === false) {
                    if (this.usernameValidator(username)) {
                        var command = 'sudo useradd ';
                        var args = [];
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
                        }
                        else if (homeDirectory === null) {
                            command += '-M ';
                        }
                        command += '\'!?!\'';
                        args.push(username);
                        linux_shell_command_1.execute(command, args).then(({ shellCommand, success }) => {
                            //User created
                            if (success) {
                                //@ts-ignore because to get here the list have to be initialized.
                                this.usersList.push(username);
                                var p = [];
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
                            }
                            else {
                                switch (shellCommand.exitStatus) {
                                    case 1:
                                        reject(new Error(`Error 1: Can't update password file\n${shellCommand.error}`));
                                        break;
                                    case 2:
                                        reject(new Error(`Error 2: Invalid command syntax\n${shellCommand.error}`));
                                        break;
                                    case 3:
                                        reject(new Error(`Error 3: Invalid argument to option\n${shellCommand.error}`));
                                        break;
                                    case 4:
                                        reject(new Error(`Error 4: UID already in use\n${shellCommand.error}`));
                                        break;
                                    case 6:
                                        reject(new Error(`Error 6: Specified group doesn't exists\n${shellCommand.error}`));
                                        break;
                                    case 9:
                                        reject(new Error(`Error 9: Username already in use\n${shellCommand.error}`));
                                        break;
                                    case 10:
                                        reject(new Error(`Error 10: Can't update group file\n${shellCommand.error}`));
                                        break;
                                    case 12:
                                        reject(new Error(`Error 12: Can't create home directory\n${shellCommand.error}`));
                                        break;
                                    case 14:
                                        reject(new Error(`Error 14: Can't update SELinux user mapping\n${shellCommand.error}`));
                                        break;
                                    default: reject(new Error(`Unknown error\n${shellCommand.error}`));
                                }
                            }
                        }).catch((e) => {
                            reject(e);
                        });
                    }
                    else {
                        reject(new Error(`"${username}" is not a valid username.`));
                    }
                }
                else {
                    reject(new Error(`The account "${username}" already exists`));
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
    changePrimaryGroup(username, primaryGroup, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    this.groups.exists(primaryGroup).then((exists) => {
                        if (exists === true) {
                            linux_shell_command_1.execute('sudo usermod -g \'!?!\' \'!?!\'', [primaryGroup, username]).then(({ shellCommand, success }) => {
                                if (success) {
                                    resolve();
                                }
                                else {
                                    reject(shellCommand.error);
                                }
                            });
                        }
                        else {
                            reject(new Error(`The group "${primaryGroup}" doesn't exists`));
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    changeSecondaryGroups(username, secondaryGroups, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    this.groups.exists(secondaryGroups).then((exists) => {
                        if (Object.values(exists).every((e) => e === true)) {
                            linux_shell_command_1.execute('sudo usermod -G \'!?!\' \'!?!\'', [secondaryGroups.join(','), username]).then(({ shellCommand, success }) => {
                                if (success) {
                                    resolve();
                                }
                                else {
                                    reject(shellCommand.error);
                                }
                            }).catch((e) => {
                                reject(e);
                            });
                        }
                        else {
                            //@ts-ignore
                            reject(new Error(`The following groups don't exists:\n\t${secondaryGroups.filter((group) => { return exists[group] === false; }).join('\n')}`));
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    addSecondaryGroup(username, group, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    this.groups.exists(group).then((exists) => {
                        if (exists === true) {
                            linux_shell_command_1.execute('sudo usermod -aG \'!?!\' \'!?!\'', [group, username]).then(({ shellCommand, success }) => {
                                if (success) {
                                    resolve();
                                }
                                else {
                                    reject(shellCommand.error);
                                }
                            }).catch((e) => {
                                reject(e);
                            });
                        }
                        else {
                            reject(new Error(`The group "${group}" doesn't exists`));
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    removeSecondaryGroup(username, group, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    this.groups.exists(group).then((exists) => {
                        if (exists === true) {
                            linux_shell_command_1.execute('sudo gpasswd -d \'!?!\' \'!?!\'', [username, group]).then(({ shellCommand, success }) => {
                                if (success) {
                                    resolve();
                                }
                                else {
                                    reject(shellCommand.error);
                                }
                            }).catch((e) => {
                                reject(e);
                            });
                        }
                        else {
                            reject(new Error(`The group "${group}" doesn't exists`));
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    lock(username, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    linux_shell_command_1.execute('sudo usermod -L \'!?!\'', [username]).then(({ shellCommand, success }) => {
                        if (success) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    unlock(username, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    linux_shell_command_1.execute('sudo usermod -U \'!?!\'', [username]).then(({ shellCommand, success }) => {
                        if (success) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    checkPassword(username, password, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists) {
                    linux_shell_command_1.execute('sudo getent shadow \'!?!\' | cut -d: -f2', [username]).then(({ shellCommand, success }) => {
                        if (success) {
                            if (password === null) {
                                resolve(shellCommand.stdout.trim() === '!');
                            }
                            else {
                                var userShadow = shellCommand.stdout.trim();
                                var buf = userShadow.split('$');
                                var hash = buf[1];
                                var salt = buf[2];
                                linux_shell_command_1.execute('echo \'!?!\' | openssl passwd \'!?!\' -salt \'!?!\' -stdin', [password, `-${hash}`, salt]).then(({ shellCommand, success }) => {
                                    if (success) {
                                        var passwordHash = shellCommand.stdout.trim();
                                        resolve(userShadow === passwordHash);
                                    }
                                    else {
                                        reject(shellCommand.error);
                                    }
                                }).catch((e) => {
                                    reject(e);
                                });
                            }
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
                    reject(new Error(`The account "${username}" doesn't exists`));
                }
            }).catch((e) => {
                reject(e);
            });
        });
        if (typeof callback === 'undefined') {
            return result;
        }
        else {
            result.then((ok) => {
                callback(null, ok);
            }).catch((e) => {
                //@ts-ignore
                callback(e);
            });
        }
    }
    changePassword(username, password, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    linux_shell_command_1.execute('echo -e \'!?!\' | passwd \'!?!\'', [`${password}\n${password}`, username]).then(({ shellCommand, success }) => {
                        if (success) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    changeShell(username, shell, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    var shells = new shells_1.Shells();
                    shells.exists(shell).then((exists) => {
                        if (exists) {
                            linux_shell_command_1.execute('sudo chsh -s \'!?!\' \'!?!\'', [shell, username]).then(({ shellCommand, success }) => {
                                if (success) {
                                    resolve();
                                }
                                else {
                                    reject(shellCommand.error);
                                }
                            }).catch((e) => {
                                reject(e);
                            });
                        }
                        else {
                            reject(new Error(`The shell "${shell}" doesn't exists`));
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    changeHomeDirectory(username, homeDirectory, moveContent, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    fs_1.promises.access(homeDirectory).then(() => {
                        reject(new Error(`The directory ${homeDirectory} already exists`));
                    }).catch(() => {
                        linux_shell_command_1.execute(`sudo usermod -${moveContent === true ? 'm' : ''}d \'!?!\' \'!?!\'`, [homeDirectory, username]).then(({ shellCommand, success }) => {
                            if (success) {
                                resolve();
                            }
                            else {
                                reject(shellCommand.error);
                            }
                        }).catch((e) => {
                            reject(e);
                        });
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    changeName(username, newName, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    linux_shell_command_1.execute('sudo usermod -l \'!?!\' \'!?!\'', [newName, username]).then(({ shellCommand, success }) => {
                        if (success) {
                            //@ts-ignore
                            this.usersList[this.usersList.indexOf(username)] = newName;
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    changeUserId(username, uid, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    linux_shell_command_1.execute('sudo usermod -u \'!?!\' \'!?!\'', [String(Math.floor(uid)), username]).then(({ shellCommand, success }) => {
                        if (success) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    changeComment(username, comment, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    linux_shell_command_1.execute('sudo usermod -c \'!?!\' \'!?!\'', [comment, username]).then(({ shellCommand, success }) => {
                        if (success) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    changeAccountExpiryDate(username, expiryDate, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    var date = `${expiryDate.getFullYear()}-${expiryDate.getMonth() + 1}-${expiryDate.getDay()}`;
                    linux_shell_command_1.execute('sudo chage -E \'!?!\' \'!?!\'', [date, username]).then(({ shellCommand, success }) => {
                        if (success) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    changePasswordExpiryFrequency(username, days, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists === true) {
                    linux_shell_command_1.execute('sudo chage -M \'!?!\' \'!?!\'', [String(Math.floor(days)), username]).then(({ shellCommand, success }) => {
                        if (success) {
                            resolve();
                        }
                        else {
                            reject(shellCommand.error);
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
    delete(username, deleteHomeDirectory, callback) {
        var result = new Promise((resolve, reject) => {
            this.exists(username).then((exists) => {
                if (exists) {
                    linux_shell_command_1.execute(`sudo userdel ${deleteHomeDirectory === true ? '-r' : ''} '!?!'`, [username]).then(({ shellCommand, success }) => {
                        if (success) {
                            //@ts-ignore because to get here the list have to be initialized.
                            this.usersList = this.usersList.filter(user => user !== username);
                            resolve();
                        }
                        else {
                            switch (shellCommand.exitStatus) {
                                case 1:
                                    reject(new Error(`Error 1: Can't update password file\n${shellCommand.error}`));
                                    break;
                                case 2:
                                    reject(new Error(`Error 2: Invalid command syntax\n${shellCommand.error}`));
                                    break;
                                case 6:
                                    reject(new Error(`Error 6: Specified user doesn't exists\n${shellCommand.error}`));
                                    break;
                                case 10:
                                    reject(new Error(`Error 10: Can't update group file\n${shellCommand.error}`));
                                    break;
                                case 12:
                                    reject(new Error(`Error 12: Can't remove home directory\n${shellCommand.error}`));
                                    break;
                                default: reject(new Error(`Unknown error\n${shellCommand.error}`));
                            }
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                }
                else {
                    reject(new Error(`The account "${username}" doesn't exists`));
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
}
exports.Users = Users;
