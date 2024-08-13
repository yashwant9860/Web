const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
dotenv.config();
mongoose.connect(process.env.MONGO_URL);
jwtSecret = process.env.JWT_SECRET;
const app = express();

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true,
}));
app.use(express.json());
app.get('/test',(req,res)=>{
    res.json('test ok');
});
app.post('/register',async(req,res)=>{
    const {username,password} = req.body;
    
    try{
        const createdUser = await User.create({username,password});
        jwt.sign({userId:createdUser._id},jwtSecret,{},(err,token)=>{
            if(err)throw err;
            res.cookie('token',token).status(201).json({
                _id:createdUser._id,
            });
        })
    }
    catch(err){
        if(err)throw err;
        res.status(500).json('error');
    }
    
});

app.listen(4000);