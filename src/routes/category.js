import express, { Router } from "express";
import { check } from "express-validator";
import Category from "../controllers/category_controller.js";

const router = Router();
const category = new Category();

router.get("/categorylist/:page",category.allCategoryList)
router.get("/category", category.getCategory);
router.post("/category",
    check("Name", "Name is required. Please enter your response. ")
        .not()
        .isEmpty(),
    category.addCategory)
router.get("/editcategory/:id", category.editCategory)
router.post("/editcategory/:id", category.editCategoryData)
router.get("/deletecategory/:id", category.deleteCategory)
router.get("/viewcategory/:id", category.oneRecordCategory)
export default router;