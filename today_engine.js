/* NEXORA Today Course Bridge
   Connects the existing Today/Study Session UI to the bulk competitive course map.
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
  function makeLesson(subject,topic){
    const exam=activeExam();
    if(!exam||!window.competitiveLessonBank)return null;
    const bank=window.competitiveLessonBank[exam];
    if(!bank)return null;
    const sec=sectionFor(exam,subject,topic);
    if(!sec)return null;
    const matched=(sec.topics||[]).find(t=>key(t)===key(topic))||topic;
    const flow=bank.lessonFlow||['Concept','Worked example','Practice','Revision','Mini-test'];
    const skills=bank.skills||[];
    const concept='Exam: '+exam+' • Section: '+sec.name+'\n\nTopic: '+matched+'\n\nThis NEXORA session starts with the core idea, then applies it through an example, practice and review. '+(bank.mode||'Exam-focused study')+'.';
    const formulas=[
      'Learning target: explain '+matched+' in your own words.',
      'Method: identify the given information → choose the relevant rule/formula → solve → verify.',
      'Exam skill: '+(skills[0]||'accuracy and time management'),
      'Session flow: '+flow.join(' → ')
    ];
    const example='Worked example: Take one standard '+matched+' problem. First identify what is being asked, list the given information, select the governing concept, solve step by step, and finish by checking units/signs or the logical conclusion. For theory topics, write the principle, apply it to a simple case, then state the conclusion.';
    const practice=[
      ['What is the main idea you must remember from '+matched+'?','Self-check'],
      ['Write the key rule, formula, definition or framework used for '+matched+'.','Self-check'],
      ['Solve one representative '+exam+' practice problem from '+matched+' without looking at the solution.','Self-check'],
      ['What is one common mistake or trap in '+matched+'?','Self-check']
    ];
    return {
      title:matched+' — '+exam+' Lesson',
      concept:concept,
      formulas:formulas,
      example:example,
      practice:practice,
      commonMistakes:['Do not memorise the answer without understanding the method.','Check the exact wording, units and conditions.','Record repeated errors and revise the weak concept.'],
      revision:flow.map(x=>'Revision step: '+x),
      testTopics:[matched],
      detailLevel:'competitive-course'
    };
  }
  const oldLessonForTopic=window.lessonForTopic;
  window.lessonForTopic=function(subject,requestedTopic){
    const p=typeof profile==='function'?profile():null;
    const competitive=p&&p.goalKey==='competitive';
    if(competitive){
      const l=makeLesson(subject,requestedTopic);
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
  window.nexoraTodayCourseBridge={activeExam,makeLesson};
})();
