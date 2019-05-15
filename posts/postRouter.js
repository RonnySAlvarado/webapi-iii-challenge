const express = require('express');

const router = express.Router();

const db = require('./postDb.js');

router.get('/', async (req, res) => {
    const allPosts = await db.get();
    res.status(200).json(allPosts);
});

router.get('/:id', validatePostId, (req, res) => {
    res.status(200).json(req.validId);
});

router.delete('/:id', validatePostId, async (req, res) => {
    try {
        const { id } = req.params;
        const deletePost = await db.remove(id);
        res.status(200).json(deletePost);
    } catch(err){
        res.status(500).json({ message: "Something went wrong with deleting the post" })
    }
})

router.put('/:id', validatePostId, validatePost, async (req, res) => {
    try {
        const { id } = req.params;
        const editPost = await db.update(id, req.body);
        res.status(200).json(editPost);
    } catch (err){
        res.status(500).json({ messsage: "Something went wrong with updating the post" })
    }
});

// custom middleware

async function validatePostId(req, res, next) {
    const { id } = req.params;
    const validId = await db.getById(id);
    if (validId){
        req.validId = validId;
        next();
    } else {
        res.status(404).json({ message: "Invalid id" })
    }
};

function validatePost(req, res, next) {
    const updatePost = req.body;
        if (updatePost && Object.keys(updatePost).length){
            if((updatePost.text).length){
                next();
            } else {
                res.status(400).json({ message: "missing required text field" })
            }
        } else {
            res.status(400).json({ message: "missing post data" })
        }
};

module.exports = router;