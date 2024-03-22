import { User } from "../../entities/User";
import { IUser } from "../../entities/interfaces/IUser";

export interface ILocalUserRepository {
	save(user: User): void;
	get(): IUser;
	clear(): void;
	implementsILocalUserRepository?();
}