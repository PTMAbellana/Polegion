const BaseRepository = require('./BaseRepo');
const { createClient } = require('@supabase/supabase-js');

class UserRepository extends BaseRepository {
  constructor() {
    super('user');
    // Initialize Supabase client for auth operations
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }

  // Keep Supabase auth methods from original UserRepo.js
  async refreshSession(refreshToken) {
    try {
      console.log('Attempting to refresh session with token:', refreshToken ? 'Present' : 'Missing')
      
      const {
        data,
        error
      } = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken
      })

      if (error) {
        console.error('Refresh session error from Supabase:', error)
        throw error
      }
      
      console.log('Refresh session successful, new session expires at:', data.session?.expires_at)
      return data
    } catch (error) {
      console.error('Refresh session failed:', error)
      throw error
    }
  }

  async getUserById(token) {
    try {
      const {
        data,
        error
      } = await this.supabase.auth.getUser(token)
      
      if (error) {
        // More specific error handling based on Supabase error
        if (error.message && error.message.includes('expired')) {
          throw new Error("Token expired")
        }
        throw new Error(`Token validation failed: ${error.message || 'Unknown error'}`)
      }
      
      if (!data.user) {
        throw new Error("User not found")
      }
      
      return data.user
    } catch (error) {
      throw error
    }
  }

  async getUserByuid(userId) {
    try {
      const {
        data,
        error
      } = await this.supabase.auth.admin.getUserById(userId)

      if (error || !data.user) throw new Error("User not found or invalid user ID")

      return data.user
    } catch (error) {
      throw error
    }
  }

  async signInWithPassword(email, password) {
    try {
      const {
        data,
        error
      } = await this.supabase.auth.signInWithPassword({
        email, 
        password
      })

      if (error) throw error
      
      return data
    } catch (error) {
      throw error
    }
  }

  async signUp(email, password, options) {
    try {
      const { 
        data, 
        error 
      } = await this.supabase.auth.signUp({
        email,
        password,
        options
      })

      if (error) throw error 

      return data
    } catch (error) {
      throw error
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()

      if (error) throw error

      return true
    } catch (error) {
      throw error
    }
  }

  async resetPassword(email, redirectUrl) {
    try {
      const { data, error } = await this.supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: redirectUrl
        }
      )
      
      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  }

  // Add minimal Prisma methods only for database operations that Supabase can't handle
  async syncUserToDatabase(supabaseUser, additionalData = {}) {
    // Sync Supabase user to Neon database for complex queries
    return await this.prisma.user.upsert({
      where: { supabaseId: supabaseUser.id },
      update: {
        email: supabaseUser.email,
        lastLoginAt: new Date(),
        ...additionalData
      },
      create: {
        supabaseId: supabaseUser.id,
        email: supabaseUser.email,
        username: supabaseUser.user_metadata?.username || supabaseUser.email.split('@')[0],
        firstName: supabaseUser.user_metadata?.firstName || '',
        lastName: supabaseUser.user_metadata?.lastName || '',
        lastLoginAt: new Date(),
        ...additionalData
      }
    });
  }

  async findBySupabaseId(supabaseId) {
    // Only for finding synced user data in Neon database
    return await this.prisma.user.findUnique({
      where: { supabaseId }
    });
  }
}

module.exports = UserRepository;