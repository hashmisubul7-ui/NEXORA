/* NEXORA Today Course Bridge
   Connects Today to the central lesson/course engine and guarantees visible tasks.
   Written lessons are original NEXORA teaching content; not official PYQs. */
(function(){
  function key(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

  function activeExam(){
    const p=typeof profile==='function'?profile():null;
    if(!p||p.goalKey!=='competitive')return null;
    const raw=String(p.exam||p.examKey||'').toLowerCase();
    if(raw.includes('jee advanced'))return 'JEE Advanced';
    if(raw.includes('jee main'))return 'JEE Main';
    if(raw.includes('neet'))return 'NEET';
    if(raw.includes('nda'))return 'NDA';
    if(raw.includes('upsc'))return 'UPSC';
    if(raw.includes('cuet'))return 'CUET';
    if(raw.includes('ssc'))return 'SSC';
    if(raw.includes('cat'))return 'CAT';
    if(raw.includes('gate'))return 'GATE';
    return 'OTHER';
  }

  function sectionFor(exam,subject,topic){
    const bank=window.competitiveLessonBank||{};
    const e=bank[exam];
    if(!e)return null;
    const sk=key(subject),tk=key(topic);
    for(const sec of (e.sections||[])){
      const names=[sec.name,...(sec.topics||[])];
      if(names.some(x=>key(x)===sk)||key(sec.name)===sk)return sec;
      if((sec.topics||[]).some(x=>key(x)===tk))return sec;
    }
    return (e.sections||[]).find(sec=>key(sec.name).includes(sk)||sk.includes(key(sec.name)))||null;
  }

  function makeCompetitiveLesson(subject,topic){
    const exam=activeExam(),bank=exam&&(window.competitiveLessonBank||{})[exam];
    if(!exam||!bank)return null;
    const sec=sectionFor(exam,subject,topic);
    if(!sec)return null;
    const matched=(sec.topics||[]).find(t=>key(t)===key(topic))||topic||sec.name;
    const flow=bank.lessonFlow||['Concept','Worked example','Practice','Revision','Mini-test'];
    const skills=bank.skills||[];
    return {
      title:matched+' — '+exam+' Lesson',
      concept:'Exam: '+exam+' • Section: '+sec.name+'\n\nTopic: '+matched+'\n\nNEXORA starts with the core concept, then applies it through an example, practice and review. '+(bank.mode||'Exam-focused study')+'.',
      formulas:['Learning target: explain '+matched+' in your own words.','Method: identify the given information → choose the relevant rule/formula → solve → verify.','Exam skill: '+(skills[0]||'accuracy and time management'),'Session flow: '+flow.join(' → ')],
      example:'Worked example: Take one standard '+matched+' problem. First identify what is being asked, list the given information, select the governing concept, solve step by step, and finish by checking units/signs or the logical conclusion.',
      practice:[['What is the main idea you must remember from '+matched+'?','Self-check'],['Write the key rule, formula, definition or framework used for '+matched+'.','Self-check'],['Solve one representative '+exam+' practice problem from '+matched+' without looking at the solution.','Self-check'],['What is one common mistake or trap in '+matched+'?','Self-check']],
      commonMistakes:['Do not memorise the answer without understanding the method.','Check the exact wording, units and conditions.','Record repeated errors and revise the weak concept.'],
      revision:flow.map(x=>'Revision step: '+x),
      testTopics:[matched],
      detailLevel:'competitive-course'
    };
  }

  const oldLessonForTopic=window.lessonForTopic;
  window.lessonForTopic=function(subject,requestedTopic){
    const p=typeof profile==='function'?profile():null;
    if(p&&p.goalKey==='competitive'){
      const l=makeCompetitiveLesson(subject,requestedTopic);
      if(l){
        if(p.syllabusStatus==='practice_only'||p.syllabusStatus==='complete'){
          l.title+=' — Practice';
          l.concept='Your syllabus is marked complete. This Today session focuses on active recall, application, practice and mistake review instead of restarting the course.\n\n'+l.concept;
        }
        return l;
      }
    }
    return oldLessonForTopic?oldLessonForTopic(subject,requestedTopic):null;
  };

  function safeSubjects(){
    try{
      const s=typeof subjects==='function'?subjects():[];
      if(s&&s.length)return s;
    }catch(e){console.warn('NEXORA Today subject fallback',e)}
    return ['Physics','Chemistry','Mathematics'];
  }

  const pcmTopics={
    Physics:['Units & Measurements','Kinematics','Laws of Motion','Work, Energy & Power','Rotational Motion','Gravitation'],
    Chemistry:['Some Basic Concepts of Chemistry','Atomic Structure','Chemical Bonding','Chemical Thermodynamics','Solutions','Equilibrium'],
    Mathematics:['Sets, Relations and Functions','Complex Numbers and Quadratic Equations','Matrices and Determinants','Permutations and Combinations','Binomial Theorem','Sequences and Series','Limits, Continuity and Differentiability','Trigonometry']
  };

  function safeTopic(subject,day){
    try{
      if(typeof roadmapTopicFor==='function'){
        const t=roadmapTopicFor(subject,day);
        if(t)return String(t);
      }
    }catch(e){console.warn('NEXORA Today topic fallback',e)}
    const list=pcmTopics[subject]||['Core Concepts','Practice & Application','Revision'];
    return list[(Math.max(1,day)-1)%list.length];
  }

  function safeLesson(subject,topic){
    let l=null;
    try{l=window.lessonForTopic?window.lessonForTopic(subject,topic):null}catch(e){console.warn('NEXORA Today lesson fallback',e)}
    if(l)return l;
    try{
      const kb=window.knowledgeBank&&window.knowledgeBank[subject];
      if(kb){const k=Object.keys(kb).find(x=>key(x)===key(topic));if(k)return kb[k];}
    }catch(e){}
    return {title:topic+' — NEXORA Lesson',concept:'Learn the core idea of '+topic+' and connect it to a representative problem. This session is designed to move from understanding to application.',formulas:['Write the key definition or rule.','Write the main formula or method.','Check units, signs and conditions before finalising an answer.'],example:'Worked example: identify the given information, choose the governing concept, solve step by step and verify the result.',practice:[['State the main idea of '+topic+'.','Self-check'],['Write the key formula or method for '+topic+'.','Self-check'],['Solve one representative problem from '+topic+'.','Self-check']],commonMistakes:['Skipping the given information.','Using a formula without checking conditions.','Not checking the final answer.'],revision:['Recall the concept','Recall the formula','Solve one fresh problem'],testTopics:[topic]};
  }

  function buildTodayTasks(){
    let p=null;try{p=typeof profile==='function'?profile():null}catch(e){}
    const day=typeof cycleDay==='function'?cycleDay():1;
    const subs=safeSubjects();
    const weak=String(p&&p.weak||'').toLowerCase().split(',').map(x=>x.trim()).filter(Boolean);
    const total=Math.max(1,subs.reduce((n,s)=>n+(weak.some(w=>String(s).toLowerCase().includes(w)||w.includes(String(s).toLowerCase()))?1.5:1),0));
    const base=typeof minutes==='function'?minutes(p&&p.time):60;
    return subs.map((subject,i)=>{
      const topic=safeTopic(subject,day),lesson=safeLesson(subject,topic);
      const isWeak=weak.some(w=>String(subject).toLowerCase().includes(w)||w.includes(String(subject).toLowerCase()));
      const share=Math.max(10,Math.round(base*((isWeak?1.5:1))/total));
      const mode=p&&(p.syllabusStatus==='complete'||p.syllabusStatus==='practice_only')?'Practice':'Study';
      return {id:'d'+day+'_'+i,subject,title:(isWeak?'Focus: ':'')+mode+': '+subject+' — '+String(lesson.title||topic).split(' — ')[0],meta:(mode==='Practice'?'Practice → questions → mistakes':'Learn → example → practice')+' • '+share+' min • '+topic,minutes:share,lesson};
    });
  }

  // Override the old task source so Today, the study modal and completion all use the same safe task objects.
  window.allTasks=function(){return buildTodayTasks();};

  window.renderToday=function(){
    const box=document.getElementById('todayTasks');
    if(!box)return;
    let p=null;try{p=typeof profile==='function'?profile():null}catch(e){}
    const tasks=buildTodayTasks();
    const d=typeof userData==='function'?userData():{};
    const done=d.tasks||{};
    if(!p){
      box.innerHTML='<div class="empty-state"><b>Create your Student Profile first</b><p class="muted small">Choose your class, subjects and goal. NEXORA will then build Physics/Chemistry/Maths or your selected subjects into Today.</p><button class="btn primary" onclick="openStudent()">🎓 Create Student Profile</button></div>';
    }else{
      box.innerHTML=tasks.map(t=>'<div class="task '+(done[t.id]?'done':'')+'"><button class="task-open" onclick="openStudySession(\''+t.id+'\')"><span class="task-title">'+(done[t.id]?'✓ ':'')+esc(t.title)+'</span><div class="muted small">'+esc(t.meta)+' • '+(done[t.id]?'Completed — open again':'Open study session →')+'</div></button></div>').join('');
    }
    const completed=tasks.filter(t=>done[t.id]).length;
    const pct=tasks.length?Math.round(completed/tasks.length*100):0;
    const bar=document.getElementById('todayProgress'),txt=document.getElementById('todayProgressText');
    if(bar)bar.style.width=pct+'%';
    if(txt)txt.textContent=p.length===0?'Set up your profile to start today.':completed+' of '+tasks.length+' study sessions completed today.';
  };

  window.nexoraTodayCourseBridge={activeExam,makeLesson:makeCompetitiveLesson,buildTodayTasks};
  // Re-render after this bridge is injected so the visible Today page updates immediately.
  try{if(document.readyState!=='loading'&&typeof current==='function'&&current())window.renderToday();}catch(e){console.warn('NEXORA Today initial render',e)}
})();
