const PostModel = require("../models/post");



module.exports = {
  create,
  index
};

const { v4: uuidv4 } = require('uuid');

const S3 = require('aws-sdk/clients/s3');

const s3 = new S3();

const BUCKET_NAME = process.env.S3_BUCKET


function create(req, res) {
  console.log(req.file, req.body, req.user)
 
  const filePath = `pupstagram/${uuidv4()}-${req.file.originalname}`
  const params = {Bucket: BUCKET_NAME, Key: filePath, Body: req.file.buffer}
  
  s3.upload(params, async function(err, data) {
    console.log("=======================");
    console.log(err, " err from aws");
    console.log("=======================");
    if (err) return res.status(400).json({ err: "Check Terminal error with AWS" });
    try {
   
      const post = await PostModel.create({
        caption: req.body.caption,
        user: req.user,
        photoUrl: data.Location, // < this is from aws
      });

   
      await post.populate('user')

     
      res.status(201).json({ post });
    } catch (err) {
      res.status(400).json({ err });
    }
  })
}


async function index(req, res) {
  try {

    const posts = await PostModel.find({}).populate("user").exec();
    res.status(200).json({ posts });
  } catch (err) {
    res.json({error: err})
  }
}