import { S3 } from 'aws-sdk';

const s3 = new S3();

export const handler = async (event) => {
    const bucket = event.Records[0].s3.bucket.name; // Name of the input bucket
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' ')); // Key (filename) of the uploaded file

    try {
         const downloadParams = {
            Bucket: bucket,
            Key: key
        };

        const data = await s3.getObject(downloadParams).promise();

        // 2. Read the content of the file
        const content = data.Body.toString('utf-8');
        const lines = content.split('\n');

         const sortedLines = lines.sort();

         const sortedContent = sortedLines.join('\n');
        const uploadParams = {
            Bucket: 'sortoutt', // Output bucket
            Key: key.replace('.txt', '.srt'), // Replace .txt with .srt for the output filename
            Body: sortedContent,
            ContentType: 'text/plain'
        };

        await s3.putObject(uploadParams).promise();

        console.log(`File processed successfully: ${key}`);
        return {
            statusCode: 200,
            body: JSON.stringify('File processed and sorted successfully.')
        };

    } catch (error) {
        console.error('Error processing file', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Failed to process the file.')
        };
    }
};
