import { IExecuteFunctions, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import * as request from 'request-promise-native';
import * as cheerio from 'cheerio';

export class ViettelPost implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'ViettelPost Auth',
    name: 'ViettelPost',
    icon: 'file:Viettel_Post_logo.svg.png',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Get data from NASAs API',
    defaults: {
      name: 'ViettelPost Auth',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'ViettelPostApi',
        required: true,
      },
    ],
    properties: [],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    const credentials = await this.getCredentials('ViettelPostApi') as any;
    const username = credentials.username as string;
    const password = credentials.password as string;

    for (let i = 0; i < items.length; i++) {
      try {
        const loginPage = await request.get({
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

        if (!csrfToken) {
          throw new Error('CSRF token not found.');
        }

        const loginResponse = await request.post({
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

        const ssoUpdateResponse = await request.post({
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
          jar: true,
        })

        const TokenKey = JSON.parse(ssoUpdateResponse.body).data.TokenKey;

        if (!TokenKey) {
          throw new Error('TokenKey not found.');
        }

        returnData.push({ json: { accessToken, TokenKey } });
      } catch (error) {
        returnData.push({ json: { error: error.message } });
      }
    }

    return this.prepareOutputData(returnData);
  }
}