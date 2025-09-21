const prisma = require('../../config/prisma');
const cacheService = require('../../config/cache');

class BaseRepository {
  constructor(model) {
    this.model = model;
    this.prisma = prisma;
    this.cache = cacheService;
  }

  async findById(id, useCache = true) {
    const cacheKey = `${this.model}_${id}`;
    
    if (useCache) {
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const result = await this.prisma[this.model].findUnique({
      where: { id }
    });

    if (result && useCache) {
      await this.cache.set(cacheKey, result, 1800); // 30 minutes
    }

    return result;
  }

  async findMany(where = {}, options = {}, useCache = false) {
    const cacheKey = `${this.model}_list_${JSON.stringify({ where, options })}`;
    
    if (useCache) {
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const result = await this.prisma[this.model].findMany({
      where,
      ...options
    });

    if (useCache && result) {
      await this.cache.set(cacheKey, result, 600); // 10 minutes
    }

    return result;
  }

  async create(data) {
    const result = await this.prisma[this.model].create({
      data
    });

    // Invalidate related cache
    await this.invalidateCache();
    
    return result;
  }

  async update(id, data) {
    const result = await this.prisma[this.model].update({
      where: { id },
      data
    });

    // Invalidate specific and related cache
    await this.cache.del(`${this.model}_${id}`);
    await this.invalidateCache();
    
    return result;
  }

  async delete(id) {
    const result = await this.prisma[this.model].delete({
      where: { id }
    });

    // Invalidate specific and related cache
    await this.cache.del(`${this.model}_${id}`);
    await this.invalidateCache();
    
    return result;
  }

  async count(where = {}) {
    return await this.prisma[this.model].count({ where });
  }

  async invalidateCache(pattern = null) {
    // This is a simple implementation - in production, you might want more sophisticated cache invalidation
    if (pattern) {
      // Redis doesn't have a built-in way to delete by pattern in the basic client
      // You would need to implement this based on your specific needs
      console.log(`Invalidating cache pattern: ${pattern}`);
    }
  }

  async paginate(where = {}, page = 1, limit = 10, options = {}) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma[this.model].findMany({
        where,
        skip,
        take: limit,
        ...options
      }),
      this.prisma[this.model].count({ where })
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = BaseRepository;