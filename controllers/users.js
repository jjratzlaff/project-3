const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const PostModel = require('../models/post')

const { v4: uuidv4 } = require('uuid');

const S3 = require('aws-sdk/clients/s3');
// initialize the S3 consturctor function to give us the object that can perform crud operations to aws
const s3 = new S3();

const BUCKET_NAME = process.env.S3_BUCKET


module.exports = {
  signup,
  login,
  profile
};

async function profile(req, res){
  try {
    // Find the user by there username
    // from the params
    const user = await User.findOne({username: req.params.username})
    // if we don't find a user send back user not found
    if (!user) return  res.status(404).json({error: 'User not found'})

    const posts = await PostModel.find({user: user._id}).populate('user').exec()

    res.status(200).json({data: posts, user: user})
  } catch(err){
    console.log(err)
    res.status(400).json({err})
  }
}

async function signup(req, res) {
  console.log(req.body, req.file)

 
  if(!req.file) return res.status(400).json({error: 'Please Submit a Photo'})

  
  const filePath = `pupstagram/${uuidv4()}-${req.file.originalname}`
  const params = {Bucket: BUCKET_NAME, Key: filePath, Body: req.file.buffer}; 
  
  s3.upload(params, async function(err, data){ 
    if(err){
      console.log('===============================')
      console.log(err, ' <- error from aws, Probably telling you your keys arent correct')
      console.log('===============================')
      res.status(400).json({error: 'error from aws, check your terminal'})
    }

    const user = new User({...req.body, photoUrl: data.Location}); 
    try {
      await user.save(); 
      const token = createJWT(user);
      res.json({ token }); 
    } catch (err) {
      
      res.status(400).json(err);
    }


  }) 

}

async function login(req, res) {
 
  try {
    const user = await User.findOne({email: req.body.email});
   
    if (!user) return res.status(401).json({err: 'bad credentials'});
    user.comparePassword(req.body.password, (err, isMatch) => {
      
      if (isMatch) {
        const token = createJWT(user);
        res.json({token});
      } else {
        return res.status(401).json({err: 'bad credentials'});
      }
    });
  } catch (err) {
    return res.status(401).json(err);
  }
}

/*----- Helper Functions -----*/

function createJWT(user) {
  return jwt.sign(
    {user}, // data payload
    SECRET,
    {expiresIn: '24h'}
  );
}
