import "../bindings/mask";
import "../bindings/map";
import "../bindings/marker";
import "../bindings/layersShow";
import "../bindings/scroll";
import "../bindings/refreshScroll";
import "../bindings/markers";
import "../bindings/visibleRegion";
import "../bindings/phone";
import "../bindings/date";
import "../bindings/scrollTo";
import "../bindings/cost";
import { Navigation } from "../viewmodels/Navigation";
import { Start } from "../viewmodels/Start";
import { Alert } from "../viewmodels/Alert";
import { Auth } from "../viewmodels/Auth";
import { Signup } from "../viewmodels/Signup";
import { DataContext } from "./DataContext";
import { AuthService } from "../models/services/AuthService";
import { UserRepository } from "../models/repositories/UserRepository";
import { Signin } from "../viewmodels/Signin";
import { LocalUserRepository } from "../models/repositories/LocalUserRepository";
import { Remind } from "../viewmodels/Remind";
import { Social } from "../viewmodels/Social";
import { Import } from "crisper.di/annotations/Import";
import { ViewModels } from "crisper.ko/annotations/ViewModels";
import { Services } from "crisper.ko/annotations/Services";
import { Repositories } from "crisper.ko/annotations/Repositories";
import { Component } from "crisper.di/annotations/Component";
import { SocialExtra } from "../viewmodels/SocialExtra";
import { SocialUserRepository } from "../models/repositories/SocialUserRepository";
import { AddObject } from "../viewmodels/AddObject";
import { WebComponents } from "crisper.ko/annotations/WebComponents";
import { Selector } from "../webcomponents/Selector";
import { InputNumber } from "../webcomponents/InputNumber";
import { ObjectFileUpload } from "../viewmodels/ObjectFileUpload";
import { ProfileService } from "../models/services/ProfileService";
import { FilesService } from "../models/services/FilesService";
import { FileRepository } from "../models/repositories/FileRepository";
import { Search } from "../webcomponents/Search";
import { CitiesService } from "../models/services/CitiesService";
import { CityRepository } from "../models/repositories/CityRepository";
import { Map } from "../viewmodels/Map";
import { REObjectsService } from "../models/services/REObjectsService";
import { REObjectRepository } from "../models/repositories/REObjectRepository";
import { ObjectsList } from "../viewmodels/ObjectsList";
import { ExceptionsHandlers } from "crisper.ko/annotations/ExceptionsHandlers";
import { ErrorHandler } from "../exceptionshandlers/ErrorHandler";
import { ObjectsFilter } from "../viewmodels/ObjectsFilter";
import { ObjectViewer } from "../viewmodels/ObjectViewer";
import { Slider } from "../webcomponents/Slider";
import { ContentSlider } from "../webcomponents/ContentSlider";
import { PhotoViewer } from "../viewmodels/PhotoViewer";
import { Routers } from "crisper.ko/annotations/Routers";
import { Navigation as NavigationRouter } from "../routers/Navigation";
import { Tooltip } from "../webcomponents/Tooltip";
import { MyObjects } from "../viewmodels/MyObjects";
import { ProfileViewer } from "../viewmodels/ProfileViewer";
import { EditProfile } from "../viewmodels/EditProfile";
import { LocalREObjectRepository } from "../models/repositories/LocalREObjectRepository";
import { RequestsList } from "../viewmodels/RequestsList";

@Import([DataContext])
@ExceptionsHandlers([ErrorHandler])
@ViewModels([Navigation, Start, Alert,
             Auth, Signup, Signin, Remind, Social, SocialExtra,
             AddObject, ObjectFileUpload,
             Map,
             ObjectsList, ObjectsFilter,
             ObjectViewer, PhotoViewer,
             MyObjects,
             ProfileViewer, EditProfile,
             RequestsList])
@WebComponents([Selector, InputNumber, Search, Slider, ContentSlider, Tooltip])
@Services([AuthService, ProfileService, FilesService, CitiesService, REObjectsService])
@Repositories([UserRepository, LocalUserRepository, SocialUserRepository, FileRepository, CityRepository,
               REObjectRepository, LocalREObjectRepository])
@Routers([NavigationRouter])
export class Config {
    @Component("sammy")
    public sammy(): Sammy.Application {
        return Sammy();
    }
    
    @Component("postbox")
    public postbox(): KnockoutSubscribable<any> {
        return new ko.subscribable();
    }
}