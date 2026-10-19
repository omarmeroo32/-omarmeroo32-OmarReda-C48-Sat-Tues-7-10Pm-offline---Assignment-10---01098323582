import crypto from "node:crypto"
import { buffer } from "node:stream/consumers"
import { errorRes } from "../errormassege.js"



let securitkay = Buffer.from("123omarrdfidsskcmscpassadsdsdsa1")

export const encryption =(data)=>{
   const iv = crypto.randomBytes(16)
   const cipher = crypto.createCipheriv("aes-256-cbc",securitkay,iv)
   let ciphertext = cipher.update(data,"utf8","hex")
   ciphertext+= cipher.final("hex")
   return `${iv.toString("hex")}:${ciphertext}` 
}

export const decryption =(encryptedValue)=>{
    const [iv,ciphertext] = encryptedValue.split(":")
    if(!iv ||!ciphertext){
        errorRes({msg:"in-valid"})
    }
    const binry = Buffer.from(iv,"hex")
    const decipher = crypto.createDecipheriv("aes-256-cbc",securitkay,binry)
    let textplan = decipher.update(ciphertext,"hex","utf8")
    textplan += decipher.final("utf8")
    return textplan
}