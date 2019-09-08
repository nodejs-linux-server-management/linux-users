"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shells_1 = require("./shells");
const groups_1 = require("./groups");
const users_1 = require("./users");
var Shells;
(function (Shells) {
    function shells() {
        try {
            return new shells_1.Shells();
        }
        catch (e) {
            throw e;
        }
    }
    Shells.shells = shells;
    function list(callback) {
        if (typeof callback === 'undefined') {
            try {
                return shells().list();
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                shells().list(callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Shells.list = list;
    function exists(shell, callback) {
        if (typeof callback === 'undefined') {
            try {
                return shells().exists(shell);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                shells().exists(shell, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Shells.exists = exists;
})(Shells = exports.Shells || (exports.Shells = {}));
var Groups;
(function (Groups) {
    function groups() {
        try {
            return new groups_1.Groups();
        }
        catch (e) {
            throw e;
        }
    }
    Groups.groups = groups;
    function list(callback) {
        if (typeof callback === 'undefined') {
            try {
                return groups().list();
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                groups().list(callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Groups.list = list;
    function exists(groupNames, callback) {
        if (typeof callback === 'undefined') {
            try {
                return groups().exists(groupNames);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                groups().exists(groupNames, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Groups.exists = exists;
    function create(name, id, callback) {
        if (typeof callback === 'undefined') {
            try {
                return groups().create(name, id);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                groups().create(name, id, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Groups.create = create;
    function deleteGroup(group, callback) {
        if (typeof callback === 'undefined') {
            try {
                return groups().delete(group);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                groups().delete(group, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Groups.deleteGroup = deleteGroup;
    function members(group, callback) {
        if (typeof callback === 'undefined') {
            try {
                return groups().members(group);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                groups().members(group, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Groups.members = members;
})(Groups = exports.Groups || (exports.Groups = {}));
var Users;
(function (Users) {
    function users() {
        try {
            return new users_1.Users();
        }
        catch (e) {
            throw e;
        }
    }
    Users.users = users;
    function usernameValidator(username) {
        try {
            return users().usernameValidator(username);
        }
        catch (e) {
            throw e;
        }
    }
    Users.usernameValidator = usernameValidator;
    function list(callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().list();
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().list(callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.list = list;
    function listSystemUsers(callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().listSystemUsers();
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().listSystemUsers(callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.listSystemUsers = listSystemUsers;
    function listNonSystemUsers(callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().listNonSystemUsers();
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().listNonSystemUsers(callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.listNonSystemUsers = listNonSystemUsers;
    function exists(usernames, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().exists(usernames);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().exists(usernames, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.exists = exists;
    function informations(usernames, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().informations(usernames);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().informations(usernames, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.informations = informations;
    function listWithInformations(callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().listWithInformations();
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().listWithInformations(callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.listWithInformations = listWithInformations;
    function create(username, uid, password, primaryGroup, secondaryGroups, shell, homeDirectory, comment, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().create(username, uid, password, primaryGroup, secondaryGroups, shell, homeDirectory, comment);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().create(username, uid, password, primaryGroup, secondaryGroups, shell, homeDirectory, comment, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.create = create;
    function changePrimaryGroup(username, primaryGroup, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().changePrimaryGroup(username, primaryGroup);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().changePrimaryGroup(username, primaryGroup, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.changePrimaryGroup = changePrimaryGroup;
    function changeSecondaryGroups(username, secondaryGroups, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().changeSecondaryGroups(username, secondaryGroups);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().changeSecondaryGroups(username, secondaryGroups, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.changeSecondaryGroups = changeSecondaryGroups;
    function addSecondaryGroup(username, group, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().addSecondaryGroup(username, group);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().addSecondaryGroup(username, group, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.addSecondaryGroup = addSecondaryGroup;
    function removeSecondaryGroup(username, group, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().removeSecondaryGroup(username, group);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().removeSecondaryGroup(username, group, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.removeSecondaryGroup = removeSecondaryGroup;
    function lock(username, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().lock(username);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().lock(username, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.lock = lock;
    function unlock(username, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().unlock(username);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().unlock(username, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.unlock = unlock;
    function checkPassword(username, password, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().checkPassword(username, password);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().checkPassword(username, password, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.checkPassword = checkPassword;
    function changePassword(username, password, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().changePassword(username, password);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().changePassword(username, password, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.changePassword = changePassword;
    function changeShell(username, shell, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().changeShell(username, shell);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().changeShell(username, shell, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.changeShell = changeShell;
    function changeHomeDirectory(username, homeDirectory, moveContent, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().changeHomeDirectory(username, homeDirectory, moveContent);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().changeHomeDirectory(username, homeDirectory, moveContent, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.changeHomeDirectory = changeHomeDirectory;
    function changeName(username, newName, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().changeName(username, newName);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().changeName(username, newName, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.changeName = changeName;
    function changeUserId(username, uid, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().changeUserId(username, uid);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().changeUserId(username, uid, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.changeUserId = changeUserId;
    function changeComment(username, comment, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().changeComment(username, comment);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().changeComment(username, comment, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.changeComment = changeComment;
    function changeAccountExpiryDate(username, expiryDate, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().changeAccountExpiryDate(username, expiryDate);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().changeAccountExpiryDate(username, expiryDate, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.changeAccountExpiryDate = changeAccountExpiryDate;
    function changePasswordExpiryFrequency(username, days, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().changePasswordExpiryFrequency(username, days);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().changePasswordExpiryFrequency(username, days, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.changePasswordExpiryFrequency = changePasswordExpiryFrequency;
    function deleteUser(username, deleteHomeDirectory, callback) {
        if (typeof callback === 'undefined') {
            try {
                return users().delete(username, deleteHomeDirectory);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            try {
                users().delete(username, deleteHomeDirectory, callback);
            }
            catch (e) {
                throw e;
            }
        }
    }
    Users.deleteUser = deleteUser;
})(Users = exports.Users || (exports.Users = {}));
