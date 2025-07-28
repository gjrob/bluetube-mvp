// pages/404.js - Custom 404 page
import Layout from '../components/Layout';
import Head from 'next/head';

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Page Not Found - BlueTubeTV</title>
      </Head>
      
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🚁</div>
          <h1 className="text-4xl font-bold mb-4">404 - Lost in the Clouds</h1>
          <p className="text-gray-600 mb-8">
            This page seems to have flown away. Let's get you back on course.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Go Home
            </a>
            <a 
              href="/browse"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Browse Content
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}