import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
       {
             path: {
              type: String,
              required:true
             },
             fileName:{
              type:String,
              required:true,
              unique:true
             },
             createdBy:{
                  type: mongoose.Schema.Types.ObjectId,
                  ref:"users",
                  required:true
            }
       },{
            timestamps:true
     }
)

const File = mongoose.model("File",fileSchema)

export default File;