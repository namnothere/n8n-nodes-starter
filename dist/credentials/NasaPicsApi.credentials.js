"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NasaPicsApi = void 0;
class NasaPicsApi {
    constructor() {
        this.name = 'NasaPicsApi';
        this.displayName = 'NASA Pics API';
        this.documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                qs: {
                    'api_key': '={{$credentials.apiKey}}'
                }
            },
        };
    }
}
exports.NasaPicsApi = NasaPicsApi;
//# sourceMappingURL=NasaPicsApi.credentials.js.map