const supabase = require('./config/supabase')

// Import repositories
const UserRepository = require('./infrastructure/repository/auth/UserRepo');
const XPRepository = require('./infrastructure/repository/world/XPRepo');

// Castle/Chapter/Adaptive Learning Repositories
const CastleRepository = require('./infrastructure/repository/world/CastleRepo');
const ChapterQuizRepository = require('./infrastructure/repository/world/ChapterQuizRepo');
const ChapterRepository = require('./infrastructure/repository/world/ChapterRepo');
const MinigameRepository = require('./infrastructure/repository/world/MinigameRepo');
const UserCastleProgressRepository = require('./infrastructure/repository/world/UserCastleProgressRepo');
const UserChapterProgressRepository = require('./infrastructure/repository/world/UserChapterProgressRepo');
const UserMinigameAttemptRepository = require('./infrastructure/repository/world/UserMinigameAttemptRepo');
const UserQuizAttemptRepository = require('./infrastructure/repository/world/UserQuizAttemptRepo');
const AssessmentRepository = require('./infrastructure/repository/adaptive/AssessmentRepo');
const AdaptiveLearningRepository = require('./infrastructure/repository/adaptive/AdaptiveLearningRepo');


// Import services
const AuthService = require('./application/services/auth/AuthService');
const UserService = require('./application/services/auth/UserService');
const XPService = require('./application/services/world/XPService');

// Castle/Chapter/Adaptive Learning Services
const CastleService = require('./application/services/world/CastleService');
const ChapterQuizService = require('./application/services/world/ChapterQuizService');
const ChapterService = require('./application/services/world/ChapterService');
const MinigameService = require('./application/services/world/MinigameService');
const UserCastleProgressService = require('./application/services/world/UserCastleProgressService');
const UserChapterProgressService = require('./application/services/world/UserChapterProgressService');
const UserMinigameAttemptService = require('./application/services/world/UserMinigameAttemptService');
const UserQuizAttemptService = require('./application/services/world/UserQuizAttemptService');
const ChapterSeeder = require('./application/services/ChapterSeeder');
const QuizAndMinigameSeeder = require('./application/services/QuizAndMinigameSeeder');
const AssessmentService = require('./application/services/adaptive/AssessmentService');
const AdaptiveLearningService = require('./application/services/adaptive/AdaptiveLearningService');
const MasteryProgressionService = require('./application/services/adaptive/MasteryProgressionService'); // NEW: Mastery-based unlocking

// Import controllers
const AuthController = require('./presentation/controllers/auth/AuthController');
const UserController = require('./presentation/controllers/auth/UserController');

// Castle/Chapter/Adaptive Learning Controllers
const CastleController = require('./presentation/controllers/world/CastleController');
const ChapterQuizController = require('./presentation/controllers/world/ChapterQuizController');
const ChapterController = require('./presentation/controllers/world/ChapterController');
const MinigameController = require('./presentation/controllers/world/MinigameController');
const UserCastleProgressController = require('./presentation/controllers/world/UserCastleProgressController');
const UserChapterProgressController = require('./presentation/controllers/world/UserChapterProgressController');
const UserMinigameAttemptController = require('./presentation/controllers/world/UserMinigameAttemptController');
const UserQuizAttemptController = require('./presentation/controllers/world/UserQuizAttemptController');
const AssessmentController = require('./presentation/controllers/adaptive/AssessmentController');
const AdaptiveLearningController = require('./presentation/controllers/adaptive/AdaptiveLearningController');
const MasteryProgressionController = require('./presentation/controllers/adaptive/MasteryProgressionController'); // NEW

// Import middleware
const AuthMiddleware = require('./presentation/middleware/AuthMiddleware');

// Import routes
const AuthRoutes = require('./presentation/routes/auth/AuthRoutes');
const UserRoutes = require('./presentation/routes/auth/UserRoutes');

// Castle/Chapter/Adaptive Learning Routes
const CastleRoutes = require('./presentation/routes/world/CastleRoutes');
const ChapterQuizRoutes = require('./presentation/routes/world/ChapterQuizRoutes');
const ChapterRoutes = require('./presentation/routes/world/ChapterRoutes');
const MinigameRoutes = require('./presentation/routes/world/MinigameRoutes');
const UserCastleProgressRoutes = require('./presentation/routes/world/UserCastleProgressRoutes');
const UserChapterProgressRoutes = require('./presentation/routes/world/UserChapterProgressRoutes');
const UserMinigameAttemptRoutes = require('./presentation/routes/world/UserMinigameAttemptRoutes');
const UserQuizAttemptRoutes = require('./presentation/routes/world/UserQuizAttemptRoutes');
const AssessmentRoutes = require('./presentation/routes/adaptive/AssessmentRoutes');
const AdaptiveLearningRoutes = require('./presentation/routes/adaptive/AdaptiveLearningRoutes');
const MasteryProgressionRoutes = require('./presentation/routes/adaptive/MasteryProgressionRoutes'); // NEW

// Import services registry
const servicesRegistry = require('./application/services');

// Initialize repositories
const userRepository = new UserRepository(supabase);
const xpRepository = new XPRepository(supabase);

// Castle/Chapter/Adaptive Learning Repositories
const castleRepository = new CastleRepository(supabase);
const chapterQuizRepository = new ChapterQuizRepository(supabase);
const chapterRepository = new ChapterRepository(supabase);
const minigameRepository = new MinigameRepository(supabase);
const userCastleProgressRepository = new UserCastleProgressRepository(supabase);
const userChapterProgressRepository = new UserChapterProgressRepository(supabase);
const userMinigameAttemptRepository = new UserMinigameAttemptRepository(supabase);
const userQuizAttemptRepository = new UserQuizAttemptRepository(supabase);
const assessmentRepository = new AssessmentRepository(supabase);
const adaptiveLearningRepository = new AdaptiveLearningRepository(supabase);

