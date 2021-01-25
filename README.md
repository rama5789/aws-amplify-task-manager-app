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
