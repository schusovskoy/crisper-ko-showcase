import { User } from "../../entities/User";

export interface IProfileService {
    refresh(profile: User): Promise<void>;
    logout(profile: User): void;
    update(from: User, to: User): Promise<void>;
    implementsIProfileService?();
}