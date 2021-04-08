"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
const port = 4040;
app.use(morgan_1.default('dev'));
app.get('/', (req, res) => {
    res.send('Hello world! tsc-watch some more changes');
});
app.listen(port, () => {
    console.debug(`server started at localhost:${port}`);
});
//# sourceMappingURL=server.js.map