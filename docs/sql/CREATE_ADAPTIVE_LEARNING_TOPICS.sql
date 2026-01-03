-- =============================================
-- ADAPTIVE LEARNING TOPICS SCHEMA
-- Separate from worldmap chapters
-- =============================================

-- Drop existing if recreating
DROP TABLE IF EXISTS adaptive_learning_state CASCADE;
DROP TABLE IF EXISTS adaptive_state_transitions CASCADE;
DROP TABLE IF EXISTS adaptive_learning_topics CASCADE;

-- =============================================
-- 1. ADAPTIVE LEARNING TOPICS
-- Clear, descriptive topics for Q-Learning research
-- =============================================
CREATE TABLE adaptive_learning_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_code VARCHAR(50) UNIQUE NOT NULL,
  topic_name VARCHAR(255) NOT NULL,
  description TEXT,
  cognitive_domain VARCHAR(50) NOT NULL,
  -- Cognitive domains: 'knowledge_recall', 'concept_understanding', 'procedural_skills', 
  --                    'analytical_thinking', 'problem_solving', 'higher_order_thinking'
  difficulty_range VARCHAR(20) DEFAULT '1-5',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_adaptive_topics_active ON adaptive_learning_topics(is_active);
CREATE INDEX idx_adaptive_topics_domain ON adaptive_learning_topics(cognitive_domain);

-- =============================================
-- 2. ADAPTIVE LEARNING STATE (Per Student Per Topic)
-- Tracks Q-Learning state for each student on each topic
-- =============================================
CREATE TABLE adaptive_learning_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES adaptive_learning_topics(id) ON DELETE CASCADE,
  
  -- Current state
  difficulty_level INTEGER DEFAULT 3 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  mastery_level DECIMAL(5,2) DEFAULT 0.00 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  
  -- Performance tracking
  correct_streak INTEGER DEFAULT 0,
  wrong_streak INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  
  -- Q-Learning metadata
  last_action VARCHAR(100),
  exploration_count INTEGER DEFAULT 0,
  exploitation_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_attempt_at TIMESTAMP,
  
  -- Unique constraint: one state per user per topic
  UNIQUE(user_id, topic_id)
);

-- Indexes for performance
CREATE INDEX idx_adaptive_state_user ON adaptive_learning_state(user_id);
CREATE INDEX idx_adaptive_state_topic ON adaptive_learning_state(topic_id);
CREATE INDEX idx_adaptive_state_user_topic ON adaptive_learning_state(user_id, topic_id);

-- =============================================
-- 3. ADAPTIVE STATE TRANSITIONS (Research Logging)
-- Logs every Q-Learning decision for analysis
-- =============================================
CREATE TABLE adaptive_state_transitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES adaptive_learning_topics(id) ON DELETE CASCADE,
  
  -- State information
  prev_difficulty INTEGER,
  new_difficulty INTEGER,
  prev_mastery DECIMAL(5,2),
  new_mastery DECIMAL(5,2),
  
  -- Q-Learning action
  action VARCHAR(100) NOT NULL,
  action_reason TEXT,
  
  -- Question details
  question_id UUID,
  was_correct BOOLEAN,
  time_spent INTEGER, -- in seconds
  
  -- Q-Learning metrics
  reward DECIMAL(10,2),
  q_value DECIMAL(10,2),
  used_exploration BOOLEAN DEFAULT false,
  epsilon DECIMAL(5,4),
  
  -- Session tracking
  session_id VARCHAR(100),
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for research queries
CREATE INDEX idx_transitions_user ON adaptive_state_transitions(user_id);
CREATE INDEX idx_transitions_topic ON adaptive_state_transitions(topic_id);
CREATE INDEX idx_transitions_session ON adaptive_state_transitions(session_id);
CREATE INDEX idx_transitions_created ON adaptive_state_transitions(created_at DESC);

-- =============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE adaptive_learning_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_learning_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_state_transitions ENABLE ROW LEVEL SECURITY;

-- Topics: Public read access
CREATE POLICY "Topics are viewable by everyone"
  ON adaptive_learning_topics FOR SELECT
  USING (is_active = true);

-- State: Users can only see/modify their own state
CREATE POLICY "Users can view their own adaptive state"
  ON adaptive_learning_state FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own adaptive state"
  ON adaptive_learning_state FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own adaptive state"
  ON adaptive_learning_state FOR UPDATE
  USING (auth.uid() = user_id);

-- Transitions: Users can view their own, insert logged by backend
CREATE POLICY "Users can view their own transitions"
  ON adaptive_state_transitions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transitions"
  ON adaptive_state_transitions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role bypass (for backend operations)
CREATE POLICY "Service role has full access to topics"
  ON adaptive_learning_topics FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to state"
  ON adaptive_learning_state FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to transitions"
  ON adaptive_state_transitions FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- 5. SEED DATA: GEOMETRY TOPICS
-- Clear, descriptive topics for students
-- =============================================

