"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const questions_route_1 = __importDefault(require("./routes/questions.route"));
const answers_route_1 = __importDefault(require("./routes/answers.route"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./lib/db");
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, cors_1.default)({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', auth_route_1.default);
app.use('/api/questions', questions_route_1.default);
app.use('/api/answers', answers_route_1.default);
app.use('/api/users', users_route_1.default);
console.log("Routes initialized successfully");
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    (0, db_1.connectDB)();
});
exports.default = app;
//# sourceMappingURL=server.js.map