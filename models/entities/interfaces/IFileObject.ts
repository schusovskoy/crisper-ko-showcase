export interface IFileObject {
    avatar?: boolean;
    path?: string;
    progress?: number;
    tmpPath?: string;
    implementsIFileObject?();
}