const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const { getDate } = require("./date");
const PORT = 2000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

(async () => {
    try {
        await mongoose.connect('mongodb+srv://demirkansafa:g8p79P78lH4CSrK3@cluster0.kb3rqz6.mongodb.net/postDB');
    } catch (err) {
        console.log(err);
    }
})();

const postSchema = new mongoose.Schema({
    postTitle: String,
    name: String,
    date: String,
    body: String,
});

const Post = mongoose.model("post", postSchema);

app.get("/", async (req, res) => {
    try {
        const posts = await Post.find();
        res.render("home", { title: "Home", content: "content", posts: posts });
    } catch (err) {
        console.log(err);
    }
});

app.get("/About_us", (req, res) => {
    res.render("home", { title: "About Us", content: "about us" });
});

app.get("/Contact_us", (req, res) => {
    res.render("home", { title: "Contact Us", content: "contact us" });
});

app.get("/Compose", (req, res) => {
    res.render("home", { title: "Compose" });
});

app.post("/read-more", async (req, res) => {
    try {
        const postDetails = await Post.findById(req.body.postId);
        res.render("home", { title: "read-more", post: postDetails });
    } catch (err) {
        console.log(err);
    }
});

app.get("/:navItem", (req, res) => {
    const navItem = _.capitalize(req.params.navItem);

    switch (navItem) {
        case "Home":
            res.redirect("/");
            break;
        case "Compose":
        case "About_us":
        case "Contact_us":
            res.redirect(`/${navItem}`);
            break;
        default:
            res.redirect("/");
            break;
    }
});

app.post("/", (req, res) => {
    const navItem = req.body.nav_item || req.body.compose;
    res.redirect(`/${navItem}`);
});

app.post("/compose", async (req, res) => {
    try {
        const post = new Post({
            postTitle: _.capitalize(req.body.title),
            body: req.body.post,
            name: req.body.name,
            date: getDate(),
        });
        await post.save();
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
