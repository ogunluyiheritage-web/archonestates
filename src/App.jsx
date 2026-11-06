import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X, Plus, Instagram, Mail, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const projects = [
 {n:'01',name:'The Aurelia Residence',type:'Private residence',place:'Lagos, Nigeria',year:'2025',img:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=85'},
 {n:'02',name:'House on the Ridge',type:'Residential architecture',place:'Abuja, Nigeria',year:'2024',img:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=85'},
 {n:'03',name:'The Glass Courtyard',type:'Concept residence',place:'Accra, Ghana',year:'2025',img:'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1500&q=85'}
];

function Header(){
 const [open,setOpen]=useState(false);
 const location=useLocation();
 useEffect(()=>setOpen(false),[location]);
 return <header className="header">
   <Link to="/" className="brand"><span className="brand-mark">A<span>.</span></span><span>ARCHON<small>ARCHITECTURE / SPACES</small></span></Link>
   <nav className={open?'nav nav-open':'nav'}>
    <NavLink to="/" end>Home</NavLink><NavLink to="/residences">Residences</NavLink><NavLink to="/about">About</NavLink><NavLink to="/contact">Contact</NavLink>
   </nav>
   <Link to="/contact" className="header-cta">Start a project <ArrowUpRight size={15}/></Link>
   <button className="menu-btn" aria-label="Toggle menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
 </header>
}

function Reveal({children,className=''}) {
 const ref=useRef(null);
 useEffect(()=>{if(!ref.current)return; const ctx=gsap.context(()=>{gsap.fromTo(ref.current,{y:34,opacity:0},{y:0,opacity:1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:ref.current,start:'top 88%',once:true}})},ref);return()=>ctx.revert()},[]);
 return <div ref={ref} className={className}>{children}</div>
}

function ScrollVideoHero(){
 const section=useRef(null), videoRef=useRef(null), progressRef=useRef(0);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{
  const video=videoRef.current;
  if(!video) return;
  const syncDuration=()=>{
   if(Number.isFinite(video.duration) && video.duration>0) video.currentTime=progressRef.current*video.duration;
  };
  video.addEventListener('loadedmetadata',syncDuration);
  const ctx=gsap.context(()=>{
   ScrollTrigger.create({
    trigger:section.current, start:'top top', end:'bottom bottom', scrub:0.35,
    onUpdate:self=>{
     const next=self.progress;
     progressRef.current=next;
     setProgress(next);
     if(video.readyState>=1 && Number.isFinite(video.duration) && video.duration>0){
      const target=next*video.duration;
      if(Math.abs(video.currentTime-target)>.035) video.currentTime=target;
     }
    }
   });
  },section);
  return()=>{video.removeEventListener('loadedmetadata',syncDuration);ctx.revert();};
 },[]);
 // Labels are timed to the actual footage: approach/doorway, living room, then pool.
 // The supplied clip contains no distinct dining or kitchen shot, so those labels are intentionally omitted.
 const scenes=[
  {start:0.22,end:0.50,eyebrow:'01 / ARRIVAL',title:'The Entrance',desc:'A measured arrival, framed by clean lines, natural stone and quiet landscape.'},
  {start:0.50,end:0.72,eyebrow:'02 / LIVING',title:'The Living Room',desc:'A calm, light-filled space shaped around comfort, openness and everyday life.'},
  {start:0.72,end:1.01,eyebrow:'03 / OUTDOORS',title:'The Garden & Pool',desc:'Living extends beyond the glass into a private garden and a restrained poolside retreat.'}
 ];
 const active=progress<0.22?-1:scenes.findIndex((scene)=>progress>=scene.start && progress<scene.end);
 const current=active>=0?scenes[active]:null;
 const introOpacity=Math.max(0,Math.min(1,(0.19-progress)/0.065));
 const stage=progress<0.50?1:progress<0.72?2:3;
 return <section className="video-tour-wrap" ref={section} aria-label="Scroll-controlled residence tour">
  <div className="video-tour-sticky">
   <video ref={videoRef} className="video-tour-footage" src="/archon-tour.mp4" poster="/archon-poster.jpg" muted playsInline preload="auto" aria-label="Cinematic tour of a contemporary residence" />
   <div className="video-tour-shade" />
   <div className="video-tour-topline"><span className="tour-brand-label"><i/> ARCHON <b>/</b> PRIVATE RESIDENCE 01</span><span className="tour-instruction">SCROLL TO EXPLORE <ArrowDownRight size={15}/></span></div>
   <div className="video-tour-intro" style={{opacity:introOpacity,transform:`translateY(${(1-introOpacity)*18}px)`,pointerEvents:progress>.16?'none':'auto'}} aria-hidden={progress>.18}>
    <p className="eyebrow hero-overline"><span>ARCHON / 01</span><i/> ARCHITECTURE · INTERIORS · LANDSCAPE</p>
    <h1><span>High-end residential</span><br/><em>design &amp; build.</em></h1>
    <div className="hero-intro-foot"><p className="video-tour-lede">Distinctive homes.<br/>Considered down to the last detail.</p><span className="video-scroll-cue"><span/> SCROLL TO EXPLORE</span></div>
   </div>
   {current&&<div className="video-room-label" key={current.title}>
    <span className="eyebrow">{current.eyebrow}</span><h2>{current.title}</h2><p>{current.desc}</p>
   </div>}
   <div className="video-tour-progress" aria-label={`Tour progress ${Math.round(progress*100)} percent`}><span style={{transform:`scaleX(${progress})`}}/></div>
   <div className="video-tour-bottom"><span>ONE RESIDENCE · A CLOSER LOOK</span><span>{String(stage).padStart(2,'0')} <b>/</b> 03</span></div>
  </div>
 </section>
}

