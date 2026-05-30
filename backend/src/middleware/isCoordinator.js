const isCoordinator=(req,res,next)=>{
     
    if(req.user&&req.user=='coordinator'){
        next();
    }
    else{
        return res.status(403).json({message:"Access Denied"});
    }
}
export default isCoordinator;