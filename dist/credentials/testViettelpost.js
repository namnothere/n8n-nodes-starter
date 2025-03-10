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
const { ViettelPost } = require('./ViettelPost.credentials.js');
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const viettelPost = new ViettelPost();
        viettelPost.getInputData = () => [{ json: {} }];
        viettelPost.getNodeParameter = (param, index) => {
            const credentials = {
                username: "your_username",
                password: "your_password"
            };
            return credentials[param];
        };
        viettelPost.prepareOutputData = (data) => data;
        try {
            const result = yield viettelPost.execute();
            console.log("Execution Result:", result);
        }
        catch (error) {
            console.error("Error:", error);
        }
    });
}
test();
//# sourceMappingURL=testViettelpost.js.map