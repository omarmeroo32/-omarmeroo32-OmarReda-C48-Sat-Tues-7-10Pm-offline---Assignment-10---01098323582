

import { hash,compare } from "bcrypt";



export const hasingpassword = async (password)=>{
    const genaratpasswrod = await hash(password,10)
    return genaratpasswrod
}


export const comparepasswrod =async(password,hashedpassword)=>{
    let genartedpassword = await compare(password,hashedpassword)
    return genartedpassword
}