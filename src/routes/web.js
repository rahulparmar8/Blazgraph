import express, { Router } from "express";
import User from "../controllers/product.js";

const router = Router();
const user = new User();

router.get("/booklist",user.AllBookList)
router.post("/book", user.addBook);
router.get("/search", user.oneRecordGet)
router.delete("/delet",user.bookDataDelete)
router.post("/edit",user.editData)
// router.post("/car", user.addCar)

export default router;