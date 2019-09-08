export declare class Users {
    private packages;
    private usersList;
    private groups;
    constructor();
    private setup;
    private commandsExists;
    usernameValidator(username: string): boolean;
    list(): Promise<string[]>;
    list(callback: (error: Error | null, usernames: string[]) => void): void;
    listSystemUsers(): Promise<string[]>;
    listSystemUsers(callback: (error: Error | null, usernames: string[]) => void): void;
    listNonSystemUsers(): Promise<string[]>;
    listNonSystemUsers(callback: (error: Error | null, usernames: string[]) => void): void;
    exists(usernames: string | string[]): Promise<boolean | {
        [username: string]: boolean;
    }>;
    exists(usernames: string | string[], callback: (error: Error | null, informations: boolean | {
        [username: string]: boolean;
    }) => void): void;
    informations(usernames: string | string[]): Promise<{
        [username: string]: UserInformations;
    }>;
    informations(usernames: string | string[], callback: (error: Error | null, informations: {
        [username: string]: UserInformations;
    }) => void): void;
    listWithInformations(): Promise<{
        [username: string]: UserInformations;
    }>;
    listWithInformations(callback: (error: Error | null, informations: {
        [username: string]: UserInformations;
    }) => void): void;
    create(username: string, uid: number | 'default', password: string | null, primaryGroup: string | 'default', secondaryGroups: string[] | null, shell: string | null, homeDirectory: string | null | 'default', comment: string | null): Promise<void>;
    create(username: string, uid: number | 'default', password: string | null, primaryGroup: string | 'default', secondaryGroups: string[] | null, shell: string | null, homeDirectory: string | null | 'default', comment: string | null, callback: (error: Error | null) => void): void;
    changePrimaryGroup(username: string, primaryGroup: string): Promise<void>;
    changePrimaryGroup(username: string, primaryGroup: string, callback: (error: Error | null) => void): void;
    changeSecondaryGroups(username: string, secondaryGroups: string[]): Promise<void>;
    changeSecondaryGroups(username: string, secondaryGroups: string[], callback: (error: Error | null) => void): void;
    addSecondaryGroup(username: string, group: string): Promise<void>;
    addSecondaryGroup(username: string, group: string, callback: (error: Error | null) => void): void;
    removeSecondaryGroup(username: string, group: string): Promise<void>;
    removeSecondaryGroup(username: string, group: string, callback: (error: Error | null) => void): void;
    lock(username: string): Promise<void>;
    lock(username: string, callback: (error: Error | null) => void): void;
    unlock(username: string): Promise<void>;
    unlock(username: string, callback: (error: Error | null) => void): void;
    checkPassword(username: string, password: string | null): Promise<boolean>;
    checkPassword(username: string, password: string | null, callback: (error: Error | null, ok: boolean) => void): void;
    changePassword(username: string, password: string): Promise<void>;
    changePassword(username: string, password: string, callback: (error: Error | null) => void): void;
    changeShell(username: string, shell: string): Promise<void>;
    changeShell(username: string, shell: string, callback: (error: Error | null) => void): void;
    changeHomeDirectory(username: string, homeDirectory: string, moveContent?: boolean): Promise<void>;
    changeHomeDirectory(username: string, homeDirectory: string, moveContent: boolean | undefined, callback: (error: Error | null) => void): void;
    changeName(username: string, newName: string): Promise<void>;
    changeName(username: string, newName: string, callback: (error: Error | null) => void): void;
    changeUserId(username: string, uid: number): Promise<void>;
    changeUserId(username: string, uid: number, callback: (error: Error | null) => void): void;
    changeComment(username: string, comment: string): Promise<void>;
    changeComment(username: string, comment: string, callback: (error: Error | null) => void): void;
    changeAccountExpiryDate(username: string, expiryDate: Date): Promise<void>;
    changeAccountExpiryDate(username: string, expiryDate: Date, callback: (error: Error | null) => void): void;
    changePasswordExpiryFrequency(username: string, days: number): Promise<void>;
    changePasswordExpiryFrequency(username: string, days: number, callback: (error: Error | null) => void): void;
    delete(username: string, deleteHomeDirectory?: boolean): Promise<void>;
    delete(username: string, deleteHomeDirectory: boolean | undefined, callback: (error: Error | null) => void): void;
}
export declare type UserInformations = {
    username: string;
    shadowed: boolean;
    userId: number;
    groupId: number;
    comment: string;
    homeDirectory: string;
    defaultShell: string;
};
