import type {InferGetServerSidePropsType} from 'next';
import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import Head from 'next/head';
import S3Utils, {ListOutput, PublicBucketInfo} from '../utils/s3Utils';
import BucketDropdown from '../components/BucketDropdown';
import ContentTable from '../components/ContentTable';
import {Suspense} from 'react';
import Loader from '../components/Loader';

export const getServerSideProps: GetServerSideProps<{
  objects: ListOutput;
  buckets: PublicBucketInfo[];
}> = async context => {
  const {query} = context;
  let prefix = '';
  let bucket = '';
  const s3Utils = new S3Utils();
  if (query.bucket) {
    bucket = `${query.bucket}`;
  } else {
    bucket = s3Utils.publicBuckets[0].id;
  }
  if (query.prefix) {
    prefix = `${query.prefix}`;
  } else {
    prefix =
      s3Utils.publicBuckets.find(x => x.id === bucket)?.prefixes[0] || '';
  }
  let objects;
  try {
    objects = await s3Utils.listObjects(bucket, prefix);
  } catch (_) {
    bucket = s3Utils.publicBuckets[0].id;
    prefix =
      s3Utils.publicBuckets.find(x => x.id === bucket)?.prefixes[0] || '';
    objects = await s3Utils.listObjects(bucket, prefix);
  }
  return {
    props: {
      objects,
      buckets: s3Utils.publicBuckets,
    },
  };
};

const Home = ({
  objects,
  buckets,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>RebornOS Repository Explorer</title>
      </Head>
      <main className="flex w-full flex-1 flex-col items-center text-center">
        <Suspense
          fallback={
            <div className="inset-1/2 fixed min-h-screen">
              <Loader />
            </div>
          }
        >
          <div className="card w-full shadow-xl">
            <div className="prose-xl p-2">
              <h2>RebornOS Repository Explorer</h2>
            </div>
            <div className="flex flex-col gap-12 card-body">
              <div className="flex flex-row">
                <BucketDropdown
                  buckets={buckets}
                  onBucketChange={newValue =>
                    router.push({
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        bucket: newValue.id,
                        prefix: newValue.prefixes[0],
                      },
                    })
                  }
                  onPrefixChange={newValue =>
                    router.push({
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        prefix: newValue,
                      },
                    })
                  }
                />
              </div>
              <ContentTable data={objects} />
            </div>
          </div>
        </Suspense>
      </main>
    </div>
  );
};

export default Home;
