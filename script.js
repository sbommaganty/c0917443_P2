
AWS.config.update({
    accessKeyId: 'AKIAXKPUZOTRM7ZXCZPJ',
    secretAccessKey: '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',
    region: 'ca-central-1'
});

const s3 = new AWS.S3();

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file.');
        return;
    }

    const params = {
        Bucket: 'sortinn',
        Key: file.name,
        Body: file
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error(err);
            alert('Error uploading file.');
        } else {
            alert('File uploaded successfully! Please wait for processing.');
            fetchSortedFile(file.name.replace('.txt', '.srt'));
        }
    });
}

function fetchSortedFile(fileName) {
    const params = {
        Bucket: 'sortoutt',
        Key: fileName
    };

    s3.getObject(params, (err, data) => {
        if (err) {
            console.error(err);
            alert('Error fetching sorted file.');
        } else {
            const content = new TextDecoder().decode(data.Body);
            document.getElementById('sortedContent').textContent = content;
        }
    });
}
