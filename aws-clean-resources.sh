ACCESS_KEYS=$(aws iam list-access-keys \
  --user-name github-actions-user-for-webpage \
  --query 'AccessKeyMetadata[].AccessKeyId' \
  --output text)

for KEY in $ACCESS_KEYS; do
  echo "Deleting access key: $KEY for user: github-actions-user-for-webpage"
  aws iam delete-access-key --user-name github-actions-user-for-webpage --access-key-id "$KEY"
done

aws iam delete-user --user-name github-actions-user-for-webpage

aws iam delete-policy --policy-arn arn:aws:iam::263937883789:policy/ecr-access-for-github-user

aws ecr delete-repository --repository-name aws-repo-for-my-webpage