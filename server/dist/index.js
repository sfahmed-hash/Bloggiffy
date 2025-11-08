"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
const blocknote_1 = require("./middleware.ts/blocknote");
const blog_controller_1 = require("./controllers/blog.controller");
const user_controller_1 = require("./controllers/user.controller");
const auth_1 = require("./middleware.ts/auth");
const medium_controller_1 = require("./controllers/medium.controller");
const hashnode_controller_1 = require("./controllers/hashnode.controller");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, db_1.connectToDB)();
// auth checkpoints
app.get("/auth/github", (req, res) => {
    const redirectURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user,repo`;
    res.redirect(redirectURL);
});
app.get("/auth/github/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //GitHub sends code → You exchange it for access_token → Use token to fetch user data → Redirect frontend with token.
    const code = req.query.code;
    try {
        const tokenRes = yield axios_1.default.post(`https://github.com/login/oauth/access_token`, {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }, {
            headers: { Accept: "application/json" },
        });
        const access_token = tokenRes.data.access_token;
        const userRes = yield axios_1.default.get(`https://api.github.com/user`, {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        res.redirect(`${process.env.FRONTEND_URL}/loading/?token=${access_token}`);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("GitHub auth failed");
    }
}));
// Initialize OpenAI client
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// AI completion endpoint for BlockNote
app.post('/ai', blocknote_1.validateApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const { provider, url } = req.query;
        const _d = req.body, { messages, model = 'gpt-4o-mini', stream = false } = _d, otherParams = __rest(_d, ["messages", "model", "stream"]);
        console.log('AI request received:', { provider, url, model, stream });
        // Handle OpenAI requests
        if (provider === 'openai' && url === 'https://api.openai.com/v1/chat/completions') {
            if (stream) {
                // Handle streaming requests
                const streamResponse = yield openai.chat.completions.create(Object.assign({ model,
                    messages, stream: true }, otherParams));
                res.setHeader('Content-Type', 'text/event-stream');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');
                try {
                    //@ts-ignore
                    for (var _e = true, streamResponse_1 = __asyncValues(streamResponse), streamResponse_1_1; streamResponse_1_1 = yield streamResponse_1.next(), _a = streamResponse_1_1.done, !_a; _e = true) {
                        _c = streamResponse_1_1.value;
                        _e = false;
                        const chunk = _c;
                        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_e && !_a && (_b = streamResponse_1.return)) yield _b.call(streamResponse_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                res.write('data: [DONE]\n\n');
                res.end();
            }
            else {
                // Handle regular completion requests
                const completion = yield openai.chat.completions.create(Object.assign({ model,
                    messages }, otherParams));
                res.json(completion);
            }
        }
        else {
            res.status(400).json({
                error: 'Unsupported provider or URL',
                provider,
                url
            });
        }
    }
    catch (error) {
        console.error('AI completion error:', error);
        res.status(500).json({
            error: 'AI completion failed',
            details: error.message
        });
    }
}));
// keep alive endpoint
app.head('/health', (req, res) => {
    // HEAD requests should not return a body
    // Just return status code and headers
    res.set({
        'X-Service-Status': 'ok',
        'X-Service-Uptime': process.uptime(),
        'X-Last-Check': new Date().toISOString()
    });
    res.status(200).end();
});
// health checkpoint
app.get('/health', (req, res) => {
    res.send("server is running healthy from bloggify");
});
// user login endpoint
app.post('/user/login', (req, res) => {
    (0, user_controller_1.login)(req, res);
});
// user profile endpoint -- public endpoint
app.post('/user/profile', (req, res) => {
    (0, user_controller_1.getProfile)(req, res);
});
// blog routes
app.get('/blogs', (req, res) => {
    (0, blog_controller_1.getAllBlogs)(req, res);
});
app.post('/blog', auth_1.auth, (req, res) => {
    (0, blog_controller_1.createBlog)(req, res);
});
app.get('/blog/:id', (req, res) => {
    (0, blog_controller_1.getSingleBlogById)(req, res);
});
app.get('/userblog', auth_1.auth, (req, res) => {
    (0, blog_controller_1.getUserBlogs)(req, res);
});
app.put('/blog/:id', (req, res) => {
    (0, blog_controller_1.editBlog)(req, res);
});
// get blogs by username -- public endpoint
app.post('/user/blog', (req, res) => {
    (0, blog_controller_1.getBlogByUsername)(req, res);
});
// get modium blogs by username 
app.post('/user/medium/blogs', (req, res) => {
    (0, medium_controller_1.fetchMediumBlogs)(req, res);
});
// get hashnode blogs by username
app.post('/user/hashnode/blogs', (req, res) => {
    (0, hashnode_controller_1.fetchHashnodeBlogs)(req, res);
});
// medium blogs
app.post('/user/medium', (req, res) => {
    (0, medium_controller_1.medium_integration)(req, res);
});
app.post('/user/hashnode', (req, res) => {
    (0, hashnode_controller_1.hashnode_integration)(req, res);
});
// viewer distinction endpoint
app.post('/user/distinguish', (req, res) => {
    (0, user_controller_1.distinguishUser)(req, res);
});
const GET_USER_BLOG = app.post('/demo/hashnode', (req, res) => {
});
// server listening here
app.listen(3001, () => {
    console.log("server running at 3001");
});
