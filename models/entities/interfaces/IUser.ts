import { IFileObject } from "./IFileObject";

export interface IUser {
	id?: string;
	email?: string;
	phone?: string;
	fio?: string;
	password?: string;
	second?: string;
	token?: string;
	viber?: boolean;
    whatsapp?: boolean;
    photo?: IFileObject;
    registerDate?: number;
	implementsIUser?();
}