import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'API REST para gerenciamento de tarefas.'
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Ambiente local'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
});