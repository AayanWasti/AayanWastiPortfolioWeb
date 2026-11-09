import sys,json
from playwright.sync_api import sync_playwright
JS = """
() => {
 const parse=c=>{const m=c.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const p=m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number);return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1}}
 const page={r:248,g:247,b:253}
 const over=(f,b)=>({r:f.r*f.a+b.r*(1-f.a),g:f.g*f.a+b.g*(1-f.a),b:f.b*f.a+b.b*(1-f.a)})
 const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)}
 const out=[];
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 const seen=new Set();
 while(walker.nextNode()){
  const n=walker.currentNode; const t=n.textContent.trim(); if(!t) continue;
  const el=n.parentElement; if(!el||seen.has(el)) continue; seen.add(el);
  const cs=getComputedStyle(el); if(cs.visibility==='hidden'||cs.display==='none') continue;
  const r=el.getBoundingClientRect(); if(r.width<2||r.height<2) continue;
  if(el.closest('[aria-hidden=true]')&&!el.closest('.project-art')) continue;
  let op=1,node=el; while(node&&node!==document.documentElement){op*=parseFloat(getComputedStyle(node).opacity);node=node.parentElement}
  const fg=parse(cs.color); if(!fg) continue; fg.a*=op;
  // background: composite ancestors bottom-up
  const chain=[];let a=el;while(a){chain.push(a);a=a.parentElement}
  let bg={...page},unknown=false;
  for(let i=chain.length-1;i>=0;i--){const s=getComputedStyle(chain[i]);const bc=parse(s.backgroundColor);if(bc&&bc.a>0)bg=over(bc,bg);if(s.backgroundImage&&s.backgroundImage!=='none'){unknown=true}}
  const f=over(fg,bg);const L1=lum(f),L2=lum(bg);const ratio=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
  const size=parseFloat(cs.fontSize),big=size>=24||(size>=18.66&&parseInt(cs.fontWeight)>=700);
  const need=big?3:4.5;
  if(ratio<need) out.push({t:t.slice(0,40),ratio:+ratio.toFixed(2),size,cls:el.className&&el.className.baseVal===undefined?el.className:'',tag:el.tagName,unknownBg:unknown});
 }
 return out;
}
"""
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1280,'height':900})
    pg.goto('http://localhost:4190/'); pg.evaluate("localStorage.setItem('portfolio-theme','light')"); pg.reload(); pg.wait_for_timeout(800)
    todo=['']; seen=set(); 
    while todo and len(seen)<70:
        h=todo.pop(0)
        if h in seen: continue
        seen.add(h)
        pg.goto('http://localhost:4190/#'+h); pg.reload(); pg.wait_for_timeout(900)
        # expand any collapsed rows
        for btn in pg.query_selector_all('.fn-head,.experience-row button,details summary'):
            try: btn.click(timeout=300)
            except: pass
        pg.wait_for_timeout(700)
        res=pg.evaluate(JS)
        print('#'+h, len(res))
        for r in res[:14]: print('   ',r)
        for l in pg.eval_on_selector_all('a[href^="#"]','els=>els.map(e=>e.getAttribute("href").slice(1))'):
            if l not in seen and l not in todo: todo.append(l)
