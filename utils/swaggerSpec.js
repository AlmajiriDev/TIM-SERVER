const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TIM-WEB APP API',
    version: '1.0.0',
    description: 'API documentation for TIMSAN WEB APP',
  },
  servers: [
    {
      url: 'https://dev.timsan.com.ng',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Replace with the path to your routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;