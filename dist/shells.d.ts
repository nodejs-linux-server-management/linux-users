export declare class Shells {
    private packages;
    constructor();
    private setup;
    private commandsExists;
    list(): Promise<string[]>;
    list(callback: (error: Error | null, shells: string[]) => void): void;
    exists(shell: string): Promise<boolean>;
    exists(shell: string, callback: (error: Error | null, exists: boolean) => void): void;
}
