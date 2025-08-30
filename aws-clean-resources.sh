ACCESS_KEYS=$(aws iam list-access-keys \
  --user-name github-actions-user-for-webpage \
  --query 'AccessKeyMetadata[].AccessKeyId' \
  --output text)

ATTACHED_POLICIES=$(aws iam list-attached-user-policies \
  --user-name github-actions-user-for-webpage \
  --query 'AttachedPolicies[].PolicyArn' \
  --output text)

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

for KEY in $ACCESS_KEYS; do
  echo "Deleting access key: $KEY for user: github-actions-user-for-webpage"
  aws iam delete-access-key --user-name github-actions-user-for-webpage --access-key-id "$KEY"
done

for POLICY in $ATTACHED_POLICIES; do
  echo "Deattaching policy: $POLICY for user: github-actions-user-for-webpage"
  aws iam detach-user-policy --user-name github-actions-user-for-webpage --policy-arn "$POLICY"
done

aws iam delete-user --user-name github-actions-user-for-webpage

aws iam delete-policy --policy-arn arn:aws:iam::$AWS_ACCOUNT_ID:policy/ecr-access-for-github-user

aws ecr delete-repository --repository-name aws-repo-for-my-webpage