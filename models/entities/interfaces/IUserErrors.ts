export interface IUserErrors {
	email?: string;
	phone?: string;
	fio?: string;
	password?: string;
	implementsIUserErrors?();
}