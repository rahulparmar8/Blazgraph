import express, { Router } from "express";
import User from "../controllers/product.js";

const router = Router();
const user = new User();

router.get("/booklist",user.AllBookList)
router.post("/book", user.Book);
router.post("/car", user.Car)

export default router;