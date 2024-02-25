import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    info: {
      title: 'DAILY TRENDS API',
      version: '1.0.0',
      description: 'Documentation for daily trends API',
    },
  },
  apis: ['swagger.yaml'],
};

export const swaggerSpecs = swaggerJSDoc(options);
