import {ListObjectsV2Command, S3Client} from '@aws-sdk/client-s3';
import pb from 'pretty-bytes';

export type BucketInfo = {
  id: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  prefixes: string[];
  public: string;
};

export type PublicBucketInfo = {
  id: string;
  endpoint: string;
  region: string;
  prefixes: string[];
  public: string;
};

export type ListOutput = {
  contents?: {
    key?: string;
    lastModified?: string;
    size?: string;
    class?: string;
    redirect?: string;
  }[];
};

export default class S3Utils {
  private buckets: BucketInfo[];
  public publicBuckets: PublicBucketInfo[];

  constructor() {
    this.buckets = JSON.parse(process.env.S3_BUCKETS || '[]');
    console.log(
      '🚀 ~ file: s3Utils.ts ~ line 39 ~ S3Utils ~ constructor ~ buckets',
      this.buckets
    );
    this.publicBuckets = this.buckets.map(x => ({
      id: x.id,
      endpoint: x.endpoint,
      region: x.region,
      prefixes: x.prefixes,
      public: x.public,
    }));
  }

  async listObjects(bucketId: string, prefix: string): Promise<ListOutput> {
    const bucket = this.buckets.find(x => x.id === bucketId);
    if (!bucket) {
      throw new Error(`Bucket ${bucketId} not found`);
    }
    const s3 = new S3Client({
      endpoint: bucket.endpoint,
      credentials: {
        accessKeyId: bucket.accessKeyId,
        secretAccessKey: bucket.secretAccessKey,
      },
      region: bucket.region,
      forcePathStyle: true,
    });
    const out = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket.bucket,
        Prefix: prefix,
        Delimiter: '/',
      })
    );
    return {
      contents:
        out.Contents?.map(x => ({
          key: x.Key?.replace(prefix, '') || '',
          lastModified: x.LastModified?.toJSON() || '',
          size: pb(x.Size || 0),
          class: x.StorageClass || 'UNKNOWN',
          redirect: `${bucket.public}/${x.Key}`,
        })) || [],
    };
  }
}
