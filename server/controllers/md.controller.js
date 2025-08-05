import fs from "fs"
const handleReadFile = async (req,res) =>{
       // console.log(req.params)
        // Get the file path from query params or URL
  const filePath = req.query.path || '';
  console.log('Looking for file:', filePath);
       fs.readFile(filePath,"utf-8",(err,data)=>{
              if(err){
                     return res.json({
                            success:false,
                            message:"File not found"
                     })
              }
              return res.json({
                     success:true,
                     message:"File read successfully",
                     data:data
              })
       })
}

export { handleReadFile}