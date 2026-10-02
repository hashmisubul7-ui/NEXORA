/* NEXORA — bulk competitive-exam course map
   Compact, exam-specific learning blueprints. Detailed PCM chapters are reused by reference.
   These are original NEXORA teaching notes/question types, not official PYQs. */
const competitiveLessonBank = {
  "JEE Main": {
    mode:"PCM + exam practice",
    sections:[
      {name:"Physics",topics:["Units & Measurements","Kinematics","Laws of Motion","Work, Energy & Power","Rotational Motion","Gravitation","Properties of Solids and Liquids","Thermodynamics","Kinetic Theory of Gases","Oscillations and Waves","Electrostatics","Current Electricity","Magnetic Effects of Current and Magnetism","Electromagnetic Induction and Alternating Currents","Electromagnetic Waves","Optics","Dual Nature of Matter and Radiation","Atoms and Nuclei","Electronic Devices","Experimental Skills"]},
      {name:"Chemistry",topics:["Some Basic Concepts of Chemistry","Atomic Structure","Chemical Bonding","Chemical Thermodynamics","Solutions","Equilibrium","Redox Reactions and Electrochemistry","Chemical Kinetics","Classification of Elements and Periodicity in Properties","p-Block Elements","d- and f-Block Elements","Coordination Compounds","Purification and Characterisation of Organic Compounds","Some Basic Principles of Organic Chemistry","Hydrocarbons","Organic Compounds Containing Halogens","Organic Compounds Containing Oxygen","Aldehydes, Ketones and Carboxylic Acids","Amines","Biomolecules and Polymers","Principles Related to Practical Chemistry"]},
      {name:"Mathematics",topics:["Sets, Relations and Functions","Complex Numbers and Quadratic Equations","Matrices and Determinants","Permutations and Combinations","Binomial Theorem","Sequences and Series","Limits, Continuity and Differentiability","Integral Calculus","Differential Equations","Coordinate Geometry","Three Dimensional Geometry","Vector Algebra","Statistics and Probability","Trigonometry"]}
    ],
    lessonFlow:["Concept recall","JEE-level formula selection","Solved application","Timed mixed practice","Error log","Mini-test"],
    skills:["multi-concept problems","numerical answer entry","speed + accuracy","negative-marking awareness"]
  },
  "JEE Advanced": {
    mode:"Advanced PCM practice",
    sections:[
      {name:"Physics",topics:["Mechanics","Thermal Physics","Waves and Oscillations","Electrostatics","Current Electricity","Magnetism","EMI and AC","Optics","Modern Physics"]},
      {name:"Chemistry",topics:["Physical Chemistry","Inorganic Chemistry","Organic Chemistry"]},
      {name:"Mathematics",topics:["Algebra","Calculus","Coordinate Geometry","Vectors and 3D","Probability and Combinatorics","Trigonometry"]}
    ],
    lessonFlow:["Deep concept","Multiple representations","Multi-step example","Mixed advanced practice","Timed analysis","Error log"],
    skills:["case analysis","multi-correct reasoning","integer/numerical reasoning","cross-topic problems"],
    note:"Paper formats and marking can vary; NEXORA uses an original practice simulation rather than claiming an official paper."
  },
  "NEET": {
    mode:"PCB + medical entrance practice",
    sections:[
      {name:"Physics",topics:["Units & Measurements","Kinematics","Laws of Motion","Work, Energy & Power","Rotational Motion","Gravitation","Thermodynamics","Oscillations and Waves","Electrostatics","Current Electricity","Magnetism","EMI and AC","Optics","Dual Nature","Atoms and Nuclei","Electronic Devices"]},
      {name:"Chemistry",topics:["Some Basic Concepts","Atomic Structure","Chemical Bonding","Thermodynamics","Solutions","Equilibrium","Electrochemistry","Chemical Kinetics","Periodicity","p-Block","d- and f-Block","Coordination Compounds","Organic Basics","Hydrocarbons","Halogen Compounds","Oxygen Compounds","Carbonyl Compounds","Amines","Biomolecules","Practical Chemistry"]},
      {name:"Biology",topics:["Diversity in Living World","Structural Organisation","Cell Structure and Function","Plant Physiology","Human Physiology","Reproduction","Genetics and Evolution","Ecology and Environment","Biology and Human Welfare","Biotechnology and Its Applications"]}
    ],
    lessonFlow:["NCERT-focused concept","Diagram/fact recall","Solved MCQ","Timed MCQ set","Mistake notebook","Mini-test"],
    skills:["high-volume MCQ practice","NCERT recall","elimination","negative-marking awareness"]
  },
  "NDA": {
    mode:"Mathematics + GAT",
    sections:[
      {name:"Mathematics",topics:["Algebra","Matrices and Determinants","Trigonometry","Analytical Geometry","Differential Calculus","Integral Calculus","Vector Algebra","Statistics and Probability"]},
      {name:"GAT",topics:["English Grammar and Vocabulary","Physics","Chemistry","General Science","History","Geography","Current Affairs"]}
    ],
    lessonFlow:["Concept","Worked example","Speed drill","Mixed practice","Revision","Mini-test"],
    skills:["fast arithmetic","reading comprehension","general awareness recall","time allocation"]
  },
  "UPSC": {
    mode:"Civil services foundation",
    sections:[
      {name:"General Studies I",topics:["Indian Heritage and Culture","Ancient and Medieval India","Modern India","World History","Indian Society","Physical Geography","Indian Geography"]},
      {name:"General Studies II",topics:["Constitution","Polity and Governance","Social Justice","International Relations"]},
      {name:"General Studies III",topics:["Indian Economy","Agriculture","Science and Technology","Environment and Biodiversity","Internal Security","Disaster Management"]},
      {name:"General Studies IV",topics:["Ethics and Human Values","Attitude","Emotional Intelligence","Probity in Governance","Case Studies"]},
      {name:"CSAT",topics:["Reading Comprehension","Basic Numeracy","Data Interpretation","Logical Reasoning","Analytical Ability"]}
    ],
    lessonFlow:["Core concept","Source-aware notes","Example/case","Practice answer","Self-review","Mini-test"],
    skills:["structured answers","elimination","comprehension","current-affairs linkage"]
  },
  "CUET": {
    mode:"Language + General Test + selected domains",
    sections:[
      {name:"Language",topics:["Reading Comprehension","Vocabulary","Grammar","Verbal Ability"]},
      {name:"General Test",topics:["Quantitative Aptitude","Logical Reasoning","General Awareness","Current Affairs"]},
      {name:"Domain",topics:["Selected school subject syllabus","Concept revision","Application questions","Mixed practice"]}
    ],
    lessonFlow:["Concept refresh","Example","Timed MCQ","Review","Mini-test"],
    skills:["section timing","reading speed","MCQ accuracy","domain revision"]
  },
  "SSC": {
    mode:"SSC aptitude foundation",
    sections:[
      {name:"Quantitative Aptitude",topics:["Number System","Percentage","Ratio and Proportion","Profit Loss","Simple and Compound Interest","Time Work","Time Distance","Algebra","Geometry","Mensuration","Trigonometry","Data Interpretation"]},
      {name:"Reasoning",topics:["Analogy","Classification","Series","Coding Decoding","Blood Relations","Direction Sense","Syllogism","Venn Diagrams","Statement Logic","Non-verbal Reasoning"]},
      {name:"English",topics:["Grammar","Vocabulary","Error Detection","Fill in the Blanks","Cloze Test","Reading Comprehension","Sentence Improvement"]},
      {name:"General Awareness",topics:["History","Geography","Polity","Economy","Science","Current Affairs"]}
    ],
    lessonFlow:["Rule/concept","Shortcut with reasoning","Worked example","Speed drill","Mixed set","Mini-test"],
    skills:["calculation speed","pattern recognition","grammar accuracy","GA revision"]
  },
  "CAT": {
    mode:"MBA entrance aptitude",
    sections:[
      {name:"VARC",topics:["Reading Comprehension","Para Jumbles","Para Summary","Odd Sentence","Vocabulary in Context","Critical Reasoning"]},
      {name:"DILR",topics:["Tables and Charts","Arrangements","Games and Tournaments","Venn Sets","Routes and Networks","Scheduling","Caselets"]},
      {name:"QA",topics:["Arithmetic","Algebra","Number System","Geometry","Mensuration","Modern Mathematics"]}
    ],
    lessonFlow:["Concept/toolkit","Worked set","Timed set","Selection strategy","Error analysis","Mini-test"],
    skills:["question selection","data interpretation","RC inference","time management"]
  },
  "GATE": {
    mode:"Engineering/technical entrance",
    sections:[
      {name:"General Aptitude",topics:["Verbal Ability","Quantitative Aptitude","Analytical Reasoning"]},
      {name:"Engineering Mathematics",topics:["Linear Algebra","Calculus","Differential Equations","Probability and Statistics","Numerical Methods"]},
      {name:"Core Subject",topics:["Discipline syllabus","Concept mastery","Formula/application","Numerical practice","Previous-pattern analysis"]}
    ],
    lessonFlow:["Theory","Derivation/formula","Solved numerical","Timed practice","Error analysis","Mini-test"],
    skills:["numerical accuracy","concept application","MSQ/NAT reasoning","discipline mapping"],
    note:"Core-subject topics depend on the student's selected GATE paper; NEXORA should ask for the discipline rather than assume one."
  },
  "OTHER": {
    mode:"Custom competitive exam",
    sections:[
      {name:"Exam Setup",topics:["Exam name","Subjects/sections","Syllabus","Marking scheme","Time limit"]},
      {name:"Course",topics:["Concept lessons","Worked examples","Practice questions","Revision","Mock tests","Mistake analysis"]}
    ],
    lessonFlow:["Learn","Apply","Practice","Test","Review","Repeat"],
    skills:["syllabus mapping","personalized scheduling","test analysis"]
  }
};
