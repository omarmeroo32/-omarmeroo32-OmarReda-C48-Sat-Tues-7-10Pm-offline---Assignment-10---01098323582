export const errorRes = ({ msg = "error", statusCode = 500,options }) => {

    let error = new Error(msg,{
        cause:{
            statusCode,
            options
        }
    });
    // error.statusCode = statusCode;

    throw error;
}