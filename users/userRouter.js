const express = require('express');

const router = express.Router();

const db = require('./userDb.js');

router.post('/', validateUser, async (req, res) => {
    try {
        const newUser = await db.insert(req.body);
        res.status(201).json(newUser);
    } catch (err){
        res.status(500).json({ message: "Something went wrong with saving a new user to the databases" })
    }
});

// router.post('/:id/posts', (req, res) => {

// });

router.get('/', async (req, res) => {
    try {
        const allUsers = await db.get();
        res.status(200).json(allUsers);
    } catch (err){
        res.status(500).json({ error: "Something went wrong with retrieving the users list." })
    }
});

router.get('/:id', validateUserId, async (req, res) => {
    res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, async (req, res) => {
    try {
        const { id } = req.params;
        const userPosts = await db.getUserPosts(id);
        res.status(200).json(userPosts);
    } catch(err){
        res.status(500).json({ message: "Something went wrong with retrieving the user's posts" })
    }
});

router.delete('/:id', validateUserId, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await db.remove(id);
        res.status(200).json(deleteUser);
    } catch (err){
        res.status(500).json({ message: "Something went wrong with deleting the specified user" })
    }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const editUser = await db.update(id, req.body);
        res.status(200).json(editUser);
    } catch (err){
        res.status(500).json({ message: "Something went wrong with updating the specified user's information." })
    }
});

//custom middleware

async function validateUserId(req, res, next) {
    try {
        const { id } = req.params;
        const user = await db.getById(id);
        if (user){
            req.user = user;
            next();
        } else {
            res.status(404).json({ message: "invalid user id" })
        }
    } catch(err){
        res.status(500).json({ message: "Something went wrong with your request." })
    }
};

function validateUser(req, res, next) {
        const newUser = req.body;
        if (newUser && Object.keys(newUser).length){
            if((newUser.name).length){
                next();
            } else {
                res.status(400).json({ message: "missing required name field" })
            }
        } else {
            res.status(400).json({ message: "missing user data" })
        }
};

function validatePost(req, res, next) {
    const newPost = req.body;
        if (newPost && Object.keys(newPost).length){
            if((newPost.text).length){
                next();
            } else {
                res.status(400).json({ message: "missing required text field" })
            }
        } else {
            res.status(400).json({ message: "missing post data" })
        }
};

module.exports = router;