function Home(){
 return <main>
  <ScrollVideoHero/>
  <section className="intro section-pad"><Reveal><p className="eyebrow">OUR POINT OF VIEW</p><h2>Not just a building.<br/><em>A feeling, made tangible.</em></h2></Reveal><Reveal className="intro-bottom"><p>ARCHON is an architecture and design studio creating enduring places for living, gathering, and belonging. Every line has intention. Every detail earns its place.</p><Link to="/about" className="text-link">Discover our approach <ArrowUpRight size={16}/></Link></Reveal></section>
  <section className="work section-pad"><div className="section-heading"><div><p className="eyebrow">SELECTED WORK / 2024—25</p><h2>Places with <em>presence.</em></h2></div><Link to="/residences" className="text-link">View all residences <ArrowUpRight size={16}/></Link></div><div className="project-grid">{projects.slice(0,2).map((p,i)=><ProjectCard p={p} index={i} key={p.n}/>)}</div></section>
  <section className="statement"><div className="statement-bg"/><Reveal><p className="eyebrow">A MORE HUMAN ARCHITECTURE</p><h2>Designed to be<br/><em>lived in.</em> Not just looked at.</h2><Link to="/about" className="round-link light">Meet the studio <ArrowUpRight size={16}/></Link></Reveal></section>
  <section className="cta-band"><p className="eyebrow">HAVE A PLACE IN MIND?</p><h2>Let's make room<br/>for <em>what matters.</em></h2><Link to="/contact" className="round-link">Start a conversation <ArrowUpRight size={16}/></Link></section>
 </main>
}

function ProjectCard({p,index}) {
 return <Link to="/residences" className={`project-card project-${index}`}>
  <div className="project-image"><img src={p.img} alt={p.name}/><span className="project-arrow"><ArrowUpRight/></span><span className="project-number">{p.n}</span></div>
  <div className="project-meta"><div><h3>{p.name}</h3><p>{p.type} · {p.place}</p></div><span>{p.year}</span></div>
 </Link>
}

