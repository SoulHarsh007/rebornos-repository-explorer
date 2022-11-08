import Link from 'next/link';
import {ListOutput} from '../utils/s3Utils';

export default function ContentTable(props: {data: ListOutput}) {
  const {data} = props;
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>File</th>
            <th>Size</th>
            <th>Upload Time (DD-MM-YYYY UTC 24H)</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {data?.contents?.map(x => (
            <tr className="hover" key={x.key}>
              <td>
                <div className="font-bold">{x.key}</div>
                <div
                  className={
                    x.class?.toLowerCase() === 'standard'
                      ? 'badge badge-success font-semibold capitalize opacity-90'
                      : 'badge badge-warning font-semibold capitalize opacity-85'
                  }
                >
                  {x.class?.toLowerCase()}
                </div>
              </td>
              <td>{x.size}</td>
              <td>
                {new Date(x.lastModified || '')
                  .toLocaleString('en-GB', {timeZone: 'UTC', hour12: false})
                  .replace(/\//g, '-')
                  .replace(/,/g, '')}
              </td>
              <td className="link">
                <Link className="link" href={`${x.redirect}`}>
                  Download
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
