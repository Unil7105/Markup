import express, { json } from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import path from "path"
import multer from "multer"
import File from "./models/fileMetaData.model.js"
import fileRoutes from "./routes/files.routes.js"
import mdRoutes from "./routes/md.routes.js"
import { handleReadFile } from "./controllers/md.controller.js"
import { checkAuth, restrictToLoggedInUser } from "./middleware/auth.js"
import staticRoutes from "./routes/static.routes.js"
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
       origin: ['http://localhost:5173'], 
       credentials: true  // This allows cookies to be sent and received
     }))

dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended: false}))//it is used to parse the fromdata 
app.use(cookieParser());

const storage = multer.diskStorage(
       {
              destination: function (req,file,cb){
                     return cb(null,"./uploads");
              },
              filename:function (req,file,cb){
                     // return cb(null,`${Date.now()}-${file.originalname}`)
                     return cb(null,`${file.originalname}`)
              },
       }
)


const upload = multer({storage :storage})



app.set("view engine","ejs")
app.set("views",path.resolve("./views"))



// app.use("/uploads",restrictToLoggedInUser,express.static('uploads'))
app.use("/",staticRoutes)
app.use("/surf",surfRoutes)
app.use("/file",restrictToLoggedInUser,fileRoutes)
app.use("/md",restrictToLoggedInUser,handleReadFile)
app.post("/upload", restrictToLoggedInUser, upload.single("profileImage"), async (req, res) => {
       console.log(req.body);
       console.log(req.file);
       // console.log(req.cookies.uid)
       console.log(req.user);
       const result = await File.create({
         path: req.file.path,
         fileName: req.body.filename,
         createdBy: req.user._id
       });
       console.log("uploaded successfully");
       return res.status(200).json({
         success: true,
         message: "File uploaded successfully"
       });
     });
mongoose.connect(process.env.MONGODB_URL) 
.then((res)=>{
       console.log("connection established successfully");
       app.listen(process.env.PORT || 3001,()=>{
              console.log(`Server running on port ${process.env.PORT}`)
       })
})