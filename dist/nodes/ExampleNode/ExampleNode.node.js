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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleNode = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class ExampleNode {
    constructor() {
        this.description = {
            displayName: 'Example Node',
            name: 'exampleNode',
            group: ['transform'],
            version: 1,
            description: 'Basic Example Node',
            defaults: {
                name: 'Example Node',
            },
            inputs: ["main"],
            outputs: ["main"],
            properties: [
                {
                    displayName: 'My String',
                    name: 'myString',
                    type: 'string',
                    default: '',
                    placeholder: 'Placeholder value',
                    description: 'The description text',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            let item;
            let myString;
            for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                try {
                    myString = this.getNodeParameter('myString', itemIndex, '');
                    item = items[itemIndex];
                    item.json.myString = myString;
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
                    }
                    else {
                        if (error.context) {
                            error.context.itemIndex = itemIndex;
                            throw error;
                        }
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                            itemIndex,
                        });
                    }
                }
            }
            return [items];
        });
    }
}
exports.ExampleNode = ExampleNode;
//# sourceMappingURL=ExampleNode.node.js.map