import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint('https://testing-reacttt.nyc3.digitaloceanspaces.com'), 
  accessKeyId: 'DO00UF7KLPU8BEQWFN3R', 
  secretAccessKey: 'dop_v1_784a6ec600404b41418cedefb96a505d91ddf774e03b3779efd7125a10846e83', 
  region: 'nyc3', 
});

const uploadToSpace = (file: File) => {
  const params = {
    Bucket: 'testing-reacttt', 
    Key: file.name, 
    Body: file, 
    ACL: 'public-read', 
    ContentType: file.type, 
  };

  return s3.upload(params).promise();
};
