import * as request from 'request-promise-native';
import * as cheerio from 'cheerio';

const execute = async () => {
  const returnData: any = [];

  const username = "0886158479";
  const password = "Thuyduon1";

  try {
    const loginPage = await request.get({
      method: 'GET',
      uri: 'https://id.viettelpost.vn/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dvtp.web%26secret%3Dvtp-web%26scope%3Dopenid%2520profile%2520se-public-api%2520offline_access%26response_type%3Did_token%2520token%26state%3Dabc%26redirect_uri%3Dhttps%253A%252F%252Fviettelpost.vn%252Fstart%252Flogin%26nonce%3Dsxr4b2916zq1wdk6kzr8ya',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      resolveWithFullResponse: true,
      jar: true, // Enable cookie storage
    });
    const $ = cheerio.load(loginPage.body);
    const csrfToken = $('input[name="__RequestVerificationToken"]').val();
    const returnUrl = $('#ReturnUrl').val();

    console.log("csrfToken", csrfToken);
    console.log("returnUrl", returnUrl);

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
      followAllRedirects: true, // Follow redirects
      jar: true,
    });

    // Step 3: Extract Access Token from Redirect URL
    const redirectUrl = loginResponse.request.uri.href;
    const urlParams = new URLSearchParams(redirectUrl.split('#')[1]);
    const accessToken = urlParams.get('access_token');

    if (!accessToken) {
      throw new Error('Access token not found.');
    }

    // returnData.push({ json: { accessToken } });

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
      jar: true
    })

    const TokenKey = JSON.parse(ssoUpdateResponse.body).data.TokenKey;

    if (!TokenKey) {
      throw new Error('TokenKey not found.');
    }

    returnData.push({ json: { TokenKey } });
  } catch (error) {
    returnData.push({ json: { error: error.message } });
  }

  console.log(returnData);
  return returnData;
}

execute();