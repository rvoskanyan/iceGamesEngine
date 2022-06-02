import puppeteer from "puppeteer";

export default class Browser {
  static #instance = null;
  
  constructor() {
    if (Browser.#instance) {
      return Browser.#instance;
    }
  
    this.browser = null;
    Browser.#instance = this;
  }
  
  LAUNCH_PUPPETEER_OPTS = {
    executablePath: process.env.CHROMIUM_PATH || '',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080'
    ]
  };
  
  PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout: 5000,
    waitUntil: 'networkidle2',
    timeout: 3000000,
  };
  
  async init() {
    this.browser = await puppeteer.launch(this.LAUNCH_PUPPETEER_OPTS);
  }
  
  async getPageContent(url) {
    if (!this.browser) {
      await this.init();
    }
    
    try {
      const page = await this.browser.newPage();
      
      await page.goto(url, this.PAGE_PUPPETEER_OPTS);
      
      const content = await page.content();
  
      await page.close();
      
      return content;
    } catch (e) {
      throw e;
    }
  }
  
  close() {
    this.browser.close();
    this.browser = null;
  }
}