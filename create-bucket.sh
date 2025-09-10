aws s3api create-bucket --bucket technarion-3-bucket-for-webpage --create-bucket-configuration LocationConstraint=eu-north-1

aws s3api put-public-access-block \
    --bucket technarion-3-bucket-for-webpage \
    --public-access-block-configuration '{"BlockPublicAcls": false, "IgnorePublicAcls": false, "BlockPublicPolicy": false, "RestrictPublicBuckets": false}'

aws s3 website s3://technarion-3-bucket-for-webpage/ --index-document index.html

aws s3api put-bucket-policy --bucket technarion-3-bucket-for-webpage --policy file://bucket-policy.json