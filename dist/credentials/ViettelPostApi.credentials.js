"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViettelPostApi = void 0;
class ViettelPostApi {
    constructor() {
        this.name = 'ViettelPostApi';
        this.displayName = 'ViettelPostApi';
        this.documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
        this.properties = [
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
            },
        ];
    }
}
exports.ViettelPostApi = ViettelPostApi;
//# sourceMappingURL=ViettelPostApi.credentials.js.map