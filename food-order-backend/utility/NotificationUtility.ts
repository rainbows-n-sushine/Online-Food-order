//email
//Notifications
//OTP

export const GenerateOTP=()=>{
    const otp=Math.floor(100000+Math.random()*900000)
    const expiry=new Date()
    expiry.setTime( new Date().getTime()+(30*60*1000))

    return{otp, expiry}

}

export const OnRequestOTP=async(otp:number,toPhoneNumber:string)=>{
     const  authToken=process.env.AUTH_TOKEN
     const accountSid=process.env.ACCOUNT_SID   


    const client=require('twilio')(accountSid,authToken)
    console.log('this is the client ',client)
    const response=client.messages.create({
        body:`your otp is ${otp}`,
        from:'+15703654417',
        to:`+251${toPhoneNumber}`
    })
    return response;



}
//payment notification and emails
