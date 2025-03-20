{movie.streaming_services && movie.streaming_services.length > 0 && (
  <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-xl font-semibold text-gray-900">Where to Watch</h3>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Tv className="h-4 w-4" />
        <span>{movie.streaming_services.length} Platforms</span>
      </div>
    </div>
    
    <div className="flex flex-wrap gap-2">
      {movie.streaming_services.map((service) => (
        <div
          key={service.provider_id}
          className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
        >
          <img
            src={`https://image.tmdb.org/t/p/original${service.logo_path}`}
            alt={service.provider_name}
            className="h-4 w-4 rounded-full"
          />
          <span>{service.provider_name}</span>
        </div>
      ))}
    </div>

    <div className="mt-4 rounded-lg bg-purple-50 p-3 text-sm text-purple-700">
      <p className="flex items-center gap-2">
        <Info className="h-4 w-4" />
        <span>Streaming availability may vary by region. Prices and content may differ.</span>
      </p>
    </div>
  </div>
)} 