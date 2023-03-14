const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const http=require("http");
const router = express.Router();
const path = require('path');
const multer =require('multer');
const app=express();

app.set('view engine' ,'ejs');
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

var publicPath = path.join(__dirname, 'public');




router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/home.html"));
});


app.get('/', function (req, res) {
    res.sendFile(publicPath + '/home.html');
});
mongoose.connect(
    "mongodb://0.0.0.0:27017/",
    {
      dbName: "shop",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) =>
      err ? console.log(err) : console.log(
        "Connected to  database"));


        const noteschema= new mongoose.Schema({
            name:String,
            email:String,
            option:String,
            type:String,
            image:String,
            about:String
        });
        var note=mongoose.model("note",noteschema);

    // var Storage=multer.diskStorage({
    //     destination:'public/upload',
    //     filename: function (req,file,cb){
    //         cb(null , addimg.filedname +"_"+Date.now()+path.extname(addimg.originalname));   
    //      }
    // });
    // var upload=multer({
    //     storage:Storage
    // }).single('addimg');

app.get("/found",function(res,req){
    req.sendFile(__dirname+"/found.html");
})
app.post("/found", function(req,res){
    
    const newnote=new note({
        name:req.body.name,
        email:req.body.email,
        option:req.body.option,
        type:req.body.type,
        image:req.file.addimg,
        about:req.body.about
    });
    console.log(req.body.name);
    console.log(req.body.email);
    console.log(req.body.option);
    console.log(req.body.about);
    newnote.save();
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("server is running on the port ");
})