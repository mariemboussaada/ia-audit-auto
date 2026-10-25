const lum=(h:string)=>{const c=[1,3,5].map(i=>parseInt(h.substring(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]};
export const ratio=(a:string,b:string)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const hex=(c:number[])=>'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');
export const suggest=(fg:string,bg:string,min:number)=>{let c=[1,3,5].map(i=>parseInt(fg.substring(i,i+2),16));for(let k=0;k<50&&ratio(hex(c),bg)<min;k++)c=c.map(v=>Math.max(0,v-6));return hex(c)};
