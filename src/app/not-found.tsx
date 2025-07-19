export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-8">The page you are looking for does not exist.</p>
        <a href="/" className="inline-block bg-white text-black px-6 py-3 rounded-lg hover:bg-white/90 transition">
          Return Home
        </a>
      </div>
    </div>
  );
}
