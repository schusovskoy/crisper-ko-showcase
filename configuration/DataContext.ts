import { UserErrors } from "../models/entities/UserErrors";
import { User } from "../models/entities/User";
import { Component } from "crisper.di/annotations/Component";
import { SocialUser } from "../models/entities/SocialUser";
import { REObject } from "../models/entities/REObject";
import { Prototype } from "crisper.di/annotations/Prototype";
import { FileObject } from "../models/entities/FileObject";
import { REObjectErrors } from "../models/entities/REObjectErrors";
import { REObjectRequest } from "../models/entities/REObjectRequest";
import { IREObject } from "../models/entities/interfaces/IREObject";
import { IREObjectRequest } from "../models/entities/interfaces/IREObjectRequest";

export class DataContext {
    @Component("signupErrors")
    public signupErrors(): UserErrors {
        return new UserErrors();
    }
    
    @Component("signupCredentials")
    public signupCredentials(): User {
        const user: User = new User();
        user.photo = this.fileObject();
        return user;
    }
    
    @Component("signinCredentials")
    public signinCredentials(): User {
        const user: User = new User();
        user.photo = this.fileObject();
        return user;
    }
    
    @Component("profile")
    public profile(): User {
        const user: User = new User();
        user.photo = this.fileObject();
        return user;
    }
    
    @Component()
    public socialUser(): SocialUser {
        return new SocialUser();
    }
    
    @Component("reObject")
    public reObject(): REObject {
        return new REObject();
    }
    
    @Component("reObjectErrors")
    public reObjectEerrors(): REObjectErrors {
        return new REObjectErrors();
    }
    
    @Component("reObjectRequest")
    public reObjectRequest(): REObjectRequest {
        return new REObjectRequest();
    }
    
    @Component("reObjectsCollection")
    public reObjectsCollection(): KnockoutObservableArray<IREObject> {
        return ko.observableArray([]);
    }
    
    @Component("myObjectsCollection")
    public myObjectsCollection(): KnockoutObservableArray<IREObject> {
        return ko.observableArray([]);
    }
    
    @Component("reObjectsMapCollection")
    public reObjectsMapCollection(): KnockoutObservableArray<IREObject> {
        return ko.observableArray([]);
    }
    
    @Component("selectedObject")
    public selectedObject(): REObject {
        return new REObject();
    }
    
    @Component("editableUser")
    public editableUser(): User {
        const user: User = new User();
        user.photo = this.fileObject();
        return user;
    }
    
    @Component("profileErrors")
    public profileErrors(): UserErrors {
        return new UserErrors();
    }
    
    @Component("favoritesCollection")
    public favoritesCollection(): KnockoutObservableArray<IREObject> {
        return ko.observableArray([]);
    }
    
    @Component("requestsCollection")
    public requestsCollection(): KnockoutObservableArray<IREObjectRequest> {
        return ko.observableArray([]);
    }
    
    @Prototype()
    public fileObject(): FileObject {
        return new FileObject();
    }
}