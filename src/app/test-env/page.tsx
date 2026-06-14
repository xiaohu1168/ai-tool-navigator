export default function TestEnvPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold text-blue-600 mb-4'>Environment Variables Test</h1>
        <div className='space-y-2'>
          <p><strong>ADMIN_USERNAME:</strong> {process.env.ADMIN_USERNAME || 'NOT SET'}</p>
          <p><strong>ADMIN_PASSWORD length:</strong> {process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.length : 'NOT SET'}</p>
          <p><strong>ADMIN_SALT length:</strong> {process.env.ADMIN_SALT ? process.env.ADMIN_SALT.length : 'NOT SET'}</p>
          <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'NOT SET'}</p>
        </div>
        <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
          <p className='text-xs text-yellow-700'>如果 ADMIN_USERNAME 正确但其他为空，说明 .env 文件部分加载</p>
        </div>
      </div>
    </div>
  );
}