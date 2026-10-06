import SectionHeading from './SectionHeading';
const skills = [
  { title: 'Frontend', tags: ['HTML5','CSS3','Flexbox / Grid','JavaScript ES6+','React','GatsbyJS'] },
  { title: 'Backend', tags: ['NodeJS','Strapi','GraphQL'] },
  { title: 'Languages & Database', tags: ['C#','Python','Bash','SQL Server','MySQL','SQLite'] },
  { title: 'Security & Systems', tags: ['OWASP Top 10','Burp Suite','Networking','Windows','Linux / Ubuntu'] },
  { title: 'Tools & Productivity', tags: ['Git','AI-assisted development','Debugging','Documentation','Automation scripts'] },
  { title: 'Soft Skills',  tags: ['Problem-solving','Logical thinking','Self-learning','Adaptability','Responsibility'] }
];
export default function Skills() { return <section id="skills" className="section section-alt"><div className="container"><SectionHeading number="02" label="SKILLS" title="Technical Skills" /><div className="skills-grid">{skills.map(item => <article className="skill-card reveal" key={item.title}><h3>{item.title}</h3>{item.tags && <div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}{item.text?.map(line => <p key={line}>{line}</p>)}</article>)}</div></div></section>; }
