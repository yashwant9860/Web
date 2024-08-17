const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
dotenv.config();
const ws = require('ws');
const cookieParser = require('cookie-parser');
mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);
const Message = require('./models/Message');
const app = express();

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true,
}));
app.use(express.json());
app.use(cookieParser());
app.get('/test',(req,res)=>{
    res.json('test ok');
});
app.post('/register',async(req,res)=>{
    const {username,password} = req.body;
    
    try{
        const hashedPassword = bcrypt.hashSync(password,bcryptSalt);
        const createdUser = await User.create({
            username:username,
            password:hashedPassword});
        jwt.sign({userId:createdUser._id,username},jwtSecret,{},(err,token)=>{
            if(err)throw err;
            res.cookie('token',token,{sameSite:'none',secure:true}).status(201).json({
                id:createdUser._id,
            });
        })
    }
    catch(err){
        if(err)throw err;
        res.status(500).json('error');
    }
    
});
app.post('/login',async (req,res)=>{
    const {username,password} = req.body;
    const foundUser = await User.findOne({username});
    if(foundUser)
    {
        const passOk=bcrypt.compareSync(password,foundUser.password);
        if(passOk)
        {
            jwt.sign({userId:foundUser._id,username},jwtSecret,{},(err,token)=>{
                if(err)throw err;
                res.cookie('token',token,{sameSite:'none',secure:true}).json({
                    id:foundUser._id,

                })
            });
        }
    }

});
async function getUserDataFromRequest(req){
    return new Promise((resolve,reject)=>{
        const token = req.cookies?.token;
        if(token)
        {
            jwt.verify(token,jwtSecret,{},(err,userData)=>{
                if(err)throw err;
                resolve(userData);
        
            })
        }
        else{
            reject('no token');
        }
    })

}


app.get('/messages/:userId',async (req,res)=>{
    const {userId} = req.params;
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.userId;
    const messages = await Message.find({
        sender:{$in:[userId,ourUserId]},
        recipient:{$in:[userId,ourUserId]},
    }).sort({createdAt:-1});
    res.json(messages);
});

app.get('/people',async(req,res)=>{
    const users =  await User.find({},{'_id':1,username:1});
    res.json(users);
});
app.get('/profile',(req,res)=>{
    const token = req.cookies?.token;
    if(token)
    {
        jwt.verify(token,jwtSecret,{},(err,userData)=>{
            if(err)throw err;
            res.json({
                userData
            });
    
        })
    }
    else{
        res.status(401).json(req);
    }
    
})

const server = app.listen(4000);


const wss = new ws.WebSocketServer({server});

wss.on('connection',(connection,req)=>{
    const cookies = req.headers.cookie;
    if(cookies)
    {
        const tokenCookieString = cookies.split(';').find(str=>str.startsWith('token'));
        if(tokenCookieString)
        {
            const token = tokenCookieString.split('=')[1];
            if(token)
            {
                jwt.verify(token,jwtSecret,{},(err,userData)=>{
                    if(err) throw err;
                    const {userId,username} = userData;
                    connection.userId = userId;
                    connection.username = username;
                })
            }
        }
    };

    
    
    connection.on('message',async (message)=>{
        const messageData = JSON.parse(message.toString());
        const {recipient,text} = messageData;
        if(recipient && text)
        {
            const messageDoc = await Message.create({
                sender:connection.userId,
                recipient,
                text,
            });
            [...wss.clients]
            .filter(c=>c.userId === recipient)
            .forEach(c=>c.send(JSON.stringify({
                text,
                sender:connection.userId,
                _id:messageDoc._id,
                recipient,
            })));
            
        }
    });
    //notify everyone about online people (when someone connects)
    [...wss.clients].forEach(client=>{
        client.send(JSON.stringify({
            online : [...wss.clients].map(c=>({userId:c.userId,username:c.username}))
        }));
    });
});