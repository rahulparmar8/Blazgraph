import express, { Router } from "express";
import User from "../controllers/book_controller.js";
import { check } from "express-validator";

const router = Router();
const user = new User();

router.get("/book", user.addBookpage);
router.post("/book",
    check("BookTitle", "BookTitle is required. Please enter your response. ")
        .not()
        .isEmpty(),
    check("price", "Price is required. Please enter your response. ")
        .not()
        .isEmpty(),
    check("authorname", "authorname is required. Please enter your response. ")
        .not()
        .optional(),
    user.addBook);
router.get("/booklist/:page", user.AllBookList)
router.get("/newlist/:page", user.newAllBookList)
router.get("/edit/:id", user.editData)
router.post("/edit/:id", user.editBookData)
router.get("/view/:id", user.oneRecordGet)
router.get("/delet/:id", user.bookDataDelete)
// router.post("/car", user.addCar)

export default router;