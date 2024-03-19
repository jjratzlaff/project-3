const express = require('express');
const router = express.Router();
const likesCtrl = require('../../controllers/likes')

// in server app.use('/api', likesRouter)
// so the full routes are 
// /api/posts/:id/likes
router.post('/posts/:id/likes', likesCtrl.create)
// /api/likes/:id
router.delete('/likes/:id', likesCtrl.deleteLike)

module.exports = router;