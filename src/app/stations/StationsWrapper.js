import dynamic from 'next/dynamic';

const StationTable = dynamic(() => import('/StationTable'), { ssr: false });

export default function Page() {
  return <StationTable />;
}
