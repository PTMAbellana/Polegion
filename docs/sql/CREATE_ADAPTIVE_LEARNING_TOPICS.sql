-- =============================================
-- ADAPTIVE LEARNING TOPICS SCHEMA
-- Separate from worldmap chapters
-- =============================================

-- Drop existing if recreating
DROP TABLE IF EXISTS adaptive_learning_state CASCADE;
DROP TABLE IF EXISTS adaptive_state_transitions CASCADE;
DROP TABLE IF EXISTS adaptive_topic_objectives CASCADE;
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
-- 2. ADAPTIVE TOPIC OBJECTIVES (Learning Objectives per Topic)
-- Detailed curriculum requirements
-- =============================================
CREATE TABLE adaptive_topic_objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES adaptive_learning_topics(id) ON DELETE CASCADE,
  objective_code VARCHAR(50) UNIQUE NOT NULL,
  objective_text TEXT NOT NULL,
  cognitive_domain VARCHAR(50) NOT NULL,
  -- Same domains as parent topic, can vary per objective
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_objectives_topic ON adaptive_topic_objectives(topic_id);
CREATE INDEX idx_objectives_domain ON adaptive_topic_objectives(cognitive_domain);

-- =============================================
-- 3. ADAPTIVE LEARNING STATE (Per Student Per Topic)
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
ALTER TABLE adaptive_topic_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_learning_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_state_transitions ENABLE ROW LEVEL SECURITY;

-- Topics: Public read access
CREATE POLICY "Topics are viewable by everyone"
  ON adaptive_learning_topics FOR SELECT
  USING (is_active = true);

-- Objectives: Public read access
CREATE POLICY "Objectives are viewable by everyone"
  ON adaptive_topic_objectives FOR SELECT
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

CREATE POLICY "Service role has full access to objectives"
  ON adaptive_topic_objectives FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to state"
  ON adaptive_learning_state FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to transitions"
  ON adaptive_state_transitions FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- 5. SEED DATA: GEOMETRY TOPICS (Curriculum-Aligned)
-- Matches required curriculum exactly
-- =============================================

INSERT INTO adaptive_learning_topics (topic_code, topic_name, description, cognitive_domain) VALUES
-- Topic 1: Basic Geometric Figures
('BASIC_FIGURES', 'Basic Geometric Figures', 'Identify, draw, and name different geometric figures including parallel, intersecting, perpendicular, and skew lines.', 'knowledge_recall'),

-- Topic 2: Kinds of Angles  
('KINDS_ANGLES', 'Kinds of Angles', 'Name, measure, identify, and construct different kinds of angles including congruent angles.', 'concept_understanding'),

-- Topic 3: Angle Relationships
('ANGLE_RELATIONSHIPS', 'Complementary and Supplementary Angles', 'Differentiate and solve problems involving complementary and supplementary angles.', 'procedural_skills'),

-- Topic 4: Parts of a Circle
('CIRCLE_PARTS', 'Parts of a Circle', 'Draw a circle and identify its parts (center, radius, diameter, chord, arc, sector).', 'knowledge_recall'),

-- Topic 5: Circumference and Area of Circle
('CIRCLE_MEASUREMENTS', 'Circumference and Area of a Circle', 'Calculate circumference and area of circles, solve related word problems.', 'procedural_skills'),

-- Topic 6: Polygons - Identification
('POLYGON_TYPES', 'Polygon Identification', 'Identify different polygons, recognize similar and congruent polygons, and draw polygons.', 'concept_understanding'),

-- Topic 7: Polygon Angles
('POLYGON_ANGLES', 'Interior Angles of Polygons', 'Calculate interior angles of polygons using formulas and solve word problems.', 'analytical_thinking'),

-- Topic 8: Perimeter and Area of Polygons
('POLYGON_MEASUREMENTS', 'Perimeter and Area of Polygons', 'Find perimeter and area of rectangle, square, triangle, parallelogram, and trapezoid; solve word problems.', 'procedural_skills'),

-- Topic 9: Plane and Space Figures
('PLANE_SPACE', 'Plane and 3D Figures', 'Identify and differentiate plane figures from solid figures; find surface area of solid figures.', 'concept_understanding'),

-- Topic 10: Volume of Space Figures
('VOLUME_SOLIDS', 'Volume of Space Figures', 'Calculate volume of prisms, pyramids, cylinders, cones, and spheres; solve word problems.', 'analytical_thinking'),

-- Topic 11: Advanced Word Problems
('WORD_PROBLEMS_ADV', 'Geometry Word Problems', 'Solve complex real-world problems involving multiple geometric concepts.', 'problem_solving'),

-- Topic 12: Geometric Reasoning
('GEO_REASONING', 'Geometric Proofs and Reasoning', 'Apply logical reasoning to prove geometric properties and solve challenging problems.', 'higher_order_thinking');

-- =============================================
-- 6. SEED DATA: LEARNING OBJECTIVES (Detailed Curriculum)
-- Each objective maps to specific curriculum requirements
-- =============================================

