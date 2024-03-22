import { IProfileService } from "./interfaces/IProfileService";
import { User } from "../entities/User";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { Required } from "crisper.di/annotations/Required";
import { Interface } from "crisper.std/Interface";
import { ILocalUserRepository } from "../repositories/interfaces/ILocalUserRepository";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IUser } from "../entities/interfaces/IUser";

export class ProfileService implements IProfileService {
    @Required(new Interface<ILocalUserRepository>("ILocalUserRepository"))
    private localUserRepository: ILocalUserRepository;
    @Required(new Interface<IUserRepository>("IUserRepository"))
    private userRepository: IUserRepository;
    
    public async refresh(profile: User): Promise<void> {
        const cachedProfile: IUser = this.localUserRepository.get();
        if (!cachedProfile) throw new RequestException(400, "Token is null");
        
        profile.updateData(cachedProfile);
        profile.updateData(await this.userRepository.getProfile(cachedProfile.token));
        this.localUserRepository.save(profile);
    }
    
    public logout(profile: User): void {
        this.localUserRepository.clear();
        profile.clear();
    }
    
    public async update(from: User, to: User): Promise<void> {
        const token: string = await this.userRepository.update(from);
        to.token = token;
        to.updateData(await this.userRepository.getProfile(token));
        this.localUserRepository.save(to);
    }
    
    implementsIProfileService() {}
}