import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="flex items-center text-3xl font-bold mb-8">Hello World</h1>
      
      <Link href="/list" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Go to List
      </Link>
    </div>
  );
}