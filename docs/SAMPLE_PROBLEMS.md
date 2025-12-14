# Sample Problems for Grading System

These 5 problems are designed to test the new grading features with various problem types, shape constraints, and difficulty levels.

---

## Problem 1: Rectangle Area (Easy)
**Title:** "Create a Small Garden Plot"

**Prompt:** 
"Create a rectangular garden plot with a width of 8 units and a height of 5 units. Calculate the area of your garden."

**Difficulty:** Easy

**Problem Type:** `area_rectangle`

**Shape Constraint:** `rectangle`

**Grading Rules:**
- Property to Check: `area`
- Tolerance: `0.5`
- Expected Value: `40` (8 × 5 = 40)
- Check Shape: `true` (must be a valid rectangle)

**Visibility:** `show` (visible to students)

**Timer:** 3 minutes

**Limit Attempts:** 3

**Hint:** "Remember, Area = Width × Height. Make sure your rectangle has the correct dimensions!"

**XP:** 10

**Why this works:**
- Simple rectangle with whole numbers
- Expected area is 40 square units
- Easy to verify visually
- Tests basic area calculation

---

## Problem 2: Square Perimeter (Easy)
**Title:** "Fence Around a Square Field"

**Prompt:**
"A farmer needs to fence a square field. Each side of the field is 6 units long. Draw the square field and calculate the total perimeter (length of fence needed)."

**Difficulty:** Easy

**Problem Type:** `perimeter_square`

**Shape Constraint:** `square`

**Grading Rules:**
- Property to Check: `perimeter`
- Tolerance: `0.5`
- Expected Value: `24` (4 × 6 = 24)
- Check Shape: `true` (must be a valid square)

**Visibility:** `show`

**Timer:** 3 minutes

**Limit Attempts:** 3

**Hint:** "A square has 4 equal sides. Perimeter = 4 × side length."

**XP:** 10

**Why this works:**
- Simple square with whole number sides
- Expected perimeter is 24 units
- Tests understanding of perimeter
- Validates that all sides are equal

---

## Problem 3: Triangle Area (Intermediate)
**Title:** "Triangular Sail Design"

**Prompt:**
"Design a triangular sail with a base of 10 units and a height of 7 units. Calculate the area of the sail."

**Difficulty:** Intermediate

**Problem Type:** `area_triangle`

**Shape Constraint:** `triangle`

**Grading Rules:**
- Property to Check: `area`
- Tolerance: `1.0`
- Expected Value: `35` (½ × 10 × 7 = 35)
- Check Shape: `true` (must be a valid triangle)

**Visibility:** `show`

**Timer:** 5 minutes

**Limit Attempts:** 2

**Hint:** "For a triangle: Area = ½ × base × height. The height is perpendicular to the base!"

**XP:** 20

**Why this works:**
- Tests triangle area formula
- Slightly larger tolerance (1.0) for triangle placement
- Expected area is 35 square units
- Validates it's a proper triangle

---

## Problem 4: Complementary Angles (Intermediate)
**Title:** "Corner Angles"

**Prompt:**
"Two angles are complementary (they add up to 90°). Draw one angle that measures 35 degrees. What is the measure of the complementary angle?"

**Difficulty:** Intermediate

**Problem Type:** `angle_complementary`

**Shape Constraint:** `angle`

**Grading Rules:**
- Property to Check: `angle`
- Tolerance: `2.0`
- Expected Value: `35` (the angle they draw should be 35°)
- Check Shape: `true` (must be a valid angle)

**Visibility:** `show`

**Timer:** 4 minutes

**Limit Attempts:** 3

**Hint:** "Complementary angles add up to 90°. If one angle is 35°, what's the other? Draw the 35° angle."

**XP:** 20

**Why this works:**
- Tests angle understanding
- Students should draw a 35° angle
- The complement would be 55° (they calculate mentally)
- Tolerance of 2° for angle drawing imprecision

---

## Problem 5: Rectangle with Specific Dimensions (Hard)
**Title:** "Design a Basketball Court"

**Prompt:**
"A basketball half-court needs to be 15 units wide and 14 units in height. Draw the court and calculate its area and perimeter."

**Difficulty:** Hard

**Problem Type:** `area_rectangle`

**Shape Constraint:** `rectangle`

**Grading Rules:**
- Property to Check: `area`
- Tolerance: `2.0`
- Expected Value: `210` (15 × 14 = 210)
- Check Shape: `true` (must be a valid rectangle)

**Visibility:** `show`

**Timer:** 6 minutes

**Limit Attempts:** 2

**Hint:** "Area = Width × Height. Perimeter = 2(Width + Height). Make sure your rectangle has the exact dimensions!"

**XP:** 30

**Why this works:**
- Larger numbers make it harder
- Tests precision in drawing
- Area = 210, Perimeter = 58
- Students need to be more careful with dimensions

---

## Additional Problem Ideas (Bonus)

### Problem 6: Circle Perimeter (Intermediate)
**Title:** "Circular Track"
**Prompt:** "Draw a circular running track with a radius of 5 units. Calculate the circumference (perimeter)."
- Problem Type: `perimeter_circle`
- Expected Value: `31.42` (2πr = 2 × 3.14159 × 5 ≈ 31.42)
- Tolerance: `1.0`

### Problem 7: Pythagorean Theorem (Hard)
**Title:** "Right Triangle Ladder"
**Prompt:** "A ladder forms a right triangle against a wall. The base is 3 units from the wall, and the ladder reaches 4 units up the wall. Draw this triangle."
- Problem Type: `pythagorean_theorem`
- Expected Value: `5` (hypotenuse: √(3² + 4²) = 5)
- Tolerance: `0.5`

---

## How to Create These in the System

1. **Navigate to your room** and click "Create Problem"
2. **Enter the problem title** in the title field
3. **Enter the prompt** in the prompt box
4. **Select difficulty** from the dropdown (Easy/Intermediate/Hard)
5. **Click "Grading Settings"** toggle button
6. **Configure grading:**
   - Select Problem Type from dropdown
   - Select Shape Constraint
   - Set Property to Check (or leave auto-detect)
   - Set Tolerance (error margin)
   - Enter Expected Value
   - Check "Validate Shape Properties" if needed
7. **Set controls:**
   - Limit Attempts
   - Timer
   - Hint (optional)
   - Visibility (show/hide)
8. **Draw the expected solution** on the canvas (optional reference)
9. **Click "Save Problem"**

---

## Testing Notes

- The shape limit is **5 shapes maximum**
- Measurements display with **2 decimal places** (e.g., 12.34 units)
- The grading engine validates:
  - Shape type matches constraint
  - Calculated property (area/perimeter/angle) is within tolerance
  - Expected value matches (if provided)

---

## Tips for Creating More Problems

1. **Use whole numbers** for Easy difficulty
2. **Use decimals** for Intermediate/Hard
3. **Set appropriate tolerances:**
   - 0.5 for precise shapes (squares, rectangles)
   - 1.0-2.0 for triangles and angles
   - 2.0-5.0 for circles (due to π approximations)
4. **Always enable "Check Shape"** if you want to enforce specific shapes
5. **Provide helpful hints** that guide without giving away answers
6. **Test the problem yourself** by attempting it as a student

---

Good luck with your geometry problems! 🎓📐
