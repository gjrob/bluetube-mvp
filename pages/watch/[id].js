// Temporary debug version - add this to your watch/[id].js to test different URLs
import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';

export default function WatchStream() {
  const router = useRouter();
  const { id } = router.query;
  const [urlFormat, setUrlFormat] = useState(0);
  
  // Try different Cloudflare URL formats
  const urlFormats = [
    `https://customer-f33zs165nr7gyfy4.cloudflarestream.com/${id}/iframe`,
    `https://iframe.cloudflarestream.com/${id}`,
    `https://watch.cloudflarestream.com/embed/${id}`,
    `https://cloudflarestream.com/${id}/embed`,
  ];
  
  // Your ACTUAL working stream ID from your setup
  const testStreamId = "6c5352b797fdb73a57dc190c8b617066"; // From your notes
  
  return (
    <>
      <Head>
        <title>Debug Stream - BlueTubeTV</title>
      </Head>

      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">🚁 Stream Debug</h1>
          
          <div className="bg-gray-100 p-4 rounded mb-4">
            <p className="mb-2"><strong>Current Stream ID:</strong> {id || 'Loading...'}</p>
            <p className="mb-2"><strong>URL Format:</strong> {urlFormats[urlFormat]}</p>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setUrlFormat((prev) => (prev + 1) % urlFormats.length)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Try Next URL Format
              </button>
              
              <button
                onClick={() => router.push(`/watch/${testStreamId}`)}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Use Test Stream ID
              </button>
            </div>
          </div>
          
          {id && (
            <>
              <div className="aspect-video bg-gray-900 rounded overflow-hidden mb-4">
                <iframe
                  key={urlFormat} // Force reload on URL change
                  src={urlFormats[urlFormat]}
                  className="w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-300 p-4 rounded">
                <h3 className="font-bold mb-2">Troubleshooting:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Make sure this video exists in your Cloudflare Stream dashboard</li>
                  <li>Check if the video is set to "Allow embedding on any site"</li>
                  <li>Try the "Use Test Stream ID" button with your known working ID</li>
                  <li>If none work, the issue might be domain restrictions</li>
                </ol>
                
                <div className="mt-4">
                  <p className="font-semibold">Direct Links to Test:</p>
                  <a 
                    href={`https://customer-f33zs165nr7gyfy4.cloudflarestream.com/${id}/watch`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm block"
                  >
                    Open in Cloudflare Player →
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}