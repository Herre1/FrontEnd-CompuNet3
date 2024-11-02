import Link from "next/link";

export default function NotFound(){
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h2>
                Page Not Found
            </h2>
            <p>Page not found</p>
            <Link 
              className="mt-4 p-2 bg-gray-900 text-white rounded hover:bg-gray-600 transition-all"
              href="/">Return home</Link>
        </div>
    )
}