import {el} from '../utils';
export interface Media {src:string;alt:string;placeholder?:string;caption?:string}
export function mediaFigure(media:Media,className:string,eager=false) {
  const figure=el('figure',className);
  const frame=el('div','photo-frame');
  const fallback=()=>{frame.replaceChildren(el('span','photo-placeholder',media.placeholder || 'Image unavailable'));frame.classList.add('is-placeholder');};
  if(media.src){const image=el('img');image.alt=media.alt;image.loading=eager?'eager':'lazy';image.decoding='async';image.src=`${import.meta.env.BASE_URL}${media.src.replace(/^\//,'')}`;image.onerror=fallback;frame.append(image);}else fallback();
  figure.append(frame);if(media.caption)figure.append(el('figcaption','',media.caption));return figure;
}
