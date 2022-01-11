const express = require('express');
const apiRouter = express.Router();
const puppeteer = require('puppeteer');
const { stageOne, stageTwo, stageThree } = require('../extractor');
const mongoose = require('mongoose');
const PageInfo = require('../models/pageInfo');

async function takePuppeteerScreenshot(pageURL) {
    await mongoose.connect('mongodb://localhost/webscan');
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    const pageRequest = await page.goto(pageURL);

    let stageOneData = await stageOne(page, pageRequest)
    let stageTwoData = await stageTwo(stageOneData.ip, pageRequest)
    let stageThreeData = await stageThree(pageRequest)

    await browser.close();
    let finalData = { stageOne: stageOneData, stageTwo: stageTwoData, stageThree: stageThreeData };
    await new PageInfo(finalData).save();
    return { ...stageOneData, ...stageTwoData };
}

//Controller
const urlController = async function (req, res) {
    if (typeof req.query.page == 'undefined' || req.query.page == '') {
        return res.status(400).send({ error: 'Page URL is required' });
    }
    let pageURL = req.query.page;
    if (!req.query.page.startsWith('http')) {
        pageURL = 'http://' + pageURL;
    }
    takePuppeteerScreenshot(pageURL).then(data => {
        res.json({ ...data });
    }).catch(err => {
        res.status(500).send({ error: err });
    });
};

//Router
apiRouter.route('/').get(urlController)
module.exports = apiRouter;