import puppeteer from 'puppeteer';
import moment from 'moment';
import jsdom from 'jsdom';
import eventModel from '../models/event';
import { logger } from '../utils/logger';
// Definir tipos
interface NewsData {
  heading: string;
  subHeading: string;
  link: string;
}

// Clase base para la extracción de datos web
class Web {
  private newsData: NewsData[] = [];

  private provider: string = '';

  private event: eventModel;

  constructor(provider: string) {
    this.provider = provider;
    this.event = new eventModel();
  }

  // Método para extraer el contenido de una URL utilizando Puppeteer
  async extract(url: string): Promise<string> {
    try {
      const message = `Iniciando extracción de la URL: ${url}`;
      logger.info(message);
      const browser = await puppeteer.launch({ timeout: 60000 });
      const page = await browser.newPage();
      const response = await page.goto(url);

      if (response && response.ok()) {
        const body = await response.text();
        const bodyWithoutStyles = this.removeStyles(body);
        await browser.close();
        logger.info('Extracción completada.');
        return bodyWithoutStyles;
      }
      await browser.close();
      throw new Error('No se pudo cargar la URL.');
    } catch (error) {
      logger.error('Error durante la extracción:', error);
      throw error;
    }
  }

  // Método para eliminar estilos del cuerpo del HTML
  private removeStyles(body: string): string {
    const regex = /<style\b[^>]*>[\s\S]*?<\/style>/gi;
    return body.replace(regex, '');
  }

  // Método para limpiar el título de la noticia
  protected cleanHeading(heading: string): string {
    return heading.replace(/\b.*?\|\s/g, '').trim();
  }

  // Método para limpiar el subtítulo de la noticia
  protected cleanSubHeading(subHeading: string): string {
    return subHeading.replace(/(<([^>]+)>)/gi, '');
  }

  // Método para agregar una noticia al conjunto de datos
  protected addNews(heading: string, subHeading: string, link: string): void {
    this.newsData.push({ heading, subHeading, link });
  }

  // Método para guardar los datos extraídos en la base de datos
  async saveData(): Promise<boolean> {
    try {
      const date = moment().format('YYYY-MM-DD');
      await this.event.deleteMany({ createdAt: {
        $gte: moment().startOf('day').toDate(),
        $lt: moment().endOf('day').toDate(),
      },
      provider: this.provider, });

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
      logger.error('Error al guardar los datos:', error);
      throw error;
    }
  }
}

// Clase para extraer datos del sitio web "El Mundo"
class ElMundo extends Web {
  private readonly url: string = 'https://www.elmundo.es/';

  constructor() {
    super('mundo');
  }

  // Método para extraer noticias de El Mundo
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
      logger.error('Error durante la extracción de noticias:', error);
      return false;
    }
  }

  // Método para extraer datos de El Mundo
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
      logger.error('Error durante la extracción de datos:', error);
      return false;
    }
  }
}

// Clase para extraer datos del sitio web "El País"
class ElPais extends Web {
  private readonly url: string = 'https://elpais.com/actualidad/';

  constructor() {
    super('pais');
  }

  // Método para extraer noticias de El País
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
      logger.error('Error durante la extracción de noticias:', error);
      return false;
    }
  }

  // Método para extraer datos de El País
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
      logger.error('Error durante la extracción de datos:', error);
      return false;
    }
  }
}

// Factory Method Pattern
class WebFactory {
  static createWeb(provider) {
    switch (provider) {
      case 'mundo':
        return new ElMundo();
      case 'pais':
        return new ElPais();
      default:
        throw new Error('Proveedor no válido');
    }
  }
}

// Función para iniciar el proceso de extracción y almacenamiento de datos
const start = async (): Promise<void> => {
  logger.info('Iniciando scraping...');

  const elMundo = WebFactory.createWeb('mundo');
  await elMundo.dataExtract();
  await elMundo.saveData();

  const elPais = WebFactory.createWeb('pais');
  await elPais.dataExtract();
  await elPais.saveData();

  logger.info('Extracción y almacenamiento completados.');
};

export default {
  start,
};
