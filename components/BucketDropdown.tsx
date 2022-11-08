import {useState} from 'react';
import {useRouter} from 'next/router';
import {PublicBucketInfo} from '../utils/s3Utils';
import Dropdown from './Dropdown';
import TextField from './TextField';

export default function BucketDropdown(props: {
  buckets: PublicBucketInfo[];
  onBucketChange: (newValue: PublicBucketInfo) => void;
  onPrefixChange: (newValue: string) => void;
}) {
  const router = useRouter();
  const {buckets, onBucketChange, onPrefixChange} = props;
  const [bucket, setBucket] = useState(
    buckets.find(b => b.id === router.query.bucket) || buckets[0]
  );
  return (
    <div className="w-full flex flex-row gap-4 lg:gap-8 flex-wrap justify-center">
      <TextField label="Identifier" data={bucket.id} />
      <TextField label="Region" data={bucket.region} />
      <TextField label="Public URL" data={bucket.public} />
      <Dropdown
        label="Bucket"
        list={buckets.map(x => x.id)}
        defaultSelected={bucket.id}
        onChange={newValue => {
          const newBucket = buckets.find(b => b.id === newValue);
          if (newBucket) {
            setBucket(newBucket);
            onBucketChange(newBucket);
          }
        }}
      />
      <Dropdown
        label="Prefix"
        list={bucket.prefixes}
        defaultSelected={router.query.prefix?.toString()}
        onChange={newValue => {
          onPrefixChange(newValue);
        }}
      />
    </div>
  );
}