function PageHero({eyebrow,title,italic,desc,image}) {
 return <section className="page-hero" style={{'--page-image':`url(${image})`}}><div className="page-hero-shade"/><div className="page-hero-content"><p className="eyebrow">{eyebrow}</p><h1>{title}<br/><em>{italic}</em></h1><p className="page-desc">{desc}</p></div><span className="page-hero-index">ARCHON / STUDIO JOURNAL</span></section>
}
function Residences(){
 return <main><PageHero eyebrow="OUR PORTFOLIO / 01—03" title="Spaces with" italic="a point of view." desc="A selection of places shaped by light, landscape, and the lives that unfold within them." image={projects[1].img}/>
 <section className="residences-list section-pad"><div className="section-heading"><div><p className="eyebrow">SELECTED RESIDENCES</p><h2>Every project, <em>personal.</em></h2></div><p className="side-note">A small selection of ideas made real — and ideas still becoming.</p></div>{projects.map((p,i)=><Reveal key={p.n} className="residence-row"><div className="residence-image"><img src={p.img} alt={p.name}/><span>{p.n}</span></div><div className="residence-info"><p className="eyebrow">{p.type} / {p.year}</p><h3>{p.name}</h3><p>{p.place}</p><span className="line-link">Explore project <ArrowUpRight size={16}/></span></div></Reveal>)}</section>
 <section className="cta-band"><p className="eyebrow">YOUR PROJECT COULD BE NEXT</p><h2>Have a vision?<br/><em>Let's shape it.</em></h2><Link to="/contact" className="round-link">Tell us about it <ArrowUpRight size={16}/></Link></section></main>
}
function About(){
 return <main><PageHero eyebrow="THE STUDIO / EST. 2018" title="Good spaces" italic="change everything." desc="We believe architecture should feel as considered as it looks — grounded in place, generous in spirit, and built to last." image={projects[0].img}/>
 <section className="about-intro section-pad"><div><p className="eyebrow">OUR PHILOSOPHY</p><h2>Quiet confidence.<br/><em>Lasting impact.</em></h2></div><div className="about-copy"><p className="large-copy">We are a design-led architecture studio working at the intersection of modern living, craft, and context.</p><p>Our process starts with listening. We study how people move, gather, rest, and connect — then translate those observations into places that feel natural, distinctive, and deeply personal.</p><p>From the first sketch to the final material detail, we aim for clarity over excess and character over trend.</p></div></section>
 <section className="about-gallery"><div className="gallery-main"><img src={projects[2].img} alt="Contemporary residence with natural materials"/><span>01 / MATERIAL & LIGHT</span></div><div className="gallery-side"><img src={projects[1].img} alt="Modern home exterior"/><span>02 / FORM & LANDSCAPE</span></div></section>
 <section className="values section-pad"><p className="eyebrow">WHAT GUIDES US</p><div className="value-row"><span>01</span><h3>Intention in every detail.</h3><p>We design with purpose, giving each material, opening, and transition a reason to be there.</p><Plus size={18}/></div><div className="value-row"><span>02</span><h3>Context over convention.</h3><p>Every project responds to its climate, landscape, culture, and the people who will call it home.</p><Plus size={18}/></div><div className="value-row"><span>03</span><h3>Beauty that lives well.</h3><p>We balance striking form with comfort, function, and the unplanned moments of daily life.</p><Plus size={18}/></div></section>
 <section className="cta-band"><p className="eyebrow">WORK WITH ARCHON</p><h2>Let's create something<br/><em>meaningful.</em></h2><Link to="/contact" className="round-link">Meet us halfway <ArrowUpRight size={16}/></Link></section></main>
}
function Contact(){
 const [sent,setSent]=useState(false);
 return <main><PageHero eyebrow="LET'S TALK / 04" title="Every great place" italic="starts somewhere." desc="Tell us what you're imagining. We would love to hear about the place you want to create." image={projects[2].img}/>
 <section className="contact-layout section-pad"><div className="contact-left"><p className="eyebrow">START A CONVERSATION</p><h2>Have a project<br/>in <em>mind?</em></h2><p>Whether you are planning a private residence, exploring a new development, or simply have a question, our studio is open to a conversation.</p><div className="contact-detail"><Mail size={17}/><span>hello@archon.studio</span></div><div className="contact-detail"><MapPin size={17}/><span>Lagos, Nigeria · Working internationally</span></div><div className="contact-detail"><Instagram size={17}/><span>@archon.studio</span></div></div>
 <form className="contact-form" onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<div className="success"><span className="eyebrow">MESSAGE PREPARED</span><h3>Thank you for reaching out.</h3><p>This demo form is front-end only. Connect it to Formspree, Resend, or your preferred form backend to receive submissions.</p><button type="button" className="text-link" onClick={()=>setSent(false)}>Send another message <ArrowRight size={15}/></button></div>:<><label>Your name<input required placeholder="Full name"/></label><label>Email address<input required type="email" placeholder="you@example.com"/></label><label>What are you planning?<select defaultValue=""><option value="" disabled>Select a project type</option><option>Private residence</option><option>Development / hospitality</option><option>Interior architecture</option><option>Something else</option></select></label><label>Tell us a little more<textarea required rows="4" placeholder="A few details about your vision..."/></label><button className="submit-btn" type="submit">Send your enquiry <ArrowUpRight size={16}/></button></>}</form></section></main>
}
function Footer(){
 return <footer className="footer"><div className="footer-top"><Link to="/" className="brand footer-brand"><span className="brand-mark">A<span>.</span></span><span>ARCHON<small>ARCHITECTURE / SPACES</small></span></Link><p>Places that make<br/><em>life feel different.</em></p><Link to="/contact" className="footer-circle"><ArrowUpRight/></Link></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ARCHON STUDIO</span><span>DESIGNED WITH INTENTION</span><div><Link to="/">HOME</Link><Link to="/residences">RESIDENCES</Link><Link to="/about">ABOUT</Link><Link to="/contact">CONTACT</Link></div></div></footer>
}
export default function App(){
 const location=useLocation();
 useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[location.pathname]);
 return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/residences" element={<Residences/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<Home/>}/></Routes><Footer/></>;
}