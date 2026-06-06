import {IImageFile} from "@/models/common/IImageFile";

export default interface IRegisterModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imageFile?: IImageFile;
}