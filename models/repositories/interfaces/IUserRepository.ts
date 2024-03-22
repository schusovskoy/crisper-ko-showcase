import { User } from "../../entities/User";
import { IUser } from "../../entities/interfaces/IUser";

export interface IUserRepository {
	signup(user: User): Promise<void>;
	signin(user: User): Promise<string>;
	getProfile(token: string): Promise<IUser>;
	update(user: User): Promise<string>;
	remind(user: User): Promise<void>;
	implementsIUserRepository?();
}