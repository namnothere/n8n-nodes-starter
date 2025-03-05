"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const request = __importStar(require("request-promise-native"));
const cheerio = __importStar(require("cheerio"));
const execute = () => __awaiter(void 0, void 0, void 0, function* () {
    const returnData = [];
    const username = "0886158479";
    const password = "Thuyduon1";
    try {
        const loginPage = yield request.get({
            method: 'GET',
            uri: 'https://id.viettelpost.vn/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dvtp.web%26secret%3Dvtp-web%26scope%3Dopenid%2520profile%2520se-public-api%2520offline_access%26response_type%3Did_token%2520token%26state%3Dabc%26redirect_uri%3Dhttps%253A%252F%252Fviettelpost.vn%252Fstart%252Flogin%26nonce%3Dsxr4b2916zq1wdk6kzr8ya',
            headers: {
                'User-Agent': 'Mozilla/5.0',
            },
            resolveWithFullResponse: true,
            jar: true,
        });
        const $ = cheerio.load(loginPage.body);
        const csrfToken = $('input[name="__RequestVerificationToken"]').val();
        const returnUrl = $('#ReturnUrl').val();
        console.log("csrfToken", csrfToken);
        console.log("returnUrl", returnUrl);
        if (!csrfToken) {
            throw new Error('CSRF token not found.');
        }
        const loginResponse = yield request.post({
            method: 'POST',
            uri: 'https://id.viettelpost.vn/Account/Login',
            form: {
                ReturnUrl: returnUrl,
                Username: username,
                Password: password,
                Button: 'login',
                __RequestVerificationToken: csrfToken,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0',
            },
            resolveWithFullResponse: true,
            followAllRedirects: true,
            jar: true,
        });
        const redirectUrl = loginResponse.request.uri.href;
        const urlParams = new URLSearchParams(redirectUrl.split('#')[1]);
        const accessToken = urlParams.get('access_token');
        if (!accessToken) {
            throw new Error('Access token not found.');
        }
        const ssoUpdateResponse = yield request.post({
            uri: "https://api.viettelpost.vn/api/user/ssoUpdateUser",
            body: JSON.stringify({
                "TokenSSO": accessToken,
                "Type": "VTP",
                "Source": 3,
                "deviceName": "Windows",
                "DeviceToken": "97c38a97-bbf7-4409-a6f9-d738a71df4cb",
                "deviceId": "aly68rja05oll6j9jrgy",
                "deviceType": "WEB",
                "browser": "Opera"
            }),
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json, text/plain, */*',
            },
            resolveWithFullResponse: true,
            followAllRedirects: true,
            jar: true
        });
        const TokenKey = JSON.parse(ssoUpdateResponse.body).data.TokenKey;
        if (!TokenKey) {
            throw new Error('TokenKey not found.');
        }
        returnData.push({ json: { TokenKey } });
    }
    catch (error) {
        returnData.push({ json: { error: error.message } });
    }
    console.log(returnData);
    return returnData;
});
execute();
//# sourceMappingURL=testViettelpost.js.map