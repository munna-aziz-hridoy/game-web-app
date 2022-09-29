import { Router } from "express";
import { allCompany } from "../controller/companyController.js";

const router = Router();

router.route("/all-companies").get(allCompany);

export default router;
