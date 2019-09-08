export declare class Groups {
    private packages;
    constructor();
    private setup;
    private commandsExists;
    list(): Promise<string[]>;
    list(callback: (error: Error | null, groups: string[]) => void): void;
    exists(groups: string | string[]): Promise<boolean | {
        [username: string]: boolean;
    }>;
    exists(groups: string | string[], callback: (error: Error | null, exists: boolean | {
        [username: string]: boolean;
    }) => void): void;
    create(name: string, id?: number): Promise<void>;
    create(name: string, id: number | undefined, callback: (error: Error | null) => void): void;
    delete(group: string): Promise<void>;
    delete(group: string, callback: (error: Error | null) => void): void;
    members(group: string): Promise<string[]>;
    members(group: string, callback: (error: Error | null, members: string[]) => void): void;
}
