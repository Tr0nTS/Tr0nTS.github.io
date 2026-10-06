import SectionHeading from './SectionHeading';
const jobs = [
  { date:'12/2024 — 09/2026', role:'Developer', company:'Mont-E Joint Stock Company', points:['Designed and developed website user interfaces.','Optimized performance and implemented responsive design.','Improved SEO and integrated APIs.'] },
  { date:'09/2024 — 12/2024', role:'Intern Developer', company:'Bizentro Vietnam Company Limited', points:["Developed menus for Enterprise Management software on the UNIERP platform for Windows using C# and the company's proprietary framework.",'Converted menus into web applications using the DAAF tool with HTML and jQuery (Low-code / No-code).'] }
];
export default function Experience() { return <section id="experience" className="section container"><SectionHeading number="03" label="EXPERIENCE" title="Work Experience" /><div className="timeline">{jobs.map(job => <article className="timeline-item reveal" key={job.company}><div className="timeline-date">{job.date}</div><div className="timeline-content"><h3>{job.role}</h3><h4>{job.company}</h4><ul>{job.points.map(point => <li key={point}>{point}</li>)}</ul></div></article>)}</div></section>; }
