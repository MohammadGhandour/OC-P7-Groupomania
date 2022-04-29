const fs = require('fs');
const db = require('../config/dbConfig');
require('dotenv').config();

exports.createPost = (req, res) => {
    const userId = req.auth.userId;
    const postContent = req.body.description;
    const postImage = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : '';
    if (postContent == '' && postImage == '') {
        res.status(400).json({ error: "Votre publication doit avoir un message ou une photo !" });
        return
    }
    db.query(`INSERT INTO posts (postDate, userId, postContent, postImage) VALUES (NOW(), '${userId}', "${postContent}", "${postImage}")`), (err, results) => {
        if (err) {
            return res.status(401).json({ error })
        }
    }
    if (res) {
        res.status(200).json({ message: 'Post created successfully !' })
    }
}

exports.getAllPosts = (req, res) => {
    db.query(`SELECT *, posts.id AS postId FROM posts, users WHERE users.id = posts.userId ORDER BY postDate DESC`, (err, posts) => {
        if (err) {
            console.log(err);
            res.status(404).json({ error: 'There\'s no post to show !' })
        } else {
            res.status(200).json(posts);
        }
    })
}

exports.getUserPosts = (req, res) => {
    const userId = req.params.userId;
    db.query(`SELECT * FROM posts WHERE userId = ${userId} ORDER BY postDate DESC`, (err, userPosts) => {
        if (err) {
            console.log(err);
            res.status(404).json({ error: "Couldn't find posts !" })
        }
        else {
            res.status(200).json(userPosts);
        }
    })
}

exports.editPost = (req, res) => {
    let newPostContent = req.body.editedDesc;
    const postId = req.params.id;
    let postImage = '';
    db.query(`SELECT * FROM posts WHERE id = '${postId}'`, (err, posts) => {
        if (err) throw err;
        if (posts.length === 0) {
            return res.status(404).json({ error: 'Publication non trouvé !' })
        } else {
            const post = posts[0];
            let originalPostImage = post.postImage;
            if (originalPostImage) {
                originalPostImage = post.postImage.split('/images/')[1];
            }
            if (req.file) {
                let imageToUpdate = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                db.query(`UPDATE posts SET postContent = '${newPostContent}', postImage = '${imageToUpdate}' WHERE id = '${postId}'`, (err, result) => {
                    if (err) throw err;
                    if (originalPostImage && req.file || req.body.deleteImage) {
                        fs.unlink(`images/${originalPostImage}`, (err => {
                            if (err) throw err;
                        }))
                    }
                    return res.status(200).json({ message: 'Votre post a bien été modifié !' })
                })
            } else if (!req.file && !req.body.deleteImage && originalPostImage) {
                db.query(`UPDATE posts SET postContent = '${newPostContent}' WHERE id = '${postId}'`, (err, result) => {
                    if (err) throw err;
                    return res.status(200).json({ message: 'Votre post a bien été modifié !' })
                })
            } else if (!req.file && !newPostContent) {
                db.query(`DELETE FROM posts WHERE id = ${postId}`, (err, result) => {
                    if (err) throw err;
                    res.status(200).json({ message: 'Publication supprimée !' });
                    return;
                })
                if (originalPostImage) {
                    fs.unlinkSync(`images/${originalPostImage}`, (err => {
                        if (err) {
                            console.log(err)
                        }
                    }))
                }
            }
            else {
                db.query(`UPDATE posts SET postContent = '${newPostContent}', postImage = '${postImage}' WHERE id = '${postId}'`, (err, result) => {
                    if (err) throw err;
                    if (originalPostImage) {
                        fs.unlink(`images/${originalPostImage}`, (err => {
                            if (err) throw err;
                        }))
                    }
                    return res.status(200).json({ message: 'Votre post a bien été modifié !' })
                })
            }
        }
    })
}

exports.deletePost = (req, res) => {
    const postId = req.params.id;
    const userId = req.auth.userId
    db.query(`SELECT *, posts.id AS postId FROM posts, users WHERE posts.id = '${postId}' AND users.id = '${userId}'`, (err, results) => {
        if (err) {
            console.log(err);
        }
        if (results.length < 1) {
            res.status(404).json({ error: "Couldn't find post !" })
            console.log(results);
            console.log("Couldn't find post !!!");
        }
        let postImage = null;
        if (results[0].postImage !== '') {
            postImage = results[0].postImage.split('/images/')[1];
        }
        if (results[0].id == results[0].userId || results[0].admin == 1) {
            db.query(`DELETE FROM posts WHERE id = ${postId}`, (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: "We couldn't delete your post !" })
                } else {
                    db.query(`DELETE FROM comments WHERE postId = ${postId}`, (err, results) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ error: "Couldn't delete comments related to this post !" })
                        } else {
                            res.status(200).json({ message: "This post's comments has been deleted successfully !" })
                        }
                    })
                    if (postImage) {
                        fs.unlinkSync(`images/${postImage}`, (err => {
                            if (err) {
                                console.log(err)
                            }
                        }))
                    }
                }
            })
        } else {
            res.status(401).json({ error: 'Vous n\'êtes pas autorisé !' })
        }
    })
}


