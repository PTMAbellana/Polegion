# Geometry Questions - Organized Structure

## 📁 Overview

This directory contains all geometry assessment questions organized into **topics** with a **parent class structure** for better maintainability and readability.

## 🏗️ Architecture

```
questions/
├── base_geometry_questions.sql    # Parent class/template
├── index.sql                      # Main entry point
├── topics/                        # Topic-specific questions
│   ├── 01_points_lines_planes.sql
│   ├── 02_angles.sql
│   ├── 03_polygons.sql
│   ├── 04_triangles.sql
│   ├── 05_circles.sql
│   └── 06_3d_shapes.sql
└── README.md                      # This file
```

## 📚 Topics Covered

### 1. **Points, Lines, and Planes** (`01_points_lines_planes.sql`)
Foundation of geometry covering:
- Points (location with no size)
- Lines (infinite straight paths)
- Line segments (parts with endpoints)
- Rays (lines with one endpoint)
- Planes (flat surfaces)

### 2. **Angles** (`02_angles.sql`)
Angle measurement and types:
- Angle definition and vertex
- Measuring angles (degrees)
- Types: acute, right, obtuse, straight, reflex
- Relationships: complementary, supplementary, vertical

### 3. **Polygons** (`03_polygons.sql`)
2D closed shapes:
- Triangle types and properties
- Quadrilaterals (square, rectangle, parallelogram)
- Other polygons (pentagon, hexagon, etc.)
- Regular vs irregular polygons
- Perimeter and area

### 4. **Triangles** (`04_triangles.sql`)
Special triangle properties:
- Classification by sides (equilateral, isosceles, scalene)
- Classification by angles (acute, right, obtuse)
- Pythagorean theorem
- Triangle inequality
- Sum of angles

### 5. **Circles** (`05_circles.sql`)
Curved shapes and properties:
- Parts: center, radius, diameter
- Chord, arc, sector, segment
- Tangent and secant
- Circumference (2πr) and area (πr²)

### 6. **3D Shapes** (`06_3d_shapes.sql`)
Solid figures:
- Polyhedra (prisms, pyramids)
- Curved solids (cylinder, cone, sphere)
- Faces, edges, vertices
- Surface area and volume

## 🎯 Question Categories

Each topic contains questions across 6 cognitive domains:

1. **Knowledge Recall (kr)** - Remember and recall facts
2. **Concept Understanding (cu)** - Understand concepts
3. **Procedural Skills (ps)** - Apply procedures
4. **Analytical Thinking (at)** - Analyze relationships
5. **Problem Solving (pb)** - Solve problems
6. **Higher Order (ho)** - Creative thinking

## 📋 Naming Convention

Question IDs follow this format:
```
{category}_{test_type}_{number}
```

Examples:
- `kr_pre_01` - Knowledge Recall, Pretest, Question 1
- `cu_post_15` - Concept Understanding, Posttest, Question 15
- `ps_pre_07` - Procedural Skills, Pretest, Question 7

### Category Abbreviations:
- `kr` = Knowledge Recall
- `cu` = Concept Understanding
- `ps` = Procedural Skills
- `at` = Analytical Thinking
- `pb` = Problem Solving
- `ho` = Higher Order

## 🚀 Usage

### Loading All Questions

To load all geometry questions into your database:

```bash
psql -U your_user -d your_database -f questions/index.sql
```

Or from Supabase SQL Editor:
1. Open the SQL Editor
2. Copy the contents of `index.sql`
3. Run the script

### Loading Specific Topics

To load only specific topics:

```bash
psql -U your_user -d your_database -f questions/base_geometry_questions.sql
psql -U your_user -d your_database -f questions/topics/03_polygons.sql
```

## ➕ Adding New Questions

### Method 1: Using the Helper Function

```sql
SELECT insert_geometry_question(
    'kr_pre_30',                                    -- question_id
    'Knowledge Recall',                              -- category
    'What is the sum of angles in a hexagon?',      -- question
    '["540°","720°","900°","1080°"]'::jsonb,        -- options (4 choices)
    '720°',                                          -- correct_answer
    'medium',                                        -- difficulty (easy/medium/hard)
    'pretest',                                       -- test_type (pretest/posttest)
    1                                                -- points
);
```

### Method 2: Direct Insert (Legacy)

```sql
INSERT INTO assessment_questions (
    question_id, category, question, options, 
    correct_answer, difficulty, test_type, points
)
VALUES (
    'kr_pre_30',
    'Knowledge Recall',
    'What is the sum of angles in a hexagon?',
    '["540°","720°","900°","1080°"]'::jsonb,
    '720°',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;
```

## 📊 Parent Class Features

The `base_geometry_questions.sql` file provides:

### 1. **Helper Function** - `insert_geometry_question()`
Simplifies adding new questions with automatic conflict handling.

### 2. **Validation Function** - `validate_question_structure()`
Validates:
- Question ID format
- Options count (must be exactly 4)
- Naming conventions

### 3. **Documentation**
- Complete topic organization
- Naming conventions
- Usage examples

## ✅ Best Practices

1. **One Topic Per File** - Keep related questions together
2. **Consistent Naming** - Follow the naming convention
3. **4 Options Always** - Each question must have exactly 4 choices
4. **Clear Questions** - Write unambiguous questions
5. **Appropriate Difficulty** - Match difficulty to question complexity
6. **Balanced Distribution** - Cover all cognitive domains

## 🔧 Maintenance

### Updating Questions
1. Locate the appropriate topic file
2. Find the question by ID
3. Modify the question text or options
4. Re-run the topic file or main index

### Adding New Topics
1. Create new file in `topics/` directory
2. Follow naming convention: `##_topic_name.sql`
3. Include all 6 cognitive domain categories
4. Add to `index.sql`

### Removing Questions
Questions are never truly removed - instead:
1. Mark as deprecated in comments
2. Or exclude from active test pools via application logic

## 📈 Statistics

After loading, you can query statistics:

```sql
-- Total questions
SELECT COUNT(*) FROM assessment_questions;

-- By category
SELECT category, COUNT(*) 
FROM assessment_questions 
GROUP BY category;

-- By difficulty
SELECT difficulty, COUNT(*) 
FROM assessment_questions 
GROUP BY difficulty;

-- By test type
SELECT test_type, COUNT(*) 
FROM assessment_questions 
GROUP BY test_type;
```

## 🎓 Educational Standards

Questions align with:
- Grade 7 Mathematics Curriculum
- K-12 Geometry Standards
- Bloom's Taxonomy (cognitive domains)
- Common Core State Standards (where applicable)

## 📝 Notes

- Questions are reusable across pretests and posttests
- Each topic can be expanded independently
- The modular structure allows for easy A/B testing
- Questions support parametric generation (future enhancement)

## 🔗 Related Files

- Original monolithic file: `../INSERT_ASSESSMENT_QUESTIONS.sql`
- Schema definitions: `../CREATE_ASSESSMENT_TABLES.sql`
- Adaptive learning: `../COMPLETE_ADAPTIVE_SCHEMA.sql`

---

**Last Updated:** January 3, 2026  
**Maintainer:** Polegion Team  
**Questions Count:** ~150+ questions across 6 topics
