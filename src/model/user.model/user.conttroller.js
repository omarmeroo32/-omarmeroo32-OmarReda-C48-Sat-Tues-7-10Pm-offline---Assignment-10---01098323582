import { Router } from "express";
import * as serves from "./user.serves.js";
import { SuccesRess } from "../../utils/SsuccessMassage.js";
import { auth, authonticate } from "../../middleware/auth.js";
import { EnumRole } from "./user.type.js";
import { validationuser } from "./user.validation.js";
import { validation } from "../../middleware/validation.js";
import { UploadeFaile } from "../../utils/uploadfaile.js";


export const router = Router();

export const routes = {
    base: "/user",
    SighnUps: "/SighnUps",
    login: "/login",
    prfile: "/prfile",
    refresh: "/refreshtoken",
    google: "/signup/gmail",
    confirmEmail: "/confirm-Email",
    ForgetPass: "/Forget-pass",// patch
    ChangePasswerd: "/ChangePass",//pstch
    UpladeFaile: "/Uploade-faile", // get
};

router.post(routes.SighnUps, validation(validationuser), async (req, res) => {
    const { firstname, LastName, Lastname, age, username, email, Gander, provaid, role, passwerd } = req.body;
    const familyName = LastName ?? Lastname;
    const { data } = await serves.SighnUp(firstname, familyName, age, username, email, Gander, provaid, role, passwerd);

    SuccesRess({ res, msg: "done", status: 201, data });
});

router.post(routes.login, async (req, res) => {
    const { midfay, passwerd } = req.body;
    const { data } = await serves.login(midfay, passwerd);
    SuccesRess({ res, msg: "done", data, status: 200 });
});

router.get(routes.prfile, auth, authonticate(EnumRole.admin), async (req, res) => {
    const user = req.user;
    SuccesRess({ res, data: { user }, msg: "done", status: 200 });
});

router.post(routes.refresh, async (req, res) => {
    const { authorization } = req.headers;
    const { data } = await serves.refresh(authorization);
    SuccesRess({ res, data, msg: "data done", status: 200 });
});

router.post(routes.google, async (req, res) => {
    const { data } = await serves.googleLogin(req.body.idToken);
    SuccesRess({ res, data });
});


router.patch(routes.confirmEmail, async (req, res) => {
    const { email, otp } = req.body
    const { data } = await serves.confirmEmail(email, otp)
    SuccesRess({ res, data })
})

router.patch(routes.ForgetPass, async (req, res) => {
    const { email } = req.body
    const { data } = await serves.ForgetPass(email)

    SuccesRess({
        res,
        data
    })
})



router.patch(routes.ChangePasswerd, async (req, res) => {
    const { email, passwerd, otp } = req.body
    const { data } = await serves.changePasswerd(email, otp, passwerd)
    SuccesRess({ res })
})


router.get(routes.UpladeFaile, auth, UploadeFaile("./uplades").single("image"), async (req, res) => {
    // req.user.photoImage = 
    console.log(req.file)
    SuccesRess({ res })
})