const UserRepository = require('../../infrastructure/repository/UserRepoNew');
const JWTService = require('../../config/jwt');
const cacheService = require('../../config/cache');

class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(email, password, options) {
    try {
      // Use Supabase auth for registration (your original approach)
      const data = await this.userRepo.signUp(email, password, options);
      
      if (data.user) {
        // Sync to Neon database for complex queries
        const dbUser = await this.userRepo.syncUserToDatabase(data.user, {
          username: options?.data?.username || email.split('@')[0],
          firstName: options?.data?.firstName || '',
          lastName: options?.data?.lastName || ''
        });

        // Generate JWT tokens for session management
        const tokens = JWTService.generateTokens({
          userId: data.user.id,
          email: data.user.email,
          username: dbUser.username,
          role: 'USER'
        });

        // Cache user session
        await cacheService.cacheUserSession(
          data.user.id, 
          { ...tokens, userId: data.user.id }, 
          parseInt(process.env.CACHE_USER_SESSION_TTL) || 7200
        );

        return {
          user: data.user,
          session: data.session,
          tokens
        };
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      // Use Supabase auth for login (your original approach)
      const data = await this.userRepo.signInWithPassword(email, password);
      
      if (data.user && data.session) {
        // Sync/update user in Neon database
        const dbUser = await this.userRepo.syncUserToDatabase(data.user);

        // Generate JWT tokens for session management
        const tokens = JWTService.generateTokens({
          userId: data.user.id,
          email: data.user.email,
          username: dbUser.username,
          role: dbUser.role || 'USER'
        });

        // Cache user session
        await cacheService.cacheUserSession(
          data.user.id, 
          { ...tokens, userId: data.user.id, supabaseSession: data.session }, 
          parseInt(process.env.CACHE_USER_SESSION_TTL) || 7200
        );

        return {
          user: data.user,
          session: data.session,
          tokens,
          dbUser // Additional database info if needed
        };
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      throw error;
    }
  }

  async refreshSession(refreshToken) {
    try {
      // Use Supabase's refresh session (your original approach)
      const data = await this.userRepo.refreshSession(refreshToken);
      
      if (data.session && data.user) {
        // Generate new JWT tokens
        const tokens = JWTService.generateTokens({
          userId: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.username || data.user.email.split('@')[0],
          role: 'USER'
        });

        // Update cached session
        await cacheService.cacheUserSession(
          data.user.id, 
          { ...tokens, supabaseSession: data.session }, 
          parseInt(process.env.CACHE_USER_SESSION_TTL) || 7200
        );

        return {
          session: data.session,
          user: data.user,
          tokens
        };
      }

      throw new Error('Failed to refresh session');
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      // Use Supabase signOut (your original approach)
      await this.userRepo.signOut();
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(token) {
    try {
      // Use Supabase getUserById (your original approach)
      const user = await this.userRepo.getUserById(token);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(email, redirectUrl) {
    try {
      // Use Supabase resetPassword (your original approach)
      const data = await this.userRepo.resetPassword(email, redirectUrl);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;