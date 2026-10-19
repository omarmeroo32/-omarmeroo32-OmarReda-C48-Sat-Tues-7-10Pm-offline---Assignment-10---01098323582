import { model, Schema } from "mongoose";
import { EnumRole, Enumprovaid, EnumGendaer } from "../../model/user.model/user.type.js";
import { maxLength, minLength } from "zod";


const otpSchema = new Schema({
    otp: {

        type: String,
        require: true
    },
    expairIn: {
        type: Date,
        default: Date.now() + 5 * 60 * 1000
    }
}, {
    _id: false
})

otpSchema.index("expairIn", {
    expireAfterSeconds: 0
})


const userSchema = new Schema({
    photoImage: {
        type: String
    },
    firstname: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    age: Number,
    boi: String,
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    Gander: {
        type: Number,
        required: true,
        enum: Object.values(EnumGendaer),
        default: EnumGendaer.male
    },
    provaid: {
        type: Number,
        required: true,
        enum: Object.values(Enumprovaid),
        default: Enumprovaid.system
    },
    phone: {
        type: String
    },
    role: {
        type: Number,
        required: true,
        enum: Object.values(EnumRole),
        default: EnumRole.user
    },
    confiarmAt: {
        type: Date,
    },
    otp: otpSchema,
    blocedAt: Date,
    passwerd: {
        type: String,
        required: false
    }
}, {
    strict: true,
    strictQuery: true,
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: {
        virtuals: true,
        getters: true
    },
    toObject: {
        virtuals: true,
        getters: true
    }
});

export const usermodel = model("User", userSchema);
