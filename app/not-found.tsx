import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-6xl font-bold text-blue-600">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-gray-500 dark:text-gray-400">The page you are looking for does not exist or was moved.</p>
      <Link href="/" className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition">Back to the translator</Link>
    </div>
  );
}