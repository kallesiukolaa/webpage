
# Web page

This an instruction, how to use web pages. The project is implemented with Typescript and its running on docker container. The image is build and deployed to AWS ECR repo by Github Actions. 




## Installation

On your local app, run (you should have npm and aws cli installed)

```bash
  npm install --package-lock-only
  npm ci
```

Configure your AWS connection (see https://docs.aws.amazon.com/cli/v1/userguide/cli-chap-configure.html).

Then we will create ecr repo, users and policies. You only need to do this once. Run 

```bash
  cd scripts/awsSetup
```

```bash
  sh aws-create-user-and-repo.sh
```

Once you have run aws-create-user-and-repo.sh, you should see the following output

```json
  {
    "AccessKey": {
        "UserName": "github-actions-user-for-webpage",
        "AccessKeyId": "xxxxxx",
        "Status": "Active",
        "SecretAccessKey": "yyyyyyyyyy",
        "CreateDate": "2025-08-30T11:13:18+00:00"
    }
```

Create new github actions secrets (https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)

```bash
  AWS_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY
```

Copy the values from the output. Now if the build is successfull, you should see new images in the AWS ECR repository

## Running locally

Install the dependecies
```bash
npm install --only=dev
```

To run the application locally on your machine, run 

```bash
  npm run dev
```

## Clean resources

There is a cleanup script in case you need to delete your aws changes

```bash
  sh aws-clean-resources.sh
```