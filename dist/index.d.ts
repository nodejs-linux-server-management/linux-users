import { Shells as ShellsClass } from "./shells";
import { Groups as GroupsClass } from "./groups";
import { Users as UsersClass, UserInformations } from "./users";
export declare namespace Shells {
    function shells(): ShellsClass;
    function list(): Promise<string[]>;
    function list(callback: (error: Error | null, shells: string[]) => void): void;
    function exists(shell: string): Promise<boolean>;
    function exists(shell: string, callback: (error: Error | null, exists: boolean) => void): void;
}
export declare namespace Groups {
    function groups(): GroupsClass;
    function list(): Promise<string[]>;
    function list(callback: (error: Error | null, groups: string[]) => void): void;
    function exists(groupNames: string | string[]): Promise<boolean | {
        [username: string]: boolean;
    }>;
    function exists(groupNames: string | string[], callback: (error: Error | null, exists: boolean | {
        [username: string]: boolean;
    }) => void): void;
    function create(name: string, id?: number): Promise<void>;
    function create(name: string, id: number | undefined, callback: (error: Error | null) => void): void;
    function deleteGroup(group: string): Promise<void>;
    function deleteGroup(group: string, callback: (error: Error | null) => void): void;
    function members(group: string): Promise<string[]>;
    function members(group: string, callback: (error: Error | null, members: string[]) => void): void;
}
export declare namespace Users {
    function users(): UsersClass;
    function usernameValidator(username: string): boolean;
    function list(): Promise<string[]>;
    function list(callback: (error: Error | null, usernames: string[]) => void): void;
    function listSystemUsers(): Promise<string[]>;
    function listSystemUsers(callback: (error: Error | null, usernames: string[]) => void): void;
    function listNonSystemUsers(): Promise<string[]>;
    function listNonSystemUsers(callback: (error: Error | null, usernames: string[]) => void): void;
    function exists(usernames: string | string[]): Promise<boolean | {
        [username: string]: boolean;
    }>;
    function exists(usernames: string | string[], callback: (error: Error | null, informations: boolean | {
        [username: string]: boolean;
    }) => void): void;
    function informations(usernames: string | string[]): Promise<{
        [username: string]: UserInformations;
    }>;
    function informations(usernames: string | string[], callback: (error: Error | null, informations: {
        [username: string]: UserInformations;
    }) => void): void;
    function listWithInformations(): Promise<{
        [username: string]: UserInformations;
    }>;
    function listWithInformations(callback: (error: Error | null, informations: {
        [username: string]: UserInformations;
    }) => void): void;
    function create(username: string, uid: number | 'default', password: string | null, primaryGroup: string | 'default', secondaryGroups: string[] | null, shell: string | null, homeDirectory: string | null | 'default', comment: string | null): Promise<void>;
    function create(username: string, uid: number | 'default', password: string | null, primaryGroup: string | 'default', secondaryGroups: string[] | null, shell: string | null, homeDirectory: string | null | 'default', comment: string | null, callback: (error: Error | null) => void): void;
    function changePrimaryGroup(username: string, primaryGroup: string): Promise<void>;
    function changePrimaryGroup(username: string, primaryGroup: string, callback: (error: Error | null) => void): void;
    function changeSecondaryGroups(username: string, secondaryGroups: string[]): Promise<void>;
    function changeSecondaryGroups(username: string, secondaryGroups: string[], callback: (error: Error | null) => void): void;
    function addSecondaryGroup(username: string, group: string): Promise<void>;
    function addSecondaryGroup(username: string, group: string, callback: (error: Error | null) => void): void;
    function removeSecondaryGroup(username: string, group: string): Promise<void>;
    function removeSecondaryGroup(username: string, group: string, callback: (error: Error | null) => void): void;
    function lock(username: string): Promise<void>;
    function lock(username: string, callback: (error: Error | null) => void): void;
    function unlock(username: string): Promise<void>;
    function unlock(username: string, callback: (error: Error | null) => void): void;
    function checkPassword(username: string, password: string | null): Promise<boolean>;
    function checkPassword(username: string, password: string | null, callback: (error: Error | null, ok: boolean) => void): void;
    function changePassword(username: string, password: string): Promise<void>;
    function changePassword(username: string, password: string, callback: (error: Error | null) => void): void;
    function changeShell(username: string, shell: string): Promise<void>;
    function changeShell(username: string, shell: string, callback: (error: Error | null) => void): void;
    function changeHomeDirectory(username: string, homeDirectory: string, moveContent?: boolean): Promise<void>;
    function changeHomeDirectory(username: string, homeDirectory: string, moveContent: boolean | undefined, callback: (error: Error | null) => void): void;
    function changeName(username: string, newName: string): Promise<void>;
    function changeName(username: string, newName: string, callback: (error: Error | null) => void): void;
    function changeUserId(username: string, uid: number): Promise<void>;
    function changeUserId(username: string, uid: number, callback: (error: Error | null) => void): void;
    function changeComment(username: string, comment: string): Promise<void>;
    function changeComment(username: string, comment: string, callback: (error: Error | null) => void): void;
    function changeAccountExpiryDate(username: string, expiryDate: Date): Promise<void>;
    function changeAccountExpiryDate(username: string, expiryDate: Date, callback: (error: Error | null) => void): void;
    function changePasswordExpiryFrequency(username: string, days: number): Promise<void>;
    function changePasswordExpiryFrequency(username: string, days: number, callback: (error: Error | null) => void): void;
    function deleteUser(username: string, deleteHomeDirectory?: boolean): Promise<void>;
    function deleteUser(username: string, deleteHomeDirectory: boolean | undefined, callback: (error: Error | null) => void): void;
}
