import { Shells as ShellsClass } from "./shells";
import { Groups as GroupsClass } from "./groups";
import { Users as UsersClass, UserInformations } from "./users";

export namespace Shells {
	export function shells(): ShellsClass {
		try {
			return new ShellsClass();
		} catch (e) {
			throw e;
		}
	}

	export function list(): Promise<string[]>;
	export function list(callback: (error: Error | null, shells: string[]) => void): void;
	export function list(callback?: (error: Error | null, shells: string[]) => void): Promise<string[]> | void {
		if (typeof callback === 'undefined') {
			try {
				return shells().list();
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				shells().list(callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function exists(shell: string): Promise<boolean>;
	export function exists(shell: string, callback: (error: Error | null, exists: boolean) => void): void;
	export function exists(shell: string, callback?: (error: Error | null, exists: boolean) => void): Promise<boolean> | void {
		if (typeof callback === 'undefined') {
			try {
				return shells().exists(shell);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				shells().exists(shell, callback);
			} catch (e) {
				throw e;
			}
		}
	}
}

export namespace Groups {
	export function groups(): GroupsClass {
		try {
			return new GroupsClass();
		} catch (e) {
			throw e;
		}
	}

	export function list(): Promise<string[]>;
	export function list(callback: (error: Error | null, groups: string[]) => void): void;
	export function list(callback?: (error: Error | null, groups: string[]) => void): Promise<string[]> | void {
		if (typeof callback === 'undefined') {
			try {
				return groups().list();
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				groups().list(callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function exists(groupNames: string | string[]): Promise<boolean | { [username: string]: boolean }>;
	export function exists(groupNames: string | string[], callback: (error: Error | null, exists: boolean | { [username: string]: boolean }) => void): void;
	export function exists(groupNames: string | string[], callback?: (error: Error | null, exists: boolean | { [username: string]: boolean }) => void): Promise<boolean | { [username: string]: boolean }> | void {
		if (typeof callback === 'undefined') {
			try {
				return groups().exists(groupNames);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				groups().exists(groupNames, callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function create(name: string, id?: number): Promise<void>;
	export function create(name: string, id: number | undefined, callback: (error: Error | null) => void): void;
	export function create(name: string, id: number | undefined, callback?: (error: Error | null) => void): Promise<void> | void {
		if (typeof callback === 'undefined') {
			try {
				return groups().create(name, id);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				groups().create(name, id, callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function deleteGroup(group: string): Promise<void>;
	export function deleteGroup(group: string, callback: (error: Error | null) => void): void;
	export function deleteGroup(group: string, callback?: (error: Error | null) => void): Promise<void> | void {
		if (typeof callback === 'undefined') {
			try {
				return groups().delete(group);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				groups().delete(group, callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function members(group: string): Promise<string[]>;
	export function members(group: string, callback: (error: Error | null, members: string[]) => void): void
	export function members(group: string, callback ?: (error: Error | null, members: string[]) => void): Promise<string[]> | void {
		if(typeof callback === 'undefined'){
			try{
				return groups().members(group);
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				groups().members(group, callback);
			}catch(e){
				throw e;
			}
		}
	}
}

export namespace Users {
	export function users(): UsersClass {
		try{
			return new UsersClass();
		}catch(e){
			throw e;
		}
	}

	export function usernameValidator(username: string): boolean {
		try{
			return users().usernameValidator(username);
		}catch(e){
			throw e;
		}
	}

	export function list(): Promise<string[]>;
	export function list(callback: (error: Error | null, usernames: string[]) => void): void;
	export function list(callback ?: (error: Error | null, usernames: string[]) => void): Promise<string[]> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().list();
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().list(callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function listSystemUsers(): Promise<string[]>;
	export function listSystemUsers(callback: (error: Error | null, usernames: string[]) => void): void;
	export function listSystemUsers(callback ?: (error: Error | null, usernames: string[]) => void): Promise<string[]> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().listSystemUsers();
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().listSystemUsers(callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function listNonSystemUsers(): Promise<string[]>;
	export function listNonSystemUsers(callback: (error: Error | null, usernames: string[]) => void): void;
	export function listNonSystemUsers(callback ?: (error: Error | null, usernames: string[]) => void): Promise<string[]> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().listNonSystemUsers();
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().listNonSystemUsers(callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function exists(usernames: string | string[]): Promise<boolean | { [username: string]: boolean }>;
	export function exists(usernames: string | string[], callback: (error: Error | null, informations: boolean | { [username: string]: boolean }) => void): void;
	export function exists(usernames: string | string[], callback ?: (error: Error | null, informations: boolean | { [username: string]: boolean }) => void): Promise<boolean | { [username: string]: boolean }> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().exists(usernames);
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().exists(usernames, callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function informations(usernames: string | string[]): Promise<{ [username: string]: UserInformations }>;
	export function informations(usernames: string | string[], callback: (error: Error | null, informations: { [username: string]: UserInformations }) => void): void;
	export function informations(usernames: string | string[], callback ?: (error: Error | null, informations: { [username: string]: UserInformations }) => void): Promise<{ [username: string]: UserInformations }> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().informations(usernames);
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().informations(usernames, callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function listWithInformations(): Promise<{ [username: string]: UserInformations }>;
	export function listWithInformations(callback: (error: Error | null, informations: { [username: string]: UserInformations }) => void): void;
	export function listWithInformations(callback ?: (error: Error | null, informations: { [username: string]: UserInformations }) => void): Promise<{ [username: string]: UserInformations }> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().listWithInformations();
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().listWithInformations(callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function create(username: string, uid: number | 'default', password: string | null, primaryGroup: string | 'default', secondaryGroups: string[] | null, shell: string | null, homeDirectory: string | null | 'default', comment: string | null): Promise<void>;
	export function create(username: string, uid: number | 'default', password: string | null, primaryGroup: string | 'default', secondaryGroups: string[] | null, shell: string | null, homeDirectory: string | null | 'default', comment: string | null, callback: (error: Error | null) => void): void;
	export function create(username: string, uid: number | 'default', password: string | null, primaryGroup: string | 'default', secondaryGroups: string[] | null, shell: string | null, homeDirectory: string | null | 'default', comment: string | null, callback ?: (error: Error | null) => void): Promise<void> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().create(username, uid, password, primaryGroup, secondaryGroups, shell, homeDirectory, comment);
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().create(username, uid, password, primaryGroup, secondaryGroups, shell, homeDirectory, comment, callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function changePrimaryGroup(username: string, primaryGroup: string): Promise<void>;
	export function changePrimaryGroup(username: string, primaryGroup: string, callback: (error: Error | null) => void): void;
	export function changePrimaryGroup(username: string, primaryGroup: string, callback ?: (error: Error | null) => void): Promise<void> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().changePrimaryGroup(username, primaryGroup);
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().changePrimaryGroup(username, primaryGroup, callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function changeSecondaryGroups(username: string, secondaryGroups: string[]): Promise<void>;
	export function changeSecondaryGroups(username: string, secondaryGroups: string[], callback: (error: Error | null) => void): void;
	export function changeSecondaryGroups(username: string, secondaryGroups: string[], callback ?: (error: Error | null) => void): Promise<void> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().changeSecondaryGroups(username, secondaryGroups);
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().changeSecondaryGroups(username, secondaryGroups, callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function addSecondaryGroup(username: string, group: string): Promise<void>;
	export function addSecondaryGroup(username: string, group: string, callback: (error: Error | null) => void): void;
	export function addSecondaryGroup(username: string, group: string, callback ?: (error: Error | null) => void): Promise<void> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().addSecondaryGroup(username, group);
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().addSecondaryGroup(username, group, callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function removeSecondaryGroup(username: string, group: string): Promise<void>;
	export function removeSecondaryGroup(username: string, group: string, callback: (error: Error | null) => void): void;
	export function removeSecondaryGroup(username: string, group: string, callback ?: (error: Error | null) => void): Promise<void> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().removeSecondaryGroup(username, group);
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().removeSecondaryGroup(username, group, callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function lock(username: string): Promise<void>;
	export function lock(username: string, callback: (error: Error | null) => void): void;
	export function lock(username: string, callback ?: (error: Error | null) => void): Promise<void> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().lock(username);
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().lock(username, callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function unlock(username: string): Promise<void>;
	export function unlock(username: string, callback: (error: Error | null) => void): void;
	export function unlock(username: string, callback ?: (error: Error | null) => void): Promise<void> | void {
		if(typeof callback === 'undefined'){
			try{
				return users().unlock(username);
			}catch(e){
				return Promise.reject(e);
			}
		}else{
			try{
				users().unlock(username, callback);
			}catch(e){
				throw e;
			}
		}
	}

	export function checkPassword(username: string, password: string | null): Promise<boolean>;
	export function checkPassword(username: string, password: string | null, callback: (error: Error | null, ok: boolean) => void): void;
	export function checkPassword(username: string, password: string | null, callback ?: (error: Error | null, ok: boolean) => void): Promise<boolean> | void {
		if (typeof callback === 'undefined') {
			try {
				return users().checkPassword(username, password);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				users().checkPassword(username, password, callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function changePassword(username: string, password: string): Promise<void>;
	export function changePassword(username: string, password: string, callback: (error: Error | null) => void): void;
	export function changePassword(username: string, password: string, callback ?: (error: Error | null) => void): Promise<void> | void {
		if (typeof callback === 'undefined') {
			try {
				return users().changePassword(username, password);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				users().changePassword(username, password, callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function changeShell(username: string, shell: string): Promise<void>;
	export function changeShell(username: string, shell: string, callback: (error: Error | null) => void): void;
	export function changeShell(username: string, shell: string, callback ?: (error: Error | null) => void): Promise<void> | void {
		if (typeof callback === 'undefined') {
			try {
				return users().changeShell(username, shell);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				users().changeShell(username, shell, callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function changeHomeDirectory(username: string, homeDirectory: string, moveContent ?: boolean): Promise<void>;
	export function changeHomeDirectory(username: string, homeDirectory: string, moveContent: boolean | undefined, callback: (error: Error | null) => void): void
	export function changeHomeDirectory(username: string, homeDirectory: string, moveContent: boolean | undefined, callback ?: (error: Error | null) => void): Promise<void> | void {
		if (typeof callback === 'undefined') {
			try {
				return users().changeHomeDirectory(username, homeDirectory, moveContent);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				users().changeHomeDirectory(username, homeDirectory, moveContent, callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function changeName(username: string, newName: string): Promise<void>;
	export function changeName(username: string, newName: string, callback: (error: Error | null) => void): void;
	export function changeName(username: string, newName: string, callback ?: (error: Error | null) => void): Promise<void> | void {
		if (typeof callback === 'undefined') {
			try {
				return users().changeName(username, newName);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				users().changeName(username, newName, callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function changeUserId(username: string, uid: number): Promise<void>;
	export function changeUserId(username: string, uid: number, callback: (error: Error | null) => void): void;
	export function changeUserId(username: string, uid: number, callback ?: (error: Error | null) => void): Promise<void> | void {
		if (typeof callback === 'undefined') {
			try {
				return users().changeUserId(username, uid);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				users().changeUserId(username, uid, callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function changeComment(username: string, comment: string): Promise<void>;
	export function changeComment(username: string, comment: string, callback: (error: Error | null) => void): void;
	export function changeComment(username: string, comment: string, callback ?: (error: Error | null) => void): Promise<void> | void {
		if (typeof callback === 'undefined') {
			try {
				return users().changeComment(username, comment);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				users().changeComment(username, comment, callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function changeAccountExpiryDate(username: string, expiryDate: Date): Promise<void>;
	export function changeAccountExpiryDate(username: string, expiryDate: Date, callback: (error: Error | null) => void): void;
	export function changeAccountExpiryDate(username: string, expiryDate: Date, callback ?: (error: Error | null) => void): Promise<void> | void {
		if (typeof callback === 'undefined') {
			try {
				return users().changeAccountExpiryDate(username, expiryDate);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				users().changeAccountExpiryDate(username, expiryDate, callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function changePasswordExpiryFrequency(username: string, days: number): Promise<void>;
	export function changePasswordExpiryFrequency(username: string, days: number, callback: (error: Error | null) => void): void;
	export function changePasswordExpiryFrequency(username: string, days: number, callback ?: (error: Error | null) => void): Promise<void> | void {
		if (typeof callback === 'undefined') {
			try {
				return users().changePasswordExpiryFrequency(username, days);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				users().changePasswordExpiryFrequency(username, days, callback);
			} catch (e) {
				throw e;
			}
		}
	}

	export function deleteUser(username: string, deleteHomeDirectory ?: boolean): Promise<void>;
	export function deleteUser(username: string, deleteHomeDirectory: boolean | undefined, callback: (error: Error | null) => void): void;
	export function deleteUser(username: string, deleteHomeDirectory: boolean | undefined, callback ?: (error: Error | null) => void): Promise<void> | void {
		if (typeof callback === 'undefined') {
			try {
				return users().delete(username, deleteHomeDirectory);
			} catch (e) {
				return Promise.reject(e);
			}
		} else {
			try {
				users().delete(username, deleteHomeDirectory, callback);
			} catch (e) {
				throw e;
			}
		}
	}

}
