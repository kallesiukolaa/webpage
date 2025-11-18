AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

aws ecr create-repository --repository-name aws-repo-for-my-webpage --image-scanning-configuration scanOnPush=false

aws iam create-policy --policy-name ecr-access-for-github-user --description "This policy is used for Github actions to push Docker images to ECR repo." --policy-document file://aws-ecr-policy-doc.json

aws iam create-policy --policy-name lambda-access-for-github-user --description "This policy is used for Github actions to invoke a lambda function that will create invalidations." --policy-document file://aws-lambda-policy-doc.json

aws iam create-user --user-name github-actions-user-for-webpage

aws iam attach-user-policy --user-name github-actions-user-for-webpage --policy-arn arn:aws:iam::$AWS_ACCOUNT_ID:policy/ecr-access-for-github-user

aws iam attach-user-policy --user-name github-actions-user-for-webpage --policy-arn arn:aws:iam::$AWS_ACCOUNT_ID:policy/lambda-access-for-github-user

aws iam create-access-key --user-name github-actions-user-for-webpage

aws ecr put-lifecycle-policy --repository-name aws-repo-for-my-webpage --lifecycle-policy-text "file://lifecycle-policy.json"

aws iam create-policy --policy-name s3-access-for-github-user --description "This policy is used for Github actions to push static files into s3." --policy-document file://aws-s3-policy-doc.json

aws iam attach-user-policy --user-name github-actions-user-for-webpage --policy-arn arn:aws:iam::$AWS_ACCOUNT_ID:policy/s3-access-for-github-user