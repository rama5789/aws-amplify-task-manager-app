# Create Amplify Backend Environment :

```sh
--------------------------------------
# Create Amplify Backend Env:

$ amplify init
Note: It is recommended to run this command from the root of your app directory
? Enter a name for the project TaskManagerApp
? Enter a name for the environment dev
? Choose your default editor: Visual Studio Code
? Choose the type of app that you,re building javascript
Please tell us about your project
? What javascript framework are you using none
? Source Directory Path:  src
? Distribution Directory Path: dist
? Build Command:  npm run-script build
? Start Command: npm run-script start
Using default provider  awscloudformation

For more information on AWS Profiles, see:
https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use default
Adding backend environment dev to AWS Amplify Console app: degvdeehnll8y
⠼ Initializing project in the cloud...

CREATE_COMPLETE AuthRole   AWS::IAM::Role
CREATE_COMPLETE UnauthRole AWS::IAM::Role
CREATE_COMPLETE DeploymentBucket AWS::S3::Bucket
CREATE_COMPLETE amplify-taskmanagerapp-dev-211629 AWS::CloudFormation::Stack

✔ Successfully created initial AWS cloud resources for deployments.
✔ Initialized provider successfully.
Initialized your environment successfully.

Your project has been successfully initialized and connected to the cloud!

```

# Re-Create Deleted Amplify Backend Environment :

```sh
--------------------------------------
# Delete All Environments Completely:

$ amplify delete

# Recreate the Environment:
# remove or empty "team-provider-info.json"

$ amplify init

# Recreate all resources of the Environment:

$ amplify push

```

# Create DynamoDB Tables :

```sh
--------------------------------------
# Create Table "users" in DynamoDB:

$ amplify add storage
? Please select from one of the below mentioned services: NoSQL Database

Welcome to the NoSQL DynamoDB database wizard
This wizard asks you a series of questions to help determine how to set up your NoSQL database table.

? Please provide a friendly name for your resource that will be used to label this category in the project: users
? Please provide table name: users

You can now add columns to the table.

? What would you like to name this column: UserId
? Please choose the data type: string
? Would you like to add another column? Yes
? What would you like to name this column: SignUpDate
? Please choose the data type: number
? Would you like to add another column? No

Before you create the database, you must specify how items in your table are uniquely organized. You do this by specifying a primary key. The primary key uniquely identifies each item in the table so that no two items can have the same key. This can be an individual column, or a combination that includes a primary key and a sort key.

To learn more about primary keys, see:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey

? Please choose partition key for the table: UserId
? Do you want to add a sort key to your table? Yes
? Please choose sort key for the table: SignUpDate

You can optionally add global secondary indexes for this table. These are useful when you run queries defined in a different column than the primary key.
To learn more about indexes, see:
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.SecondaryIndexes

? Do you want to add global secondary indexes to your table? No
? Do you want to add a Lambda Trigger for your Table? No
Successfully added resource users locally

If a user is part of a user pool group, run "amplify update storage" to enable IAM group policies for CRUD operations
Some next steps:
"amplify push" builds all of your local backend resources and provisions them in the cloud
"amplify publish" builds all of your local backend and front-end resources (if you added hosting category) and provisions them in the cloud

# Update the Cloud:

$ amplify push
✔ Successfully pulled backend environment dev from the cloud.
Current Environment: dev

| Category | Resource name | Operation | Provider plugin   |
| -------- | ------------- | --------- | ----------------- |
| Storage  | users         | Create    | awscloudformation |
? Are you sure you want to continue? Yes
⠋ Updating resources in the cloud. This may take a few minutes...

CREATE_COMPLETE DynamoDBTable AWS::DynamoDB::Table
CREATE_COMPLETE amplify-taskmanagerapp-dev-211629-storageusers-YFR7B256B6I2 AWS::CloudFormation::Stack
UPDATE_COMPLETE amplify-taskmanagerapp-dev-211629 AWS::CloudFormation::Stack
CREATE_COMPLETE storageusers                      AWS::CloudFormation::Stack

# Create Table "tasks" in DynamoDB:

$ amplify add storage
? Please select from one of the below mentioned services: NoSQL Database
:::::::::::::::::::
? Please provide a friendly name for your resource that will be used to label this category in the project: tasks
? Please provide table name: tasks

You can now add columns to the table.

? What would you like to name this column: TaskId
? Please choose the data type: string
? Would you like to add another column? Yes
? What would you like to name this column: CreationDate
? Please choose the data type: number
? Would you like to add another column? No
:::::::::::::::::::
? Please choose partition key for the table: TaskId
? Do you want to add a sort key to your table? Yes
? Please choose sort key for the table: CreationDate
:::::::::::::::::::
? Do you want to add global secondary indexes to your table? No
? Do you want to add a Lambda Trigger for your Table? No
Successfully added resource tasks locally

# Update the Cloud:

$ amplify push
✔ Successfully pulled backend environment dev from the cloud.
Current Environment: dev

| Category | Resource name | Operation | Provider plugin   |
| -------- | ------------- | --------- | ----------------- |
| Storage  | tasks         | Create    | awscloudformation |
| Storage  | users         | No Change | awscloudformation |
? Are you sure you want to continue? Yes
⠙ Updating resources in the cloud. This may take a few minutes...

UPDATE_COMPLETE storageusers        AWS::CloudFormation::Stack
CREATE_COMPLETE amplify-taskmanagerapp-dev-211629-storagetasks-MDDKRH9M4J7V AWS::CloudFormation::Stack
CREATE_COMPLETE DynamoDBTable       AWS::DynamoDB::Table
UPDATE_COMPLETE amplify-taskmanagerapp-dev-211629 AWS::CloudFormation::Stack
UPDATE_COMPLETE storageusers        AWS::CloudFormation::Stack
CREATE_COMPLETE storagetasks        AWS::CloudFormation::Stack

```

