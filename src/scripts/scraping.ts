import puppeteer from 'puppeteer';
import moment from 'moment';
import jsdom from 'jsdom';
import eventModel from '../models/event';
import { logger } from '../utils/logger';
import { NewsData } from '../interfaces/event';

class Web {
  private newsData: NewsData[] = [];
  private provider: string = '';
  private event: eventModel;

  constructor(provider: string) {
    this.provider = provider;
    this.event = new eventModel();
  }

  async extract(url: string): Promise<string> {
    try {
      const message = `Initiating extraction from URL: ${url}`;
      logger.info(message);
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], timeout: 60000 });
      const page = await browser.newPage();
      const response = await page.goto(url);

      if (response && response.ok()) {
        const body = await response.text();
        const bodyWithoutStyles = this.removeStyles(body);
        await browser.close();
        logger.info('Extraction completed.');
        return bodyWithoutStyles;
      }
      await browser.close();
      throw new Error('Could not load URL.');
    } catch (error) {
      logger.error('Error during extraction:', error);
      throw error;
    }
  }

  private removeStyles(body: string): string {
    const regex = /<style\b[^>]*>[\s\S]*?<\/style>/gi;
    return body.replace(regex, '');
  }

  protected cleanHeading(heading: string): string {
    return heading.replace(/\b.*?\|\s/g, '').trim();
  }

  protected cleanSubHeading(subHeading: string): string {
    return subHeading.replace(/(<([^>]+)>)/gi, '');
  }

  protected addNews(heading: string, subHeading: string, link: string): void {
    this.newsData.push({ heading, subHeading, link });
  }

  async saveData(): Promise<boolean> {
    try {
      const date = moment().format('YYYY-MM-DD');
      await this.event.deleteMany({
        createdAt: {
          $gte: moment().startOf('day').toDate(),
          $lt: moment().endOf('day').toDate(),
        },
        provider: this.provider,
      });

      const promises = this.newsData.map(news => {
        const eventData = {
          heading: this.cleanHeading(news.heading),
          subHeading: this.cleanSubHeading(news.subHeading),
          link: news.link,
          provider: this.provider,
          date,
        };
        return this.event.create(eventData);
      });

      await Promise.all(promises);
      return true;
    } catch (error) {
      logger.error('Error while saving data:', error);
      throw error;
    }
  }
}

class ElMundo extends Web {
  private readonly url: string = 'https://www.elmundo.es/';

  constructor() {
    super('mundo');
  }

  async newsExtract(url: string): Promise<boolean> {
    try {
      const body = await this.extract(url);
      const {
        window: { document },
      } = new jsdom.JSDOM(body);

      const heading = document.querySelector('h1.ue-c-article__headline')?.innerHTML || '';
      const subHeading = document.querySelector('div.ue-c-article__body')?.innerHTML || '';

      this.addNews(heading, subHeading, url);
      return true;
    } catch (error) {
      logger.error('Error during news extraction:', error);
      return false;
    }
  }

  async dataExtract(): Promise<boolean> {
    try {
      const body = await this.extract(this.url);
      const {
        window: { document },
      } = new jsdom.JSDOM(body);

      const urls = [...(document.querySelector('div[data-b-name=ad_news_a]')?.querySelectorAll('article>a') || [])].map(a => a.href);
      const promises = urls.slice(0, 5).map(url => this.newsExtract(url));

      await Promise.all(promises);
      return true;
    } catch (error) {
      logger.error('Error during data extraction:', error);
      return false;
    }
  }
}

class ElPais extends Web {
  private readonly url: string = 'https://elpais.com/actualidad/';

  constructor() {
    super('pais');
  }

  async newsExtract(url: string): Promise<boolean> {
    try {
      const body = await this.extract(url);
      const {
        window: { document },
      } = new jsdom.JSDOM(body);

      const heading = document.querySelector('h1')?.innerHTML || '';
      const subHeading = document.querySelector('article [data-dtm-region=articulo_cuerpo]')?.innerHTML || '';

      this.addNews(heading, subHeading, url);
      return true;
    } catch (error) {
      logger.error('Error during news extraction:', error);
      return false;
    }
  }

  async dataExtract(): Promise<boolean> {
    try {
      const body = await this.extract(this.url);
      const {
        window: { document },
      } = new jsdom.JSDOM(body);

      const urls = [...(document.querySelector('section[data-dtm-region=portada_apertura]')?.querySelectorAll('article>header>h2>a') || [])].map(
        a => a.href,
      );
      const promises = urls.slice(0, 5).map(url => this.newsExtract(url));

      await Promise.all(promises);
      return true;
    } catch (error) {
      logger.error('Error during data extraction:', error);
      return false;
    }
  }
}

class WebFactory {
  static createWeb(provider) {
    switch (provider) {
      case 'mundo':
        return new ElMundo();
      case 'pais':
        return new ElPais();
      default:
        throw new Error('Invalid provider');
    }
  }
}

const start = async (): Promise<void> => {
  logger.info('Initiating scraping...');

  const elMundo = WebFactory.createWeb('mundo');
  await elMundo.dataExtract();
  await elMundo.saveData();

  const elPais = WebFactory.createWeb('pais');
  await elPais.dataExtract();
  await elPais.saveData();

  logger.info('Extraction and storage completed.');
};

export default {
  start,
};
