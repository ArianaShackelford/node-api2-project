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
    Posts.findPostComments(id)
    .then(post => {
        console.log(post);
        if(post.length === 0){
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

//create a new comment
router.post('/:id/comments', (req,res) => {
    const commentData = req.body;
    const id = req.params.id;
    req.body = {...req.body, post_id : id};


    Posts.findById(id)
      .then(post => {
          console.log(post);
          if(!post){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }else{
            Posts.insertComment(commentData)
            .then(newComment => {
                if(!req.body.text || !req.body.post_id){
                        res.status(400).json({
                            errorMessage: "Please provide text for the comment"
                        })
                        return;
                    }else{
                        Posts.findCommentById(newComment.id)
                        .then(selectedComment => {
                            res.status(200).json(selectedComment);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({errorMessage: "There was an error fetching your comment"})
                        })
                       
             } })
             .catch(err => {
               console.log(err);
               res.status(500).json({errorMessage: "sorry, we ran into and finding that post"});
             })
            }
           });
  });
    
  //delete post
  router.delete('/:id', (req,res) => {
      const id = req.params.id;
   Posts.findById(id)
      .then(post => {
        //   console.log(post)
         if(post.length === 0) {
            res.status(404).json({message: "Selected post could not be found"})
         }else
         Posts.remove(post.id)
         .then(deleted => {
             console.log('post',post);
                 res.status(200).json(post);
         })
         .catch(err => {
           console.log(err);
           res.status(500).json({message: "there was an error deleting your post"})
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "there was an error deleting your post"})
        });
     
  });

  //updates post

  router.put('/:id', (req,res) => {
    const id = req.params.id;
    Posts.findById(id)
       .then(post => {
           console.log('post inside of findById', post)
          if(post.length === 0) {
             res.status(404).json({message: "Selected post could not be found"})
          }else if(!req.body.title || !req.body.contents){
                res.status(400).json({message: "Must provide title and content to edit"})
          }else{ 
              Posts.update(post.id, req.body)
              .then(postToEdit => {
                console.log('post to edit',post.id);
                 res.status(200).json(post);
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({message: "there was an error editing your post"})
                 });
          }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "There was a problem editing your post"})
        })
  })

module.exports = router;