# Create Lambda Functions :

```sh
--------------------------------------
# Create Lambda Functions for "users" and "tasks" in DynamoDB:

# Create Lambda Function "tmaManageTasks":

$ amplify add function
? Select which capability you want to add: Lambda function (serverless function)
? Provide an AWS Lambda function name: tmaManageTasks
? Choose the runtime that you want to use: NodeJS
? Choose the function template that you want to use: CRUD function for DynamoDB (Integration with API Gateway)
? Choose a DynamoDB data source option Use DynamoDB table configured in the current Amplify project
? Choose from one of the already configured DynamoDB tables tasks

Available advanced settings:
- Resource access permissions
- Scheduled recurring invocation
- Lambda layers configuration

? Do you want to configure advanced settings? No
? Do you want to edit the local lambda function now? Yes
Please edit the file in your editor: /media/rama/DiskE/MEANStack/Assignments/Orangebits/App/amplify/backend/function/tmaManageTasks/src/app.js
? Press enter to continue
Successfully added resource tmaManageTasks locally.

Next steps:
Check out sample function code generated in <project-dir>/amplify/backend/function/tmaManageTasks/src
"amplify function build" builds all of your functions currently in the project
"amplify mock function <functionName>" runs your function locally
"amplify push" builds all of your local backend resources and provisions them in the cloud
"amplify publish" builds all of your local backend and front-end resources (if you added hosting category) and provisions them in the cloud

# Create Lambda Function "tmaManageUsers":

$ amplify add function
? Select which capability you want to add: Lambda function (serverless function)
? Provide an AWS Lambda function name: tmaManageUsers
? Choose the runtime that you want to use: NodeJS
? Choose the function template that you want to use: CRUD function for DynamoDB (Integration with API Gateway)
? Choose a DynamoDB data source option Use DynamoDB table configured in the current Amplify project
? Choose from one of the already configured DynamoDB tables users
::::::::::::::::::
? Do you want to configure advanced settings? No
? Do you want to edit the local lambda function now? Yes
Please edit the file in your editor: /media/rama/DiskE/MEANStack/Assignments/Orangebits/App/amplify/backend/function/tmaManageUsers/src/app.js
? Press enter to continue
Successfully added resource tmaManageUsers locally.

--------------------------------------
# Update the Cloud:

$ amplify push
✔ Successfully pulled backend environment dev from the cloud.
Current Environment: dev

| Category | Resource name  | Operation | Provider plugin   |
| -------- | -------------- | --------- | ----------------- |
| Function | tmaManageTasks | Create    | awscloudformation |
| Function | tmaManageUsers | Create    | awscloudformation |
| Storage  | users          | No Change | awscloudformation |
| Storage  | tasks          | No Change | awscloudformation |
? Are you sure you want to continue? Yes
⠹ Updating resources in the cloud. This may take a few minutes...
CREATE_COMPLETE LambdaExecutionRole     AWS::IAM::Role
CREATE_COMPLETE LambdaFunction          AWS::Lambda::Function
CREATE_COMPLETE lambdaexecutionpolicy   AWS::IAM::Policy
CREATE_COMPLETE amplify-taskmanagerapp-dev-100143-functiontmaManageUsers-1IXAKBOEN83WG AWS::CloudFormation::Stack
CREATE_COMPLETE amplify-taskmanagerapp-dev-100143-functiontmaManageTasks-4DI9TIZMMAXP AWS::CloudFormation::Stack
CREATE_COMPLETE functiontmaManageUsers  AWS::CloudFormation::Stack
CREATE_COMPLETE functiontmaManageTasks  AWS::CloudFormation::Stack
UPDATE_COMPLETE amplify-taskmanagerapp-dev-100143 AWS::CloudFormation::Stack
UPDATE_COMPLETE storageusers            AWS::CloudFormation::Stack
UPDATE_COMPLETE storagetasks            AWS::CloudFormation::Stack
✔ All resources are updated in the cloud

```
