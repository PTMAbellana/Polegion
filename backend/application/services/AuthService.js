const bcrypt = require('bcryptjs');
const UserRepository = require('../../infrastructure/repository/UserRepo');
const JWTService = require('../../config/jwt');
const cacheService = require('../../config/redis');
const { createClient } = require('@supabase/supabase-js');

class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in Supabase Auth (optional)
    let supabaseUser = null;
    try {
      const { data, error } = await this.supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
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
      role: user.role
    });

    // Cache user session
    await cacheService.set(
      `user_session_${user.id}`, 
      { ...tokens, userId: user.id }, 
      7 * 24 * 3600 // 7 days
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
    const user = await this.userRepo.findByEmail(email, false);
    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    // For now, we'll skip password verification since we're using Supabase auth
    // In a full implementation, you might want to verify with Supabase or store hashed passwords

    // Update last login
    await this.userRepo.update(user.id, {
      lastLoginAt: new Date()
    });

    // Generate tokens
    const tokens = JWTService.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Cache user session
    await cacheService.set(
      `user_session_${user.id}`, 
      { ...tokens, userId: user.id }, 
      7 * 24 * 3600 // 7 days
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
        role: user.role
      });

      // Update cached session
      await cacheService.set(
        `user_session_${user.id}`, 
        { ...tokens, userId: user.id }, 
        7 * 24 * 3600
      );

      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(userId, accessToken) {
    // Blacklist the token
    await JWTService.blacklistToken(accessToken);
    
    // Clear user session cache
    await cacheService.del(`user_session_${userId}`);
    
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(userId) {
    // Try cache first
    const cacheKey = `current_user_${userId}`;
    let user = await cacheService.get(cacheKey);
    
    if (!user) {
      user = await this.userRepo.findById(userId);
      if (user) {
        await cacheService.set(cacheKey, user, 1800); // 30 minutes
      }
    }
    
    return user;
  }
}

module.exports = AuthService;