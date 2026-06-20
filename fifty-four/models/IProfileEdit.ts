import {IImageFile} from "@/models/common/IImageFile";

export interface IProfileEdit {
    firstName: string;
    lastName: string;
    email: string;
    imageFile?: IImageFile;
}