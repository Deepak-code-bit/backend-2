const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getConnect } = require("../db");

const posts = [{title: "My Title", description: "My Description"}];

const getAllPosts = async () => {
    const posts = [];
        const postsConnect = getConnect().db().collection("posts");
        const postsCursor = await postsConnect.find({});
        await postsCursor.forEach( post => {
            posts.push(post);
        });
        return posts;
}

router.get("/posts", async (req, res) => {
    const posts = await getAllPosts();
    res.status(200).json(posts);
});

router.post("/post", async (req, res) => {
    const {title, description} = req.body;
    const postsConnect = getConnect().db().collection("posts");
    await postsConnect.insertOne({title, description});
    const posts = await getAllPosts();
    res.status(201).json(posts);
});

router.patch("/post/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log(ObjectId(id));
        const {title, description} = req.body;
        console.log({title, description});
        const postsConnect = getConnect().db().collection("posts");
        await postsConnect.updateOne({_id: ObjectId(id)}, {$set: {title, description}});
        const posts = await getAllPosts();
        res.status(201).json(posts);
    } catch (e) {
        console.log(e);
        res.json("ERROR")
    }
});

router.delete("/post/:id", async (req, res) => {
    const id = req.params.id;
    const postsConnect = getConnect().db().collection("posts");
    await postsConnect.deleteOne({_id: ObjectId(id)});
    const posts = await getAllPosts();
    res.status(201).json(posts);
});

module.exports = router;