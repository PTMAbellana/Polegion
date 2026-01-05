const supabase = require('./config/supabase')

// Import repositories
const UserRepository = require('./infrastructure/repository/UserRepo');
const XPRepository = require('./infrastructure/repository/XPRepo');

// Castle/Chapter/Adaptive Learning Repositories
const CastleRepository = require('./infrastructure/repository/CastleRepo');
const ChapterQuizRepository = require('./infrastructure/repository/ChapterQuizRepo');
const ChapterRepository = require('./infrastructure/repository/ChapterRepo');
const MinigameRepository = require('./infrastructure/repository/MinigameRepo');
const UserCastleProgressRepository = require('./infrastructure/repository/UserCastleProgressRepo');
const UserChapterProgressRepository = require('./infrastructure/repository/UserChapterProgressRepo');
const UserMinigameAttemptRepository = require('./infrastructure/repository/UserMinigameAttemptRepo');
const UserQuizAttemptRepository = require('./infrastructure/repository/UserQuizAttemptRepo');
const AssessmentRepository = require('./infrastructure/repository/AssessmentRepo');
const AdaptiveLearningRepository = require('./infrastructure/repository/AdaptiveLearningRepo');


// Import services
const AuthService = require('./application/services/AuthService');
const UserService = require('./application/services/UserService');
const XPService = require('./application/services/XPService');

// Castle/Chapter/Adaptive Learning Services
const CastleService = require('./application/services/CastleService');
const ChapterQuizService = require('./application/services/ChapterQuizService');
const ChapterService = require('./application/services/ChapterService');
const MinigameService = require('./application/services/MinigameService');
const UserCastleProgressService = require('./application/services/UserCastleProgressService');
const UserChapterProgressService = require('./application/services/UserChapterProgressService');
const UserMinigameAttemptService = require('./application/services/UserMinigameAttemptService');
const UserQuizAttemptService = require('./application/services/UserQuizAttemptService');
const ChapterSeeder = require('./application/services/ChapterSeeder');
const QuizAndMinigameSeeder = require('./application/services/QuizAndMinigameSeeder');
const AssessmentService = require('./application/services/AssessmentService');
const AdaptiveLearningService = require('./application/services/AdaptiveLearningService');
const MasteryProgressionService = require('./application/services/MasteryProgressionService'); // NEW: Mastery-based unlocking

// Import controllers
const AuthController = require('./presentation/controllers/AuthController');
const UserController = require('./presentation/controllers/UserController');

// Castle/Chapter/Adaptive Learning Controllers
const CastleController = require('./presentation/controllers/CastleController');
const ChapterQuizController = require('./presentation/controllers/ChapterQuizController');
const ChapterController = require('./presentation/controllers/ChapterController');
const MinigameController = require('./presentation/controllers/MinigameController');
const UserCastleProgressController = require('./presentation/controllers/UserCastleProgressController');
const UserChapterProgressController = require('./presentation/controllers/UserChapterProgressController');
const UserMinigameAttemptController = require('./presentation/controllers/UserMinigameAttemptController');
const UserQuizAttemptController = require('./presentation/controllers/UserQuizAttemptController');
const AssessmentController = require('./presentation/controllers/AssessmentController');
const AdaptiveLearningController = require('./presentation/controllers/AdaptiveLearningController');
const MasteryProgressionController = require('./presentation/controllers/MasteryProgressionController'); // NEW

// Import middleware
const AuthMiddleware = require('./presentation/middleware/AuthMiddleware');

// Import routes
const AuthRoutes = require('./presentation/routes/AuthRoutes');
const UserRoutes = require('./presentation/routes/UserRoutes');

// Castle/Chapter/Adaptive Learning Routes
const CastleRoutes = require('./presentation/routes/CastleRoutes');
const ChapterQuizRoutes = require('./presentation/routes/ChapterQuizRoutes');
const ChapterRoutes = require('./presentation/routes/ChapterRoutes');
const MinigameRoutes = require('./presentation/routes/MinigameRoutes');
const UserCastleProgressRoutes = require('./presentation/routes/UserCastleProgressRoutes');
const UserChapterProgressRoutes = require('./presentation/routes/UserChapterProgressRoutes');
const UserMinigameAttemptRoutes = require('./presentation/routes/UserMinigameAttemptRoutes');
const UserQuizAttemptRoutes = require('./presentation/routes/UserQuizAttemptRoutes');
const AssessmentRoutes = require('./presentation/routes/AssessmentRoutes');
const AdaptiveLearningRoutes = require('./presentation/routes/AdaptiveLearningRoutes');
const MasteryProgressionRoutes = require('./presentation/routes/MasteryProgressionRoutes'); // NEW

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