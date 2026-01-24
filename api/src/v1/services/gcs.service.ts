import { Storage } from '@google-cloud/storage';
import path from 'path';
import { GCP_PROJECT_ID, GCS_BUCKET_NAME } from '../../env';

class GCSService {
    private storage: Storage;
    private bucketName: string;

    constructor() {
        this.storage = new Storage();
        this.bucketName = GCS_BUCKET_NAME!;
    }

    async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
        const bucket = this.storage.bucket(this.bucketName);
        const file = bucket.file(fileName);

        await file.save(fileBuffer, {
            metadata: { contentType: mimeType },
            resumable: false
        });
        return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    }
}

export const gcsService = new GCSService();
