# Credly API Cache System

## Overview

The portfolio integrates with Credly API to automatically fetch and display professional certifications. To reduce API calls and improve performance, a robust caching system has been implemented.

## Cache Strategy

### Multi-Level Caching

1. **Next.js ISR Cache**: 24-hour revalidation at the framework level
2. **In-Memory Cache**: 24-hour TTL for runtime efficiency  
3. **HTTP Cache Headers**: Browser and CDN caching support
4. **Stale-While-Revalidate**: Fallback to expired cache during API failures

### Cache Configuration

```typescript
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
```

### Cache Headers

```typescript
'Cache-Control': 'public, max-age=86400, s-maxage=86400' // 24h
```

## Cache Behavior

### Cache Hit Flow
1. Check in-memory cache first
2. If valid (< 24h), return cached data
3. Response includes `X-Cache-Status: HIT` header

### Cache Miss Flow
1. Fetch fresh data from Credly API
2. Store in memory cache with timestamp
3. Return data with `X-Cache-Status: MISS` header

### Error Handling
1. If API fails, attempt to serve stale cache
2. Stale cache served with `X-Cache-Status: STALE` header
3. Reduced TTL (1h) for stale responses

### Cache Management
- Maximum 10 entries in memory
- LRU eviction when limit exceeded
- Automatic cleanup of expired entries

## Benefits

### Performance
- **Reduced API Calls**: From every page load to once per day
- **Faster Response**: In-memory cache serves data instantly
- **Lower Latency**: No external API dependency for cached data

### Reliability
- **Graceful Degradation**: Stale cache during API outages
- **Better UX**: No loading delays for cached data
- **Error Resilience**: Fallback strategies prevent failures

### Cost Efficiency
- **API Rate Limits**: Reduced risk of hitting Credly limits
- **Bandwidth**: Less external traffic
- **Server Load**: Fewer external dependencies

## Monitoring

### Cache Status Headers
- `X-Cache-Status: HIT` - Data served from cache
- `X-Cache-Status: MISS` - Fresh data from API
- `X-Cache-Status: STALE` - Expired cache due to API error

### Logs
- Cache hits/misses logged to console
- API failures and fallbacks tracked
- Cache expiration and cleanup events logged

## Configuration

### Environment Variables
No additional environment variables required - the system works out of the box.

### Manual Cache Invalidation
To force cache refresh, restart the application or wait for the 24-hour TTL.

### Development vs Production
- Same caching behavior in all environments
- Console logs available for debugging
- Cache statistics visible in response headers

## API Endpoint

```
GET /api/credly/[username]
```

### Response Headers
- `Cache-Control`: Browser/CDN cache instructions
- `X-Cache-Status`: Cache hit/miss/stale indicator

### Error Responses
- `404`: Credly profile not found
- `500`: API failure (with stale cache fallback)

## Future Enhancements

- Redis cache for multi-instance deployments
- Cache warming strategies
- Analytics and cache hit rate monitoring
- Configurable TTL per environment 