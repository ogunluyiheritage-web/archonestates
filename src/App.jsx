import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Float, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X, MoveUpRight, Plus, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const projects = [
 {n:'01',name:'The Aurelia Residence',type:'Private residence',place:'Lagos, Nigeria',year:'2025',img:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=85'},
 {n:'02',name:'House on the Ridge',type:'Residential architecture',place:'Abuja, Nigeria',year:'2024',img:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=85'},
 {n:'03',name:'The Glass Courtyard',type:'Concept residence',place:'Accra, Ghana',year:'2025',img:'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1500&q=85'}
];
const rooms = [
 {title:'The Residence',sub:'A quiet statement from the outside.',eyebrow:'01 / ARRIVAL'},
 {title:'The Living Room',sub:'Light, proportion, and space to exhale.',eyebrow:'02 / GATHER'},
 {title:'The Kitchen',sub:'Designed around the rituals of everyday life.',eyebrow:'03 / CREATE'},
 {title:'The Private Suites',sub:'A considered retreat at the end of the day.',eyebrow:'04 / REST'},
 {title:'The Outdoor Sanctuary',sub:'Where architecture opens to the landscape.',eyebrow:'05 / UNWIND'}
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

function HouseModel({progress}) {
 const root=useRef();
 const smooth=useRef(0);
 useFrame((state,delta)=>{
  const p=THREE.MathUtils.clamp(progress.current,0,1);
  smooth.current=THREE.MathUtils.damp(smooth.current,p,2.5,delta);
  const t=smooth.current;
  // One continuous camera path: front lawn -> entrance -> connected rooms -> rear terrace.
  const cameraPath=new THREE.CatmullRomCurve3([
   new THREE.Vector3(0,4.3,22),
   new THREE.Vector3(0,3.0,14),
   new THREE.Vector3(0,2.25,8.5),
   new THREE.Vector3(0,2.05,3.5),
   new THREE.Vector3(0,2.05,-3.5),
   new THREE.Vector3(0,2.05,-10.5),
   new THREE.Vector3(0,3.1,-19.5)
  ]);
  const lookPath=new THREE.CatmullRomCurve3([
   new THREE.Vector3(0,2.2,12),
   new THREE.Vector3(0,1.8,8),
   new THREE.Vector3(0,1.65,3),
   new THREE.Vector3(0,1.65,-3),
   new THREE.Vector3(0,1.65,-10),
   new THREE.Vector3(0,1.8,-15),
   new THREE.Vector3(0,1.7,-24)
  ]);
  const pos=cameraPath.getPoint(t), target=lookPath.getPoint(t);
  state.camera.position.lerp(pos,1-Math.exp(-delta*3.5));
  state.camera.lookAt(target);
 });
 const mat=(color,roughness=.65,metalness=0)=> <meshStandardMaterial color={color} roughness={roughness} metalness={metalness}/>;
 const glass=<meshPhysicalMaterial color="#a8c3c1" roughness={.12} metalness={.12} transmission={.12} transparent opacity={.55}/>;
 const box=(x,y,z,sx,sy,sz,material,cast=true)=> <mesh position={[x,y,z]} castShadow={cast} receiveShadow><boxGeometry args={[sx,sy,sz]}/>{material}</mesh>;
 const column=(x,z)=> <group key={`col-${x}-${z}`}>{box(x,2.25,z,.2,4.5,.2,mat("#c0b6a4",.55))}{box(x,4.52,z,.34,.16,.34,mat("#b5a27e",.3,.45))}</group>;
 return <group ref={root}>
  {/* Ground and approach: the camera starts outside the same model it later enters. */}
  {box(0,-.45,0,90,.5,100,mat("#262923",.95),false)}
  {box(0,-.16,18,7,.12,17,mat("#b8b1a4",.9),false)}
  {box(0,-.08,12,5,.08,6,mat("#d3ccbd",.9),false)}
  {/* Large contemporary mansion shell: front elevation and roof remain visible on arrival. */}
  {box(0,4.55,-1,17,.34,27,mat("#292b27",.4))}
  {box(-8.25,2.15,-1,.35,4.3,27,mat("#d0c8b8",.72))}
  {box(8.25,2.15,-1,.35,4.3,27,mat("#d0c8b8",.72))}
  {box(-4.55,2.15,12.35,7.8,4.3,.32,mat("#d0c8b8",.72))}
  {box(4.55,2.15,12.35,7.8,4.3,.32,mat("#d0c8b8",.72))}
  {box(0,4.45,12.25,9.2,.2,.5,mat("#b6a17c",.32,.35))}
  {/* Entrance doors and full-height front glazing. */}
  {box(-2.0,2.05,12.12,2.7,4.05,.12,glass)}
  {box(2.0,2.05,12.12,2.7,4.05,.12,glass)}
  {box(0,2.0,12.0,.12,4,.22,mat("#393a34",.35))}
  {box(-3.45,2.15,11.96,.12,4.25,.2,mat("#b6a17c",.28,.5))}
  {box(3.45,2.15,11.96,.12,4.25,.2,mat("#b6a17c",.28,.5))}
  {/* Interior flooring and warm ceiling details. */}
  {box(0,-.05,-1,16,.18,27,mat("#b8ad9b",.78),false)}
  {box(0,4.25,6,15.8,.1,6,mat("#363832",.45))}
  {box(0,4.25,0,15.8,.1,6,mat("#363832",.45))}
  {box(0,4.25,-6,15.8,.1,6,mat("#363832",.45))}
  {box(0,4.25,-12,15.8,.1,6,mat("#363832",.45))}
  {/* Room divisions are intentionally open in the middle, so the camera can travel through. */}
  {box(-5.8,2.05,5.0,4.4,4.1,.18,mat("#d0c8b8",.8))}
  {box(5.8,2.05,5.0,4.4,4.1,.18,mat("#d0c8b8",.8))}
  {box(-5.8,2.05,-1.5,4.4,4.1,.18,mat("#d0c8b8",.8))}
  {box(5.8,2.05,-1.5,4.4,4.1,.18,mat("#d0c8b8",.8))}
  {box(-5.8,2.05,-8.2,4.4,4.1,.18,mat("#d0c8b8",.8))}
  {box(5.8,2.05,-8.2,4.4,4.1,.18,mat("#d0c8b8",.8))}
  {/* Glazing down both sides gives the connected home depth and natural light. */}
  {[-10,-6,-2,2,6].map(z=><group key={`window-${z}`}>
   {box(-8.05,2.15,z, .1,2.7,2.8,glass)}{box(8.05,2.15,z,.1,2.7,2.8,glass)}
   {box(-8.0,2.15,z-1.45,.14,2.9,.12,mat("#b6a17c",.28,.5))}
   {box(8.0,2.15,z-1.45,.14,2.9,.12,mat("#b6a17c",.28,.5))}
  </group>)}
  {/* Living room: sofa, low table, artwork wall and floor lamp. */}
  {box(-3.3,.65,2.1,3.4,.65,1.2,mat("#d7d0c3",.92))}
  {box(-3.3,1.02,2.35,3.35,.22,.8,mat("#e9e1d4",.9))}
  {box(-4.85,1.0,1.7,.2,1.0,1.1,mat("#d7d0c3",.92))}
  {box(-1.75,.46,-.3,2.2,.12,1.1,mat("#755a40",.55))}
  {box(-1.75,.56,-.3,1.8,.08,.85,mat("#c5b79e",.4))}
  {box(5.2,2.5,2.5,.1,1.8,2.3,mat("#9d927f",.8))}
  {/* Kitchen island and cabinetry. */}
  {box(0,1.0,-3.7,4.3,1.0,1.55,mat("#ded8cc",.3))}
  {box(0,1.53,-3.7,4.45,.12,1.68,mat("#f1eee6",.22))}
  {box(-4.5,1.25,-5.3,2.8,2.4,.48,mat("#755a42",.55))}
  {box(-4.5,2.48,-5.3,2.9,.12,.55,mat("#e5ded1",.22))}
  {[-1.25,0,1.25].map(x=><group key={`stool-${x}`}>{box(x,.47,-2.35,.42,.1,.42,mat("#8e775a",.5))}{box(x,.25,-2.35,.08,.5,.08,mat("#343631",.45))}</group>)}
  {/* Master bedroom: bed, headboard, bedside tables. */}
  {box(0,.52,-10.1,4.6,.42,3.2,mat("#d9d0c2",.9))}
  {box(0,.78,-10.0,4.45,.22,3.0,mat("#eee7dc",.88))}
  {box(0,1.25,-11.55,4.6,1.25,.22,mat("#795f49",.7))}
  {box(-3.0,.52,-10.0,.8,.8,.8,mat("#72573e",.6))}
  {box(3.0,.52,-10.0,.8,.8,.8,mat("#72573e",.6))}
  {box(0,3.25,-11.9,3.0,1.25,.1,mat("#b5a58c",.6))}
  {/* Rear doors and outdoor sanctuary. */}
  {box(-4.4,2.1,-14.25,7.6,4.1,.12,glass)}
  {box(4.4,2.1,-14.25,7.6,4.1,.12,glass)}
  {box(0,2.05,-14.3,.1,4,.2,mat("#393a34",.35))}
  {box(0,-.08,-19.4,20,.12,12,mat("#b9b09f",.9),false)}
  {box(0,.0,-20.1,8,.12,5.3,mat("#5d8886",.2,.15),false)}
  {box(0,.05,-17.4,8.6,.18,.18,mat("#d6c9b2",.3))}
  {box(0,.05,-22.8,8.6,.18,.18,mat("#d6c9b2",.3))}
  {[-4.2,4.2].map(x=>box(x,.05,-20.1,.18,.18,5.6,mat("#d6c9b2",.3)))}
  {/* Terrace loungers and planters. */}
  {[-6.5,6.5].map(x=><group key={`planter-${x}`}>{box(x,.25,-18.2,1.1,.5,1.1,mat("#6b6d5b",.9))}<mesh position={[x,.95,-18.2]} castShadow><sphereGeometry args={[.75,12,10]}/>{mat("#394c3a",.95)}</mesh></group>)}
  {[-3.8,3.8].map(x=><group key={`chair-${x}`}>{box(x,.3,-24.2,1.5,.18,2.2,mat("#b4a083",.8))}{box(x,.8,-25.0,1.5,1.0,.18,mat("#c9bca8",.9))}</group>)}
  {/* Architectural vertical fins and entrance landscaping. */}
  {[-7,-5,5,7].map(x=>column(x,12.0))}
  {[-6,-3,3,6].map(x=><group key={`frontplant-${x}`}><mesh position={[x,.45,15.2]} castShadow><sphereGeometry args={[.55,12,10]}/>{mat("#43523d",.9)}</mesh>{box(x,.18,15.2,.8,.3,.8,mat("#716653",.9))}</group>)}
  {/* A warm sun direction and subtle garden fill make the architecture readable. */}
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.17,0]} receiveShadow><planeGeometry args={[100,100]}/>{mat("#262923",1)}</mesh>
 </group>
}

function TourScene({progress}) {
 return <Canvas shadows camera={{position:[0,4.3,22],fov:48}} dpr={[1,1.5]}>
  <color attach="background" args={['#20231f']}/>
  <fog attach="fog" args={['#20231f',35,72]}/>
  <ambientLight intensity={1.15}/>
  <hemisphereLight intensity={1.1} color="#f5e9d2" groundColor="#343b32"/>
  <directionalLight position={[-10,16,12]} intensity={2.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}/>
  <pointLight position={[0,3,2]} intensity={2.2} color="#e8cda3" distance={18}/>
  <pointLight position={[0,3,-6]} intensity={1.5} color="#e8cda3" distance={18}/>
  <pointLight position={[0,4,-20]} intensity={1.6} color="#b5d3d0" distance={18}/>
  <Suspense fallback={null}><HouseModel progress={progress}/><Environment preset="city"/></Suspense>
 </Canvas>
}

function ImmersiveTour(){
 const section=useRef(null), progress=useRef(0), [active,setActive]=useState(0);
 useEffect(()=>{
  const ctx=gsap.context(()=>{
   ScrollTrigger.create({trigger:section.current,start:'top top',end:'bottom bottom',scrub:1,onUpdate:self=>{
    progress.current=self.progress;
    const idx=Math.min(4,Math.floor(Math.min(.9999,self.progress)*5));
    setActive(idx);
   }});
  },section);
  return()=>ctx.revert();
 },[]);
 const tourCopy=[
  {eyebrow:'00 / ARRIVAL',title:'The Residence',sub:'A modern architectural statement, defined by quiet proportions, expansive glazing, and a warm natural palette.',hero:true},
  {eyebrow:'01 / GATHER',title:'The Living Room',sub:'A generous social space shaped by natural light, tactile finishes, and a calm connection to the garden.'},
  {eyebrow:'02 / CREATE',title:'The Kitchen',sub:'A sculptural stone island anchors the room, balanced by warm timber cabinetry and considered everyday details.'},
  {eyebrow:'03 / RETREAT',title:'The Master Bedroom',sub:'A private sanctuary of soft textures, understated materials, and broad views through floor-to-ceiling glazing.'},
  {eyebrow:'04 / OUTDOORS',title:'The Backyard',sub:'The journey opens onto a secluded terrace, landscaped planting, and a reflecting pool made for slow afternoons.'}
 ];
 const c=tourCopy[active];
 return <section className="tour-wrap" ref={section} id="tour">
  <div className="tour-sticky"><div className="tour-canvas"><TourScene progress={progress}/></div>
   <div className="tour-vignette"/>
   <div className="tour-top"><span>ARCHON / PRIVATE RESIDENCE 01</span><span>SCROLL TO TAKE THE TOUR <ArrowDownRight size={15}/></span></div>
   {active===0?<div className="tour-hero-copy" key="hero"><p className="eyebrow">A STUDY IN MODERN LIVING</p><h1>A residence<br/>of <em>quiet grandeur.</em></h1><p className="tour-hero-desc">Explore the architecture from the front approach to the private garden.</p><span className="scroll-cue"><span/> SCROLL TO ENTER</span></div>:<div className="tour-copy" key={active}><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.sub}</p></div>}
   <div className="tour-progress">{tourCopy.map((r,i)=><span key={r.title} className={i===active?'current':''}/>)}</div>
   <div className="tour-bottom"><span>ONE CONTINUOUS 3D JOURNEY</span><span>0{active+1} — 05</span></div>
  </div>
 </section>
}

