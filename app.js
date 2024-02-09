const express=require("express");
const mongoose=require("mongoose");
const path = require('path');
const { render } = require("ejs");
const app=express();
app.use(express.static(path.join(__dirname, "public")));
const auth=require('./login');
const passport=require('passport');
const session = require('express-session');
const fileupload=require('express-fileupload');
const cloudinary=require('cloudinary').v2;
const login=require('two-step-auth');
app.set('views','views');
app.set('view engine','ejs')
require('dotenv').config();
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret,
});

// ........................................................................email verification.............................................................................

app.get("/", function (req, res) {
    res.render('login');
});

//.....................................................mongo db conntion..............................................................


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

//.......................................................home .................................................................//
app.use('/home',(req,res)=>{
    res.render('home');
})
// ..................................................conntected found form ..........................................................



app.use(fileupload({
    useTempFiles:true
}));
        const noteschema= new mongoose.Schema({
            name:String,
            email:String,
            option:String,
            type:String,
            image:String,
            about:String
        });
        const note=mongoose.model("note",noteschema);
        app.get("/found",function(res,req){
            req.render('found');
        })
        app.post("/found", function(req,res){
            
            const file=req.files.addimg;
            cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
       
          
           const newnote=new note({
            name:req.body.name,
            email:req.body.email,
            option:req.body.option,
            type:req.body.type,
            image:result.url, 
            about:req.body.about
        });
        newnote.save();
        res.redirect("/home"); 
            });
           
        });
        //..................................................lost page......................................................//
        app.get('/lost',async(req,res)=>{
            const user=await note.find();
            res.render('lost',{user});
        })
        // ......................................contected to sign in form..............................................................
      
        app.use(session({
            secret: 'mysecret-is-secure-in-the-code-do-not-take-tesion',
          resave: false,
          saveUninitialized: true,
          cookie: { secure: false }
        }))
        app.use(passport.initialize());
        app.use(passport.session());
        app.get('/auth/google',
          passport.authenticate('google', { scope: ['profile'] }));
        
        app.get('/auth/google/callback', 
          passport.authenticate('google', { failureRedirect: '/login' }),
          function(req, res) {
            res.redirect('/home');
          });

app.listen(3000,function(){
    console.log("server is running on the port ");
})