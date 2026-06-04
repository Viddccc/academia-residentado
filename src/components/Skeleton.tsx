export function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden animate-pulse">
      <div className="h-24 bg-gray-100" />
      <div className="p-4">
        <div className="h-3 bg-gray-100 rounded w-16 mb-3" />
        <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-20" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonCursoDetalle() {
  return (
    <div className="animate-pulse">
      <div className="h-40 bg-gray-100 rounded-2xl mb-6" />
      <div className="h-4 bg-gray-100 rounded w-24 mb-3" />
      <div className="h-8 bg-gray-100 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-100 rounded w-full mb-2" />
      <div className="h-4 bg-gray-100 rounded w-5/6 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-4/6 mb-6" />
      <div className="flex gap-4">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="h-4 bg-gray-100 rounded w-24" />
      </div>
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-24" />
        ))}
      </div>
      <div className="bg-gray-100 rounded-xl h-48 mb-6" />
      <div className="bg-gray-100 rounded-xl h-32" />
    </div>
  )
}

export function SkeletonTabla() {
  return (
    <div className="animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 px-5 py-3 border-b">
          <div className="flex-1">
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-1" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
          <div className="h-4 bg-gray-100 rounded w-16" />
          <div className="h-4 bg-gray-100 rounded w-20" />
        </div>
      ))}
    </div>
  )
}