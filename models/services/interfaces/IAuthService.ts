import { User } from "../../entities/User";
import { SocialUser } from "../../entities/SocialUser";

export interface IAuthService {
    signup(user: User): Promise<void>;
    signin(user: User, profile: User): Promise<void>;
    remind(user: User): Promise<void>;
    signinSocial(user: SocialUser, profile: User): Promise<void>;
    signupSocial(user: SocialUser, profile: User): Promise<void>;
    implementsIAuthService?();
}