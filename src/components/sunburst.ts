import {arc,select} from 'd3';
import expertise from '../data/expertise.json';
import education from '../data/education.json';
import {el,link} from '../utils';

interface Sector {educationId:string;lines:string[];startAngle:number;endAngle:number;innerRadius:number;outerRadius:number;group:string}
export function mountSunburst(host:HTMLElement) {
  const svg=select(host).append('svg').attr('viewBox','-380 -380 760 760').attr('role','group').attr('aria-label','Education wheel: environmental sciences and computing connected by interdisciplinary training');
  const sectors:Sector[]=[];
  expertise.groups.forEach((group,g)=>group.items.forEach((item,i)=>sectors.push({...item,group:group.id,startAngle:g*Math.PI+i*Math.PI/group.items.length,endAngle:g*Math.PI+(i+1)*Math.PI/group.items.length,innerRadius:216,outerRadius:348})));
  // A complete inner ring links both disciplinary halves, rather than duplicating courses.
  expertise.bridges.forEach((item,i)=>sectors.push({...item,group:'bridge',startAngle:i*Math.PI-Math.PI/2,endAngle:(i+1)*Math.PI-Math.PI/2,innerRadius:118,outerRadius:207}));
  const details=el('div','education-detail');details.id='education-wheel-details';details.setAttribute('aria-live','polite');
  details.append(el('p','muted','Choose a qualification to explore its story. The inner ring connects both disciplines.'));
  const shape=arc<Sector>().padAngle(.014).cornerRadius(3);
  const nodes=svg.selectAll<SVGGElement,Sector>('g').data(sectors).join('g').attr('class',d=>`wheel-sector ${d.group}`).attr('tabindex',0).attr('role','button').attr('aria-controls',details.id).attr('aria-pressed','false').attr('aria-label',d=>education.find(x=>x.id===d.educationId)?.title||d.educationId);
  nodes.append('path').attr('d',shape);
  nodes.each(function(d){const mid=(d.startAngle+d.endAngle)/2;const radius=(d.innerRadius+d.outerRadius)/2;const text=select(this).append('text').attr('text-anchor','middle').attr('transform',`translate(${Math.sin(mid)*radius},${-Math.cos(mid)*radius})`).attr('aria-hidden','true');d.lines.forEach((line,i)=>text.append('tspan').attr('x',0).attr('dy',i===0?`${-(d.lines.length-1)*.6}em`:'1.2em').text(line));});
  const picker=el('select','wheel-picker');picker.setAttribute('aria-label','Choose a qualification');const placeholder=el('option','','Choose a qualification');placeholder.value='';placeholder.disabled=true;placeholder.selected=true;picker.append(placeholder);for(const course of education){const option=el('option','',course.title);option.value=course.id;picker.append(option);}
  function activate(d:Sector){const course=education.find(x=>x.id===d.educationId);if(!course)return;picker.value=course.id;nodes.attr('aria-pressed',x=>String(x.educationId===d.educationId));details.replaceChildren(el('h3','',course.title),el('p','institution',`${course.institution} · ${course.period}`),el('p','',course.description),...(course.thesis?[el('p','thesis',`Thesis: ${course.thesis}`)]:[]),...(course.project?[el('p','thesis',`Project: ${course.project}`),...(course.projectUrl?[link('View publication →',course.projectUrl)]:[])]:[]),link('View in the timeline →',`#education-${course.id}`));}
  picker.onchange=()=>{const selected=sectors.find(d=>d.educationId===picker.value);if(selected)activate(selected);};
  nodes.on('click',(_,d)=>activate(d)).on('focus',(_,d)=>activate(d)).on('keydown',(event:KeyboardEvent,d)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activate(d);}});
  svg.append('text').attr('class','wheel-center').attr('text-anchor','middle').attr('y',-10).text('Environment &');svg.append('text').attr('class','wheel-center').attr('text-anchor','middle').attr('y',23).text('Artificial Intelligence');
  const legend=el('div','wheel-legend');for(const group of expertise.groups)legend.append(el('span',group.id,group.label));legend.append(el('span','bridge','Shared foundations'));
  host.append(legend,picker,details);
}
