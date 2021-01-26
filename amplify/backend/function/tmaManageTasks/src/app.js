/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const express = require('express');

// local
AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000',
});
// cloud
// AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = 'tasks';
if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = 'TaskId';
const partitionKeyType = 'S';
const sortKeyName = 'CreationDate';
const sortKeyType = 'N';
const hasSortKey = sortKeyName !== '';
// const path = "/item";
const path = '/tasks';
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case 'N':
      return Number.parseInt(param);
    default:
      return param;
  }
};

/********************************
 * HTTP Get method for list objects *
 ********************************/
// path -> /tasks/:TaskId
app.get(path + hashKeyPath, (req, res) => {
  console.log('\n\n::: Get Task by TaskId :::');

  const condition = {};
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ',
  };

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH,
    ];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [
        convertUrlType(req.params[partitionKeyName], partitionKeyType),
      ];
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  const queryParams = {
    TableName: tableName,
    KeyConditions: condition,
  };
  console.log('queryParams: ' + JSON.stringify(queryParams, 0, 2));
  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/
// path -> /tasks/object/:TaskId/:CreationDate
app.get(path + '/object' + hashKeyPath + sortKeyPath, (req, res) => {
  console.log('\n\n::: Get a Task by TaskId and CreationDate :::');

  const params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(
        req.params[partitionKeyName],
        partitionKeyType
      );
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(
        req.params[sortKeyName],
        sortKeyType
      );
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  const getItemParams = {
    TableName: tableName,
    Key: params,
  };
  console.log('getItemParams: ' + JSON.stringify(getItemParams, 0, 2));
  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data);
      }
    }
  });
});

/************************************
 * HTTP get method for list all tasks *
 *************************************/
// path -> /tasks
app.get(path, (req, res) => {
  console.log('\n\n::: Get all Tasks :::');

  const scanParams = {
    TableName: tableName,
    // Limit: 2,
  };
  console.log('scanParams: ' + JSON.stringify(scanParams, 0, 2));
  dynamodb.scan(scanParams, (err, data) => {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.json({ error: 'Could not fetch tasks: ' + err });
    } else {
      res.json(data.Items);
    }
  });
});

/************************************
 * HTTP put method for update object *
 *************************************/
// path -> /tasks
app.put(path, (req, res) => {
  console.log('\n\n::: Update a Task :::');

  if (userIdPresent) {
    req.body['userId'] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }
  const reqBody = req.body;

  // Task will be updated by the User
  const updateTask = {};
  updateTask.TaskStatus = reqBody.TaskStatus; // Open (default), In Progress, Reopened, Closed.
  updateTask.LastUpdatedDate = new Date().getTime(); // EPOCH format.

  const updateItemParams = {
    TableName: tableName,
    Key: {
      TaskId: reqBody.TaskId,
      CreationDate: reqBody.CreationDate,
    },
    // patch the document
    AttributeUpdates: {
      TaskStatus: {
        Action: 'PUT',
        Value: updateTask.TaskStatus,
      },
      LastUpdatedDate: {
        Action: 'PUT',
        Value: updateTask.LastUpdatedDate,
      },
    },
    // replace the document
    // UpdateExpression: 'set Status=:a, LastUpdatedDate=:b', // ValidationException: Invalid UpdateExpression: Attribute name is a reserved keyword; reserved keyword: Status
    /* UpdateExpression: 'set TaskStatus=:a, LastUpdatedDate=:b',
    ExpressionAttributeValues: {
      ':a': updateTask.TaskStatus,
      ':b': updateTask.LastUpdatedDate,
    }, */
    // ReturnValues: 'UPDATED_NEW',
  };
  console.log('updateItemParams: ' + JSON.stringify(updateItemParams, 0, 2));
  dynamodb.update(updateItemParams, (err, data) => {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: reqBody });
    } else {
      res.json({ success: 'put call succeed!', url: req.url, data: data });
    }
  });
});

/************************************
 * HTTP post method for insert object *
 *************************************/
// path -> /tasks
app.post(path, (req, res) => {
  console.log('\n\n::: Create a new Task :::');

  if (userIdPresent) {
    req.body['userId'] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }
  const reqBody = req.body;

  // Task will be created and assigned to a User by the Admin
  const newTask = {};
  newTask.TaskId = uuidv4(); // Randomly generated Id.
  newTask.Number = 'TASK-123'; // auto generated. Should have format:TASK-123.
  newTask.Name = reqBody.Name;
  newTask.Description = reqBody.Description;
  newTask.UserId = reqBody.UserId; // User's Id (verified) whom task has been assigned to.
  newTask.CreatedBy = reqBody.userId; // User's Id who has created the task.
  newTask.CreationDate = new Date().getTime(); // EPOCH format.
  newTask.LastUpdatedDate = new Date().getTime(); // EPOCH format.
  newTask.TaskStatus = 'Open'; // Open (default), In Progress, Reopened, Closed.

  const putItemParams = {
    TableName: tableName,
    Item: newTask,
  };
  console.log('putItemParams: ' + JSON.stringify(putItemParams, 0, 2));
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: reqBody });
    } else {
      res.json({ success: 'post call succeed!', url: req.url, data: data });
    }
  });
});

/**************************************
 * HTTP remove method to delete object *
 ***************************************/
// path -> /tasks/object/:TaskId/:CreationDate
app.delete(path + '/object' + hashKeyPath + sortKeyPath, (req, res) => {
  console.log('\n\n::: Delete a Task :::');

  const params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(
        req.params[partitionKeyName],
        partitionKeyType
      );
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(
        req.params[sortKeyName],
        sortKeyType
      );
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  const removeItemParams = {
    TableName: tableName,
    Key: params,
  };
  console.log('removeItemParams: ' + JSON.stringify(removeItemParams, 0, 2));
  dynamodb.delete(removeItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url });
    } else {
      res.json({ url: req.url, data: data });
    }
  });
});

const APP_PORT = 3000;
app.listen(APP_PORT, () => {
  console.log(`App started at port ${APP_PORT} !!!`);
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
