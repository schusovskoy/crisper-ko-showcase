import { User } from "../entities/User";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IAuthService } from "./interfaces/IAuthService";
import { IUser } from "../entities/interfaces/IUser";
import { ILocalUserRepository } from "../repositories/interfaces/ILocalUserRepository";
import { Interface } from "crisper.std/Interface";
import { Required } from "crisper.di/annotations/Required";
import { SocialUser } from "../entities/SocialUser";
import { ISocialUserRepository } from "../repositories/interfaces/ISocialUserRepository";

export class AuthService implements IAuthService {
    @Required(new Interface<IUserRepository>("IUserRepository"))
    private userRepository: IUserRepository;
    @Required(new Interface<ILocalUserRepository>("ILocalUserRepository"))
    private localUserRepository: ILocalUserRepository;
    @Required(new Interface<ISocialUserRepository>("ISocialUserRepository"))
    private socialRepository: ISocialUserRepository;
    
    public signup(user: User): Promise<void> {
        return this.userRepository.signup(user);
    }
    
    public async signin(user: User, profile: User): Promise<void> {
        const token: string = await this.userRepository.signin(user);
        const updatedUser: IUser = await this.userRepository.getProfile(token);
        updatedUser.token = token;
        profile.updateData(updatedUser);
        this.localUserRepository.save(profile);
    }
    
    public remind(user: User): Promise<void> {
        return this.userRepository.remind(user);
    }
    
    public async signinSocial(user: SocialUser, profile: User): Promise<void> {
        if (user.social == "vk") user.token = await this.socialRepository.getVkToken();
        else if (user.social == "fb") user.token = await this.socialRepository.getFbToken();
        else if (user.social == "ok") user.token = await this.socialRepository.getOkToken();
        
        const token: string = await this.socialRepository.signin(user);
        const updatedUser: IUser = await this.userRepository.getProfile(token);
        updatedUser.token = token;
        profile.updateData(updatedUser);
        this.localUserRepository.save(profile);
    }
    
    public async signupSocial(user: SocialUser, profile: User): Promise<void> {
        const token: string = await this.socialRepository.signup(user);
        const updatedUser: IUser = await this.userRepository.getProfile(token);
        updatedUser.token = token;
        profile.updateData(updatedUser);
        this.localUserRepository.save(profile);
    }
    
    implementsIAuthService() {}
}