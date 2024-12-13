export interface CreateVendorInput{
    name:string;
    ownerName:string;
    foodTypes:[string];
    pincode: string;
    address:string;
    phone:string;
    email:string;
    password:string    
} 

export interface VendorLoginInputs{
    email:string;
    password:string;
}

export interface VendorPayload{
    _id:string;
    name:string;
    email:string;
    foodTypes:[string]

}

export interface EditVendorInputs{

    name:string,
    foodTypes:[string],
    address:string,
    phone:string
}