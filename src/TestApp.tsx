function TestApp() {
  return (
    <div className="h-screen w-screen bg-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">OmniCanvas 測試</h1>
        <p className="text-gray-600">如果您看到這個頁面，說明基本配置正常。</p>
        <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
          <p className="text-green-800 text-sm">✅ React 正常</p>
          <p className="text-green-800 text-sm">✅ TypeScript 正常</p>
          <p className="text-green-800 text-sm">✅ Tailwind CSS 正常</p>
        </div>
      </div>
    </div>
  )
}

export default TestApp