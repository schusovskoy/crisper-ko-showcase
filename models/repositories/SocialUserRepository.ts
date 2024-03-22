import { ISocialUserRepository } from "./interfaces/ISocialUserRepository";
import { SocialUser } from "../entities/SocialUser";
import { AsyncRequest } from "crisper.ko/asyncrequest/AsyncRequest";
import { SocialException } from "../exceptions/SocialException";
import { Exception } from "crisper.std/Exception";

export class SocialUserRepository implements ISocialUserRepository {
    public getVkToken(): Promise<string> {
        return new Promise((resolve: (data: string) => void, reject: (reason: Exception) => void) => {
            VK.Auth.login((response) => {
                if (response.session) resolve(response.session.sid);
                else reject(new SocialException("Vk Auth error"));
            });
        });
    }
    
    public getFbToken(): Promise<string> {
        return new Promise((resolve: (data: string) => void, reject: (reason: Exception) => void) => {
            FB.login((response) => {
                if (response.status == "connected") resolve(response.authResponse.accessToken);
                else reject(new SocialException("Fb Auth error"));
            });
        });
    }
    
    public getOkToken(): Promise<string> {
        return new Promise((resolve: (data: string) => void, reject: (reason: Exception) => void) => {
            var done: boolean;
            const popup: Window = window.open("/ok", "Одноклассники", "width=500,height=500");
            
            const listener = (event) => {
                done = true;
                window.removeEventListener("message", listener);
                
                const data: any = JSON.parse(event.data);
                if (data.error) reject(new SocialException("Ok Auth error"));
                else resolve(data.token);
            };
            window.addEventListener("message", listener);
            
            const checkInterval = window.setInterval(() => {
                window.setTimeout(() => {
                    if (popup.closed && !done) {
                        window.clearInterval(checkInterval);
                        window.removeEventListener("message", listener);
                        reject(new SocialException("Ok Auth error"));
                    } else if (popup.closed) window.clearInterval(checkInterval);
                }, 2500);
            }, 100);
        });
    }
    
    public async signin(user: SocialUser): Promise<string> {
        const request: AsyncRequest = new AsyncRequest();
        request.open("POST", "/user/signin/social");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.timeout = 10000;
        const jsonToken: string = await request.send(user.serializeUrlEncoded(true, "phone"));
        return JSON.parse(jsonToken).token;
    }
    
    public async signup(user: SocialUser): Promise<string> {
        const request: AsyncRequest = new AsyncRequest();
        request.open("POST", "/user/signin/social");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.timeout = 10000;
        const jsonToken: string = await request.send(user.serializeUrlEncoded(true));
        return JSON.parse(jsonToken).token;
    }
    
    implementsISocialUserRepository() {}
}