-- Topic 1: Basic Geometric Figures
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'BASIC_FIG_01', 'Identify different geometric figures', 'knowledge_recall', 1 FROM adaptive_learning_topics WHERE topic_code = 'BASIC_FIGURES';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'BASIC_FIG_02', 'Identify parallel, intersecting, perpendicular, and skew lines', 'knowledge_recall', 2 FROM adaptive_learning_topics WHERE topic_code = 'BASIC_FIGURES';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'BASIC_FIG_03', 'Draw and name different geometric figures', 'procedural_skills', 3 FROM adaptive_learning_topics WHERE topic_code = 'BASIC_FIGURES';

-- Topic 2: Kinds of Angles
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'ANGLES_01', 'Name and measure angles', 'knowledge_recall', 1 FROM adaptive_learning_topics WHERE topic_code = 'KINDS_ANGLES';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'ANGLES_02', 'Identify the kinds of angles (acute, right, obtuse, straight, reflex)', 'knowledge_recall', 2 FROM adaptive_learning_topics WHERE topic_code = 'KINDS_ANGLES';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'ANGLES_03', 'Construct angles', 'procedural_skills', 3 FROM adaptive_learning_topics WHERE topic_code = 'KINDS_ANGLES';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'ANGLES_04', 'Identify congruent angles', 'concept_understanding', 4 FROM adaptive_learning_topics WHERE topic_code = 'KINDS_ANGLES';

-- Topic 3: Angle Relationships
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'ANGLE_REL_01', 'Differentiate complementary from supplementary angles', 'concept_understanding', 1 FROM adaptive_learning_topics WHERE topic_code = 'ANGLE_RELATIONSHIPS';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'ANGLE_REL_02', 'Solve for the missing measure of an angle', 'procedural_skills', 2 FROM adaptive_learning_topics WHERE topic_code = 'ANGLE_RELATIONSHIPS';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'ANGLE_REL_03', 'Solve word problems involving missing angles', 'problem_solving', 3 FROM adaptive_learning_topics WHERE topic_code = 'ANGLE_RELATIONSHIPS';

-- Topic 4: Parts of a Circle
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'CIRCLE_01', 'Draw a circle and identify its parts', 'knowledge_recall', 1 FROM adaptive_learning_topics WHERE topic_code = 'CIRCLE_PARTS';

-- Topic 5: Circumference and Area of Circle
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'CIRCLE_MEAS_01', 'Find the circumference and area of a circle', 'procedural_skills', 1 FROM adaptive_learning_topics WHERE topic_code = 'CIRCLE_MEASUREMENTS';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'CIRCLE_MEAS_02', 'Solve word problems involving area and circumference of a circle', 'problem_solving', 2 FROM adaptive_learning_topics WHERE topic_code = 'CIRCLE_MEASUREMENTS';

-- Topic 6: Polygons - Identification
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'POLYGON_01', 'Identify different polygons', 'knowledge_recall', 1 FROM adaptive_learning_topics WHERE topic_code = 'POLYGON_TYPES';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'POLYGON_02', 'Identify similar and congruent polygons', 'concept_understanding', 2 FROM adaptive_learning_topics WHERE topic_code = 'POLYGON_TYPES';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'POLYGON_03', 'Draw polygons', 'procedural_skills', 3 FROM adaptive_learning_topics WHERE topic_code = 'POLYGON_TYPES';

-- Topic 7: Polygon Angles
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'POLY_ANG_01', 'Solve for the interior angles of polygons using formula (n-2)×180°', 'analytical_thinking', 1 FROM adaptive_learning_topics WHERE topic_code = 'POLYGON_ANGLES';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'POLY_ANG_02', 'Solve word problems involving interior angles of polygons', 'problem_solving', 2 FROM adaptive_learning_topics WHERE topic_code = 'POLYGON_ANGLES';

-- Topic 8: Perimeter and Area of Polygons
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'POLY_MEAS_01', 'Find the perimeter and area of rectangle, square, triangle, parallelogram, and trapezoid', 'procedural_skills', 1 FROM adaptive_learning_topics WHERE topic_code = 'POLYGON_MEASUREMENTS';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'POLY_MEAS_02', 'Solve word problems involving perimeter and area of polygons', 'problem_solving', 2 FROM adaptive_learning_topics WHERE topic_code = 'POLYGON_MEASUREMENTS';

-- Topic 9: Plane and Space Figures
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'SPACE_01', 'Identify plane and 3D figures or solid figures', 'knowledge_recall', 1 FROM adaptive_learning_topics WHERE topic_code = 'PLANE_SPACE';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'SPACE_02', 'Differentiate plane figures from solid figures', 'concept_understanding', 2 FROM adaptive_learning_topics WHERE topic_code = 'PLANE_SPACE';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'SPACE_03', 'Find the surface area of solid figures', 'analytical_thinking', 3 FROM adaptive_learning_topics WHERE topic_code = 'PLANE_SPACE';

-- Topic 10: Volume of Space Figures
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'VOLUME_01', 'Find the volume of prisms, pyramids, cylinders, cones, and spheres', 'analytical_thinking', 1 FROM adaptive_learning_topics WHERE topic_code = 'VOLUME_SOLIDS';
INSERT INTO adaptive_topic_objectives (topic_id, objective_code, objective_text, cognitive_domain, order_index) 
SELECT id, 'VOLUME_02', 'Solve word problems involving volume of space/solid figures', 'problem_solving', 2 FROM adaptive_learning_topics WHERE topic_code = 'VOLUME_SOLIDS';

-- =============================================
-- 7. HELPFUL VIEWS FOR RESEARCH
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
