# Problem Visualization for Parametric Questions

## 🎨 **How to Show Problem Images**

Since questions are generated with different numbers each time, we have **3 approaches**:

---

## ✅ **OPTION 1: Dynamic SVG Generation (RECOMMENDED)**

Generate diagram images on-the-fly using SVG based on parameters.

### **Example: Rectangle Problem**

```javascript
// QuestionGeneratorService.js
generateQuestionWithImage(difficultyLevel, chapterId) {
  const question = this.generateQuestion(difficultyLevel, chapterId);
  
  // Generate SVG diagram based on parameters
  question.image_svg = this.generateSVG(question.type, question.parameters);
  
  return question;
}

generateSVG(type, params) {
  if (type === 'rectangle_area') {
    const { width, height } = params;
    const scale = 20; // pixels per unit
    
    return `
      <svg width="${width * scale + 40}" height="${height * scale + 40}" 
           xmlns="http://www.w3.org/2000/svg">
        <!-- Rectangle -->
        <rect x="20" y="20" 
              width="${width * scale}" 
              height="${height * scale}" 
              fill="#E0F2FE" 
              stroke="#0EA5E9" 
              stroke-width="2"/>
        
        <!-- Width label -->
        <text x="${width * scale / 2 + 20}" 
              y="${height * scale + 35}" 
              text-anchor="middle" 
              font-size="14" 
              fill="#0369A1">
          ${width} units
        </text>
        
        <!-- Height label -->
        <text x="10" 
              y="${height * scale / 2 + 20}" 
              text-anchor="middle" 
              font-size="14" 
              fill="#0369A1" 
              transform="rotate(-90, 10, ${height * scale / 2 + 20})">
          ${height} units
        </text>
      </svg>
    `;
  }
  
  // Add other shapes...
  if (type === 'circle_area') {
    const { radius } = params;
    const scale = 20;
    const centerX = radius * scale + 20;
    const centerY = radius * scale + 20;
    
    return `
      <svg width="${radius * scale * 2 + 40}" 
           height="${radius * scale * 2 + 40}" 
           xmlns="http://www.w3.org/2000/svg">
        <!-- Circle -->
        <circle cx="${centerX}" 
                cy="${centerY}" 
                r="${radius * scale}" 
                fill="#FEF3C7" 
                stroke="#F59E0B" 
                stroke-width="2"/>
        
        <!-- Radius line -->
        <line x1="${centerX}" 
              y1="${centerY}" 
              x2="${centerX + radius * scale}" 
              y2="${centerY}" 
              stroke="#DC2626" 
              stroke-width="2" 
              stroke-dasharray="5,5"/>
        
        <!-- Radius label -->
        <text x="${centerX + radius * scale / 2}" 
              y="${centerY - 5}" 
              text-anchor="middle" 
              font-size="14" 
              fill="#DC2626">
          r = ${radius}
        </text>
      </svg>
    `;
  }
  
  return '';
}
```

### **Frontend Display**

```tsx
// AdaptiveLearningDemo.tsx
function QuestionDisplay({ question }) {
  return (
    <div className="question-container">
      <h3>{question.question_text}</h3>
      
      {/* Display SVG diagram */}
      {question.image_svg && (
        <div className="diagram-container my-4 flex justify-center">
          <div dangerouslySetInnerHTML={{ __html: question.image_svg }} />
        </div>
      )}
      
      <div className="hint text-gray-600 italic">
        💡 Hint: {question.hint}
      </div>
      
      <input 
        type="number" 
        placeholder="Your answer" 
        className="answer-input"
      />
    </div>
  );
}
```

---

## 📝 **For Your ICETT Paper - Include These Figures**

### **Figure 3: Parametric Question with Dynamic Visualization**

```
┌────────────────────────────────────────────────────────────┐
│              Parametric Question Generation                 │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Template:                                                 │
│    "Rectangle with width {w} and height {h}"               │
│                                                            │
│  ──────────────────────────────────────────────────        │
│                                                            │
│  Instance 1 (w=7, h=5):        Instance 2 (w=12, h=4):     │
│                                                            │
│   ┌──────────────┐              ┌──────────────────────┐  │
│   │              │ 5             │                      │  │
│   │              │               │                      │ 4│
│   └──────────────┘               └──────────────────────┘  │
│        7 units                         12 units            │
│                                                            │
│   Answer: 35                    Answer: 48                 │
│                                                            │
│  Same concept, different parameters → Fair assessment      │
└────────────────────────────────────────────────────────────┘
```

### **Figure 4: Shape Complexity by Difficulty Level**

```
Difficulty 1: Basic             Difficulty 3: Composite      Difficulty 5: Complex
┌────────┐                      ┌────────┐                   ┌────────────┐
│        │ Rectangle              │    ╭─╮ │ Rect + Semicircle │  ╱╲       │
│        │                        │    │ │ │                   │ ╱  ╲   ⃝  │
└────────┘                        └────╰─╯─┘                   └╱____╲─────┘
```

---

## 📊 **Write This in Your Paper:**

```markdown
### 4.4 Dynamic Visualization

To maintain engagement while using parametric generation, our system 
generates visual diagrams dynamically based on question parameters.

**SVG-Based Rendering:**
Each generated question includes an SVG diagram constructed from the 
parameter values. For example, a rectangle problem with width=7 and 
height=5 generates a proportionally scaled rectangle with labeled 
dimensions (see Figure 3).

**Implementation:**
diagram = generateSVG(type, {width: 7, height: 5})

**Benefits:**
1. Visual consistency across difficulty levels
2. Automatic scaling based on parameter values
3. Accessible (SVG is screen-reader compatible)
4. Lightweight (no image files, just XML)
5. Responsive (scales to any screen size)

This approach ensures every parametrically generated question includes 
appropriate visual support, maintaining educational effectiveness while 
achieving infinite problem diversity.
```

---

## ✅ **Summary for Your Deadline**

**Best approach:** SVG generation  
**Implementation time:** ~1 hour for basic shapes  
**For paper:** Include diagrams showing template variations

You now have text AND visual variety! 🎨
