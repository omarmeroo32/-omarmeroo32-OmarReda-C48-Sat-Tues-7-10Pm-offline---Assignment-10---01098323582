import multer, { diskStorage } from "multer";
import fs from "fs/promises"





export const UploadeFaile = (des = "./genarale") => {

    const storage = diskStorage({
        destination: async (req, file, cb) => {
            const userId = req.user._id
            const foldername = `./uplaodes/${des}_${userId}`
            try {
                await fs.access(foldername)
            } catch (error) {
                await fs.mkdir(foldername, {
                    recursive: true
                })
            }
            cb(null, foldername)
        },




        filename: (req, file, cb) => {
            const username = req.user.username
            const filename = username + "_" + Date.now() + "_" + file.originalname
            cb(null, filename)
        }
    })









    return multer({
        storage

    })
}