const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  console.log('LAMBDA: tmaManageTasks triggered --->');
  console.log('event: ', event);
  console.log('context: ', context);

  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