// Initialize services
const authService = new AuthService(userRepository, supabase);
const userService = new UserService(userRepository);
const xpService = new XPService(xpRepository);

// Castle/Chapter/Adaptive Learning Services
const chapterSeeder = new ChapterSeeder(chapterRepository);
const quizAndMinigameSeeder = new QuizAndMinigameSeeder(chapterQuizRepository, minigameRepository);
const castleService = new CastleService(castleRepository, userCastleProgressRepository, chapterRepository, userChapterProgressRepository, chapterSeeder, quizAndMinigameSeeder);
const chapterQuizService = new ChapterQuizService(chapterQuizRepository);
const chapterService = new ChapterService(chapterRepository, chapterQuizService);
const minigameService = new MinigameService(minigameRepository);
const userCastleProgressService = new UserCastleProgressService(userCastleProgressRepository, castleService);
const userChapterProgressService = new UserChapterProgressService(userChapterProgressRepository, chapterRepository, userCastleProgressRepository, userMinigameAttemptRepository, userQuizAttemptRepository);
const userMinigameAttemptService = new UserMinigameAttemptService(userMinigameAttemptRepository, minigameService, xpService);
const userQuizAttemptService = new UserQuizAttemptService(userQuizAttemptRepository, chapterQuizService, xpService);
const assessmentService = new AssessmentService(assessmentRepository, userCastleProgressRepository, chapterRepository, userChapterProgressRepository);
const adaptiveLearningService = new AdaptiveLearningService(adaptiveLearningRepository);
// NEW: Mastery progression service (feeds WorldMap without modifying it)
const masteryProgressionService = new MasteryProgressionService(adaptiveLearningRepository, userChapterProgressRepository, chapterRepository);

// Register all services in the registry
servicesRegistry.registerServices({
    authService,
    userService,
    xpService,
    castleService,
    chapterQuizService,
    chapterService,
    minigameService,
    userCastleProgressService,
    userChapterProgressService,
    userMinigameAttemptService,
    userQuizAttemptService,
    assessmentService,
    adaptiveLearningService,
    masteryProgressionService // NEW: Mastery progression service
});

// Initialize middleware
const authMiddleware = new AuthMiddleware(authService);

// Initialize controllers
const authController = new AuthController(authService, adaptiveLearningRepository);
const userController = new UserController(userService);

// Castle/Chapter/Adaptive Learning Controllers
const castleController = new CastleController(castleService);
const chapterQuizController = new ChapterQuizController(chapterQuizService);
const chapterController = new ChapterController(chapterService);
const minigameController = new MinigameController(minigameService);
const userCastleProgressController = new UserCastleProgressController(userCastleProgressService);
const userChapterProgressController = new UserChapterProgressController(userChapterProgressService);
const userMinigameAttemptController = new UserMinigameAttemptController(userMinigameAttemptService);
const userQuizAttemptController = new UserQuizAttemptController(userQuizAttemptService);
const assessmentController = new AssessmentController(assessmentService);
const adaptiveLearningController = new AdaptiveLearningController(adaptiveLearningService);
const masteryProgressionController = new MasteryProgressionController(masteryProgressionService); // NEW

// Initialize routes
const authRoutes = new AuthRoutes(authController);
const userRoutes = new UserRoutes(userController, authMiddleware);

// Castle/Chapter/Adaptive Learning Routes
const castleRoutes = new CastleRoutes(castleController, authMiddleware);
const chapterQuizRoutes = new ChapterQuizRoutes(chapterQuizController, authMiddleware);
const chapterRoutes = new ChapterRoutes(chapterController, authMiddleware);
const minigameRoutes = new MinigameRoutes(minigameController, authMiddleware);
const userCastleProgressRoutes = new UserCastleProgressRoutes(userCastleProgressController, authMiddleware);
const userChapterProgressRoutes = new UserChapterProgressRoutes(userChapterProgressController, authMiddleware);
const userMinigameAttemptRoutes = new UserMinigameAttemptRoutes(userMinigameAttemptController, authMiddleware);
const userQuizAttemptRoutes = new UserQuizAttemptRoutes(userQuizAttemptController, authMiddleware);
const assessmentRoutes = new AssessmentRoutes(assessmentController, authMiddleware);
const adaptiveLearningRoutes = new AdaptiveLearningRoutes(adaptiveLearningController, authMiddleware);
const masteryProgressionRoutes = new MasteryProgressionRoutes(masteryProgressionController, authMiddleware); // NEW

module.exports = {
  authRoutes: authRoutes.getRouter(),
  userRoutes: userRoutes.getRouter(),
  castleRoutes: castleRoutes.getRouter(),
  chapterQuizRoutes: chapterQuizRoutes.getRouter(),
  chapterRoutes: chapterRoutes.getRouter(),
  minigameRoutes: minigameRoutes.getRouter(),
  userCastleProgressRoutes: userCastleProgressRoutes.getRouter(),
  userChapterProgressRoutes: userChapterProgressRoutes.getRouter(),
  userMinigameAttemptRoutes: userMinigameAttemptRoutes.getRouter(),
  userQuizAttemptRoutes: userQuizAttemptRoutes.getRouter(),
  assessmentRoutes: assessmentRoutes.getRouter(),
  adaptiveLearningRoutes: adaptiveLearningRoutes.getRouter(),
  masteryProgressionRoutes: masteryProgressionRoutes.getRouter(), // NEW

  // services (for testing or other uses)
  services: servicesRegistry.getServices()
}