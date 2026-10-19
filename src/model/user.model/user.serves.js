import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { usermodel } from "../../DB/model/user.js";
import { decoding, EnumToken } from "../../middleware/auth.js";
import { errorRes } from "../../utils/errormassege.js";
import { comparepasswrod, hasingpassword } from "../../utils/security/hash.js";
import { Enumprovaid, EnumRole } from "./user.type.js";
import { random } from "../../utils/email/CreateOtp.js";
import { sendEmail } from "../../utils/email/SendEmail.js";
import { createOtpEmailTemplate } from "../../utils/email/EmailTemplate.js"
import { date, email } from "zod";

const clint = new OAuth2Client();

export const SighnUp = async (firstname, LastName, age, username, email, Gander, provaid, role, passwerd) => {
  const existingUser = await usermodel.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    const field = existingUser.email === email ? "email" : "username";
    errorRes({ msg: `${field} exist`, statusCode: 409 });
  }

  const otp = random(6)
  await sendEmail({
    to: email,
    subject: "counfirm email",
    html: createOtpEmailTemplate({ otp, subject: "confirm Email" })
  })

  const user = await usermodel.create({
    firstname,
    otp: {
      otp: await hasingpassword(otp)
    },
    LastName,
    age,
    username,
    email,
    Gander,
    provaid,
    role,
    passwerd: await hasingpassword(String(passwerd))
  });

  return { data: { user } };
};

export const login = async (midfay, passwerd) => {
  const user = await usermodel.findOne({
    $or: [{ email: midfay }, { username: midfay }]
  });

  if (!user) {
    errorRes({ msg: "the user not found!", statusCode: 400 });
  }

  const isMatch = await comparepasswrod(String(passwerd), user.passwerd);
  if (!isMatch) {
    errorRes({ msg: "in-valid", statusCode: 400 });
  }

  const accesstoken = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.ACCESSTOKEN,
    { expiresIn: "2Minutes" }
  );

  const refreshtoken = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.REFRESHTOKEN,
    { expiresIn: "30Minutes" }
  );

  return { data: { accesstoken, refreshtoken } };
};

export const refresh = async (authorization) => {
  const { user } = await decoding({ authorization, tokentype: EnumToken.refresh });

  const accesstoken = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.ACCESSTOKEN,
    { expiresIn: "2Minutes" }
  );

  return { data: { accesstoken } };
};

export const googleLogin = async (token) => {
  const ticket = await clint.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_KAY
  });

  const payload = ticket.getPayload();
  const email = payload.email;
  const name = payload.name;

  let user = await usermodel.findOne({ email });
  if (user) {
    if (user.provaid !== Enumprovaid.google) {
      errorRes({ msg: "Opps! please LogIn your Provaider!!", statusCode: 400 });
    }
  } else {
    user = await usermodel.create({
      email,
      firstname: name,
      provaid: Enumprovaid.google,
      role: EnumRole.user,
      confiarmAt: Date.now()

    });
  }

  const accesstoken = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.ACCESSTOKEN,
    { expiresIn: "2Minutes" }
  );

  const refreshtoken = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.REFRESHTOKEN,
    { expiresIn: "30Minutes" }
  );

  return { data: { accesstoken, refreshtoken } };
};



export const confirmEmail = async (email, otp) => {
  const user = await usermodel.findOne({
    email,
    confiarmAt: {
      $exists: false
    }
  })

  if (!user) {
    errorRes({ msg: "user not found!", statusCode: 404 })
  }

  if (!user.otp.expairIn > Date.now()) {
    errorRes({ msg: "epair", statusCode: 404 })
  }
  if (!user.otp.otp) {
    return errorRes({ msg: " otp in-valid", statusCode: 404 })
  }

  // const ismatshotp = await comparepasswrod(String(otp), String(user.otp.otp))
  // if (!ismatshotp) {
  //   errorRes({ msg: "otp in-valid!", statusCode: 404 })
  // }



  user.confiarmAt = Date.now()
  await user.save()

  return {
    date: {}
  }

}


export const ForgetPass = async (email) => {
  const user = await usermodel.findOne({ email })

  if (!user) {
    errorRes({ msg: " in-valid cheack data", statusCode: 404 })
  }
  if (user.otp.expairIn > Date.now()) {
    errorRes({ msg: "Please waite 5 mint" })
  }
  // user.otp.expairIn = Date.now() + 5 * 60 * 1000
  const otp = random(6)

  user.otp = {
    otp: await hasingpassword(String(otp)),
    expairIn: Date.now() + 5 * 60 * 1000,
  }
  await user.save()
  // const otp = random(6)
  await sendEmail({
    to: email,
    subject: "Forget-password",
    html: createOtpEmailTemplate({ otp, subject: "forget-password!" })
  })

  // user.otp.otp = await hasingpassword(otp)
  // user.save()

  return {
    data: {}
  }
}

export const changePasswerd = async (email, otp, passwerd) => {
  console.log(otp)
  const user = await usermodel.findOne({ email })

  if (!user) {
    errorRes({ msg: "user not found", statusCode: 404 })
  }
  // const otphashed = await hasingpassword(otp)
  if (!user.otp.otp || user.otp.expairIn < Date.now()) {
    errorRes({ msg: " otp expair", statusCode: 404 })
  }

  const ismatshotp = await comparepasswrod(String(otp), String(user.otp.otp))
  if (!ismatshotp) {
    errorRes({ msg: "otp in-valid!", statusCode: 404 })
  }

  user.passwerd = await hasingpassword(passwerd)
  user.save()

  return {
    data: {}
  }

}

// export const CeachOtp = async (user, otp) => {

//   if (!user.otp.otp || user.otp.expairIn < Date.now()) {
//    return errorRes({ msg: " otp expair", statusCode: 404 })
//   }

//   const ismatshotp = await comparepasswrod(String(otp), String(user.otp.otp))
//   if (!ismatshotp) {
//     errorRes({ msg: "otp in-valid!", statusCode: 404 })
//   }

// } 