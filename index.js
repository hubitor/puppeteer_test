const puppeteer = require('puppeteer');
const {TimeoutError} = require('puppeteer/Errors');
const log4js = require('log4js');
const fs = require('fs');


log4js.configure('./log4js.json');
let log = log4js.getLogger("app");

log.debug("Starting scratching pages...")