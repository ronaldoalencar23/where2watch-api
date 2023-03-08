import express from "express";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { MyListModel } from "../model/myList.model.js";
import isAuth from "../middlewares/isAuth.js";

const myListRouter = express.Router();

myListRouter.post("/", isAuth, attachCurrentUser, async (req, res) => {
  // rota errada
  try {
    const newList = await MyListModel.create({
      ...req.body,
      user: req.currentUser._id,
    });

    return res.status(200).json(newList);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

myListRouter.get("/:myListId", isAuth, async (req, res) => {
  try {
    const { myListId } = req.params;
    const list = await MyListModel.findOne({ _id: myListId });

    return res.status(200).json(list);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

myListRouter.get("/", async (req, res) => {
  // TESTAR
  try {
    const list = await MyListModel.find();
    return res.status(200).json(list);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

myListRouter.put("/:myListId", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const updatedList = await MyListModel.findOneAndUpdate(
      { _id: req.params.myListId },
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedList);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

myListRouter.delete(
  "/:myListId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const deletedList = await MyListModel.deleteOne({
        _id: req.params.myListId,
      });

      await MyListModel.findOneAndUpdate(
        { _id: req.currentUser._id },
        { $pull: { lists: req.params.myListId } },
        { new: true, runValidator: true }
      );

      return res.status(200).json(deletedList);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export { myListRouter };
