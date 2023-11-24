import { CosmosClient } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';

export class CosmosDbUtility {
  private cosmosClient: CosmosClient;
  private dbName: string;
  public constructor(endpoint: string, dbName: string, key?: string) {
    this.dbName = dbName;
    if (key) {
      this.cosmosClient = new CosmosClient({ endpoint, key });
    } else {
      this.cosmosClient = new CosmosClient({
        endpoint,
        aadCredentials: new DefaultAzureCredential(),
      });
    }
  }

  public getCosmosClient() {
    return this.cosmosClient;
  }

  public getCosmosDbClient() {
    return this.cosmosClient.database(this.dbName);
  }

  public async ensureCosmosDb() {
    this.cosmosClient.databases.createIfNotExists({
      id: this.dbName,
      maxThroughput: 1000,
    });
  }

  public async getContainer(name: string, createIfNotExists?: boolean) {
    if (createIfNotExists) {
      await this.getCosmosDbClient().containers.createIfNotExists({
        id: name,
        partitionKey: '/partitionKey',
      });
    }

    return this.getCosmosDbClient().container(name);
  }
}

export abstract class CosmosDbContainerBase {
  static getName() {
    return this.name;
  }
  id: string | undefined | null;
  paritionKey: string | undefined | null;
  _etag: string | undefined | null;
  lastUpdateDateTime: Date | undefined | null;
  lastUpdateUserName: string | undefined | null;
}

const cosmosDbUtility = new CosmosDbUtility(
  process.env.COSMOSDB_ACCOUNTNAME as string,
  process.env.COSMOSDB_DBNAME as string
);
export function getDefaultCosmosDbUtility() {
  return cosmosDbUtility;
}
