import { SocialUser } from "../../entities/SocialUser";

export interface ISocialUserRepository {
    getVkToken(): Promise<string>;
    getFbToken(): Promise<string>;
    getOkToken(): Promise<string>;
    signin(user: SocialUser): Promise<string>;
    signup(user: SocialUser): Promise<string>;
    implementsISocialUserRepository?();
}