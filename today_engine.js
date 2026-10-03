/* NEXORA Today Engine — real chapter lesson renderer
   This file is injected after the main app script. It therefore uses DOM/event
   integration instead of trying to replace lexical function declarations. */
(function(){
  'use strict';

  const key=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const pcm=()=>window.nexoraPCMContent||{};
  const getProfile=()=>{try{return typeof profile==='function'?profile():null}catch(e){return null}};
  const getData=()=>{try{return typeof userData==='function'?userData():{}}catch(e){return {}}};
  const dayNow=()=>{try{return typeof cycleDay==='function'?cycleDay():1}catch(e){return 1}};
  const mins=v=>{try{return typeof minutes==='function'?minutes(v):60}catch(e){return 60}};

  const fallbackTopics={
    Physics:['Units & Measurements','Kinematics','Laws of Motion','Work, Energy & Power','Rotational Motion','Gravitation'],
    Chemistry:['Some Basic Concepts of Chemistry','Atomic Structure','Chemical Bonding','Chemical Thermodynamics','Solutions','Equilibrium'],
    Mathematics:['Sets, Relations and Functions','Complex Numbers and Quadratic Equations','Matrices and Determinants','Permutations and Combinations','Binomial Theorem','Sequences and Series','Limits, Continuity and Differentiability','Integral Calculus','Differential Equations','Coordinate Geometry','Three Dimensional Geometry','Vector Algebra','Statistics and Probability','Trigonometry']
  };

  function subjectsSafe(){
    try{const s=typeof subjects==='function'?subjects():[];if(s&&s.length)return s.map(String)}catch(e){}
    return ['Physics','Chemistry','Mathematics'];
  }

  function topicFor(subject,day){
    const p=getProfile();
    const same=String(p&&p.currentSubject||'').toLowerCase()===String(subject||'').toLowerCase();
    if(same&&p.currentTopic&&Number(day)===1)return String(p.currentTopic);
    try{if(typeof roadmapTopicFor==='function'){const t=roadmapTopicFor(subject,day);if(t)return String(t)}}catch(e){}
    const list=fallbackTopics[subject]||['Core Concepts','Practice & Application','Revision'];
    return list[(Math.max(1,Number(day)||1)-1)%list.length];
  }

  function pcmLesson(subject,topic){
    const bank=pcm()[subject];
    if(!bank)return null;
    const actual=Object.keys(bank).find(t=>key(t)===key(topic))||Object.keys(bank).find(t=>key(t).includes(key(topic))||key(topic).includes(key(t)));
    if(!actual)return null;
    const x=bank[actual];
    return {
      title:actual+' — NEXORA Lesson',
      concept:x.c||'',
      formulas:Array.isArray(x.f)?x.f:[],
      example:Array.isArray(x.e)?x.e.map((v,i)=>'Worked example '+String.fromCharCode(65+i)+': '+v[0]+' → '+v[1]).join('\n\n'):'',
      practice:Array.isArray(x.q)?x.q:[],
      commonMistakes:['Write the given data before choosing a formula.','Check units, signs and conditions.','After solving, verify the final answer.'],
      revision:Array.isArray(x.f)?x.f:[],
      testTopics:[actual],
      detailLevel:'chapter-specific'
    };
  }

  function competitiveLesson(subject,topic){
    const p=getProfile();
    if(!p||p.goalKey!=='competitive')return null;
    const bank=window.competitiveLessonBank||{};
    const raw=String(p.exam||p.examKey||'').toLowerCase();
    const exam=Object.keys(bank).find(x=>raw.includes(x.toLowerCase()))||'OTHER';
    const e=bank[exam];
    if(!e)return null;
    let sec=(e.sections||[]).find(s=>(s.topics||[]).some(t=>key(t)===key(topic)));
    if(!sec)sec=(e.sections||[]).find(s=>key(s.name)===key(subject)||key(s.name).includes(key(subject))||key(subject).includes(key(s.name)));
    if(!sec)return null;
    const matched=(sec.topics||[]).find(t=>key(t)===key(topic))||topic||sec.name;
    const flow=e.lessonFlow||['Concept','Worked example','Practice','Revision','Mini-test'];
    return {
      title:matched+' — '+exam+' Lesson',
      concept:'Exam: '+exam+'\nSection: '+sec.name+'\n\n'+matched+' is studied through concept → application → practice → review. '+(e.mode||'Exam-focused learning')+'.',
      formulas:['Learning target: explain '+matched+' in your own words.','Method: identify the given information → choose the relevant rule/formula → solve → verify.','Session flow: '+flow.join(' → ')],
      example:'Worked example: identify what the question asks, list the given information, select the governing concept, solve step by step, and verify the result.',
      practice:[['What is the main idea of '+matched+'?','Self-check'],['Write the key rule, formula or framework for '+matched+'.','Self-check'],['Solve one representative '+exam+' practice problem from '+matched+'.','Self-check'],['Name one common mistake or trap in '+matched+'.','Self-check']],
      commonMistakes:['Understand the method before memorising answers.','Check wording, units and conditions.','Record repeated mistakes for revision.'],
      revision:flow.map(x=>'Revision: '+x),
      testTopics:[matched],
      detailLevel:'competitive-course'
    };
  }

  function lesson(subject,topic){
    const p=getProfile();
    let l=competitiveLesson(subject,topic)||pcmLesson(subject,topic);
    if(!l){
      try{l=typeof lessonForTopic==='function'?lessonForTopic(subject,topic):null}catch(e){}
    }
    if(!l)l={title:topic+' — NEXORA Lesson',concept:'No built-in lesson is available for this topic yet.',formulas:[],example:'Use your current study material for this topic.',practice:[],commonMistakes:[],revision:[],testTopics:[topic]};
    if(p&&(p.syllabusStatus==='complete'||p.syllabusStatus==='practice_only')){
      l=Object.assign({},l,{title:l.title+' — Practice',concept:'Your syllabus is marked complete. This session focuses on active recall, application, practice and mistake review.\n\n'+l.concept});
    }
    return l;
  }

  function buildTasks(){
    const p=getProfile();
    const subs=subjectsSafe();
    const day=dayNow();
    const weak=String(p&&p.weak||'').toLowerCase().split(',').map(x=>x.trim()).filter(Boolean);
    const weights=subs.map(s=>weak.some(w=>String(s).toLowerCase().includes(w)||w.includes(String(s).toLowerCase()))?1.5:1);
    const total=weights.reduce((a,b)=>a+b,0)||1;
    const base=Math.max(30,mins(p&&p.time));
    return subs.map((subject,i)=>{
      const topic=topicFor(subject,day);
      const l=lesson(subject,topic);
      const weakFocus=weights[i]>1;
      const share=Math.max(10,Math.round(base*weights[i]/total));
      const practiceOnly=p&&(p.syllabusStatus==='complete'||p.syllabusStatus==='practice_only');
      return {id:'d'+day+'_'+i,subject,topic,minutes:share,lesson:l,title:(weakFocus?'Focus: ':'')+(practiceOnly?'Practice: ':'Study: ')+subject+' — '+topic,meta:(practiceOnly?'Practice → questions → mistakes':'Learn → concepts → examples → practice')+' • '+share+' min • '+topic};
    });
  }

  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  const taskMap={};
  function refreshTaskMap(){
    Object.keys(taskMap).forEach(k=>delete taskMap[k]);
    buildTasks().forEach(t=>taskMap[t.id]=t);
    window.nexoraTodayTasks=taskMap;
    return Object.values(taskMap);
  }

  function renderTasks(){
    const box=document.getElementById('todayTasks');
    if(!box)return;
    const p=getProfile();
    const tasks=refreshTaskMap();
    const d=getData(),done=d.tasks||{};
    if(!p){
      box.innerHTML='<div class="empty-state"><b>Create your Student Profile first</b><p class="muted small">Choose your class, subjects and goal. NEXORA will then build your actual study sessions.</p><button class="btn primary" onclick="openStudent()">🎓 Create Student Profile</button></div>';
    }else{
      box.innerHTML=tasks.map(t=>'<div class="task '+(done[t.id]?'done':'')+'"><button class="task-open" data-nexora-task="'+esc(t.id)+'"><span class="task-title">'+(done[t.id]?'✓ ':'')+esc(t.title)+'</span><div class="muted small">'+esc(t.meta)+' • '+(done[t.id]?'Completed — open again':'Open actual lesson →')+'</div></button></div>').join('');
    }
    const completed=tasks.filter(t=>done[t.id]).length;
    const bar=document.getElementById('todayProgress'),txt=document.getElementById('todayProgressText');
    if(bar)bar.style.width=(tasks.length?Math.round(completed/tasks.length*100):0)+'%';
    if(txt)txt.textContent=p?completed+' of '+tasks.length+' study sessions completed today.':'Set up your profile to start today.';
  }

  function openRealSession(id){
    const t=taskMap[id];if(!t)return;
    window._activeTask=t;
    const title=document.getElementById('sessionTitle'),meta=document.getElementById('sessionMeta'),body=document.getElementById('sessionBody'),modal=document.getElementById('studySessionModal');
    if(!title||!meta||!body||!modal)return;
    const l=t.lesson||{};
    title.textContent=t.title;
    meta.textContent='Day '+dayNow()+' • '+t.meta;
    const formulas=(l.formulas||[]).map(x=>'<div>• '+esc(x)+'</div>').join('')||'<div class="muted">No formula list for this topic.</div>';
    const examples=esc(l.example||'No worked example available.').replace(/\n/g,'<br>');
    const practice=(l.practice||[]).map((x,i)=>'<div class="practice-q"><b>'+(i+1)+'. '+esc(x[0])+'</b><input id="practice_'+i+'" placeholder="Write your answer"><button class="btn" style="margin-top:7px" onclick="checkPractice('+i+')">Check</button><div id="practiceResult_'+i+'" class="muted small" style="margin-top:6px"></div></div>').join('');
    body.innerHTML='<div class="lesson-block"><h3>1. Learn / Concept</h3><p>'+esc(l.concept||'')+'</p></div><div class="lesson-block"><h3>2. Key points & formulas</h3>'+formulas+'</div><div class="lesson-block"><h3>3. Worked examples</h3><p>'+examples+'</p></div><div class="lesson-block"><h3>4. Practice</h3>'+practice+'</div><div class="lesson-block"><h3>5. Quick revision</h3>'+((l.revision||[]).map(x=>'<div>• '+esc(x)+'</div>').join('')||'<div class="muted">Review the formulas and mistakes above.</div>')+'</div><div class="notice">Finish the lesson and check every practice question before completing the session. This completion is what advances Today progress.</div><div class="session-actions"><button class="btn primary" onclick="completeStudyTask()">✓ Complete study session</button><button class="btn" onclick="setTimer('+Math.min(180,Math.max(10,t.minutes||25))+')">⏱ Start focus timer</button></div>';
    modal.classList.add('open');
  }

  document.addEventListener('click',function(e){
    const btn=e.target.closest('[data-nexora-task]');
    if(btn){e.preventDefault();e.stopPropagation();openRealSession(btn.getAttribute('data-nexora-task'));}
  },true);

  let busy=false;
  function sync(){if(busy)return;busy=true;try{renderTasks()}finally{setTimeout(()=>busy=false,0)}}

  function install(){
    const box=document.getElementById('todayTasks');
    if(!box)return setTimeout(install,250);
    const obs=new MutationObserver(()=>sync());
    obs.observe(box,{childList:true,subtree:true});
    renderTasks();
    window.nexoraTodayCourseBridge={buildTodayTasks:buildTasks,makePcmLesson:pcmLesson,makeCompetitiveLesson:competitiveLesson,openRealSession};
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