exports.createComment = (req, res) => {
    const comment = req.body.comment;
    const postId = req.body.postId;
    const userId = req.auth.userId;
    if (comment == '') {
        res.status(400).json({ error: 'Votre commentaire ne peuvent pas être vide !' });
        return
    }
    db.query(`INSERT INTO comments (postId, userId, commentContent, commentDate) VALUES ('${postId}', '${userId}', "${comment}", NOW())`, (err, results) => {
        if (err) {
            console.log(err);
            res.status(400).json({ error: "Couldn't create comment !" })
        } else {
            res.status(201).json({ message: 'Comment created !' })
        }
    })
}

exports.getAllComments = (req, res) => {
    db.query(`SELECT *, comments.id AS commentId FROM comments, users WHERE users.id = comments.userId ORDER BY commentDate DESC`, (err, comments) => {
        if (err) {
            console.log(err);
            res.status(404).json({ error: "Couldn't find comments !" })
        } else {
            res.status(200).send(comments)
        }
    })
}

exports.deleteOneComment = (req, res) => {
    const commentId = req.params.id;
    userId = req.auth.userId
    db.query(`SELECT *, comments.id AS commentId FROM comments, users WHERE comments.id = ${commentId
        } AND users.id = '${userId}'`, (err, result) => {
            if (err) throw err;
            if (userId == result[0].userId || result[0].admin) {
                db.query(`DELETE FROM comments WHERE id = ${commentId}`, (err, results) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ error: "Couldn't delete comment !" })
                    } else {
                        res.status(200).json({ message: "Comment deleted !" })
                    }
                })
            } else {
                res.status(401).json({ error: "Vous n'êtes pas authorisé !" })
            }
        })
}

exports.editComment = (req, res) => {
    const editedComment = req.body.editedComment;
    const commentId = req.params.id;
    if (editedComment == '') {
        return
    } else {
        db.query(`SELECT * FROM comments WHERE id = '${commentId}'`, (err, result) => {
            if (err) throw err;
            db.query(`UPDATE comments SET commentContent = '${editedComment}' WHERE id = ${commentId}`, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ err })
                };
                res.status(200).json({ message: "Votre commentaire a bien été modifiée !" })
            })
        })
    }
}

exports.like = (req, res) => {
    const postId = req.params.id;
    const userId = req.auth.userId;

    db.query(`SELECT * FROM posts WHERE id = ${postId}`, (err, posts) => {
        if (err) {
            console.log(err);
            res.status(404).json({ error: "Couldn't find post !" })
        } else {
            const post = posts[0];
            let usersLiked = JSON.parse(post.usersLiked);
            const findUser = usersLiked.findIndex((a) => a == userId);
            if (findUser == -1 && req.body.like == 1) {
                usersLiked.push(userId);
                usersLikedArray = JSON.stringify(usersLiked);
                const likes = post.likes + 1;
                db.query(`UPDATE posts SET usersLiked = "${usersLikedArray}", likes = "${likes}" WHERE id = ${postId}`, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ error: "Couldn't like the post !" })
                    } else {
                        res.status(200).json({ message: "Post liked successfully !" })
                    }
                })
            } else {
                usersLiked.splice(findUser, 1)
                usersLikedArray = JSON.stringify(usersLiked);
                const likes = post.likes - 1;
                db.query(`UPDATE posts SET usersLiked = "${usersLikedArray}", likes = "${likes}" WHERE id = ${postId}`, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ error: "Couldn't dislike this post !" })
                    } else {
                        res.status(200).json({ message: "Like removed successfully !" })
                    }
                })
            }
        }
    })
}




// let editedDesc = req.body.editedDesc;
// let editedImage = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : '';
// const postId = req.params.id;
// db.query(`SELECT * FROM posts WHERE id = '${postId}'`, (err, result) => {
//     if (err) throw err;
//     else {
//         const originalPost = result[0];
//         if (editedDesc == '') {
//             editedDesc = originalPost.postContent;
//         }
//         if (editedImage == '') {
//             editedImage = originalPost.postImage;
//         }
//         if (editedDesc == '' && editedImage == '') {
//             console.log('Nothing to update');
//             return
//         };
//         db.query(`UPDATE posts SET postContent = '${editedDesc}', postImage = '${editedImage}' WHERE id = '${postId}'`, (err, result) => {
//             if (err) throw err;
//             res.status(200).json({ message: 'Votre publication a bien été modifié !' })
//         })
//     }
// })