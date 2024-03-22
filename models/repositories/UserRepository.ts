import { User } from "../entities/User";
import { IUserRepository } from "./interfaces/IUserRepository";
import { IUser } from "../entities/interfaces/IUser";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { AsyncRequest } from "crisper.ko/asyncrequest/AsyncRequest";

export class UserRepository implements IUserRepository {
    public async signup(user: User): Promise<void> {
        if (user.password != user.second) throw new RequestException(400, "{\"password\":\"Пароль и подтверждение" +
                                                                          " не совпадают\"}");
        
        var request: AsyncRequest = new AsyncRequest();
        request.open("POST", "/user");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.timeout = 5000;
        await request.send(user.serializeUrlEncoded(false, "email", "fio", "password", "phone"));
    }
    
    public async signin(user: User): Promise<string> {
        var request: AsyncRequest = new AsyncRequest();
        request.open("POST", "/user/signin");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.timeout = 5000;
        var jsonToken: string = await request.send(`username=${user.email}` +
                                                   `&password=${user.password}`);
        return JSON.parse(jsonToken).token;
    }
    
    public async getProfile(token: string): Promise<IUser> {
        var request: AsyncRequest = new AsyncRequest();
        request.open("GET", "/user");
        request.setRequestHeader("X-Auth-Token", token);
        request.timeout = 5000;
        var userString: string = await request.send();
        return JSON.parse(userString);
    }
    
    public async remind(user: User): Promise<void> {
        var request: AsyncRequest = new AsyncRequest();
        request.open("POST", "/user/resetpassword");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.timeout = 5000;
        await request.send(`username=${user.email}`);
    }
    
    public async update(user: User): Promise<string> {
        if (user.password != user.second) throw new RequestException(400, "{\"password\":\"Пароль и подтверждение" +
                                                                          " не совпадают\"}");
    
        var request: AsyncRequest = new AsyncRequest();
        request.open("PUT", "/user");
        request.setRequestHeader("X-Auth-Token", user.token);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.timeout = 5000;
        return JSON.parse(await request.send(user.serializeForUpdate())).token;
    }
    
    implementsIUserRepository() {}
}