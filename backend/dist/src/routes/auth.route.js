"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const router = express_1.default.Router();
router.post('/signup', auth_controller_1.signup);
router.post('/login', auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
router.post('/create-admin', auth_controller_1.createAdmin);
router.get("/me", auth_middleware_1.authenticateUser, auth_controller_1.getProfile);
router.get("/admin/users", auth_middleware_1.authenticateUser, admin_middleware_1.requireAdmin, auth_controller_1.getAllUsers);
router.put("/admin/users/:userId/role", auth_middleware_1.authenticateUser, admin_middleware_1.requireAdmin, auth_controller_1.updateUserRole);
exports.default = router;
//# sourceMappingURL=auth.route.js.map