

export const SuccesRess = ({res,msg = "Done",data={},status=200})=>{
   return res.status(status).json({
        msg,
        data,
        status
    })
}