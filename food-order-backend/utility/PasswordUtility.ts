import bcrypt from 'bcrypt'

export const GenerateSalt=async()=>{
    const salt=await bcrypt.genSalt()
 return salt;
}
export const GeneratePassword=async(password:string,salt:string)=>{
     const hashedPassword=await bcrypt.hash(password,salt)
     return hashedPassword;
}

export const ValidatePassword=async(enteredPassword:string,savedPassword:string, salt:string)=>{
    const passwordEntered=await GeneratePassword(enteredPassword,salt)
    return passwordEntered===savedPassword;

}