function Home(){
 return <main>
  <ImmersiveTour/>
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

function Home(){
 return <main>
  <section className="hero">
   <div className="hero-image" />
   <div className="hero-shade"/>
   <div className="hero-kicker"><span className="dot"/> INDEPENDENT ARCHITECTURE STUDIO <span>EST. 2018</span></div>
   <div className="hero-content"><p className="eyebrow">SPACES THAT STAY WITH YOU</p><h1>Architecture<br/><em>beyond</em> boundaries.</h1><div className="hero-bottom"><p>We shape thoughtful residences where material, light, and landscape come together in quiet harmony.</p><Link to="/residences" className="round-link">Explore our work <ArrowUpRight size={17}/></Link></div></div>
   <div className="hero-index"><span>01 / 04</span><span>SCROLL TO DISCOVER ↓</span></div>
  </section>
  <section className="intro section-pad"><Reveal><p className="eyebrow">OUR POINT OF VIEW</p><h2>Not just a building.<br/><em>A feeling, made tangible.</em></h2></Reveal><Reveal className="intro-bottom"><p>ARCHON is an architecture and design studio creating enduring places for living, gathering, and belonging. Every line has intention. Every detail earns its place.</p><Link to="/about" className="text-link">Discover our approach <ArrowUpRight size={16}/></Link></Reveal></section>
  <ImmersiveTour/>
  <section className="work section-pad"><div className="section-heading"><div><p className="eyebrow">SELECTED WORK / 2024—25</p><h2>Places with <em>presence.</em></h2></div><Link to="/residences" className="text-link">View all residences <ArrowUpRight size={16}/></Link></div><div className="project-grid">{projects.slice(0,2).map((p,i)=><ProjectCard p={p} index={i} key={p.n}/>)}</div></section>
  <section className="statement"><div className="statement-bg"/><Reveal><p className="eyebrow">A MORE HUMAN ARCHITECTURE</p><h2>Designed to be<br/><em>lived in.</em> Not just looked at.</h2><Link to="/about" className="round-link light">Meet the studio <ArrowUpRight size={16}/></Link></Reveal></section>
  <section className="cta-band"><p className="eyebrow">HAVE A PLACE IN MIND?</p><h2>Let's make room<br/>for <em>what matters.</em></h2><Link to="/contact" className="round-link">Start a conversation <ArrowUpRight size={16}/></Link></section>
 </main>
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