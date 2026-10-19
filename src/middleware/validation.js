import { errorRes } from "../utils/errormassege.js";

export const validation = (Schema) => {
    return (req, res, next) => {
        const validationError = [];

        Object.entries(Schema).forEach(([key, schema]) => {
            const validationRes = schema.safeParse(req[key]);
            if (!validationRes.success) {
                validationError.push({ [key]: validationRes.error.issues });
            }
        });

        if (validationError.length) {
            errorRes({ msg: "the Error validation!", statusCode: 400, options: validationError });
        }

        next();
    };
};