import bcrypt from 'bcrypt'

export const GenerateSalt=async()=>{
    const salt=await bcrypt.genSalt()
 return salt;
}
export const GeneratePassword=async(password:string,salt:string)=>{
     const hashedPassword=await bcrypt.hash(password,salt)
     return hashedPassword;

}