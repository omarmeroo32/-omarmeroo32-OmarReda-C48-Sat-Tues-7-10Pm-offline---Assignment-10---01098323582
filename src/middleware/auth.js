import jwt from "jsonwebtoken";
import { usermodel } from "../DB/model/user.js";
import { errorRes } from "../utils/errormassege.js";

export const EnumToken = {
    access: "access",
    refresh: "refresh"
};

export const decoding = async ({ authorization, tokentype = EnumToken.access }) => {
    if (!authorization) {
        errorRes({ msg: "In-valid Token", statusCode: 401 });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
        errorRes({ msg: "In-valid Token format", statusCode: 401 });
    }

    const payload = jwt.verify(
        token,
        tokentype === EnumToken.access ? process.env.ACCESSTOKEN : process.env.REFRESHTOKEN
    );

    const user = await usermodel.findById(payload._id);
    if (user.confiarmAt == null) {
        errorRes({ msg: "confirm-first", statusCode: 401 })
    }
    if (!user) {
        errorRes({ msg: "the user not found", statusCode: 404 });
    }

    return { user };
};

export const auth = async (req, res, next) => {
    const { user } = await decoding({ authorization: req.headers.authorization });
    req.user = user;
    next();
};



export const authonticate = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            errorRes({ msg: "not varibloe!", statusCode: 403 });
        }

        next();
    };
};