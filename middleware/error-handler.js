function errorHandler(err,req,res,next){
    return res.status(400).json(err)
}

export default errorHandler