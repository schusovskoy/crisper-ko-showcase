import { ILocalUserRepository } from "./interfaces/ILocalUserRepository";
import { User } from "../entities/User";
import { IUser } from "../entities/interfaces/IUser";

export class LocalUserRepository implements ILocalUserRepository {
    public save(user: User): void {
        localStorage.setItem("profile", user.serializeForSaving());
    }
    
    public get(): IUser {
        return JSON.parse(localStorage.getItem("profile"));
    }
    
    public clear(): void {
        localStorage.clear();
    }
    
    implementsILocalUserRepository() {}
}