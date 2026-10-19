import z from "zod";
import { EnumGendaer, Enumprovaid, EnumRole } from "./user.type.js";

const enumRoleValues = Object.values(EnumRole);
const enumProviderValues = Object.values(Enumprovaid);
const enumGenderValues = Object.values(EnumGendaer);

export const validationuser = {
    body: z.object({
        firstname: z.string().min(1),
        LastName: z.string().min(1).optional(),
        Lastname: z.string().min(1).optional(),
        phone: z.string().optional(),
        username: z.string().min(1),
        role: z.coerce.number().refine((value) => enumRoleValues.includes(value), {
            message: "Invalid role"
        }).optional(),
        Gander: z.coerce.number().refine((value) => enumGenderValues.includes(value), {
            message: "Invalid gender"
        }).optional(),
        passwerd: z.coerce.string().min(1),
        provaid: z.coerce.number().refine((value) => enumProviderValues.includes(value), {
            message: "Invalid provider"
        }).optional(),
        email: z.string().email(),
        age: z.coerce.number().min(0).optional()
    }).passthrough(),
    query: z.object({
        id: z.string().optional()
    }).passthrough()
};