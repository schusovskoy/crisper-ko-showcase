import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { Required } from "crisper.di/annotations/Required";
import { REObjectRequest } from "../models/entities/REObjectRequest";
import { Interface } from "crisper.std/Interface";
import { ICitiesService } from "../models/services/interfaces/ICitiesService";

@ViewModel("start")
export class Start {
	@Required("reObjectRequest")
    public reObjectRequest: REObjectRequest;
    @Required(new Interface<ICitiesService>("ICitiesService"))
    public citiesService: ICitiesService;
    
    public find(): void {
        window.history.pushState(null, null, "/find");
    }
}