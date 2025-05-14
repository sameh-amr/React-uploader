import AWS, { AWSError, S3 } from "aws-sdk";

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint("https://nyc3.digitaloceanspaces.com"),
  accessKeyId: "DO00UF7KLPU8BEQWFN3R",
  secretAccessKey:
    "test",
  region: "nyc3",
});


export const uploadToSpace = (file: File): Promise<string> => {
  const params = {
    Bucket: "testing-reacttt", 
    Key: file.name, 
    Body: file, 
    ACL: "public-read", 
    ContentType: file.type, 
  };

  return new Promise<string>((resolve, reject) => {
    s3.upload(params)
      .on("httpUploadProgress", (progress) => {
        // Optional: Update progress here if you want
        console.log(progress);
      })
      .send((err: AWSError, data: S3.Types.PutObjectOutput) => {
        if (err) {
          reject(err);
        } else if (data) {
          const fileUrl = `https://${params.Bucket}.${s3.endpoint.host}/${params.Key}`;
          resolve(fileUrl);
        } else {
          reject(new Error("Failed to upload file"));
        }
      });
  });
};

export const deleteFromSpace = (fileName: string) => {
  const params = {
    Bucket: "testing-reacttt",
    Key: fileName,
  };

  return s3
    .deleteObject(params)
    .promise()
    .then(() => {
      console.log(`Successfully deleted file: ${fileName}`);
    })
    .catch((error) => {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file.");
    });
};
