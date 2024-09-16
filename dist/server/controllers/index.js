"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const my_controller_1 = __importDefault(require("./my-controller"));
const author_1 = __importDefault(require("./author"));
const category_1 = __importDefault(require("./category"));
const tag_1 = __importDefault(require("./tag"));
const media_1 = __importDefault(require("./media"));
const post_1 = __importDefault(require("./post"));
const comment_1 = __importDefault(require("./comment"));
const users_1 = __importDefault(require("./users"));
exports.default = {
    myController: my_controller_1.default,
    author: author_1.default,
    category: category_1.default,
    tag: tag_1.default,
    media: media_1.default,
    post: post_1.default,
    comment: comment_1.default,
    users: users_1.default
};
