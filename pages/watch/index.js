// pages/watch/index.js
export async function getServerSideProps() {
  return {
    redirect: { destination: '/live', permanent: false },
  };
}
export default function WatchIndex() {
  return null;
}
