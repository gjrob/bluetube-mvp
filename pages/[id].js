// pages/watch/[id].js
import { useRouter } from 'next/router';

export default function WatchStream() {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-white mb-4">
          Watching Stream
        </h1>
        
        {/* Your video player */}
        <div className="relative aspect-video bg-gray-900 rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center text-white">
            Stream: {id}
          </div>
        </div>
      </div>
    </div>
  );
}