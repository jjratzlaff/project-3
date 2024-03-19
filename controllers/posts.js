const PostModel = require("../models/post");



module.exports = {
  create,
  index
};

const { v4: uuidv4 } = require('uuid');
// uuid, helps generate our unique ids
const S3 = require('aws-sdk/clients/s3');
// initialize the S3 consturctor function to give us the object that can perform crud operations to aws
const s3 = new S3();

const BUCKET_NAME = process.env.S3_BUCKET


function create(req, res) {
  console.log(req.file, req.body, req.user)
  // check to make sure a file was sent over
  const filePath = `pupstagram/${uuidv4()}-${req.file.originalname}`
  const params = {Bucket: BUCKET_NAME, Key: filePath, Body: req.file.buffer}
  // Upload our file to aws (request/response to aws)
  s3.upload(params, async function(err, data) {
    console.log("=======================");
    console.log(err, " err from aws");
    console.log("=======================");
    if (err) return res.status(400).json({ err: "Check Terminal error with AWS" });
    try {
        // then save our post to mongodb (request and response to mongodb)
      // Using our model to create a document in the posts collection in mongodb
      const post = await PostModel.create({
        caption: req.body.caption,
        user: req.user,
        photoUrl: data.Location, // < this is from aws
      });

      // Populate the user information
      // no need call exec because you are populating
      // on a document
      await post.populate('user')

      // respond to the client!
      // 201 means resource created!
        // then respond to the client (completing a request, by making response to the client(browser))
      res.status(201).json({ post });
    } catch (err) {
      res.status(400).json({ err });
    }
  })
}


async function index(req, res) {
  try {
    // this populates the user when you find the posts
    // so you'll have access to the users information
    // when you fetch teh posts
    const posts = await PostModel.find({}).populate("user").exec();
    res.status(200).json({ posts });
  } catch (err) {
    res.json({error: err})
  }
}