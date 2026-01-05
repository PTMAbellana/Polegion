# 🎯 Quick Reference - Geometry Questions Structure

## 📁 New File Organization

```
docs/sql/questions/
├── base_geometry_questions.sql (5.5 KB)  ← Parent class with utilities
├── index.sql (4 KB)                      ← Main entry point
├── README.md (7.4 KB)                    ← Complete documentation
├── STRUCTURE_DIAGRAM.txt (9.4 KB)        ← Visual reference
└── topics/
    ├── 01_points_lines_planes.sql (6.8 KB)
    ├── 02_angles.sql (6.6 KB)
    ├── 03_polygons.sql (6.8 KB)
    ├── 04_triangles.sql (7.2 KB)
    ├── 05_circles.sql (7.5 KB)
    └── 06_3d_shapes.sql (7.4 KB)
```

**Total:** 11 files, ~68 KB (vs original 118 KB monolithic file)

## 🚀 Quick Commands

### Load All Questions
```bash
psql -d your_database -f docs/sql/questions/index.sql
```

### Load Specific Topic
```bash
# Load base first (required)
psql -d your_database -f docs/sql/questions/base_geometry_questions.sql

# Then load topic
psql -d your_database -f docs/sql/questions/topics/03_polygons.sql
```

## 📝 Add New Question

```sql
SELECT insert_geometry_question(
    'kr_pre_99',              -- ID: {category}_{test}_{number}
    'Knowledge Recall',       -- Category name
    'Your question here?',    -- Question text
    '["A","B","C","D"]'::jsonb, -- 4 options
    'B',                      -- Correct answer
    'medium',                 -- easy|medium|hard
    'pretest',                -- pretest|posttest
    1                         -- Points (usually 1)
);
```

## 🏷️ Question ID Format

```
{category}_{test_type}_{number}
    ↓         ↓          ↓
   kr      pre/post    01-99

Example: kr_pre_15
         ↓    ↓   ↓
    Knowledge Recall, Pretest, Question 15
```

### Category Codes:
- `kr` = Knowledge Recall
- `cu` = Concept Understanding
- `ps` = Procedural Skills
- `at` = Analytical Thinking
- `pb` = Problem Solving
- `ho` = Higher Order

## 📚 Topics

| # | File | Concept | ~Questions |
|---|------|---------|-----------|
| 1 | 01_points_lines_planes.sql | Foundation | 30 |
| 2 | 02_angles.sql | Measurement | 30 |
| 3 | 03_polygons.sql | 2D Shapes | 30 |
| 4 | 04_triangles.sql | Special Props | 30 |
| 5 | 05_circles.sql | Curved Shapes | 30 |
| 6 | 06_3d_shapes.sql | Solid Figures | 30 |

## 🔍 Finding Questions

1. **By Topic:** Open the relevant topic file
2. **By ID:** Search across files for the question_id
3. **By Category:** Questions grouped by cognitive domain in each file

## ✅ Benefits

- ✅ **Organized:** By geometry topics
- ✅ **Maintainable:** Each file ~200-400 lines
- ✅ **Modular:** Update topics independently
- ✅ **Scalable:** Easy to add new topics
- ✅ **Documented:** Complete README and examples
- ✅ **Validated:** Built-in validation functions

## 📖 Documentation

- **Full Guide:** [README.md](questions/README.md)
- **Visual Diagram:** [STRUCTURE_DIAGRAM.txt](questions/STRUCTURE_DIAGRAM.txt)
- **Reorganization Summary:** [../GEOMETRY_QUESTIONS_REORGANIZATION.md](../GEOMETRY_QUESTIONS_REORGANIZATION.md)

## 🔄 Migration

- **Old File:** `docs/sql/INSERT_ASSESSMENT_QUESTIONS.sql` (preserved)
- **New Structure:** `docs/sql/questions/` (modular)
- **No Data Loss:** All questions preserved
- **Backward Compatible:** Database schema unchanged

---

**Last Updated:** January 3, 2026  
**Structure Version:** 1.0  
**Total Files:** 11 (1 base + 1 index + 6 topics + 3 docs)
