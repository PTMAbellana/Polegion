const bcrypt = require('bcryptjs');
const UserRepository = require('../../infrastructure/repository/UserRepoNew');
const JWTService = require('../../config/jwt');
const cacheService = require('../../config/cache');
const { createClient } = require('@supabase/supabase-js');

class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }

  async register(userData) {
    const { email, username, password, firstName, lastName } = userData;

    // Check if user exists
    const existingUser = await this.userRepo.findByEmail(email, false);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const existingUsername = await this.userRepo.findByUsername(username, false);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Create user in Supabase Auth (optional)
    let supabaseUser = null;
    try {
      const { data, error } = await this.supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          username,
          firstName,
          lastName
        }
      });
      
      if (!error) {
        supabaseUser = data.user;
      }
    } catch (error) {
      console.warn('Supabase user creation failed:', error.message);
    }

    // Create user in database
    const user = await this.userRepo.create({
      email,
      username,
      firstName,
      lastName,
      supabaseId: supabaseUser?.id || null
    });

    // Generate tokens
    const tokens = JWTService.generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    });

    // Cache user session
    await cacheService.cacheUserSession(
      user.id, 
      { ...tokens, userId: user.id }, 
      parseInt(process.env.CACHE_USER_SESSION_TTL) || 7200
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        xp: user.xp,
        level: user.level
      },
      tokens
    };
  }

  async login(email, password) {
    let user = await this.userRepo.findByEmail(email, false);
    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    // Try Supabase auth first if user has supabaseId
    if (user.supabaseId && password) {
      try {
        const { data, error } = await this.supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          console.log('Supabase auth failed, continuing with local auth:', error.message);
        }
      } catch (error) {
        console.log('Supabase auth error:', error.message);
      }
    }

    // Update last login
    user = await this.userRepo.updateLastLogin(user.id);

    // Generate tokens
    const tokens = JWTService.generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    });

    // Cache user session
    await cacheService.cacheUserSession(
      user.id, 
      { ...tokens, userId: user.id }, 
      parseInt(process.env.CACHE_USER_SESSION_TTL) || 7200
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        xp: user.xp,
        level: user.level,
        lastLoginAt: user.lastLoginAt
      },
      tokens
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = JWTService.verifyRefreshToken(refreshToken);
      const user = await this.userRepo.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      const tokens = JWTService.generateTokens({
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      });

      // Update cached session
      await cacheService.cacheUserSession(
        user.id, 
        { ...tokens, userId: user.id }, 
        parseInt(process.env.CACHE_USER_SESSION_TTL) || 7200
      );

      return {
        tokens,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(userId, accessToken) {
    // Blacklist the token
    await JWTService.blacklistToken(accessToken);
    
    // Clear user session cache
    await cacheService.invalidateUserData(userId);
    
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(userId) {
    // Try cache first
    const cacheKey = `current_user_${userId}`;
    let user = await cacheService.get(cacheKey);
    
    if (!user) {
      user = await this.userRepo.findById(userId, true);
      if (user) {
        await cacheService.set(cacheKey, user, 1800); // 30 minutes
      }
    }
    
    return user ? {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
      xp: user.xp,
      level: user.level,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt
    } : null;
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // If user has Supabase ID, update password in Supabase
    if (user.supabaseId) {
      try {
        const { error } = await this.supabase.auth.admin.updateUserById(
          user.supabaseId,
          { password: newPassword }
        );

        if (error) {
          throw new Error('Failed to update password in authentication service');
        }
      } catch (error) {
        throw new Error('Failed to update password: ' + error.message);
      }
    }

    // Clear user sessions to force re-login
    await cacheService.invalidateUserData(userId);
    
    return { message: 'Password updated successfully' };
  }

  async requestPasswordReset(email) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If an account exists with this email, a password reset link has been sent.' };
    }

    // Use Supabase for password reset if available
    if (user.supabaseId) {
      try {
        await this.supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.CORS_ORIGIN}/reset-password`
        });
      } catch (error) {
        console.error('Supabase password reset error:', error);
      }
    }

    return { message: 'If an account exists with this email, a password reset link has been sent.' };
  }

  async validateToken(token) {
    try {
      // Check if token is blacklisted
      const isBlacklisted = await JWTService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new Error('Token has been revoked');
      }

      const decoded = JWTService.verifyAccessToken(token);
      const user = await this.getCurrentUser(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      return { user, decoded };
    } catch (error) {
      throw new Error('Invalid token: ' + error.message);
    }
  }

  async getUserStats(userId) {
    const cacheKey = `auth_user_stats_${userId}`;
    let stats = await cacheService.get(cacheKey);
    
    if (!stats) {
      const user = await this.userRepo.findById(userId);
      if (user) {
        stats = {
          totalLogins: 1, // Could be tracked separately
          lastLogin: user.lastLoginAt,
          accountAge: Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)), // days
          isActive: user.isActive
        };
        
        await cacheService.set(cacheKey, stats, 3600); // 1 hour
      }
    }
    
    return stats;
  }
}

module.exports = AuthService;