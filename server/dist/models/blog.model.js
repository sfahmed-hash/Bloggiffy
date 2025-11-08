"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogModel = exports.blogSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.blogSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: Object,
        required: true,
    },
    subtitle: {
        type: Object,
    },
    content: {
        type: Object,
        required: true,
        minLength: [40, "Content must be at least 40 characters long"]
    },
});
exports.blogModel = mongoose_1.default.model("Blog", exports.blogSchema);