INSERT INTO adaptive_learning_topics (topic_code, topic_name, description, cognitive_domain) VALUES
-- Knowledge Recall Level
('GEO_POINTS', 'Points, Lines, and Line Segments', 'Learn the fundamental building blocks of geometry: points, lines, rays, and line segments.', 'knowledge_recall'),
('GEO_ANGLES_BASIC', 'Angle Types and Measurement', 'Identify and measure acute, right, obtuse, straight, and reflex angles.', 'knowledge_recall'),
('GEO_SHAPES_2D', '2D Shapes and Polygons', 'Recognize and classify triangles, quadrilaterals, and other polygons.', 'knowledge_recall'),

-- Concept Understanding Level
('GEO_ANGLE_PAIRS', 'Angle Relationships', 'Understand vertical angles, linear pairs, complementary and supplementary angles.', 'concept_understanding'),
('GEO_PARALLEL_LINES', 'Parallel and Perpendicular Lines', 'Explore relationships between parallel lines cut by a transversal.', 'concept_understanding'),
('GEO_CIRCLE_PARTS', 'Parts of a Circle', 'Understand radius, diameter, chord, arc, sector, and circumference.', 'concept_understanding'),

-- Procedural Skills Level
('GEO_PERIMETER', 'Perimeter Calculations', 'Calculate perimeters of rectangles, squares, triangles, and irregular polygons.', 'procedural_skills'),
('GEO_AREA_2D', 'Area of 2D Shapes', 'Compute areas of rectangles, triangles, parallelograms, trapezoids, and circles.', 'procedural_skills'),
('GEO_CIRCUMFERENCE', 'Circle Circumference', 'Calculate circumference using C = πd and C = 2πr formulas.', 'procedural_skills'),

-- Analytical Thinking Level
('GEO_POLYGON_ANGLES', 'Polygon Interior Angles', 'Apply the formula (n-2) × 180° to find angle sums in polygons.', 'analytical_thinking'),
('GEO_SURFACE_AREA', 'Surface Area of 3D Shapes', 'Calculate surface area of prisms, pyramids, cylinders, cones, and spheres.', 'analytical_thinking'),
('GEO_VOLUME', 'Volume of 3D Shapes', 'Determine volumes of cubes, prisms, pyramids, cylinders, cones, and spheres.', 'analytical_thinking'),

-- Problem Solving Level
('GEO_WORD_PROBLEMS', 'Geometry Word Problems', 'Solve real-world problems involving perimeter, area, and angle measurements.', 'problem_solving'),
('GEO_COMPOSITE_SHAPES', 'Composite Shape Calculations', 'Calculate area and perimeter of complex shapes made from simple polygons.', 'problem_solving'),

-- Higher Order Thinking Level
('GEO_PROOFS', 'Geometric Proofs and Reasoning', 'Construct logical arguments to prove geometric theorems and properties.', 'higher_order_thinking'),
('GEO_OPTIMIZATION', 'Optimization Problems', 'Apply geometry to maximize/minimize areas, volumes, and other measurements.', 'higher_order_thinking');

-- =============================================
-- 6. HELPFUL VIEWS FOR RESEARCH
-- =============================================

-- View: Student progress across all topics
CREATE OR REPLACE VIEW adaptive_student_progress AS
SELECT 
  u.id as user_id,
  u.email,
  t.topic_code,
  t.topic_name,
  t.cognitive_domain,
  s.difficulty_level,
  s.mastery_level,
  s.total_attempts,
  CASE 
    WHEN s.total_attempts > 0 THEN ROUND((s.correct_answers::DECIMAL / s.total_attempts * 100), 2)
    ELSE 0
  END as accuracy_percentage,
  s.last_attempt_at,
  s.updated_at
FROM auth.users u
LEFT JOIN adaptive_learning_state s ON u.id = s.user_id
LEFT JOIN adaptive_learning_topics t ON s.topic_id = t.id
WHERE t.is_active = true
ORDER BY u.email, t.cognitive_domain, t.topic_code;

-- View: Q-Learning performance metrics
CREATE OR REPLACE VIEW adaptive_qlearning_metrics AS
SELECT 
  topic_id,
  COUNT(*) as total_transitions,
  COUNT(DISTINCT user_id) as unique_students,
  AVG(reward) as avg_reward,
  SUM(CASE WHEN used_exploration THEN 1 ELSE 0 END) as exploration_count,
  SUM(CASE WHEN NOT used_exploration THEN 1 ELSE 0 END) as exploitation_count,
  AVG(time_spent) as avg_time_spent,
  SUM(CASE WHEN was_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(*) * 100 as overall_accuracy
FROM adaptive_state_transitions
GROUP BY topic_id;

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

COMMENT ON TABLE adaptive_learning_topics IS 'Separate topics for Q-Learning adaptive system (independent from worldmap chapters)';
COMMENT ON TABLE adaptive_learning_state IS 'Per-student state for Q-Learning algorithm (difficulty, mastery, streaks)';
COMMENT ON TABLE adaptive_state_transitions IS 'Research logging: every Q-Learning decision for ICETT paper analysis';
