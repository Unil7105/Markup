import File from "../models/fileMetaData.model.js"

const getAllFiles = async(req,res) =>{
       const files = await File.find({ createdBy: req.user._id })

       return res.status(200).json({
              success:true,
              message:"Files Fetched Successfully!",
              files
       })
}



export {getAllFiles}