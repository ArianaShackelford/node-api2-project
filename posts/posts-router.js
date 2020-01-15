const express = require('express');

const Posts = require('../data/db.js');

const router = express.Router();

//Get list of posts
router.get('/', (req, res) => {
    Posts.find()
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the hubs',
        });
      });
  });

  //get post by id
  router.get('/:id', (req,res)=> {
      const id = req.params.id;
      Posts.findById(id)
      .then(post => {
          console.log(post);
          if(!post){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }else
        res.status(200).json(post);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({errorMessage: "sorry, we ran into and finding that post"});
    });
  });

//get comments for a particular post
router.get('/:id/comments', (req,res)=> {
    const id = req.params.id;
    req.body = {...req.body, post_id : id};
    Posts.findPostComments(post_id)
    .then(comments => {
        console.log(comments);
        if(!comments){
          res.status(404).json({
              message: "The post with the specified ID does not exist"
          })
      }else
      res.status(200).json(comments);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({errorMessage: "sorry, we ran into and finding that post"});
  });
});
//create a new post
router.post('/', (req,res) => {
    const postData = req.body;
    // console.log(req);
    if(!req.body.title || !req.body.contents){
        res.status(400).json({
            errorMessage: "Please provide title and content for the post"
        })
    }else
    Posts.insert(postData)
    .then(post => {
        res.status(201).json(post);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: "The post with the specified ID does not exist"});
    });
    
})

module.exports = router;