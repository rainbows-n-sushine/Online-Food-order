import {IsEmail,IsEmpty,Length} from "class-validator"
export class CreateCustomerInputs{
    
    @IsEmail()
    email:string;

    @Length(7,12)
    phone:string;

    @Length(6,12)
    password:string;


}

export interface CustomerPayload{
    _id:any;
    email:string;
    verified:boolean;

}



export class UserLoginInputs{
    @IsEmail()
    email:string
    @Length (6,12)
    password:string
}

export class EditCustomerProfileInputs{
    @Length(3,12)
    firstName:string
    @Length(3,12)
    lastName:string
    @Length(3,20)
    address:string

}