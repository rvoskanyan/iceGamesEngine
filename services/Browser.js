import puppeteer from "puppeteer";

export default class Browser {
  static #instance = null;
  
  constructor() {
    if (Browser.#instance) {
      return Browser.#instance;
    }
  
    this.browser = null;
    this.page = null;
    Browser.#instance = this;
  }
  
  LAUNCH_PUPPETEER_OPTS = {
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
    timeout: 3000000
  };
  
  async init() {
    this.browser = await puppeteer.launch(this.LAUNCH_PUPPETEER_OPTS);
  }
  
  async getPageContent(url) {
    if (!this.browser) {
      await this.init();
    }
    
    if (this.page) {
      await this.page.close();
    }
    
    try {
      this.page = await this.browser.newPage();
      await this.page.goto(url, this.PAGE_PUPPETEER_OPTS);
      
      return await this.page.content();
    } catch (e) {
      throw e;
    }
  }
  
  close() {
    this.browser.close();
    this.browser = null;
  }
}