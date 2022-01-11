const htmlToText = require('html-to-text');
const whoiser = require('whoiser');
const pageScreenshotPath = 'websiteScreenshot.png';

module.exports.stageOne = async function (page, pageRequest) {
    //page screenshot
    await page.screenshot({ path: pageScreenshotPath });

    //destination IP
    const ip = pageRequest.remoteAddress().ip;

    //Source URL
    let chain = pageRequest.request().redirectChain();
    chain = chain.map(e => e.url());
    let chainLen = chain.length;
    let origin = chainLen > 0 ? chain[0] : null;

    return { ip, destination: pageRequest.url(), origin, screenshot: pageScreenshotPath };
}

module.exports.stageTwo = async function (ip, pageRequest) {
    let ipInfo = await whoiser.asn(ip);
    let securityInfo = pageRequest.securityDetails();
    return {
        asn: ipInfo.asn, ssl: {
            subjectName: securityInfo.subjectName(),
            issuer: securityInfo.issuer(),
            validFrom: securityInfo.validFrom(),
            validTo: securityInfo.validTo(),
            protocol: securityInfo.protocol(),
        }
    };
}

module.exports.stageThree = async function (pageRequest) {
    let pageBody = await pageRequest.text();
    return {
        body: pageBody,
        text: htmlToText.convert(pageBody)
    }
}