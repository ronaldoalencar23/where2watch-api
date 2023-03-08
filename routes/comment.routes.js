import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAuth from "../middlewares/isAuth.js";
import { CommentModel } from "../model/comment.model.js"; // não tem PostModel
import { UserModel } from "../model/user.model.js";

const commentRouter = express.Router();

commentRouter.post("/:titleId", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const newComment = await CommentModel.create({
      ...req.body,
      user: req.currentUser._id,
      title: req.params.titleId,
    });

    await UserModel.findOneAndUpdate(
      { _id: req.currentUser._id },
      { $push: { comments: newComment._id } },
      { new: true, runValidators: true }
    );

    return res.status(201).json(newComment);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

commentRouter.get("/", async (req, res) => {
  // TESTAR
  try {
    const comment = await CommentModel.find();
    return res.status(200).json(comment);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

commentRouter.get("/:commentId", async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.commentId);
    return res.status(200).json(comment);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

commentRouter.put(
  "/:commentId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      if (!req.currentUser.comments.includes(req.params.commentId)) {
        return res.status(401).json("Você precisa logar para comentar.");
      }

      const updatedComment = await CommentModel.findOneAndUpdate(
        { _id: req.params.commentId },
        { ...req.body },
        { new: true, runValidators: true }
      );

      return res.status(200).json(updatedComment);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

commentRouter.delete(
  "/:commentId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const comment = await CommentModel.findOne({
        _id: req.params.commentId,
      });

      if (
        !req.currentUser.comments.includes(req.params.commentId) ||
        !comment.user === req.currentUser._id
      ) {
        return res.status(401).json("Você só pode excluir o seu comentário.");
      }
      const deletedComment = await CommentModel.deleteOne({
        _id: req.params.commentId,
      });

      await UserModel.findOneAndUpdate(
        { comments: req.params.commentId },
        { $pull: { comments: req.params.commentId } },
        { new: true, runValidators: true }
      );

      return res.status(200).json(deletedComment);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export { commentRouter };
