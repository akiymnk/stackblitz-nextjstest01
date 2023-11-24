import { BlobServiceClient } from '@azure/storage-blob';
import { QueueServiceClient } from '@azure/storage-queue';
import { TableServiceClient, TableClient } from '@azure/data-tables';
import { DefaultAzureCredential } from '@azure/identity';
import { ConvertUtility } from './ConvertUtility';

export class CloudStorageUtility {
  private blobServiceClient: BlobServiceClient;
  private queueServiceClient: QueueServiceClient;
  private tableServiceClient: TableServiceClient;
  private connectionString: string | undefined;
  private accountName: string;

  public constructor(connectionString: string) {
    // 渡された文字列からアカウント名を取得する
    // 接続文字列の場合はAccountName=で始まる。
    // それ以外の場合は、そのものをアカウント名として利用する
    const match = connectionString.match(/AccountName=([^;]+)(;|$)/);
    let accountName = connectionString;
    if (match && match.length > 1) {
      accountName = match[1];
    }

    if (connectionString.indexOf('AccountKey=') >= 0) {
      // アカウントキーあり。接続文字列として利用する
      this.blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
      this.queueServiceClient =
        QueueServiceClient.fromConnectionString(connectionString);
      this.tableServiceClient =
        TableServiceClient.fromConnectionString(connectionString);
      this.connectionString = connectionString;
    } else {
      const defaultAzureCredential = new DefaultAzureCredential();
      this.blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        defaultAzureCredential
      );
      this.queueServiceClient = new QueueServiceClient(
        `https://${accountName}.queue.core.windows.net`,
        defaultAzureCredential
      );
      this.tableServiceClient = new TableServiceClient(
        `https://${accountName}.table.core.windows.net`,
        defaultAzureCredential
      );
      this.connectionString = undefined;
    }

    this.accountName = this.blobServiceClient.accountName;
  }

  public getBlobServiceClient() {
    return this.blobServiceClient;
  }

  public getBlobContainer(blobContainerName: string) {
    const client = this.blobServiceClient.getContainerClient(blobContainerName);
    return client;
  }

  public async isBlobContainerExists(blobContainerName: string) {
    const blobContainerClient = this.getBlobContainer(blobContainerName);
    return await blobContainerClient.exists();
  }

  public async createBlobContainerIfNotExists(blobContainerName: string) {
    console.debug('blob createBlobContainerIfNotExists : ', blobContainerName);
    const blobContainerClient = this.getBlobContainer(blobContainerName);
    return await blobContainerClient.createIfNotExists();
  }

  public getBlobClient(blobContainerName: string, blobName: string) {
    const blobContainerClient = this.getBlobContainer(blobContainerName);
    const blobClient = blobContainerClient.getBlockBlobClient(blobName);
    return blobClient;
  }

  public async isExistsBlob(blobContainerName: string, blobName: string) {
    const blob = this.getBlobClient(blobContainerName, blobName);
    return await blob.exists();
  }

  public async downloadBlob(
    blobContainerName: string,
    blobName: string,
    createIfNotExists?: boolean
  ) {
    if (createIfNotExists) {
      await this.createBlobContainerIfNotExists(blobContainerName);
    }

    const blob = this.getBlobClient(blobContainerName, blobName);
    if (!(await blob.exists())) {
      console.debug('blob not exists : ', blobContainerName, blobName);
      return undefined;
    }

    const buffer = await blob.downloadToBuffer();
    return buffer;
  }

  public async downloadBlobJson<T>(
    blobContainerName: string,
    blobName: string,
    createIfNotExists?: boolean
  ) {
    if (createIfNotExists) {
      await this.createBlobContainerIfNotExists(blobContainerName);
    }

    const blob = this.getBlobClient(blobContainerName, blobName);
    if (!(await blob.exists())) {
      console.debug('blob not exists : ', blobContainerName, blobName);
      return undefined;
    }

    try {
      const buffer = await blob.downloadToBuffer();
      const data = ConvertUtility.bufferToJson<T>(buffer);
      return data;
    } catch {
      console.debug('blob download error : ', blobContainerName, blobName);
      return undefined;
    }
  }

  public async uploadBlob(
    blobContainerName: string,
    blobName: string,
    data: Buffer | ArrayBuffer | Blob,
    createIfNotExists?: boolean
  ) {
    if (createIfNotExists) {
      await this.createBlobContainerIfNotExists(blobContainerName);
    }

    const blob = this.getBlobClient(blobContainerName, blobName);
    await blob.uploadData(data);
  }

  public async uploadBlobJson<T>(
    blobContainerName: string,
    blobName: string,
    data: T,
    createIfNotExists?: boolean
  ) {
    if (createIfNotExists) {
      await this.createBlobContainerIfNotExists(blobContainerName);
    }

    const jsonData = ConvertUtility.jsonToBuffer(data);

    const blob = this.getBlobClient(blobContainerName, blobName);
    await blob.uploadData(jsonData);
  }

  public getQueueServiceClient() {
    return this.queueServiceClient;
  }

  public async getQueue(queueName: string, createIfNotExists?: boolean) {
    const queue = this.getQueueServiceClient();
    const client = queue.getQueueClient(queueName);
    if (createIfNotExists) {
      console.debug('getQueue createIfNotExists : ', queueName);
      await client.createIfNotExists();
    }

    return client;
  }

  public async SendQueueText(
    queueName: string,
    message: string,
    createIfNotExists?: boolean
  ) {
    const client = await this.getQueue(queueName, createIfNotExists);
    const base64Message = Buffer.from(message).toString('base64');
    await client.sendMessage(base64Message);
  }

  public async SendQueueJson<T>(
    queueName: string,
    data: T,
    createIfNotExists?: boolean
  ) {
    const client = await this.getQueue(queueName, createIfNotExists);
    const base64Message = Buffer.from(JSON.stringify(data)).toString('base64');
    await client.sendMessage(base64Message);
  }

  public getTableServiceClient() {
    return this.tableServiceClient;
  }

  public async getTableClient(tableName: string, createIfNotExists?: boolean) {
    let client: TableClient | undefined;

    if (this.connectionString) {
      client = TableClient.fromConnectionString(
        this.connectionString,
        tableName
      );
    } else {
      client = new TableClient(
        `https://${this.accountName}.table.core.windows.net`,
        tableName,
        new DefaultAzureCredential()
      );
    }

    if (createIfNotExists) {
      console.debug('getTableClient createIfNotExists : ', tableName);
      try {
        await client.createTable();
      } catch {}
    }

    return client;
  }
}

const cloudStorageUtility = new CloudStorageUtility(
  process.env.STORAGE_ACCOUNTNAME as string
);
export function getDefaultCloudStorageUtility() {
  return cloudStorageUtility;
}
