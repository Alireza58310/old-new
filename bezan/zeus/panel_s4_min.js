import{connect as Xe}from"cloudflare:sockets";var nr="PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImZhIiBkaXI9InJ0bCI+CjxoZWFkPgo8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CjxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MSI+CjxsaW5rIHJlbD0iaWNvbiIgaHJlZj0iZGF0YTosIj4KPHRpdGxlPtqv2KfZhNix24wg2K7ZiNiv2LHZiNmH2KfbjCDYsdmI24zYp9uM24w8L3RpdGxlPgo8c3R5bGU+CiAgKnttYXJnaW46MDtwYWRkaW5nOjA7Ym94LXNpemluZzpib3JkZXItYm94O2ZvbnQtZmFtaWx5OidTZWdvZSBVSScsVGFob21hLHNhbnMtc2VyaWZ9CiAgYm9keXtiYWNrZ3JvdW5kOiMwYjBiMTI7Y29sb3I6I2ZmZn0KICBoZWFkZXJ7cGFkZGluZzo3MHB4IDZ2dyA0MHB4O3RleHQtYWxpZ246Y2VudGVyO2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA1MCUgMCUsIzFiMWIyZSwjMGIwYjEyIDcwJSl9CiAgaGVhZGVyIGgxe2ZvbnQtc2l6ZTo0MHB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLCNmZjUxMmYsI2YwOTgxOSk7LXdlYmtpdC1iYWNrZ3JvdW5kLWNsaXA6dGV4dDtiYWNrZ3JvdW5kLWNsaXA6dGV4dDtjb2xvcjp0cmFuc3BhcmVudDtsZXR0ZXItc3BhY2luZzoxcHh9CiAgaGVhZGVyIHB7b3BhY2l0eTouNjU7bWFyZ2luLXRvcDoxMHB4O2ZvbnQtc2l6ZToxNXB4fQogIC5ncmlke2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KGF1dG8tZml0LG1pbm1heCgzMDBweCwxZnIpKTtnYXA6MjZweDtwYWRkaW5nOjAgNnZ3IDcwcHg7bWF4LXdpZHRoOjEzMDBweDttYXJnaW46MCBhdXRvfQogIC5jYXJke2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE2MGRlZywjMTUxNTIyLCMwZTBlMTcpO2JvcmRlci1yYWRpdXM6MThweDtvdmVyZmxvdzpoaWRkZW47Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LC4wNik7CiAgICBjdXJzb3I6cG9pbnRlcjt0cmFuc2l0aW9uOi4zNXM7cG9zaXRpb246cmVsYXRpdmV9CiAgLmNhcmQ6aG92ZXJ7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLThweCk7Ym94LXNoYWRvdzowIDIwcHggNDBweCByZ2JhKDI0MCwxMjAsMzAsLjE4KTtib3JkZXItY29sb3I6cmdiYSgyNDAsMTUyLDI1LC40KX0KICAuc2hvdHtoZWlnaHQ6MTgwcHg7cG9zaXRpb246cmVsYXRpdmU7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO292ZXJmbG93OmhpZGRlbn0KICAuc2hvdCBzdmd7d2lkdGg6ODglO2ZpbHRlcjpkcm9wLXNoYWRvdygwIDEwcHggMThweCByZ2JhKDAsMCwwLC41KSk7dHJhbnNpdGlvbjouNHN9CiAgLmNhcmQ6aG92ZXIgLnNob3Qgc3Zne3RyYW5zZm9ybTpzY2FsZSgxLjA4KSB0cmFuc2xhdGVYKC02cHgpfQogIC50YWd7cG9zaXRpb246YWJzb2x1dGU7dG9wOjEycHg7bGVmdDoxMnB4O2JhY2tncm91bmQ6cmdiYSgyNDAsMTUyLDI1LC45KTtjb2xvcjojMWExYTFhO2ZvbnQtc2l6ZToxMXB4O2ZvbnQtd2VpZ2h0OmJvbGQ7CiAgICBwYWRkaW5nOjNweCAxMHB4O2JvcmRlci1yYWRpdXM6MjBweH0KICAuYm9keXtwYWRkaW5nOjE4cHggMjBweCAyMnB4fQogIC5ib2R5IGgze2ZvbnQtc2l6ZToxOXB4O21hcmdpbi1ib3R0b206NHB4fQogIC5ib2R5IC5tb2RlbHtvcGFjaXR5Oi41O2ZvbnQtc2l6ZToxMnB4O21hcmdpbi1ib3R0b206MTJweH0KICAuc3BlY3N7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgMWZyO2dhcDo4cHg7Zm9udC1zaXplOjEyLjVweDtvcGFjaXR5Oi44NX0KICAuc3BlY3MgZGl2IGJ7ZGlzcGxheTpibG9jaztjb2xvcjojZjA5ODE5O2ZvbnQtc2l6ZToxNXB4fQogIC5wcmljZXttYXJnaW4tdG9wOjE0cHg7Zm9udC1zaXplOjE3cHg7Zm9udC13ZWlnaHQ6Ym9sZDtjb2xvcjojMmVlNmE2fQogIC5tb2RhbHtwb3NpdGlvbjpmaXhlZDtpbnNldDowO2JhY2tncm91bmQ6cmdiYSgwLDAsMCwuNzUpO2Rpc3BsYXk6bm9uZTthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjt6LWluZGV4OjUwO3BhZGRpbmc6MjBweH0KICAubW9kYWwuc2hvd3tkaXNwbGF5OmZsZXh9CiAgLm1vZGFsLWJveHtiYWNrZ3JvdW5kOiMxNDE0MWY7bWF4LXdpZHRoOjQ4MHB4O3dpZHRoOjEwMCU7Ym9yZGVyLXJhZGl1czoyMHB4O3BhZGRpbmc6MzBweDtib3JkZXI6MXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsLjA4KTt0ZXh0LWFsaWduOmNlbnRlcn0KICAubW9kYWwtYm94IHN2Z3t3aWR0aDo3MCU7bWFyZ2luLWJvdHRvbToxMHB4fQogIC5tb2RhbC1ib3ggaDJ7Zm9udC1zaXplOjI0cHg7bWFyZ2luLWJvdHRvbTo2cHh9CiAgLmNsb3NlQnRue21hcmdpbi10b3A6MThweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmNTEyZiwjZjA5ODE5KTtib3JkZXI6bm9uZTtjb2xvcjojMWExYTFhO2ZvbnQtd2VpZ2h0OmJvbGQ7CiAgICBwYWRkaW5nOjEwcHggMjZweDtib3JkZXItcmFkaXVzOjMwcHg7Y3Vyc29yOnBvaW50ZXJ9Cjwvc3R5bGU+CjwvaGVhZD4KPGJvZHk+CjxoZWFkZXI+PGgxPvCfj47vuI8g2q/Yp9mE2LHbjCDYrtmI2K/YsdmI2YfYp9uMINix2YjbjNin24zbjDwvaDE+PHA+2YXYrNmF2YjYudmH4oCM2KfbjCDZhdmG2KrYrtioINin2LIg2YXZgdmH2YjZhduM4oCM2KrYsduM2YYg2LfYsdin2K3bjOKAjNmH2KfbjCDYrtmI2K/YsdmIPC9wPjwvaGVhZGVyPgo8ZGl2IGNsYXNzPSJncmlkIiBpZD0iZ3JpZCI+PC9kaXY+CjxkaXYgY2xhc3M9Im1vZGFsIiBpZD0ibW9kYWwiPjxkaXYgY2xhc3M9Im1vZGFsLWJveCIgaWQ9Im1vZGFsQm94Ij48L2Rpdj48L2Rpdj4KPHNjcmlwdD4KY29uc3QgY29sb3JzPVsnI2ZmNTEyZicsJyMyZWU2YTYnLCcjNGZhY2ZlJywnI2YwOTNmYicsJyNmYTcwOWEnLCcjZmZkMjNmJ107CmNvbnN0IGNhcnM9WwogIHtuYW1lOidWb3J0ZXggR1QnLG1vZGVsOifaqdmI2b7ZhyDYp9iz2b7YsdiqINuy27Dbstu2JyxocDo2MTIsc3BlZWQ6JzMuMXMnLHRvcDonMzMwJyxwcmljZTon27TbstuwLNuw27DbsCDYr9mE2KfYsScsdGFnOifYrNiv24zYrycsYzpjb2xvcnNbMF19LAogIHtuYW1lOidMdW5hciBQaGFudG9tJyxtb2RlbDon2LPYr9in2YYg2YTZiNqp2LMg2KfZhNqp2KrYsduM2qnbjCcsaHA6OTgwLHNwZWVkOicyLjBzJyx0b3A6JzM1MCcscHJpY2U6J9u127jbsCzbsNuw27Ag2K/ZhNin2LEnLHRhZzon2KfZhNqp2KrYsduM2qnbjCcsYzpjb2xvcnNbM119LAogIHtuYW1lOidEdW5lIFJhcHRvcicsbW9kZWw6J9i02KfYs9uM4oCM2KjZhNmG2K8g2KLZgdix2YjYrycsaHA6NTEwLHNwZWVkOic0LjRzJyx0b3A6JzIzMCcscHJpY2U6J9ux27nbsCzbsNuw27Ag2K/ZhNin2LEnLHRhZzon2b7YsdmB2LHZiNi0JyxjOmNvbG9yc1syXX0sCiAge25hbWU6J05vdmEgU3BlY3RyYScsbW9kZWw6J9mH2KfbjNm+2LHaqdin2LEg2YXZgdmH2YjZhduMJyxocDoxMzUwLHNwZWVkOicxLjhzJyx0b3A6JzQxMCcscHJpY2U6J9uyLNux27DbsCzbsNuw27Ag2K/ZhNin2LEnLHRhZzon2KfZhtit2LXYp9ix24wnLGM6Y29sb3JzWzRdfSwKICB7bmFtZTonRW1iZXIgUm9hZHN0ZXInLG1vZGVsOifaqdin2YbZiNix2KrbjNio2YQg2qnZhNin2LPbjNqpJyxocDo0NTAsc3BlZWQ6JzQuMHMnLHRvcDonMjcwJyxwcmljZTon27LbsduwLNuw27DbsCDYr9mE2KfYsScsdGFnOifaqdmE2KfYs9uM2qknLGM6Y29sb3JzWzFdfSwKICB7bmFtZTonR2xhY2llciBYMScsbW9kZWw6J9i02KfYs9uM4oCM2KjZhNmG2K8g2KfZhNqp2KrYsduM2qnbjCcsaHA6NzIwLHNwZWVkOiczLjNzJyx0b3A6JzI2MCcscHJpY2U6J9uz27PbsCzbsNuw27Ag2K/ZhNin2LEnLHRhZzon2K7Yp9mG2YjYp9iv2YcnLGM6Y29sb3JzWzVdfSwKXTsKZnVuY3Rpb24gY2FyU1ZHKGMpewogIHJldHVybiBgPHN2ZyB2aWV3Qm94PSIwIDAgNDAwIDE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxlbGxpcHNlIGN4PSIyMDAiIGN5PSIxNDAiIHJ4PSIxNzAiIHJ5PSIxMiIgZmlsbD0iIzAwMCIgb3BhY2l0eT0iMC40Ii8+CiAgICA8cGF0aCBkPSJNNDAgMTEwIFE1MCA2MCAxMTAgNTUgTDE2MCAzMCBRMjAwIDE4IDI1MCAzMCBMMzAwIDU1IFEzNTUgNjAgMzY1IDExMCBaIiBmaWxsPSIke2N9Ii8+CiAgICA8cGF0aCBkPSJNMTEwIDU1IEwxNjAgMzIgUTIwMCAyMiAyNTAgMzIgTDMwMCA1NSBMMjc1IDYwIEwxMzUgNjAgWiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwuMjUpIi8+CiAgICA8Y2lyY2xlIGN4PSIxMTAiIGN5PSIxMTUiIHI9IjI2IiBmaWxsPSIjMTExIi8+PGNpcmNsZSBjeD0iMTEwIiBjeT0iMTE1IiByPSIxMiIgZmlsbD0iIzc3NyIvPgogICAgPGNpcmNsZSBjeD0iMzAwIiBjeT0iMTE1IiByPSIyNiIgZmlsbD0iIzExMSIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjExNSIgcj0iMTIiIGZpbGw9IiM3NzciLz4KICAgIDxyZWN0IHg9IjQ1IiB5PSI5NSIgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiByeD0iNCIgZmlsbD0iI2ZmZmJlMCIvPgogICAgPHJlY3QgeD0iMzMwIiB5PSI5NSIgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiByeD0iNCIgZmlsbD0iI2ZmM2IzYiIvPgogIDwvc3ZnPmA7Cn0KY29uc3QgZ3JpZD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3JpZCcpOwpjYXJzLmZvckVhY2goKGNhcixpKT0+ewogIGNvbnN0IGVsPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOwogIGVsLmNsYXNzTmFtZT0nY2FyZCc7CiAgZWwuaW5uZXJIVE1MPWA8ZGl2IGNsYXNzPSJzaG90IiBzdHlsZT0iYmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlLCR7Y2FyLmN9MjIsdHJhbnNwYXJlbnQgNzAlKSI+CiAgICAgIDxzcGFuIGNsYXNzPSJ0YWciPiR7Y2FyLnRhZ308L3NwYW4+JHtjYXJTVkcoY2FyLmMpfTwvZGl2PgogICAgPGRpdiBjbGFzcz0iYm9keSI+PGgzPiR7Y2FyLm5hbWV9PC9oMz48ZGl2IGNsYXNzPSJtb2RlbCI+JHtjYXIubW9kZWx9PC9kaXY+CiAgICAgIDxkaXYgY2xhc3M9InNwZWNzIj4KICAgICAgICA8ZGl2PtmC2K/YsdiqPGI+JHtjYXIuaHB9IGhwPC9iPjwvZGl2PgogICAgICAgIDxkaXY+27At27HbsNuwPGI+JHtjYXIuc3BlZWR9PC9iPjwvZGl2PgogICAgICAgIDxkaXY+2LPYsdi52Kog2YbZh9in24zbjDxiPiR7Y2FyLnRvcH0ga20vaDwvYj48L2Rpdj4KICAgICAgICA8ZGl2Ptix2K/ZhzxiPiR7Y2FyLnRhZ308L2I+PC9kaXY+CiAgICAgIDwvZGl2PgogICAgICA8ZGl2IGNsYXNzPSJwcmljZSI+JHtjYXIucHJpY2V9PC9kaXY+PC9kaXY+YDsKICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCk9Pm9wZW5Nb2RhbChjYXIpKTsKICBncmlkLmFwcGVuZENoaWxkKGVsKTsKfSk7CmZ1bmN0aW9uIG9wZW5Nb2RhbChjYXIpewogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbEJveCcpLmlubmVySFRNTD1gJHtjYXJTVkcoY2FyLmMpfTxoMj4ke2Nhci5uYW1lfTwvaDI+CiAgICA8cCBzdHlsZT0ib3BhY2l0eTouNjttYXJnaW4tYm90dG9tOjE0cHgiPiR7Y2FyLm1vZGVsfTwvcD4KICAgIDxkaXYgY2xhc3M9InNwZWNzIiBzdHlsZT0ianVzdGlmeS1jb250ZW50OmNlbnRlciI+CiAgICAgIDxkaXY+2YLYr9ix2Ko8Yj4ke2Nhci5ocH0gaHA8L2I+PC9kaXY+PGRpdj7bsC3bsduw27A8Yj4ke2Nhci5zcGVlZH08L2I+PC9kaXY+CiAgICAgIDxkaXY+2LPYsdi52Kog2YbZh9in24zbjDxiPiR7Y2FyLnRvcH0ga20vaDwvYj48L2Rpdj48ZGl2PtmC24zZhdiqPGIgc3R5bGU9ImNvbG9yOiMyZWU2YTYiPiR7Y2FyLnByaWNlfTwvYj48L2Rpdj4KICAgIDwvZGl2PjxidXR0b24gY2xhc3M9ImNsb3NlQnRuIiBvbmNsaWNrPSJkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JykiPtio2LPYqtmGPC9idXR0b24+YDsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwnKS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7Cn0KZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGU9PnsgaWYoZS50YXJnZXQuaWQ9PT0nbW9kYWwnKSBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7IH0pOwo8L3NjcmlwdD4KPC9ib2R5Pgo8L2h0bWw+",z=new Map,ve=new Map,Tt=8e3,st={t:0,v:"",p:null};function ar(){ve.clear(),st={t:0,v:"",p:null}}function or(e){let t=String(e&&e.message||e||"").toLowerCase();return t.includes("overloaded")||t.includes("network connection lost")||t.includes("timeout")||t.includes("timed out")||t.includes("temporarily")||t.includes("too many")||t.includes("reset")||t.includes("internal error")||t.includes("d1_error")}async function Ne(e,t=3){let r;for(let o=0;o<t;o++)try{return await e()}catch(s){if(r=s,o===t-1||!or(s))break;await new Promise(d=>setTimeout(d,120*(o+1)+Math.floor(Math.random()*120)))}throw r}var Kt=600*1e3;async function Bt(e,t,r){let o=t.length+"|"+r,s=Date.now(),d=ve.get(o);if(d&&s-d.t<Tt)return d.v;let a;try{a=await Ne(()=>e.DB.prepare(t).bind(r).first(),2)}catch(c){if(d&&s-d.t<Kt)return d.v;throw c}if(a&&(ve.set(o,{t:Date.now(),v:a}),ve.size>500)){let c=Date.now();for(let[l,n]of ve)c-n.t>=Tt&&ve.delete(l);ve.size>500&&ve.clear()}return a}async function sr(e,t,r){let o="L|"+t.length+"|"+r,s=Date.now(),d=ve.get(o);if(d&&s-d.t<Tt)return d.v;let a;try{a=await Ne(()=>e.DB.prepare(t).bind(r).all(),2)}catch(c){if(d&&s-d.t<Kt)return d.v;throw c}return a&&a.results&&a.results.length>0&&ve.set(o,{t:Date.now(),v:a}),a}var et=new Map,ir=12*3600*1e3,lr=600*1e3,se=new Map,Ie=new Map,Oe=new Map,mt=new Set,Ee=new Map,te=new Map,Ue=new Map,Q=new Map,pe=new Map,O=new Map,we=new Map,De=0,At=0,dr=300*1e3,cr="https://cloudflare-dns.com/dns-query",bt=64*1024,it=6*1024*1024,Qt=3e3,Ur=32*1024;var Lt=2048,$t=new TextEncoder,Ve=new TextDecoder,Dt=new Set(["443","2053","2083","2087","2096","8443"]),ur=300,tt=0,Rt=30*1e3,Mt=0;function pr(){let e=Date.now();if(!(e-Mt<Rt)){Mt=e;for(let t of te.keys()){let r=se.get(t)||0,o=z.get(t)||0,s=O.get(t)||0,d=e-(te.get(t)||0);r===0&&o===0&&s===0&&d>Rt&&(te.delete(t),Ue.delete(t),Q.delete(t),se.delete(t),z.delete(t),O.delete(t),Ie.delete(t),Ee.delete(t))}for(let[t,r]of Oe.entries())e-r>6e5&&Oe.delete(t)}}function ht(e,t){if(!e||!t)return;let r=Ie.get(e);r||(r=new Map,Ie.set(e,r)),r.set(t,(r.get(t)||0)+1)}function gr(e,t){let r=Ie.get(e);if(!r||!t)return 0;let o=(r.get(t)||0)-1;return o<=0?(r.delete(t),r.size===0&&Ie.delete(e),Oe.delete(e+"_hb_"+t),0):(r.set(t,o),o)}function fr(e,t,r,o,s){if(!r||!o||!s||s==="unknown")return;let d=r+"|"+s;if(mt.has(d))return;mt.add(d);let a=(async()=>{try{await new Promise(h=>setTimeout(h,8e3));let c=Ie.get(r);if(c&&(c.get(s)||0)>0)return;let l=await e.DB.prepare("SELECT active_ips FROM users WHERE uuid = ?").bind(o).first();if(!l)return;let n={};try{n=JSON.parse(l.active_ips||"{}")}catch{}if(!n[s])return;delete n[s],await e.DB.prepare("UPDATE users SET active_ips = ? WHERE uuid = ?").bind(JSON.stringify(n),o).run()}catch(c){console.error("[c85kz7x] "+(c&&c.message))}finally{mt.delete(d)}})();t&&t.waitUntil(a)}function Pt(e){function t(u,g){return g>>>u|g<<32-u}function r(u,g,k){return u&g^~u&k}function o(u,g,k){return u&g^u&k^g&k}function s(u){return t(2,u)^t(13,u)^t(22,u)}function d(u){return t(6,u)^t(11,u)^t(25,u)}function a(u){return t(7,u)^t(18,u)^u>>>3}function c(u){return t(17,u)^t(19,u)^u>>>10}let l=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],n=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],h=typeof e=="string"?new TextEncoder().encode(e):e,p=h.length*8,i=(h.length+8>>6)+1<<6,y=new Uint8Array(i);y.set(h),y[h.length]=128;let m=new DataView(y.buffer);m.setUint32(i-4,p,!1);let b=new Uint32Array(64);for(let u=0;u<i;u+=64){for(let I=0;I<16;I++)b[I]=m.getUint32(u+I*4,!1);for(let I=16;I<64;I++)b[I]=c(b[I-2])+b[I-7]+a(b[I-15])+b[I-16]>>>0;let[g,k,S,L,E,x,_,j]=n;for(let I=0;I<64;I++){let B=j+d(E)+r(E,x,_)+l[I]+b[I]>>>0,w=s(g)+o(g,k,S)>>>0;j=_,_=x,x=E,E=L+B>>>0,L=S,S=k,k=g,g=B+w>>>0}n[0]=n[0]+g>>>0,n[1]=n[1]+k>>>0,n[2]=n[2]+S>>>0,n[3]=n[3]+L>>>0,n[4]=n[4]+E>>>0,n[5]=n[5]+x>>>0,n[6]=n[6]+_>>>0,n[7]=n[7]+j>>>0}return n.slice(0,7).map(u=>u.toString(16).padStart(8,"0")).join("")}function xt(e){try{return decodeURIComponent(e)}catch{return e}}function Je(e){let t=String(e&&e.connection_type||"vless").toLowerCase(),r=t.includes("trojan"),o=t.includes("shadowsocks");return{vless:t.includes("vless")||!r&&!o,trojan:r,ss:o}}function zt(e,t,r){let o=[];Array.isArray(e)?o=e:typeof t=="string"&&t&&(o=t.split(","));let s=["vless","trojan","shadowsocks"],d=[];for(let a of o){let c=String(a||"").trim().toLowerCase();s.includes(c)&&!d.includes(c)&&d.push(c)}return d.length>0?d.join(","):r}var rt=new Map,Be={async evpBytesToKey(e,t){let r=new TextEncoder().encode(e),o=new Uint8Array(t),s=new Uint8Array(0),d=0;for(;d<t;){let a=new Uint8Array(s.length+r.length);a.set(s),a.set(r,s.length),s=new Uint8Array(await crypto.subtle.digest("MD5",a));let c=Math.min(s.length,t-d);o.set(s.subarray(0,c),d),d+=c}return o},async getMasterKey(e){let t=rt.get(e);return t||(t=await this.evpBytesToKey(e,32),rt.size>512&&rt.clear(),rt.set(e,t)),t},async deriveSubkey(e,t){let r=await this.getMasterKey(e),o=await crypto.subtle.importKey("raw",r,{name:"HKDF"},!1,["deriveKey"]);return await crypto.subtle.deriveKey({name:"HKDF",hash:"SHA-1",salt:t,info:new TextEncoder().encode("ss-subkey")},o,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])},incrementNonce(e){for(let t=0;t<e.length&&(e[t]++,e[t]===0);t++);},async decryptChunk(e,t,r){try{let o=await crypto.subtle.decrypt({name:"AES-GCM",iv:new Uint8Array(t)},e,r);return this.incrementNonce(t),new Uint8Array(o)}catch{return null}},async encryptChunk(e,t,r){try{let o=await crypto.subtle.encrypt({name:"AES-GCM",iv:new Uint8Array(t)},e,r);return this.incrementNonce(t),new Uint8Array(o)}catch{return null}}};async function ye(e){try{let t=await e.json();return t&&typeof t=="object"?t:{}}catch{return{}}}async function mr(e,t={}){let r="https://subs.alis1.ir/Ip.txt";try{let o=await fetch(r,t);if(o.ok)return o}catch{}return await fetch(r,t)}async function br(e,t={}){let r="https://subs.alis1.ir/vipprox.txt",o="https://subs.alis1.ir/vipprox.txt";try{let s=await fetch(r,t);if(s.ok)return s}catch{}return await fetch(o,t)}var yt=0;async function hr(e,t){let r=Date.now();if(!(r-yt<36e5))try{let o=caches.default,s=new Request("https://int.cache.local/auto_reset");if(await o.match(s))return;let d=await e.DB.prepare("SELECT value FROM settings WHERE key = 'last_auto_reset_check'").first(),a=d&&parseInt(d.value)||0;if(r-a<36e5){yt=a;let l=Math.floor((36e5-(r-a))/1e3);l>0&&t&&t.waitUntil(o.put(s,new Response("1",{headers:{"Cache-Control":`max-age=${l}`}})));return}await e.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('last_auto_reset_check', ?)").bind(String(r)).run(),yt=r,t&&t.waitUntil(o.put(s,new Response("1",{headers:{"Cache-Control":"max-age=3600"}})));let c=Math.floor(r/864e5)*864e5;await e.DB.prepare("UPDATE users SET used_gb = 0, is_active = 1, last_reset_vol_time = ? WHERE auto_reset_vol_days > 0 AND ? >= (last_reset_vol_time + (auto_reset_vol_days * 86400000))").bind(c,c).run(),await e.DB.prepare("UPDATE users SET used_req = 0, is_active = 1, last_reset_req_time = ? WHERE auto_reset_req_days > 0 AND ? >= (last_reset_req_time + (auto_reset_req_days * 86400000))").bind(c,c).run()}catch{}}var wt=0;async function xr(e,t){let r=Date.now();if(!(r-wt<6e4))try{let o=await e.DB.prepare("SELECT value FROM settings WHERE key = 'ip_rotate_enabled'").first();if(!o||o.value!=="1")return;let s=caches.default,d=new Request("https://int.cache.local/auto_rotate");if(await s.match(d))return;let a=await e.DB.prepare("SELECT value FROM settings WHERE key = 'last_ip_rotate_check'").first(),c=a&&parseInt(a.value)||0;if(r-c<6e4){wt=c;let m=Math.floor((6e4-(r-c))/1e3);m>0&&t&&t.waitUntil(s.put(d,new Response("1",{headers:{"Cache-Control":`max-age=${m}`}})));return}await e.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('last_ip_rotate_check', ?)").bind(String(r)).run(),wt=r,t&&t.waitUntil(s.put(d,new Response("1",{headers:{"Cache-Control":"max-age=60"}})));let{results:l}=await e.DB.prepare("SELECT * FROM users WHERE auto_rotate_ip = 1 AND ? >= (last_rotate_time + (rotate_time * 60000))").bind(r).all();if(!l||l.length===0)return;let n=await mr("ips.txt");if(!n.ok)return;let p=(await n.text()).split("----------"),i={};p.forEach(m=>{let b=m.trim().split(`
`).map(k=>k.trim()).filter(k=>k.length>0);if(b.length===0)return;let u="Unknown",g=[];b.forEach(k=>{k.includes("#")?u=k.split("#")[1].trim():k.startsWith("[source")||g.push(k)}),g.length>0&&(i[u]=g)});let y=[];for(let m of l){let b=[];m.ip_operator==="all"?Object.values(i).forEach(k=>b=b.concat(k)):b=i[m.ip_operator]||[],b=[...new Set(b)];let u=m.ip_count||20,g=[];if(u>=b.length)g=b;else{let k=b.slice();for(let S=k.length-1;S>0;S--){let L=Math.floor(Math.random()*(S+1));[k[S],k[L]]=[k[L],k[S]]}g=k.slice(0,u)}g.length>0&&y.push(e.DB.prepare("UPDATE users SET ips = ?, last_rotate_time = ? WHERE id = ?").bind(g.join(`
`),r,m.id))}if(y.length>0)for(let b=0;b<y.length;b+=50)await e.DB.batch(y.slice(b,b+50))}catch{}}async function vt(e,t,r){try{if(Q.get(e+"_proxy_rotate"))return;Q.set(e+"_proxy_rotate",!0);let o=await t.DB.prepare("SELECT id, user_socks5, auto_rotate_user_proxy FROM users WHERE username = ?").bind(e).first();if(!o||o.auto_rotate_user_proxy!==1||!o.user_socks5){Q.delete(e+"_proxy_rotate");return}let s=[],d=!1;try{o.user_socks5.trim().startsWith("[")?(s=JSON.parse(o.user_socks5),d=!0):s=[o.user_socks5]}catch{s=[o.user_socks5]}let a=-1;for(let p=0;p<s.length;p++)if((typeof s[p]=="object"&&s[p]!==null?s[p].proxy:s[p])===r){a=p;break}if(a===-1){Q.delete(e+"_proxy_rotate");return}let c=typeof s[a]=="object"&&s[a]!==null&&s[a].country?s[a].country:"all";try{let p=new TextEncoder().encode(`GET /json/?fields=countryCode HTTP/1.1\r
Host: ip-api.com\r
Connection: close\r
\r
`),i=await Me(r,"ip-api.com",80,p),y=i.readable.getReader(),m="",b=new TextDecoder,u=setTimeout(()=>{try{i.close()}catch{}},2e3);try{for(;;){let k=await y.read();if(k.done||!k.value||(m+=b.decode(k.value,{stream:!0}),m.includes("countryCode")))break}}finally{clearTimeout(u);try{i.close()}catch{}}let g=m.match(/\{[^}]*"countryCode"\s*:\s*"([^"]+)"[^}]*\}/);g&&g[1]&&(c=g[1])}catch{}if(c==="all")try{let p=r.replace(/^(socks4|socks5|socks|http|https):\/\//i,"");p.includes("@")&&(p=p.substring(p.lastIndexOf("@")+1)),p.startsWith("[")?p=p.substring(1,p.indexOf("]")):p.includes(":")&&(p=p.substring(0,p.lastIndexOf(":")));let y=await(await fetch(`http://ip-api.com/json/${p}?fields=countryCode`)).json();y&&y.countryCode&&(c=y.countryCode)}catch{}let l=null,n=c.toUpperCase(),h=[];h.push({url:"proxy_vip/all",type:"repo"});for(let p of h)try{let i=await br(p.url);if(!i.ok)continue;let m=(await i.text()).split(`
`).map(b=>b.trim()).filter(b=>b.length>5);if(m.length>0){for(let u=m.length-1;u>0;u--){let g=Math.floor(Math.random()*(u+1));[m[u],m[g]]=[m[g],m[u]]}let b=m.slice(0,3).flatMap(u=>u.match(/^(socks4|socks5|socks|http|https|tg):\/\//i)||u.includes("t.me/socks")?[u]:p.type==="socks5"?[`socks5://${u}`]:p.type==="http"?[`http://${u}`]:[`socks5://${u}`,`http://${u}`]);try{l=await Promise.any(b.map(u=>new Promise(async(g,k)=>{let S=null,L=setTimeout(()=>{try{S&&S.close()}catch{}k(new Error("timeout"))},3e3);try{let E=$t.encode(`GET / HTTP/1.1\r
Host: 1.1.1.1\r
Connection: close\r
\r
`);S=await Me(u,"1.1.1.1",80,E);let _=await S.readable.getReader().read();clearTimeout(L);try{S.close()}catch{}_.done||!_.value?k(new Error("empty")):g(u)}catch(E){clearTimeout(L);try{S&&S.close()}catch{}k(E)}})))}catch{continue}if(l)break}}catch{}if(l){let p=l;d&&(typeof s[a]=="object"&&s[a]!==null?s[a].proxy=l:s[a]=l,p=JSON.stringify(s)),await t.DB.prepare("UPDATE users SET user_socks5 = ? WHERE id = ?").bind(p,o.id).run()}}catch{}finally{Q.delete(e+"_proxy_rotate")}}var ze="build-2",kt=180*1e3,Ut=600*1e3,_t=30*1e3,qe=null,Nt=!1;async function yr(e){let t=kt+Math.floor(Math.random()*(Ut-kt+1)),r=await e.DB.batch([e.DB.prepare("CREATE TABLE IF NOT EXISTS boot_gate (id TEXT PRIMARY KEY, started_at INTEGER)"),e.DB.prepare("INSERT OR IGNORE INTO boot_gate (id, started_at) VALUES (?, ?)").bind(ze,Date.now()),e.DB.prepare("INSERT OR IGNORE INTO boot_gate (id, started_at) VALUES (?, ?)").bind(ze+":len",t),e.DB.prepare("SELECT id, started_at FROM boot_gate WHERE id IN (?, ?)").bind(ze,ze+":len")]),o=r&&r[3]&&r[3].results||[],s=0,d=0;for(let a of o)a.id===ze?s=Number(a.started_at):a.id===ze+":len"&&(d=Number(a.started_at));if(!(s>0)||!(d>0))throw new Error("boot_gate unreadable");return{start:s,hold:Math.min(Ut,Math.max(kt,d))}}var Ot=0;async function wr(e){if(Nt)return null;if(!qe){if(Date.now()<Ot)return{start:Date.now(),hold:_t};try{if(!e||!e.DB)throw new Error("no DB");qe=await yr(e)}catch{return Ot=Date.now()+_t,{start:Date.now(),hold:_t}}}return Date.now()-qe.start>=qe.hold?(Nt=!0,null):qe}function vr(e){let r=`<script>
window.__HOLD = ${JSON.stringify({start:e.start,hold:e.hold,now:Date.now()})};
(function () {
	const remainMs = (window.__HOLD.start + window.__HOLD.hold) - window.__HOLD.now;
	const loadedAt = Date.now();

	function formatRemaining(ms) {
		const totalSeconds = Math.max(0, Math.floor(ms / 1000));
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
	}

	function timeLeft() {
		return remainMs - (Date.now() - loadedAt);
	}

	function mountCountdown() {
		const badge = document.createElement("div");
		badge.style.cssText = "position:fixed;top:10px;right:10px;background:rgba(0,0,0,.55);color:#9ecbff;font:12px monospace;padding:6px 10px;border-radius:6px;z-index:999999;letter-spacing:1px;pointer-events:none;";

		const label = document.createElement("span");
		label.id = "__hold_cd";
		label.textContent = formatRemaining(timeLeft());

		badge.appendChild(label);
		document.body.appendChild(badge);
	}

	function tick() {
		const left = timeLeft();
		const label = document.getElementById("__hold_cd");
		if (left <= 0) {
			clearInterval(intervalId);
			location.reload();
			return;
		}
		if (label) label.textContent = formatRemaining(left);
	}

	const intervalId = setInterval(tick, 1000);
	document.addEventListener("DOMContentLoaded", mountCountdown);
})();
</script>`;return new Response(rr().replace("</head>",r+"</head>"),{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}})}function kr(e,t){return vr(t)}var Nr={async fetch(e,t,r){let o=await wr(t);if(o)return kr(e,o);if(!t.DB)return new Response("Database binding 'DB' is missing in Cloudflare Workers settings.",{status:500});try{try{await le.ensureSchema(t.DB)}catch{}jr(t,r),pr(),lt&&(r.waitUntil(hr(t,r)),r.waitUntil(xr(t,r)));let s=new URL(e.url);return Se.isWebSocketUpgrade(e)?await Se.handleWebSocket(e,t,r):Se.isSubscriptionPath(s.pathname)?await Se.handleSubscription(s,t):s.pathname==="/icon.svg"||s.pathname==="/favicon.ico"||s.pathname==="/icon.png"||s.pathname==="/apple-touch-icon.png"?new Response(Dr,{headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"public, max-age=604800, immutable"}}):s.pathname==="/manifest.json"?new Response(Rr,{headers:{"Content-Type":"application/manifest+json; charset=utf-8","Cache-Control":"public, max-age=86400"}}):s.pathname==="/sw.js"?new Response(Mr,{headers:{"Content-Type":"application/javascript; charset=utf-8","Cache-Control":"no-cache"}}):s.pathname==="/robots.txt"?new Response(`User-agent: *
Disallow: /`,{headers:{"Content-Type":"text/plain; charset=UTF-8"}}):s.pathname==="/locations"?await Se.handleLocations():s.pathname.startsWith("/api/")?await Se.handleApi(e,s,t,r):s.pathname==="/adminas"||s.pathname==="/adminaslogin"?await Se.handlePanel(e,t):s.pathname.startsWith("/status/")?await Se.handleUserStatus(s,t):new Response(rr(),{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}})}catch{return new Response("Internal Server Error",{status:500})}}},Se={isWebSocketUpgrade(e){return(e.headers.get("Upgrade")||"").toLowerCase()==="websocket"},isSubscriptionPath(e){return e.startsWith("/sub/")||e.startsWith("/feed/")||e.startsWith("/singbox/")},async handleLocations(){try{let t=await(await fetch("https://speed.cloudflare.com/locations",{headers:{Referer:"https://speed.cloudflare.com/"}})).json();return new Response(JSON.stringify(t),{headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*"}})}catch(e){return new Response(JSON.stringify({error:e.message}),{status:500,headers:{"Content-Type":"application/json"}})}},async handleWebSocket(e,t,r){try{let o="";try{let d=Date.now();if(d-st.t<2e4)o=st.v;else{let a=await t.DB.prepare("SELECT value FROM settings WHERE key = 'proxy_ip'").first();o=a&&a.value?a.value:"",st={t:d,v:o,p:null}}}catch{}return Er(t,{proxy_ip:o},r,e)}catch{return new Response("Internal Server Error",{status:500})}},async handleSubscription(e,t){let r=e.pathname.startsWith("/singbox/"),o=e.pathname.startsWith("/sub/"),s=r?9:o?5:6,d=xt(e.pathname.slice(s)),a=e.hostname;try{let c=await t.DB.prepare("SELECT * FROM users WHERE username = ? COLLATE NOCASE OR uuid = ?").bind(d,d).first();if(!c)return new Response("Not Found",{status:404});try{await t.DB.prepare("UPDATE users SET used_req = used_req + 1 WHERE username = ?").bind(c.username).run()}catch{}if(r)return await qt.generateSingbox(c,a);let l="",n=!1;try{let{results:h}=await t.DB.prepare("SELECT key, value FROM settings WHERE key IN ('proxy_location_country', 'sub_info_configs')").all();for(let p of h||[])p.key==="proxy_location_country"&&p.value&&(l=p.value),p.key==="sub_info_configs"&&(n=p.value==="1")}catch{}return await qt.generateText(c,a,l,n)}catch(c){return new Response("Error building config: "+c.message,{status:500})}},async handlePanel(e,t){return await le.getPanelPassword(t.DB)?await le.verifyApiAuth(e,t)?new Response(ot.panel,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, max-age=0",Pragma:"no-cache",Expires:"0"}}):new Response(ot.login,{headers:{"Content-Type":"text/html; charset=utf-8"}}):new Response(ot.setup,{headers:{"Content-Type":"text/html; charset=utf-8"}})},async handleUserStatus(e,t){let r=xt(e.pathname.slice(8));if(!r)return new Response("Username is required",{status:400});try{let o=await t.DB.prepare("SELECT * FROM users WHERE username = ? COLLATE NOCASE OR uuid = ?").bind(r,r).first();if(!o)return new Response("User not found",{status:404});let s="",d=!1;try{let{results:l}=await t.DB.prepare("SELECT key, value FROM settings WHERE key IN ('proxy_location_country', 'sub_info_configs')").all();for(let n of l||[])n.key==="proxy_location_country"&&n.value&&(s=n.value),n.key==="sub_info_configs"&&(d=n.value==="1")}catch{}let a=JSON.stringify({username:o.username,uuid:o.uuid,limit_gb:o.limit_gb,expiry_days:o.expiry_days,used_gb:(o.used_gb||0)+(z.get(o.username)||0)/(1024*1024*1024),limit_req:o.limit_req,used_req:(o.used_req||0)+(O.get(o.username)||0),is_active:o.is_active,online_count:Math.max((Ie.get(o.username)||new Map).size,Wt(o.active_ips)),ip_limit:o.ip_limit,created_at:o.created_at,tls:o.tls,port:o.port,ips:o.ips,fingerprint:o.fingerprint||"unsafe",user_proxy_iata:o.user_proxy_iata,user_socks5:o.user_socks5,user_proxy_ip:o.user_proxy_ip,global_proxy_iata:s,info_configs:d,connection_type:o.connection_type}),c=ot.status.replace("/* {{USER_DATA_PLACEHOLDER}} */",`window.statusUser = ${a};`);return new Response(c,{headers:{"Content-Type":"text/html; charset=utf-8"}})}catch(o){return new Response("Error: "+o.message,{status:500})}},async handleApi(e,t,r,o){e.method!=="GET"&&e.method!=="HEAD"&&ar();let s=await le.getPanelPassword(r.DB);if(t.pathname==="/api/setup-password"&&e.method==="POST"){if(s)return new Response(JSON.stringify({error:"\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0627\u0632 \u0642\u0628\u0644 \u062A\u0639\u0631\u06CC\u0641 \u0634\u062F\u0647 \u0627\u0633\u062A"}),{status:400,headers:{"Content-Type":"application/json; charset=utf-8"}});let{password:a}=await ye(e),c=(a||"").trim();if(!c||c.length<4)return new Response(JSON.stringify({error:"\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06F4 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F"}),{status:400,headers:{"Content-Type":"application/json; charset=utf-8"}});let l=await le.sha256(c);return await le.setPanelPassword(r.DB,l),we.clear(),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json; charset=utf-8","Set-Cookie":"sx_tok="+l+"; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000"}})}if(t.pathname==="/api/login"&&e.method==="POST"){let a=e.headers.get("CF-Connecting-IP")||"unknown",c=Date.now();if(we.size>256)for(let[m,b]of we)c-b.lastAttempt>9e5&&we.delete(m);let l=we.get(a)||{count:0,lastAttempt:0};if(l.count>=15&&c-l.lastAttempt<9e5){let m=Math.ceil((9e5-(c-l.lastAttempt))/6e4);return new Response(JSON.stringify({error:`\u062F\u0633\u062A\u0631\u0633\u06CC \u0634\u0645\u0627 \u0645\u0633\u062F\u0648\u062F \u0634\u062F. \u0644\u0637\u0641\u0627\u064B ${m} \u062F\u0642\u06CC\u0642\u0647 \u062F\u06CC\u06AF\u0631 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.`}),{status:429,headers:{"Content-Type":"application/json; charset=utf-8"}})}let{password:n}=await ye(e),h=(n||"").trim(),p=await le.sha256(h),i=await le.getPanelPassword(r.DB,!0),y=!1;if(i===p)y=!0;else{let m=await le.oldSha256(h);i===m&&(y=!0,await le.setPanelPassword(r.DB,p))}return y?(we.delete(a),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json; charset=utf-8","Set-Cookie":"sx_tok="+p+"; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000"}})):(l.count=c-l.lastAttempt>9e5?1:l.count+1,l.lastAttempt=c,we.set(a,l),new Response(JSON.stringify({error:`\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A (\u062A\u0644\u0627\u0634\u200C\u0647\u0627\u06CC \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647: ${15-l.count})`}),{status:401,headers:{"Content-Type":"application/json; charset=utf-8"}}))}if(t.pathname==="/api/logout"&&e.method==="POST")return new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json; charset=utf-8","Set-Cookie":"sx_tok=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax"}});if(t.pathname==="/api/recover"&&e.method==="POST"){let{api_token:a}=await ye(e);if(!a)return new Response(JSON.stringify({error:"Token is required"}),{status:400,headers:{"Content-Type":"application/json; charset=utf-8"}});try{let c=await fetch("https://api.cloudflare.com/client/v4/user/tokens/verify",{headers:{Authorization:"Bearer "+a}}),l=await c.json();if(!c.ok||!l.success)return new Response(JSON.stringify({error:"Invalid or expired Cloudflare token"}),{status:401,headers:{"Content-Type":"application/json; charset=utf-8"}});let n=t.hostname,h=!1;if(n.endsWith(".workers.dev")){let p=n.split("."),i=p[p.length-3],m=await(await fetch("https://api.cloudflare.com/client/v4/accounts",{headers:{Authorization:"Bearer "+a}})).json();if(m.success&&m.result)for(let b of m.result){let g=await(await fetch(`https://api.cloudflare.com/client/v4/accounts/${b.id}/workers/subdomain`,{headers:{Authorization:"Bearer "+a}})).json();if(g.success&&g.result&&g.result.subdomain===i){h=!0;break}}}else{let i=await(await fetch("https://api.cloudflare.com/client/v4/zones",{headers:{Authorization:"Bearer "+a}})).json();if(i.success&&i.result){for(let y of i.result)if(n===y.name||n.endsWith("."+y.name)){h=!0;break}}}return h?(await r.DB.prepare("DELETE FROM settings WHERE key = 'panel_password'").run(),dt=null,we.clear(),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json; charset=utf-8"}})):new Response(JSON.stringify({error:"\u0627\u06CC\u0646 \u062A\u0648\u06A9\u0646 \u0645\u062A\u0639\u0644\u0642 \u0628\u0647 \u0635\u0627\u062D\u0628 \u067E\u0640\u0646\u0640\u0644 \u0646\u06CC\u0633\u062A (\u0627\u06CC \u06A9\u0640\u0640\u062B\u0640\u0640\u0640\u06A9\u0640\u0640\u0640\u0634)"}),{status:403,headers:{"Content-Type":"application/json; charset=utf-8"}})}catch{return new Response(JSON.stringify({error:"Cloudflare API connection error"}),{status:500,headers:{"Content-Type":"application/json; charset=utf-8"}})}}if(!await le.verifyApiAuth(e,r)&&t.pathname!=="/api/test-proxy")return new Response(JSON.stringify({error:"Unauthorized"}),{status:401,headers:{"Content-Type":"application/json; charset=utf-8"}});if(t.pathname==="/api/restart-core"&&e.method==="POST")try{return z.clear(),se.clear(),te.clear(),Ue.clear(),Q.clear(),pe.clear(),O.clear(),Ie.clear(),Oe.clear(),Ee.clear(),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json"}})}catch(a){return new Response(JSON.stringify({error:a.message}),{status:500,headers:{"Content-Type":"application/json"}})}if(t.pathname==="/api/change-password"&&e.method==="POST"){let{current_password:a,new_password:c}=await ye(e),l=(a||"").trim(),n=(c||"").trim();if(!l||!n)return new Response(JSON.stringify({error:"\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0641\u0639\u0644\u06CC \u0648 \u062C\u062F\u06CC\u062F \u0627\u0644\u0632\u0627\u0645\u06CC \u0647\u0633\u062A\u0646\u062F"}),{status:400,headers:{"Content-Type":"application/json; charset=utf-8"}});let h=await le.sha256(l),p=await le.oldSha256(l),i=await le.getPanelPassword(r.DB,!0);if(i&&i!==h&&i!==p)return new Response(JSON.stringify({error:"\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0641\u0639\u0644\u06CC \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A"}),{status:401,headers:{"Content-Type":"application/json; charset=utf-8"}});if(n.length<4)return new Response(JSON.stringify({error:"\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062C\u062F\u06CC\u062F \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06F4 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F"}),{status:400,headers:{"Content-Type":"application/json; charset=utf-8"}});let y=await le.sha256(n);return await le.setPanelPassword(r.DB,y),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json; charset=utf-8","Set-Cookie":"sx_tok="+y+"; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000"}})}if(t.pathname==="/api/settings/bulk"){if(e.method==="GET")try{let{results:a}=await r.DB.prepare("SELECT * FROM settings").all(),c={};return a&&a.forEach(l=>{l.key!=="cf_token"&&l.key!=="panel_password"&&(c[l.key]=l.value)}),new Response(JSON.stringify(c),{headers:{"Content-Type":"application/json"}})}catch{return new Response(JSON.stringify({}),{headers:{"Content-Type":"application/json"}})}if(e.method==="POST"){let a=await ye(e);if(a.settings&&typeof a.settings=="object")for(let[c,l]of Object.entries(a.settings))await r.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind(c,String(l)).run();return new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json"}})}}if(t.pathname==="/api/bulk-advanced"&&e.method==="POST"){let a=await ye(e),c=[],l=[];for(let n of["advanced_frag","cipher_suites","tls_mask","ech_config"]){if(a[n]===void 0)continue;let h=a[n]===null?"":String(a[n]).trim();if(n==="advanced_frag"&&h)try{JSON.parse(h)}catch{return new Response(JSON.stringify({error:"Advanced Fragment JSON is invalid"}),{status:400,headers:{"Content-Type":"application/json"}})}c.push(n+" = ?"),l.push(h||null)}if(a.fingerprint!==void 0){let n=String(a.fingerprint||"").trim().toLowerCase();if(!["chrome","firefox","safari","ios","android","edge","360","qq","random","randomized","unsafe"].includes(n))return new Response(JSON.stringify({error:"fingerprint is invalid"}),{status:400,headers:{"Content-Type":"application/json"}});c.push("fingerprint = ?"),l.push(n)}return c.length&&await r.DB.prepare("UPDATE users SET "+c.join(", ")).bind(...l).run(),a.patterniha!==void 0&&await r.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('patterniha_all', ?)").bind(a.patterniha?"1":"0").run(),a.patterniha_ech!==void 0&&await r.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('patterniha_ech_all', ?)").bind(a.patterniha_ech?"1":"0").run(),a.patterniha===!0&&a.patterniha_ech===void 0&&await r.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('patterniha_ech_all', '0')").run(),a.patterniha_ech===!0&&a.patterniha===void 0&&await r.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('patterniha_all', '0')").run(),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json"}})}if(t.pathname==="/api/proxy-ip"){if(e.method==="POST"){let{proxy_ip:a,iata:c,socks5:l,country:n,info_configs:h,ech_sni:p,ech_doh:i,ech_doh_preset:y,ech_api:m}=await ye(e);{let b=g=>new Response(JSON.stringify({error:g}),{status:400,headers:{"Content-Type":"application/json"}});if(p!==void 0&&!/^[A-Za-z0-9]([A-Za-z0-9.-]{0,251}[A-Za-z0-9])?$/.test(String(p)))return b("ECH SNI \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A");if(i!==void 0&&!/^(udp|tcp|https|tls):\/\/[^\s"'<>\\+]{1,200}$/i.test(String(i)))return b("ECH DoH \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A");if(y!==void 0&&!/^[a-z0-9-]{1,24}$/.test(String(y)))return b("preset \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A");if(m!==void 0&&String(m)!==""&&!/^https?:\/\/[^\s"'<>\\]{1,200}$/i.test(String(m)))return b("\u0622\u062F\u0631\u0633 API \u0645\u0631\u06A9\u0632\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A");let u=(g,k)=>r.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind(g,String(k)).run();p!==void 0&&await u("ech_sni",p),i!==void 0&&await u("ech_doh",i),y!==void 0&&await u("ech_doh_preset",y),m!==void 0&&await u("ech_api",m)}return a!==void 0&&await r.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('proxy_ip', ?)").bind(a).run(),c!==void 0&&await r.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('proxy_location_iata', ?)").bind(c).run(),n!==void 0&&await r.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('proxy_location_country', ?)").bind(n).run(),l!==void 0&&await r.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('socks5', ?)").bind(l).run(),h!==void 0&&await r.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('sub_info_configs', ?)").bind(h?"1":"0").run(),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json"}})}if(e.method==="GET"){let a=await r.DB.prepare("SELECT value FROM settings WHERE key = 'proxy_ip'").first(),c=await r.DB.prepare("SELECT value FROM settings WHERE key = 'proxy_location_iata'").first(),l=await r.DB.prepare("SELECT value FROM settings WHERE key = 'proxy_location_country'").first(),n=await r.DB.prepare("SELECT value FROM settings WHERE key = 'socks5'").first(),h=await r.DB.prepare("SELECT value FROM settings WHERE key = 'sub_info_configs'").first(),p=await r.DB.prepare("SELECT value FROM settings WHERE key = 'patterniha_all'").first(),i=await r.DB.prepare("SELECT value FROM settings WHERE key = 'patterniha_ech_all'").first(),{results:y}=await r.DB.prepare("SELECT key, value FROM settings WHERE key IN ('ech_sni', 'ech_doh', 'ech_doh_preset', 'ech_api')").all(),m={};for(let b of y||[])m[b.key]=b.value;return new Response(JSON.stringify({proxy_ip:a?a.value:"",iata:c?c.value:"",country:l?l.value:"",socks5:n?n.value:"",info_configs:h?h.value==="1":!1,patterniha_all:p?p.value==="1":!1,patterniha_ech_all:i?i.value==="1":!1,ech_sni:m.ech_sni||"cloudflare-ech.com",ech_doh:m.ech_doh||"udp://1.1.1.1",ech_doh_preset:m.ech_doh_preset||"cf-udp",ech_api:m.ech_api||""}),{headers:{"Content-Type":"application/json"}})}}if(t.pathname==="/api/test-proxy"&&e.method==="POST"){let{proxy:a,skip_country:c}=await ye(e);if(!a)return new Response(JSON.stringify({error:"\u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC \u0648\u0627\u0631\u062F \u0646\u0634\u062F\u0647 \u0627\u0633\u062A"}),{status:400,headers:{"Content-Type":"application/json"}});if(a==="direct"){let l=Date.now();try{let n=new AbortController,h=setTimeout(()=>n.abort(),3e3);return await fetch("https://cp.cloudflare.com/generate_204",{method:"HEAD",signal:n.signal}),clearTimeout(h),new Response(JSON.stringify({success:!0,ping:Date.now()-l,country:"UN"}),{headers:{"Content-Type":"application/json"}})}catch{return new Response(JSON.stringify({error:"\u0646\u062A \u0622\u0632\u0627\u062F \u0642\u0637\u0639 \u0627\u0633\u062A"}),{status:200,headers:{"Content-Type":"application/json"}})}}try{let l="",n=a;if(a.includes("t.me/socks")||a.includes("tg://socks"))l=a.match(/server=([^&]+)/)?.[1]||"";else{let x=a.replace(/^(socks4|socks5|socks|http|https):\/\//i,"");if(x.includes("@")&&(x=x.substring(x.lastIndexOf("@")+1)),x.startsWith("["))l=x.substring(1,x.indexOf("]"));else{let _=x.lastIndexOf(":");_!==-1&&x.indexOf(":")===_?l=x.substring(0,_):l=x}}let h="UN",p=Date.now(),i=c?"1.1.1.1":"ip-api.com",y=c?"/":"/json/?fields=countryCode",m=new TextEncoder().encode("GET "+y+` HTTP/1.1\r
Host: `+i+`\r
Connection: close\r
\r
`),b=await Me(a,i,80,m),u=b.readable.getReader(),g="",k=new TextDecoder,S=setTimeout(()=>{try{b.close()}catch{}},3e3);try{for(;;){let E=await u.read();if(E.done||!E.value)break;if(g+=k.decode(E.value,{stream:!0}),c){if(g.includes("HTTP/1."))break}else if(g.includes("countryCode"))break}}finally{clearTimeout(S);try{b.close()}catch{}}if(!g)throw new Error("\u062A\u0627\u06CC\u0645\u200C\u0627\u0648\u062A \u062F\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u062F\u06CC\u062A\u0627");let L=Date.now()-p;if(!c){try{let E=g.match(/\{[^}]*"countryCode"\s*:\s*"([^"]+)"[^}]*\}/);E&&E[1]&&(h=E[1])}catch{}if(h==="UN"&&l)try{let x=await(await fetch(`http://ip-api.com/json/${l}?fields=countryCode`)).json();x&&x.countryCode&&(h=x.countryCode)}catch{}}return new Response(JSON.stringify({success:!0,ping:L,country:h}),{headers:{"Content-Type":"application/json"}})}catch(l){let n=l.message;return n.includes("Stream was cancelled")||n.includes("network")?n="\u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631 \u0642\u0637\u0639 \u0634\u062F (\u0627\u062D\u062A\u0645\u0627\u0644\u0627\u064B \u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC \u0645\u0633\u062F\u0648\u062F \u06CC\u0627 \u062E\u0627\u0645\u0648\u0634 \u0627\u0633\u062A)":n.includes("timeout")||n.includes("timed out")||n.includes("\u062A\u0627\u06CC\u0645\u200C\u0627\u0648\u062A")?n="\u062A\u0627\u06CC\u0645\u200C\u0627\u0648\u062A \u062F\u0631 \u0627\u062A\u0635\u0627\u0644 (\u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC \u062F\u0631 \u062F\u0633\u062A\u0631\u0633 \u0646\u06CC\u0633\u062A)":n.includes("Invalid URL")||n.includes("Invalid format")?n="\u0641\u0631\u0645\u062A \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0628\u0631\u0627\u06CC \u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A":n==="err"&&(n="\u062E\u0637\u0627\u06CC \u0646\u0627\u0645\u0634\u062E\u0635 (\u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0631\u0642\u0631\u0627\u0631 \u0646\u0634\u062F)"),new Response(JSON.stringify({error:n}),{status:500,headers:{"Content-Type":"application/json"}})}}if(t.pathname.startsWith("/api/users")){let a=t.pathname.split("/");if(a.length>3){let l=xt(a.pop());if(e.method==="PUT"){let n=await ye(e);if(Object.keys(n).length===0)return new Response(JSON.stringify({error:"Invalid request body"}),{status:400,headers:{"Content-Type":"application/json"}});if(n.toggle_only!==void 0)return await r.DB.prepare("UPDATE users SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE username = ?").bind(l).run(),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json"}});if(n.reset_action!==void 0)return n.reset_action==="volume"?(await r.DB.prepare("UPDATE users SET used_gb = 0, is_active = 1 WHERE username = ?").bind(l).run(),z.set(l,0)):n.reset_action==="req"?(await r.DB.prepare("UPDATE users SET used_req = 0, is_active = 1 WHERE username = ?").bind(l).run(),O.set(l,0)):n.reset_action==="time"&&await r.DB.prepare("UPDATE users SET created_at = CURRENT_TIMESTAMP, is_active = 1 WHERE username = ?").bind(l).run(),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json"}});{let{username:h,limit_gb:p,expiry_days:i,limit_req:y,ips:m,tls:b,port:u,fingerprint:g,ip_limit:k,block_porn:S,block_ads:L,frag_len:E,frag_int:x,advanced_frag:_,cipher_suites:j,tls_mask:I,user_proxy_iata:B,user_socks5:w,user_proxy_ip:H,auto_reset_vol_days:P,auto_reset_req_days:V,auto_rotate_ip:ie,rotate_time:oe,ip_operator:ce,ip_count:Z,auto_rotate_user_proxy:re,start_on_first_connect:J,enable_direct:ne,connection_type:$,protocols:fe,user_ipv6_enabled:de}=n;if(h&&h!==l){if(!/^[a-zA-Z0-9_-]+$/.test(h))return new Response(JSON.stringify({error:"\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u062C\u062F\u06CC\u062F \u063A\u06CC\u0631\u0645\u062C\u0627\u0632 \u0627\u0633\u062A"}),{status:400,headers:{"Content-Type":"application/json; charset=utf-8"}});if(await r.DB.prepare("SELECT id FROM users WHERE username = ? COLLATE NOCASE").bind(h).first())return new Response(JSON.stringify({error:"\u0627\u06CC\u0646 \u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0627\u0632 \u0642\u0628\u0644 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F"}),{status:400,headers:{"Content-Type":"application/json"}});z.has(l)&&(z.set(h,z.get(l)),z.delete(l)),O.has(l)&&(O.set(h,O.get(l)),O.delete(l)),se.has(l)&&(se.set(h,se.get(l)),se.delete(l)),te.has(l)&&(te.set(h,te.get(l)),te.delete(l))}let ae=await r.DB.prepare("SELECT uuid FROM users WHERE username = ?").bind(l).first(),Ce=ae&&ae.uuid?Pt(ae.uuid):null;return await r.DB.prepare("UPDATE users SET username = ?, limit_gb = ?, expiry_days = ?, limit_req = ?, ips = ?, tls = ?, port = ?, fingerprint = ?, max_connections = ?, ip_limit = ?, block_porn = ?, block_ads = ?, frag_len = ?, frag_int = ?, advanced_frag = ?, cipher_suites = ?, tls_mask = ?, user_proxy_iata = ?, user_socks5 = ?, user_proxy_ip = ?, auto_reset_vol_days = ?, auto_reset_req_days = ?, auto_rotate_ip = ?, rotate_time = ?, ip_operator = ?, ip_count = ?, auto_rotate_user_proxy = ?, start_on_first_connect = ?, enable_direct = ?, user_ipv6_enabled = ?, trojan_hash = COALESCE(trojan_hash, ?), connection_type = COALESCE(?, connection_type) WHERE username = ?").bind(h||l,p?parseFloat(p):null,i?parseInt(i):null,y?parseInt(y):null,m||null,b,u,g||"unsafe",k?parseInt(k):null,k?parseInt(k):null,S?1:0,L?1:0,E!==void 0?E:"200-3000",x!==void 0?x:"1-2",_||null,j||null,I||null,B||null,w||null,H||null,P?parseInt(P):0,V?parseInt(V):0,ie||0,oe||0,ce||"all",Z||20,re?1:0,J?1:0,ne!==void 0?ne?1:0:1,de?1:0,Ce,zt(fe,$,null),l).run(),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json"}})}}if(e.method==="DELETE")return await r.DB.prepare("DELETE FROM users WHERE username = ?").bind(l).run(),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json"}})}else{if(e.method==="GET"){try{await _r(r)}catch{}try{let{results:l}=await r.DB.prepare("SELECT * FROM users ORDER BY id DESC").all(),n=Date.now(),h=(l||[]).map(i=>{let y=(Ie.get(i.username)||new Map).size,m=Math.max(y,Wt(i.active_ips));return{...i,used_gb:(i.used_gb||0)+(z.get(i.username)||0)/(1024*1024*1024),used_req:(i.used_req||0)+(O.get(i.username)||0),is_online:m>0?1:0,online_count:m}}),p={today:0,total:0,d1Reads:0,d1Writes:0};try{let i=await Ir(r),y=new Date().toISOString().split("T")[0],m=await r.DB.prepare("SELECT value FROM settings WHERE key = 'req_last_date'").first(),b=await r.DB.prepare("SELECT value FROM settings WHERE key = 'req_total'").first(),u=b&&parseInt(b.value)||0,g=0;if(m&&m.value===y){let k=await r.DB.prepare("SELECT value FROM settings WHERE key = 'req_today'").first();g=k&&parseInt(k.value)||0}i.today>g&&(g=i.today,await r.DB.prepare("INSERT INTO settings (key, value) VALUES ('req_today', ?) ON CONFLICT(key) DO UPDATE SET value = ?").bind(String(g),String(g)).run(),await r.DB.prepare("INSERT INTO settings (key, value) VALUES ('req_last_date', ?) ON CONFLICT(key) DO UPDATE SET value = ?").bind(y,y).run()),i.total>u&&(u=i.total,await r.DB.prepare("INSERT INTO settings (key, value) VALUES ('req_total', ?) ON CONFLICT(key) DO UPDATE SET value = ?").bind(String(u),String(u)).run()),p.today=g+De,p.total=u+De,p.d1Reads=i.d1Reads||0,p.d1Writes=i.d1Writes||0}catch{}return new Response(JSON.stringify({users:h,serverTime:n,cfRequestsToday:p.today,cfRequestsTotal:p.total,d1Reads:p.d1Reads||0,d1Writes:p.d1Writes||0}),{headers:{"Content-Type":"application/json","Cache-Control":"no-store, no-cache, must-revalidate, max-age=0"}})}catch(l){return new Response(JSON.stringify({users:[],serverTime:Date.now(),cfRequestsToday:0,cfRequestsTotal:0,error:l.message}),{status:200,headers:{"Content-Type":"application/json","Cache-Control":"no-store, no-cache, must-revalidate, max-age=0"}})}}if(e.method==="POST"){let{username:l,uuid:n,limit_gb:h,expiry_days:p,limit_req:i,ips:y,tls:m,port:b,fingerprint:u,ip_limit:g,used_gb:k,used_req:S,created_at:L,is_active:E,block_porn:x,block_ads:_,frag_len:j,frag_int:I,advanced_frag:B,cipher_suites:w,tls_mask:H,ech_config:P,user_proxy_iata:V,user_socks5:ie,user_proxy_ip:oe,auto_reset_vol_days:ce,auto_reset_req_days:Z,auto_rotate_ip:re,rotate_time:J,ip_operator:ne,ip_count:$,auto_rotate_user_proxy:fe,start_on_first_connect:de,enable_direct:ae,connection_type:Ce,protocols:ut,user_ipv6_enabled:He}=await ye(e);if(!l)return new Response(JSON.stringify({error:"\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0627\u062C\u0628\u0627\u0631\u06CC \u0627\u0633\u062A"}),{status:400,headers:{"Content-Type":"application/json"}});if(l.length>32)return new Response(JSON.stringify({error:"\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0628\u06CC\u0634\u062A\u0631 \u0627\u0632 \u06F3\u06F2 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F"}),{status:400,headers:{"Content-Type":"application/json"}});if(!/^[a-zA-Z0-9_-]+$/.test(l))return new Response(JSON.stringify({error:"\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u063A\u06CC\u0631\u0645\u062C\u0627\u0632 \u0627\u0633\u062A (\u0641\u0642\u0637 \u062D\u0631\u0648\u0641\u060C \u0627\u0639\u062F\u0627\u062F\u060C \u062E\u0637 \u062A\u06CC\u0631\u0647 \u0648 \u0622\u0646\u062F\u0631\u0644\u0627\u06CC\u0646)"}),{status:400,headers:{"Content-Type":"application/json; charset=utf-8"}});let Ae=n;Ae||(Ae=`50414e45-4c5f-5a45-5553-${Array.from(crypto.getRandomValues(new Uint8Array(6))).map(Pe=>Pe.toString(16).padStart(2,"0")).join("")}`);let Fe=parseFloat(k),pt=isNaN(Fe)?0:Fe,Qe=parseInt(S),ke=isNaN(Qe)?0:Qe,$e=L||new Date().toISOString(),We=parseInt(E),gt=isNaN(We)?1:We;if(await r.DB.prepare("SELECT id FROM users WHERE username = ? COLLATE NOCASE").bind(l).first())return new Response(JSON.stringify({error:"\u0627\u06CC\u0646 \u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0627\u0632 \u0642\u0628\u0644 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F"}),{status:400,headers:{"Content-Type":"application/json; charset=utf-8"}});try{let _e=Math.floor(Date.now()/864e5)*864e5,Pe=Date.now(),f=Pt(Ae),T=zt(ut,Ce,"vless");return await r.DB.prepare("INSERT INTO users (username, uuid, limit_gb, expiry_days, limit_req, ips, connection_type, tls, port, fingerprint, max_connections, ip_limit, used_gb, used_req, created_at, is_active, block_porn, block_ads, frag_len, frag_int, advanced_frag, cipher_suites, tls_mask, ech_config, user_proxy_iata, user_socks5, user_proxy_ip, auto_reset_vol_days, auto_reset_req_days, last_reset_vol_time, last_reset_req_time, auto_rotate_ip, rotate_time, ip_operator, ip_count, last_rotate_time, auto_rotate_user_proxy, start_on_first_connect, trojan_hash, enable_direct, user_ipv6_enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(l,Ae,h?parseFloat(h):null,p?parseInt(p):null,i?parseInt(i):null,y||null,T,m,b,u||"unsafe",g?parseInt(g):null,g?parseInt(g):null,pt,ke,$e,gt,x?1:0,_?1:0,j!==void 0?j:"200-3000",I!==void 0?I:"1-2",B||null,w||null,H||null,typeof P=="string"&&P.length<=300&&!/[\s"'<>\\]/.test(P)&&P||null,V||null,ie||null,oe||null,ce?parseInt(ce):0,Z?parseInt(Z):0,_e,_e,re||0,J||0,ne||"all",$||20,Pe,fe?1:0,de?1:0,f,ae!==void 0?ae?1:0:1,He?1:0).run(),new Response(JSON.stringify({success:!0}),{headers:{"Content-Type":"application/json"}})}catch(_e){return new Response(JSON.stringify({error:_e.message}),{status:500,headers:{"Content-Type":"application/json"}})}}}}return new Response(JSON.stringify({error:"Not Found"}),{status:404,headers:{"Content-Type":"application/json"}})}},lt=!1,nt=null,Ht=0,Ft="3",dt=null,le={async ensureSchema(e){if(!lt&&!(nt&&Date.now()-Ht<2e4)){Ht=Date.now();try{let t=await e.prepare("SELECT value FROM settings WHERE key = 'schema_ver'").first();if(t&&t.value===Ft){lt=!0;return}}catch{}nt=(async()=>{try{await e.prepare("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, uuid TEXT, limit_gb REAL, expiry_days INTEGER, ips TEXT, connection_type TEXT, tls TEXT, port INTEGER, used_gb REAL DEFAULT 0, is_active INTEGER DEFAULT 1, last_active INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)").run()}catch{}try{await e.prepare("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)").run()}catch{}try{let{results:t}=await e.prepare("PRAGMA table_info(users)").all(),r=new Set((t||[]).map(d=>d.name)),o=[{name:"is_active",def:"INTEGER DEFAULT 1"},{name:"last_active",def:"INTEGER"},{name:"fingerprint",def:"TEXT DEFAULT 'chrome'"},{name:"max_connections",def:"INTEGER"},{name:"limit_req",def:"INTEGER"},{name:"used_req",def:"INTEGER DEFAULT 0"},{name:"ip_limit",def:"INTEGER DEFAULT NULL"},{name:"active_ips",def:"TEXT DEFAULT NULL"},{name:"block_porn",def:"INTEGER DEFAULT 0"},{name:"block_ads",def:"INTEGER DEFAULT 0"},{name:"frag_len",def:"TEXT DEFAULT '200-3000'"},{name:"frag_int",def:"TEXT DEFAULT '1-2'"},{name:"lifetime_used_gb",def:"REAL DEFAULT 0"},{name:"user_proxy_ip",def:"TEXT DEFAULT NULL"},{name:"user_proxy_iata",def:"TEXT DEFAULT NULL"},{name:"trojan_hash",def:"TEXT DEFAULT NULL"},{name:"user_socks5",def:"TEXT DEFAULT NULL"},{name:"first_connection_time",def:"INTEGER DEFAULT NULL"},{name:"start_on_first_connect",def:"INTEGER DEFAULT 0"},{name:"advanced_frag",def:"TEXT DEFAULT NULL"},{name:"cipher_suites",def:"TEXT DEFAULT NULL"},{name:"tls_mask",def:"TEXT DEFAULT NULL"},{name:"ech_config",def:"TEXT DEFAULT NULL"},{name:"auto_reset_vol_days",def:"INTEGER DEFAULT 0"},{name:"auto_reset_req_days",def:"INTEGER DEFAULT 0"},{name:"last_reset_vol_time",def:"INTEGER DEFAULT 0"},{name:"last_reset_req_time",def:"INTEGER DEFAULT 0"},{name:"auto_rotate_ip",def:"INTEGER DEFAULT 1"},{name:"rotate_time",def:"INTEGER DEFAULT 0"},{name:"ip_operator",def:"TEXT DEFAULT 'all'"},{name:"ip_count",def:"INTEGER DEFAULT 15"},{name:"last_rotate_time",def:"INTEGER DEFAULT 0"},{name:"auto_rotate_user_proxy",def:"INTEGER DEFAULT 0"},{name:"enable_direct",def:"INTEGER DEFAULT 1"},{name:"user_ipv6_enabled",def:"INTEGER DEFAULT 0"}],s=[];for(let d of o)r.has(d.name)||s.push(e.prepare(`ALTER TABLE users ADD COLUMN ${d.name} ${d.def}`));s.length>0&&await e.batch(s)}catch{}try{await e.prepare("SELECT value FROM settings WHERE key = 'proto_migrated_v1'").first()||(await e.prepare("UPDATE users SET connection_type = 'vl' || 'e' || 'ss,trojan' WHERE trojan_hash IS NOT NULL AND (connection_type IS NULL OR connection_type NOT LIKE '%trojan%')").run(),await e.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('proto_migrated_v1', '1')").run())}catch{}try{await e.prepare("UPDATE users SET ip_limit = max_connections WHERE ip_limit IS NULL AND max_connections IS NOT NULL").run()}catch{}try{await e.prepare("UPDATE users SET lifetime_used_gb = used_gb WHERE lifetime_used_gb = 0 OR lifetime_used_gb IS NULL").run()}catch{}try{await e.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('schema_ver', ?)").bind(Ft).run()}catch{}})();try{await nt,lt=!0}finally{nt=null}}},async getPanelPassword(e,t=!0){try{let r=await e.prepare("SELECT value FROM settings WHERE key = 'panel_password'").first();return dt=r&&r.value?r.value:null,dt}catch{return null}},async setPanelPassword(e,t){await e.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('panel_password', ?)").bind(t).run(),dt=t},async verifyApiAuth(e,t){let r=await this.getPanelPassword(t.DB);if(!r)return!0;let s=(e.headers.get("Cookie")||"").split(";").find(a=>a.trim().startsWith("sx_tok="));return s?s.split("=")[1].trim()===r:!1},async sha256(e){let t=new TextEncoder().encode(e),r=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(r)).map(s=>s.toString(16).padStart(2,"0")).join("")},async oldSha256(e){let t=new TextEncoder().encode(e),r=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(r)).map(s=>s.toString(16).padStart(2,"0")).join("")}};function Wt(e){if(!e)return 0;try{let t=JSON.parse(e),r=Date.now(),o=0;for(let[s,d]of Object.entries(t)){let a=d&&typeof d=="object"?d.timestamp:d;r-a<=18e4&&o++}return o}catch{return 0}}var qt={async generateText(e,t,r,o=!1){let s=[t];if(e.ips){let B=e.ips.split(`
`).map(w=>w.trim()).filter(w=>w.length>0);B.length>0&&(s=B)}let d=String(e.port||"443").split(",").map(B=>B.trim()).filter(B=>B.length>0),a=e.fingerprint||"unsafe",c=encodeURIComponent("/stream/aaaaaaaaaa/"+((e.uuid||"").split("-")[4]||"default")),l=Je(e),n=[],h=decodeURIComponent("%E2%9A%A0%EF%B8%8F%D9%BE%D9%86%D9%84%20%D8%B1%D8%A7%DB%8C%DA%AF%D8%A7%D9%86%D9%87%2B%D9%86%D9%81%D8%B1%D9%88%D8%B4%20%DA%A9.%D8%B5%D8%B5%D8%B5.%DA%A9%D8%B4%D8%B4%D8%B4%D8%B4%E2%9A%A0%EF%B8%8F"),p=decodeURIComponent("%F0%9F%9A%80%D9%BE%D9%86%D9%84%20%D8%AA%D9%88%D8%B3%D8%B7%20Alireza%20Tune%20%D8%AA%D9%88%D8%B3%D8%B9%D9%87%20%DB%8C%D8%A7%D9%81%D8%AA%D9%87%20%D8%A7%D8%B3%D8%AA%F0%9F%9A%80");o&&n.push("vless://"+e.uuid+"@0.0.0.0:1?encryption=none&security=none&type=ws&host="+t+"&path="+c+"#"+encodeURIComponent(h)),o&&n.push("vless://"+e.uuid+"@0.0.0.0:1?encryption=none&security=none&type=ws&host="+t+"&path="+c+"#"+encodeURIComponent(p));let i="Unlimited";if(e.limit_gb){let B=e.limit_gb-(e.used_gb||0);i=B>0?B.toFixed(2)+"GB":"0GB"}let y="Unlimited";if(e.expiry_days&&e.created_at){let B=new Date(e.created_at),w=e.first_connection_time?new Date(e.first_connection_time+e.expiry_days*24*60*60*1e3):new Date(B.getTime()+e.expiry_days*24*60*60*1e3),H=Math.ceil((w.getTime()-Date.now())/(1e3*60*60*24));y=H>0?H+"Days":"0Days"}let m="Unlimited";if(e.limit_req){let B=e.limit_req-(e.used_req||0);m=B>0?B.toLocaleString()+"Req":"0Req"}let b="\u{1F4CA} remaining | \u200E"+i+" | \u200E"+y+" | \u200E"+m;o&&n.push("vless://"+e.uuid+"@"+t+":80?path="+c+"&security=none&encryption=none&host="+t+"&fp="+a+"&type=ws#"+encodeURIComponent(b));let u="/stream/aaaaaaaaaa/"+((e.uuid||"").split("-")[4]||"default"),g=[];try{e.user_socks5&&e.user_socks5.trim().startsWith("[")?g=JSON.parse(e.user_socks5):e.user_socks5||e.user_proxy_ip?g=[e.user_socks5||e.user_proxy_ip]:g=[null]}catch{g=[e.user_socks5||e.user_proxy_ip]}(!Array.isArray(g)||g.length===0)&&(g=[]),e.enable_direct!==0?g.some(w=>w===null||w==="")||g.push(null):g=g.filter(B=>B!==null&&B!==""),g.length===0&&(g=[null]);for(let B=0;B<g.length;B++){let w=g[B],H=typeof w=="object"&&w!==null?w.proxy:w,P=typeof w=="object"&&w!==null?w.country:H?H===e.user_proxy_ip&&e.user_proxy_iata||"":r||"",V=!1;if(!P&&H){let Z=et.get(H);Z&&Date.now()-Z.t<(Z.c?ir:lr)&&(P=Z.c,V=!0)}if(!P&&H&&!V){try{let Z=new TextEncoder().encode(`GET /json/?fields=countryCode HTTP/1.1\r
Host: ip-api.com\r
Connection: close\r
\r
`),re=await Me(H,"ip-api.com",80,Z),J=re.readable.getReader(),ne="",$=new TextDecoder,fe=setTimeout(()=>{try{re.close()}catch{}},2e3);try{for(;;){let ae=await J.read();if(ae.done||!ae.value||(ne+=$.decode(ae.value,{stream:!0}),ne.includes("countryCode")))break}}finally{clearTimeout(fe);try{re.close()}catch{}}let de=ne.match(/\{[^}]*"countryCode"\s*:\s*"([^"]+)"[^}]*\}/);de&&de[1]&&(P=de[1])}catch{}if(!P){let Z="",J=H.replace(/^(socks4|socks5|socks|http|https):\/\//i,"");if(J.includes("@")&&(J=J.substring(J.lastIndexOf("@")+1)),J.startsWith("["))Z=J.substring(1,J.indexOf("]"));else{let ne=J.lastIndexOf(":");ne!==-1&&J.indexOf(":")===ne?Z=J.substring(0,ne):Z=J}if(Z)try{let $=await(await fetch(`http://ip-api.com/json/${Z}?fields=countryCode`)).json();$&&$.countryCode&&(P=$.countryCode)}catch{}}}H&&!V&&typeof w!="object"&&(et.size>300&&et.clear(),et.set(H,{c:P||"",t:Date.now()}));let ie="\u{1F310}";if(P){let Z=P.toUpperCase().split("").map(re=>127397+re.charCodeAt(0));try{ie=String.fromCodePoint(...Z)}catch{}}let oe=encodeURIComponent(u+(w!==null&&w!==""?`/loc-${B}`:"")),ce=u+"/ss"+(w!==null&&w!==""?`/loc-${B}`:"");s.forEach(Z=>{d.forEach(re=>{let J=Dt.has(re),ne=J?"tls":"none",$=e.frag_len&&e.frag_int?"&fragment="+e.frag_len+","+e.frag_int:"";e.advanced_frag&&($+="&fm="+encodeURIComponent(e.advanced_frag)),e.cipher_suites&&($+="&cs="+encodeURIComponent(e.cipher_suites)),e.tls_mask&&($+="&mask="+encodeURIComponent(e.tls_mask)),e.ech_config&&($+="&ech="+encodeURIComponent(e.ech_config));let de=(String(P||"").toUpperCase().replace(/[^A-Z]/g,"").slice(0,2)||"NONE")+" | "+ie+" | "+e.username;if(l.vless&&n.push("vless://"+e.uuid+"@"+Z+":"+re+"?path="+oe+"&security="+ne+"&encryption=none&insecure=0&host="+t+"&fp="+a+"&type=ws&allowInsecure=0&sni="+t+$+"#"+encodeURIComponent(de)),l.trojan&&n.push("trojan://"+e.uuid+"@"+Z+":"+re+"?security="+ne+"&type=ws&host="+t+"&path="+oe+"&sni="+t+"&fp="+a+$+"#"+encodeURIComponent(de+" (Trojan)")),l.ss){let ae="v2ray-plugin;mode=websocket;host="+t+";path="+ce+(J?";tls":"");n.push("ss://"+btoa("aes-256-gcm:"+e.uuid)+"@"+Z+":"+re+"/?plugin="+encodeURIComponent(ae)+"#"+encodeURIComponent(de+" (SS)"))}})})}let L=["# System Update Feed: OK","# Sync Code: "+Math.random().toString(36).slice(2,10),"# Version: 2.10.1","# Description: Secure Node Configurations",""].join(`
`)+n.join(`
`),E=btoa(unescape(encodeURIComponent(L))),x=Math.floor((e.used_gb||0)*1073741824),_=e.limit_gb?Math.floor(e.limit_gb*1073741824):0,j=0;e.expiry_days&&e.created_at&&(j=e.first_connection_time?Math.floor((e.first_connection_time+e.expiry_days*864e5)/1e3):Math.floor((new Date(e.created_at).getTime()+e.expiry_days*864e5)/1e3));let I=`upload=0; download=${x}; total=${_}; expire=${j}`;return new Response(E,{headers:{"Content-Type":"text/plain; charset=utf-8","Access-Control-Allow-Origin":"*","Cache-Control":"no-store","Subscription-Userinfo":I}})},async generateSingbox(e,t){let r=[t];if(e.ips){let g=e.ips.split(`
`).map(k=>k.trim()).filter(k=>k.length>0);g.length>0&&(r=g)}let o=String(e.port||"443").split(",").map(g=>g.trim()).filter(g=>g.length>0),s=e.fingerprint||"unsafe",d=s==="unsafe"?"chrome":s,a=e.tls_mask||t,c="/stream/aaaaaaaaaa/"+((e.uuid||"").split("-")[4]||"default"),l=[];try{e.user_socks5&&e.user_socks5.trim().startsWith("[")?l=JSON.parse(e.user_socks5):e.user_socks5||e.user_proxy_ip?l=[e.user_socks5||e.user_proxy_ip]:l=[null]}catch{l=[e.user_socks5||e.user_proxy_ip]}(!Array.isArray(l)||l.length===0)&&(l=[]),e.enable_direct!==0?l.some(k=>k===null||k==="")||l.push(null):l=l.filter(g=>g!==null&&g!==""),l.length===0&&(l=[null]);let h=[],p=Je(e),i=p.trojan,y=0;for(let g of l){let k=c+(g!==null&&g!==""?`/loc-${y}`:""),S=c+"/ss"+(g!==null&&g!==""?`/loc-${y}`:"");r.forEach(L=>{o.forEach(E=>{let x=Dt.has(E),_={type:"vless",tag:`vl-${L}-${E}-loc${y}`,server:L,server_port:parseInt(E),uuid:e.uuid,packet_encoding:"xudp",transport:{type:"ws",path:k,headers:{Host:t}}};if(x&&(_.tls={enabled:!0,server_name:a,insecure:!1,utls:{enabled:!0,fingerprint:d}}),p.vless&&h.push(_),i){let j={type:"trojan",tag:`tj-${L}-${E}-loc${y}`,server:L,server_port:parseInt(E),password:e.uuid,transport:{type:"ws",path:k,headers:{Host:t}}};x&&(j.tls={enabled:!0,server_name:a,insecure:!1,utls:{enabled:!0,fingerprint:d}}),h.push(j)}p.ss&&h.push({type:"shadowsocks",tag:`sh-${L}-${E}-loc${y}`,server:L,server_port:parseInt(E),method:"aes-256-gcm",password:e.uuid,plugin:"v2ray-plugin",plugin_opts:"mode=websocket;host="+t+";path="+S+(x?";tls":"")})})}),y++}let m=h.map(g=>g.tag),b="udp://8.8.8.8";e.block_porn===1&&e.block_ads===1?b="udp://94.140.14.15":e.block_porn===1?b="udp://1.1.1.3":e.block_ads===1&&(b="udp://94.140.14.14");let u={log:{disabled:!1,level:"info"},dns:{servers:[{tag:"remote-dns",address:b,detour:m.length>0?"proxy":"direct"}],final:"remote-dns",independent_cache:!0},inbounds:[{type:"tun",tag:"tun-in",interface_name:"tun0",address:["172.19.0.1/30","fdfe:dcba:9876::1/126"],auto_route:!0,strict_route:!0,stack:"mixed"}],outbounds:[{type:"selector",tag:"proxy",outbounds:m.length>0?m:["direct"]},...h,{type:"direct",tag:"direct"},{type:"block",tag:"block"}],route:{rules:[{protocol:"dns",action:"hijack-dns"},{port:53,action:"hijack-dns"},{protocol:"icmp",outbound:"direct"}],auto_detect_interface:!0,final:m.length>0?"proxy":"direct"}};return new Response(JSON.stringify(u,null,2),{headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Cache-Control":"no-store"}})}};async function _r(e){let t=Date.now();for(let[o,s]of pe.entries())t>s.expires&&pe.delete(o);for(let[o,s]of we.entries())t-s.lastAttempt>9e5&&we.delete(o);let r=new Set([...z.keys(),...O.keys()]);for(let o of r){let s=z.get(o)||0,d=O.get(o)||0,a=se.get(o)||0;if(s<=0&&d<=0){z.delete(o),O.delete(o),a<=0&&(te.delete(o),te.delete(o+"_hb"));continue}if(Q.get(o))continue;let c=te.get(o)||0;if(a<=0||t-c>6e4){Q.set(o,!0),z.set(o,0),O.set(o,0);let l=s/(1024*1024*1024);try{await Ne(()=>e.DB.prepare("UPDATE users SET used_gb = used_gb + ?, lifetime_used_gb = lifetime_used_gb + ?, used_req = used_req + ? WHERE username = ?").bind(l,l,d,o).run())}catch(n){console.error(n.message),z.set(o,(z.get(o)||0)+s),O.set(o,(O.get(o)||0)+d)}finally{Q.delete(o),a<=0&&(te.delete(o),te.delete(o+"_hb"))}}}}function Et(e,t){if(!e)return"";let r=[];try{e.trim().startsWith("[")?r=JSON.parse(e):r=[e]}catch{r=[e]}if(!Array.isArray(r)||r.length===0)return"";let o=-1;if(t)try{let d=new URL(t.url),a=d.pathname.match(/\/loc-(\d+)/);if(a)o=parseInt(a[1],10);else{let c=d.searchParams.get("loc");c!==null&&!isNaN(Number(c))&&(o=parseInt(c,10))}}catch{}if(o===-1)return"";let s=r[o]||r[0];return typeof s=="object"?s.proxy||"":String(s||"")}async function Er(e,t=null,r=null,o=null){if(tt>=ur)return new Response(null,{status:503});let s=t?.proxy_ip||"",d=o&&o.headers.get("CF-Connecting-IP")||"unknown",a=d;if(d!=="unknown"){if(d.includes(":")){let f=d.split(":");f.length>=4&&(a=f.slice(0,4).join(":")+"::/64")}else if(d.includes(".")){let f=d.split(".");f.length===4&&(a=f.slice(0,3).join(".")+".0/24")}}let c=new WebSocketPair,[l,n]=Object.values(c);n.accept(),n.binaryType="arraybuffer",tt++;let h=!1,p=()=>{h||(h=!0,tt=Math.max(0,tt-1))};n.addEventListener("close",p),n.addEventListener("error",p);let i=null,y=null,m="8.8.4.4",b="https://cloudflare-dns.com/dns-query";function u(f){if(f<=0)return;if(!i){H+=f;return}H>0&&(f+=H,H=0);let T=z.get(i)||0;if(z.set(i,T+f),te.set(i,Date.now()),Q.get(i))return;let D=Ue.get(i)||0,A=Date.now(),K=500*1024*1024;if(T>=K&&A-D>18e4||T>0&&A-D>9e5){Q.set(i,!0);let C=z.get(i)||0,ee=O.get(i)||0;if(C<=0&&ee<=0){Q.set(i,!1);return}z.set(i,(z.get(i)||0)-C),O.set(i,(O.get(i)||0)-ee),Ue.set(i,A);let G=C/(1024*1024*1024),v=async()=>{try{await Ne(()=>e.DB.prepare("UPDATE users SET used_gb = used_gb + ?, lifetime_used_gb = lifetime_used_gb + ?, used_req = used_req + ?, last_active = ? WHERE username = ?").bind(G,G,ee,A,i).run())}catch(U){console.error(U.message),z.set(i,(z.get(i)||0)+C),O.set(i,(O.get(i)||0)+ee)}finally{Q.set(i,!1)}};r?r.waitUntil(v()):v()}}let g=!1,k=!1,S=()=>{if(p(),g)return;g=!0;let f=i;if(!f)return;let T=se.get(f)||0;if(k&&(T=Math.max(0,T-1),gr(f,a)<=0&&fr(e,r,f,y,a)),T<=0){se.delete(f);let D=z.get(f)||0,A=O.get(f)||0,K=Date.now(),C=Ue.get(f)||0;if((D>=20*1024*1024||K-C>6e5||A>=20)&&(D>0||A>0)&&!Q.get(f)){Q.set(f,!0),Ue.set(f,K),z.set(f,(z.get(f)||0)-D),O.set(f,(O.get(f)||0)-A);let G=D/(1024*1024*1024),v=async()=>{try{await Ne(()=>e.DB.prepare("UPDATE users SET used_gb = used_gb + ?, lifetime_used_gb = lifetime_used_gb + ?, used_req = used_req + ? WHERE username = ?").bind(G,G,A,f).run())}catch(U){console.error(U.message),z.set(f,(z.get(f)||0)+D),O.set(f,(O.get(f)||0)+A)}finally{Q.delete(f),te.delete(f)}};r?r.waitUntil(v()):v()}else te.delete(f)}else se.set(f,T)},L,E=async()=>{if(n.readyState===WebSocket.OPEN){try{if(n.send(new Uint8Array(0)),!y||!i){L=setTimeout(E,Math.floor(Math.random()*5e3)+2e4);return}let f=Date.now(),T=i+"_hb_"+(a||""),D=Oe.get(T)||0;if(f-D>=12e4){Oe.set(T,f);let A=await Ne(()=>e.DB.prepare("SELECT is_active, limit_gb, used_gb, limit_req, used_req, expiry_days, created_at, first_connection_time, ip_limit, active_ips FROM users WHERE uuid = ?").bind(y).first(),2),K=!1,C=!1,ee=null;if(!A||A.is_active===0)K=!0;else{let G=(A.used_gb||0)+(z.get(i)||0)/1073741824;if(A.limit_gb&&G>=A.limit_gb&&(K=!0),A.limit_req&&A.used_req+(O.get(i)||0)>=A.limit_req&&(K=!0),A.expiry_days&&A.created_at){let v=A.first_connection_time?new Date(A.first_connection_time+A.expiry_days*864e5):new Date(new Date(A.created_at).getTime()+A.expiry_days*864e5);f>v.getTime()&&(K=!0)}if(!K&&a&&a!=="unknown"){let v={};try{v=JSON.parse(A.active_ips||"{}")}catch{}let U=!1;for(let[F,M]of Object.entries(v)){let N=M&&typeof M=="object"?M.timestamp:M;F!==a&&f-N>18e4&&(delete v[F],U=!0)}if(!v[a])A.ip_limit&&A.ip_limit>0&&Object.keys(v).length>=A.ip_limit?C=!0:(v[a]={timestamp:f,count:1},U=!0);else{let F=Object.keys(v).sort((M,N)=>{let W=typeof v[M]=="object"?v[M].timestamp:v[M];return(typeof v[N]=="object"?v[N].timestamp:v[N])-W});if(A.ip_limit&&A.ip_limit>0&&F.indexOf(a)>=A.ip_limit)C=!0;else{let M=v[a],N=typeof M=="object"?M.timestamp:M;f-N>1e5&&(typeof M=="object"?M.timestamp=f:v[a]={timestamp:f,count:1},U=!0)}}(U||C)&&(ee=JSON.stringify(v))}}if(K){await e.DB.prepare("UPDATE users SET is_active = 0, last_active = 0 WHERE uuid = ?").bind(y).run(),clearTimeout(L),ge(n);return}if(C){clearTimeout(L),ge(n);return}ee!==null?(Ee.set(i,f),await e.DB.prepare("UPDATE users SET last_active = ?, active_ips = ? WHERE username = ?").bind(f,ee,i).run()):f-(Ee.get(i)||0)>=9e5&&(Ee.set(i,f),await e.DB.prepare("UPDATE users SET last_active = ? WHERE username = ?").bind(f,i).run())}}catch{}L=setTimeout(E,Math.floor(Math.random()*5e3)+2e4)}else clearTimeout(L)};L=setTimeout(E,Math.floor(Math.random()*5e3)+2e4);let x={socket:null,connectingPromise:null,retryConnect:null},_=null,j=!1,I=!1,B=!1,w=new Uint8Array(0),H=0,P=null;if(o)try{let f=new URL(o.url).pathname.match(/^\/stream\/aaaaaaaaaa\/([0-9A-Za-z]{1,32})\/ss(?:\/|$)/);f&&(P=f[1].toLowerCase())}catch{}let V=null,ie=null,oe=new Uint8Array(0),ce=null,Z=Promise.resolve(),re=!1,J=!1,ne=!1,$=0,fe=0,de=null,ae=null,Ce=()=>{if(ae){try{ae.releaseLock()}catch{}ae=null}de=null},He=Cr({getWriter:()=>{let f=x.socket;return f?(f!==de&&(Ce(),de=f,ae=f.writable.getWriter()),ae):null},releaseWriter:Ce,retryConnect:async()=>{typeof x.retryConnect=="function"&&await x.retryConnect()},closeConnection:()=>{try{x.socket?.close()}catch{}ge(n)},name:"vIeesWSQueue"}),Ae=!1,Fe=async(f,T=!0)=>{let D=T&&!Ae,A=await He.write(f,D);return A===!0&&(Ae=!0),A},pt=async f=>{let T=f.byteLength||0;if(u(T),B){await Jt(f,n,null,u,m);return}if(j){if(x.connectingPromise&&await x.connectingPromise,ie){await gt(f);return}await Fe(f);return}if(!j){if(w=Re(w,f),P){await jt();return}if(w.byteLength>0&&w[0]!==0){if(w.byteLength<58)return;let v=!0;for(let U=0;U<56;U++){let F=w[U];if(!(F>=48&&F<=57||F>=97&&F<=102)){v=!1;break}}if(v&&w[56]===13&&w[57]===10){await Qe();return}n.close();return}if(w.byteLength<24)return;let D=w[17],A=18+D+4;if(w.byteLength<A)return;let K=w[18+D+3];if(K===1)A+=4;else if(K===2){if(A+=1,w.byteLength<A)return;A+=w[18+D+4]}else if(K===3)A+=16;else{n.close();return}if(w.byteLength<A||I)return;if(I=!0,_=Sr(w),!_){n.close();return}if(w[18+D]===2&&(w[19+D]<<8|w[20+D])!==53){n.close();return}let C=null;try{C=await Bt(e,"SELECT * FROM users WHERE uuid = ? COLLATE NOCASE",_)}catch{}if(!C){n.close();return}if(!Je(C).vless){n.close();return}if(_=C.uuid,o){let v=new URL(o.url),U=((C.uuid||"").split("-")[4]||"default").toLowerCase();if(!(/^\/stream\/[^\/]+\//.test(v.pathname)&&v.pathname.toLowerCase().split("/")[3]===U)){n.close();return}}if(i=C.username,y=_,C.start_on_first_connect===1&&!C.first_connection_time&&!Q.get(_+"_first_conn")){Q.set(_+"_first_conn",!0);let v=Date.now();C.first_connection_time=v;let U=async()=>{try{await e.DB.prepare("UPDATE users SET first_connection_time = ? WHERE uuid = ?").bind(v,_).run()}catch{}};r?r.waitUntil(U()):U()}let ee=O.get(i)||0;if(O.set(i,ee+1),z.has(i)||z.set(i,0),g||n.readyState!==WebSocket.OPEN)return;if(C.is_active===0){n.close();return}if(C.limit_gb&&(C.used_gb||0)+(z.get(C.username)||0)/(1024*1024*1024)>=C.limit_gb){n.close();return}if(C.limit_req&&C.used_req+(O.get(i)||0)>C.limit_req){n.close();return}if(C.expiry_days&&C.created_at){let v=new Date(C.created_at),U=C.first_connection_time?new Date(C.first_connection_time+C.expiry_days*24*60*60*1e3):new Date(v.getTime()+C.expiry_days*24*60*60*1e3);if(new Date>U){try{await e.DB.prepare("UPDATE users SET is_active = 0, last_active = 0 WHERE uuid = ?").bind(_).run()}catch{}n.close();return}}if(C.block_porn===1&&C.block_ads===1?(m="94.140.14.15",b="https://family.adguard-dns.com/dns-query"):C.block_porn===1?(m="1.1.1.3",b="https://family.cloudflare-dns.com/dns-query"):C.block_ads===1&&(m="94.140.14.14",b="https://dns.adguard-dns.com/dns-query"),a&&a!=="unknown"){let v={};try{v=JSON.parse(C.active_ips||"{}")}catch{}let U=Date.now();for(let[N,W]of Object.entries(v)){let he=W&&typeof W=="object"?W.timestamp:W;U-he>18e4&&delete v[N]}let F=!1;if(v[a])typeof v[a]=="object"?(v[a].timestamp=U,v[a].count=(v[a].count||0)+1):v[a]={timestamp:U,count:1};else{let N=Object.keys(v);if(C.ip_limit&&C.ip_limit>0&&N.length>=C.ip_limit){n.close();return}v[a]={timestamp:U,count:1},F=!0}let M=Ee.get(i)||0;if(F||U-M>9e5){te.set(i,U),Ee.set(i,U);let N=async()=>{try{await e.DB.prepare("UPDATE users SET active_ips = ?, last_active = ? WHERE uuid = ?").bind(JSON.stringify(v),U,_).run()}catch{}};r?r.waitUntil(N()):N()}}j=!0;let G=se.get(i)||0;se.set(i,G+1),k=!0,ht(i,a),te.set(i,Date.now());try{let v=17,U=w[v++];v+=U;let F=w[v++],M=w[v++]<<8|w[v++],N=w[v++],W="";if(N===1)W=`${w[v++]}.${w[v++]}.${w[v++]}.${w[v++]}`;else if(N===2){let R=w[v++];W=Ve.decode(w.slice(v,v+R)),v+=R}else if(N===3){let R=[];for(let q=0;q<8;q++)R.push((w[v++]<<8|w[v++]).toString(16));W=R.join(":")}let he=w.slice(v),Te=new Uint8Array([w[0],0]);if((C.block_ads===1||C.block_porn===1)&&N===2&&M!==53)try{let R=await Yt(W,"A",b);if(R.some(Y=>Y.data==="0.0.0.0"||Y.data==="::"||Y.data==="176.103.130.130")){n.close();return}let X=R.find(Y=>Y.type===1||Y.type===28);X&&X.data&&(W=X.data)}catch{}if(F===2){M===53?(B=!0,await Jt(he,n,Te,u,m)):n.close();return}if(M===25||M===22||/^(0\.|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|169\.254\.|localhost$|::1|::ffff:|fd[0-9a-f]{2}:|fe80:)/i.test(W)){n.close();return}if(ct(W)&&!(C&&C.user_ipv6_enabled===1)){n.close();return}let Le=async(R=null,q=!0)=>{if(x.connectingPromise){await x.connectingPromise;return}let X=(async()=>{let Y=null,me=Et(C?.user_socks5,o);if(me)try{Y=await Me(me,W,M,R)}catch(ue){if(C.auto_rotate_user_proxy===1){let be=vt(C.username,e,me);r?r.waitUntil(be):be.catch(()=>{})}throw ue}else try{Y=await je(W,M,R,b)}catch(ue){if(q&&s)Y=await je(s,M,R,b);else if(q&&ue&&ue.connectPhase)try{Y=await je(W,M,R,b)}catch{throw ue}else throw ue}x.socket=Y,Y.closed.catch(()=>{}).finally(()=>ge(n)),It(Y,n,Te,null,u)})();x.connectingPromise=X;try{await X}finally{x.connectingPromise===X&&(x.connectingPromise=null)}};x.retryConnect=async()=>Le(null,!1),await Le(he,!0)}catch{n.close()}}},Qe=async()=>{if(I)return;I=!0;let f=Ve.decode(w.slice(0,56)),T=null;try{T=await Bt(e,"SELECT * FROM users WHERE trojan_hash = ?",f)}catch{}if(!T||!Je(T).trojan){n.close();return}let D=58;if(w.byteLength<D+2){I=!1;return}let A=w[D++],K=w[D++],C="";if(K===1){if(w.byteLength<D+4){I=!1;return}C=`${w[D++]}.${w[D++]}.${w[D++]}.${w[D++]}`}else if(K===3){if(w.byteLength<D+1){I=!1;return}let M=w[D++];if(w.byteLength<D+M){I=!1;return}C=Ve.decode(w.slice(D,D+M)),D+=M}else if(K===4){if(w.byteLength<D+16){I=!1;return}let M=[];for(let N=0;N<8;N++)M.push((w[D++]<<8|w[D++]).toString(16));C=M.join(":")}else{n.close();return}if(w.byteLength<D+4){I=!1;return}let ee=w[D++]<<8|w[D++];if(w[D]!==13||w[D+1]!==10){n.close();return}D+=2;let G=w.slice(D);if(T.is_active===0){n.close();return}if(T.limit_gb&&(T.used_gb||0)+(z.get(T.username)||0)/(1024*1024*1024)>=T.limit_gb){n.close();return}if(T.limit_req&&T.used_req>=T.limit_req){n.close();return}if(T.expiry_days&&T.created_at){let M=new Date(T.created_at),N=T.first_connection_time?new Date(T.first_connection_time+T.expiry_days*24*60*60*1e3):new Date(M.getTime()+T.expiry_days*24*60*60*1e3);if(new Date>N){try{await e.DB.prepare("UPDATE users SET is_active = 0, last_active = 0 WHERE uuid = ?").bind(T.uuid).run()}catch{}n.close();return}}if(ee===25||ee===22||/^(0\.|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|169\.254\.|localhost$|::1|::ffff:|fd[0-9a-f]{2}:|fe80:)/i.test(C)){n.close();return}if(ct(C)&&!(T&&T.user_ipv6_enabled===1)){n.close();return}if(i=T.username,y=T.uuid||null,T.start_on_first_connect===1&&!T.first_connection_time&&!Q.get(T.uuid+"_first_conn")){Q.set(T.uuid+"_first_conn",!0);let M=Date.now(),N=async()=>{try{await e.DB.prepare("UPDATE users SET first_connection_time = ? WHERE uuid = ?").bind(M,T.uuid).run()}catch{}};r?r.waitUntil(N()):N()}let v=O.get(i)||0;O.set(i,v+1),z.has(i)||z.set(i,0),j=!0;let U=se.get(i)||0;se.set(i,U+1),k=!0,ht(i,a),te.set(i,Date.now());let F=async(M=null)=>{if(x.connectingPromise){await x.connectingPromise;return}let N=(async()=>{let W=null,he=Et(T?.user_socks5,o);if(he)try{W=await Me(he,C,ee,M)}catch(Te){if(T.auto_rotate_user_proxy===1){let Le=vt(T.username,e,he);r?r.waitUntil(Le):Le.catch(()=>{})}throw Te}else try{W=await je(C,ee,M,b)}catch(Te){if(s)W=await je(s,ee,M,b);else throw Te}x.socket=W,W.closed.catch(()=>{}).finally(()=>ge(n)),It(W,n,null,null,u)})();x.connectingPromise=N;try{await N}finally{x.connectingPromise===N&&(x.connectingPromise=null)}};x.retryConnect=async()=>F(null);try{await F(G)}catch{n.close()}},ke=32,$e=16383,We=async()=>{let f=[];for(;;){if(ce===null){if(oe.byteLength<18)break;let D=await Be.decryptChunk(ie.key,ie.nonce,oe.subarray(0,18));if(!D)return null;let A=D[0]<<8|D[1];if(A>$e)return null;ce=A,oe=oe.slice(18)}if(oe.byteLength<ce+16)break;let T=await Be.decryptChunk(ie.key,ie.nonce,oe.subarray(0,ce+16));if(!T)return null;oe=oe.slice(ce+16),ce=null,T.byteLength>0&&f.push(T)}return f},gt=async f=>{if(oe=Re(oe,f),oe.byteLength>2*1024*1024){ge(n);return}let T=await We();if(T===null){ge(n);return}for(let D of T)await Fe(D)},jt=async()=>{if(w.byteLength<ke+18)return;if(w.byteLength>128*1024){n.close();return}if(!V){let R=null;try{let{results:q}=await sr(e,"SELECT * FROM users WHERE uuid LIKE ? LIMIT 8","%-"+P);R=(q||[]).find(X=>String(String(X.uuid||"").split("-")[4]||"").toLowerCase()===P)||null}catch{}if(!R||!Je(R).ss){n.close();return}V=R}let f=V,T=w.slice(0,ke),A={key:await Be.deriveSubkey(f.uuid,T),nonce:new Uint8Array(12)},K=await Be.decryptChunk(A.key,A.nonce,w.subarray(ke,ke+18));if(!K){n.close();return}let C=K[0]<<8|K[1];if(C===0||C>$e){n.close();return}let ee=ke+18+C+16;if(w.byteLength<ee)return;let G=await Be.decryptChunk(A.key,A.nonce,w.subarray(ke+18,ee));if(!G){n.close();return}let v=0,U=G[v++],F="";if(U===1){if(G.byteLength<v+4+2){n.close();return}F=`${G[v++]}.${G[v++]}.${G[v++]}.${G[v++]}`}else if(U===3){let R=G[v++];if(!R||G.byteLength<v+R+2){n.close();return}F=Ve.decode(G.subarray(v,v+R)),v+=R}else if(U===4){if(G.byteLength<v+16+2){n.close();return}let R=[];for(let q=0;q<8;q++)R.push((G[v++]<<8|G[v++]).toString(16));F=R.join(":")}else{n.close();return}let M=G[v++]<<8|G[v++],N=G.slice(v);ie=A,oe=w.slice(ee),ce=null,w=new Uint8Array(0);let W=await We();if(W===null){n.close();return}if(W.length>0&&(N=Re(N,...W)),I)return;if(I=!0,f.is_active===0){n.close();return}if(f.limit_gb&&(f.used_gb||0)+(z.get(f.username)||0)/(1024*1024*1024)>=f.limit_gb){n.close();return}if(f.expiry_days&&f.created_at){let R=new Date(f.created_at),q=f.first_connection_time?new Date(f.first_connection_time+f.expiry_days*24*60*60*1e3):new Date(R.getTime()+f.expiry_days*24*60*60*1e3);if(new Date>q){try{await e.DB.prepare("UPDATE users SET is_active = 0, last_active = 0 WHERE uuid = ?").bind(f.uuid).run()}catch{}n.close();return}}if(M===25||M===22||/^(0\.|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|169\.254\.|localhost$|::1|::ffff:|fd[0-9a-f]{2}:|fe80:)/i.test(F)){n.close();return}if(ct(F)&&!(f&&f.user_ipv6_enabled===1)){n.close();return}if(i=f.username,y=f.uuid||null,f.start_on_first_connect===1&&!f.first_connection_time&&!Q.get(f.uuid+"_first_conn")){Q.set(f.uuid+"_first_conn",!0);let R=Date.now();f.first_connection_time=R;let q=async()=>{try{await e.DB.prepare("UPDATE users SET first_connection_time = ? WHERE uuid = ?").bind(R,f.uuid).run()}catch{}};r?r.waitUntil(q()):q()}let he=O.get(i)||0;if(O.set(i,he+1),z.has(i)||z.set(i,0),g||n.readyState!==WebSocket.OPEN)return;if(f.limit_req&&f.used_req+(O.get(i)||0)>f.limit_req){n.close();return}if(f.block_porn===1&&f.block_ads===1?(m="94.140.14.15",b="https://family.adguard-dns.com/dns-query"):f.block_porn===1?(m="1.1.1.3",b="https://family.cloudflare-dns.com/dns-query"):f.block_ads===1&&(m="94.140.14.14",b="https://dns.adguard-dns.com/dns-query"),a&&a!=="unknown"){let R={};try{R=JSON.parse(f.active_ips||"{}")}catch{}let q=Date.now();for(let[me,ue]of Object.entries(R)){let be=ue&&typeof ue=="object"?ue.timestamp:ue;q-be>18e4&&delete R[me]}let X=!1;if(R[a])typeof R[a]=="object"?(R[a].timestamp=q,R[a].count=(R[a].count||0)+1):R[a]={timestamp:q,count:1};else{if(f.ip_limit&&f.ip_limit>0&&Object.keys(R).length>=f.ip_limit){n.close();return}R[a]={timestamp:q,count:1},X=!0}let Y=Ee.get(i)||0;if(X||q-Y>9e5){te.set(i,q),Ee.set(i,q);let me=async()=>{try{await e.DB.prepare("UPDATE users SET active_ips = ?, last_active = ? WHERE uuid = ?").bind(JSON.stringify(R),q,f.uuid).run()}catch{}};r?r.waitUntil(me()):me()}}if((f.block_ads===1||f.block_porn===1)&&U===3&&M!==53)try{let R=await Yt(F,"A",b);if(R.some(Y=>Y.data==="0.0.0.0"||Y.data==="::"||Y.data==="176.103.130.130")){n.close();return}let X=R.find(Y=>Y.type===1||Y.type===28);X&&X.data&&(F=X.data)}catch{}j=!0;let Te=se.get(i)||0;se.set(i,Te+1),k=!0,ht(i,a),te.set(i,Date.now());let Le=async(R=null)=>{if(x.connectingPromise){await x.connectingPromise;return}let q=(async()=>{let X=null,Y=Et(f?.user_socks5,o);if(Y)try{X=await Me(Y,F,M,R)}catch(be){if(f.auto_rotate_user_proxy===1){let ft=vt(f.username,e,Y);r?r.waitUntil(ft):ft.catch(()=>{})}throw be}else try{X=await je(F,M,R,b)}catch(be){if(s)X=await je(s,M,R,b);else if(be&&be.connectPhase)try{X=await je(F,M,R,b)}catch{throw be}else throw be}x.socket=X,X.closed.catch(()=>{}).finally(()=>ge(n));let me=crypto.getRandomValues(new Uint8Array(ke)),ue=await Be.deriveSubkey(f.uuid,me);It(X,n,null,null,u,{key:ue,nonce:new Uint8Array(12),salt:me})})();x.connectingPromise=q;try{await q}finally{x.connectingPromise===q&&(x.connectingPromise=null)}};x.retryConnect=async()=>{throw new Error("shadowsocks: reconnect not supported")};try{await Le(N)}catch{n.close()}},_e=f=>{J||(J=!0,re=!0,clearTimeout(L),$=0,fe=0,He.clear(),Ce(),ge(n),S())},Pe=f=>{Z=Z.then(f).catch(_e)};return n.addEventListener("message",f=>{if(re||J||typeof f.data=="string")return;let T=f.data.byteLength||0,D=$+T,A=fe+1;if(D>it||A>Qt){_e(new Error("ws queue overflow"));return}$=D,fe=A,Pe(async()=>{$=Math.max(0,$-T),fe=Math.max(0,fe-1),!J&&await pt(f.data)})}),n.addEventListener("close",()=>{clearTimeout(L),ge(n),S(),!ne&&(ne=!0,re=!0,Pe(async()=>{J||(await He.awaitEmpty(),Ce())}))}),n.addEventListener("error",f=>{_e(f)}),new Response(null,{status:101,webSocket:l})}var Ge=null,Gt=0,Zt="";async function Ir(e){if(!e.CF_API_TOKEN||!e.CF_ACCOUNT_ID)return{today:0,total:0,d1Reads:0,d1Writes:0};let t=Date.now(),r=new Date().toISOString().split("T")[0];if(Ge&&t-Gt<15e3&&Zt===r)return Ge;try{let o=new Date,s=new Date(o.getUTCFullYear(),o.getUTCMonth(),o.getUTCDate()).toISOString(),d=new Date(o.getTime()-720*60*60*1e3).toISOString(),a=`query {
	  viewer {
		accounts(filter: {accountTag: "${e.CF_ACCOUNT_ID}"}) {
		  today: workersInvocationsAdaptive(limit: 10, filter: {datetime_geq: "${s}"}) {
			sum { requests }
		  }
		  total: workersInvocationsAdaptive(limit: 10, filter: {datetime_geq: "${d}"}) {
			sum { requests }
		  }
		  d1: d1AnalyticsAdaptiveGroups(limit: 10, filter: {datetime_geq: "${s}"}) {
			sum { rowsRead rowsWritten }
		  }
		}
	  }
	}`,n=(await(await fetch("https://api.cloudflare.com/client/v4/graphql",{method:"POST",headers:{Authorization:"Bearer "+e.CF_API_TOKEN,"Content-Type":"application/json"},body:JSON.stringify({query:a})})).json())?.data?.viewer?.accounts?.[0],h=n?.today?.[0]?.sum?.requests||0,p=n?.total?.[0]?.sum?.requests||h,i=n?.d1?.[0]?.sum?.rowsRead||0,y=n?.d1?.[0]?.sum?.rowsWritten||0;return Ge={today:h,total:p,d1Reads:i,d1Writes:y},Gt=t,Zt=r,Ge}catch{return Ge||{today:0,total:0,d1Reads:0,d1Writes:0}}}function er(e){let t=String(e||"").split(".");return t.length===4&&t.every(r=>/^\d{1,3}$/.test(r)&&Number(r)>=0&&Number(r)<=255)}function xe(e){return e instanceof Uint8Array?e:e instanceof ArrayBuffer?new Uint8Array(e):ArrayBuffer.isView(e)?new Uint8Array(e.buffer,e.byteOffset,e.byteLength):new Uint8Array(e||0)}function Re(...e){if(e.length===2){let d=xe(e[0]),a=xe(e[1]);if(!d.byteLength)return a;if(!a.byteLength)return d;let c=new Uint8Array(d.byteLength+a.byteLength);return c.set(d,0),c.set(a,d.byteLength),c}let t=e.map(xe),r=0;for(let d of t)r+=d.byteLength;let o=new Uint8Array(r),s=0;for(let d of t)o.set(d,s),s+=d.byteLength;return o}function ge(e){try{(e.readyState===WebSocket.OPEN||e.readyState===WebSocket.CLOSING)&&e.close()}catch{}}async function Yt(e,t,r=cr){let o=`${e}:${t}:${r}`;if(pe.has(o)){let s=pe.get(o);if(Date.now()<s.expires)return s.data;if(pe.delete(o),s.data&&s.data.length>0)return Vt(e,t,r,o).catch(()=>{}),s.data}return await Vt(e,t,r,o)}async function Vt(e,t,r,o){let s=null,d=()=>{if(pe.size>=Lt){let a=pe.keys().next().value;a!==void 0&&pe.delete(a)}pe.set(o,{data:[],expires:Date.now()+3e4})};try{let c={A:1,AAAA:28}[t.toUpperCase()]||1,n=(E=>{let x=E.endsWith(".")?E.slice(0,-1).split("."):E.split("."),_=[];for(let j of x){let I=$t.encode(j);_.push(new Uint8Array([I.length]),I)}return _.push(new Uint8Array([0])),Re(..._)})(e),h=new Uint8Array(12+n.length+4),p=new DataView(h.buffer);p.setUint16(0,crypto.getRandomValues(new Uint16Array(1))[0]),p.setUint16(2,256),p.setUint16(4,1),h.set(n,12),p.setUint16(12+n.length,c),p.setUint16(12+n.length+2,1);let i=new AbortController;s=setTimeout(()=>i.abort(),1500);let y=await fetch(r,{method:"POST",headers:{"Content-Type":"application/dns-message",Accept:"application/dns-message"},body:h,signal:i.signal});if(!y.ok)return clearTimeout(s),d(),[];let m=new Uint8Array(await y.arrayBuffer());clearTimeout(s);let b=new DataView(m.buffer),u=b.getUint16(4),g=b.getUint16(6),k=E=>{let x=[],_=E,j=!1,I=-1,B=128;for(;_<m.length&&B-- >0;){let w=m[_];if(w===0){j||(I=_+1);break}if((w&192)===192){j||(I=_+2),_=(w&63)<<8|m[_+1],j=!0;continue}x.push(Ve.decode(m.slice(_+1,_+1+w))),_+=w+1}return I===-1&&(I=_+1),[x.join("."),I]},S=12;for(let E=0;E<u;E++){let[,x]=k(S);S=Number(x)+4}let L=[];for(let E=0;E<g&&S<m.length;E++){let[x,_]=k(S);S=Number(_);let j=b.getUint16(S);S+=2,S+=2;let I=b.getUint32(S);S+=4;let B=b.getUint16(S);S+=2;let w=m.slice(S,S+B);S+=B;let H;if(j===1&&B===4)H=`${w[0]}.${w[1]}.${w[2]}.${w[3]}`;else if(j===28&&B===16){let P=[];for(let V=0;V<16;V+=2)P.push((w[V]<<8|w[V+1]).toString(16));H=P.join(":")}else H=Array.from(w).map(P=>P.toString(16).padStart(2,"0")).join("");L.push({name:x,type:j,TTL:I,data:H})}if(pe.size>=Lt){let E=pe.keys().next().value;E!==void 0&&pe.delete(E)}return pe.set(o,{data:L,expires:Date.now()+dr}),L}catch{return s&&clearTimeout(s),d(),[]}}function Cr({getWriter:e,releaseWriter:t,retryConnect:r,closeConnection:o,name:s="UpstreamQueue"}){let d=[],a=0,c=0,l=!1,n=!1,h=null,p=[],i=null,y=(x,_=null)=>{if(x)for(let j of x)j&&(_?j.reject(_):j.resolve())},m=x=>{for(let _=a;_<d.length;_++){let j=d[_];j&&j.completions&&y(j.completions,x)}},b=()=>{a>32&&a*2>=d.length&&(d=d.slice(a),a=0)},u=()=>{if(c||l||!p.length)return;let x=p;p=[];for(let _ of x)_()},g=(x=null)=>{let _=x||(n?new Error(`${s}: queue closed`):null);_&&(m(_),y(i,_),i=null),d=[],a=0,c=0,u()},k=()=>{if(a>=d.length)return null;let x=d[a];return d[a++]=void 0,c-=x.chunk.byteLength,b(),x},S=()=>{let x=k();if(!x)return null;if(a>=d.length||x.chunk.byteLength>=bt)return x;let _=x.chunk.byteLength,j=a,I=x.allowRetry,B=x.completions||null;for(;j<d.length;){let P=d[j],V=_+P.chunk.byteLength;if(V>bt)break;_=V,I=I&&P.allowRetry,P.completions&&(B=B?B.concat(P.completions):P.completions),j++}if(j===a)return x;let w=h||=new Uint8Array(bt);w.set(x.chunk);let H=x.chunk.byteLength;for(;a<j;){let P=d[a];d[a++]=void 0,c-=P.chunk.byteLength,w.set(P.chunk,H),H+=P.chunk.byteLength}return b(),{chunk:w.subarray(0,_),allowRetry:I,completions:B}},L=async()=>{if(!(l||n)){l=!0;try{let x=0;for(;!n;){let _=S();if(!_)break;let j=e();if(!j)throw new Error(`${s}: remote writer unavailable`);let I=_.completions||null;i=I;try{try{await j.write(_.chunk)}catch(B){if(t?.(),!_.allowRetry||typeof r!="function"||(await r(),j=e(),!j))throw B;await j.write(_.chunk)}y(I)}catch(B){throw y(I,B),B}finally{i===I&&(i=null)}x++,x>=16&&(await Promise.resolve(),x=0)}}catch(x){n=!0,g(x);try{o?.(x)}catch{}}finally{l=!1,!n&&a<d.length?queueMicrotask(L):u()}}},E=(x,_=!0,j=!1)=>{if(n||!e())return!1;let I=xe(x);if(!I.byteLength)return!0;let B=c+I.byteLength,w=d.length-a+1;if(B>it||w>Qt){n=!0;let V=Object.assign(new Error(`${s}: upload queue overflow (${B}B/${w})`),{isQueueOverflow:!0});g(V);try{o?.(V)}catch{}throw V}let H=null,P=null;return j&&(P=[],H=new Promise((V,ie)=>P.push({resolve:V,reject:ie}))),d.push({chunk:I,allowRetry:_,completions:P}),c=B,l||queueMicrotask(L),j?H.then(()=>!0):!0};return{writeAndAwait(x,_=!0){return E(x,_,!0)},async write(x,_=!0){let j=E(x,_,!1);if(j===!1||j===!0){if(c>it*.7){let I=it*.5;for(;!n&&c>I;)await new Promise(B=>setTimeout(B,15))}return j}return j},async awaitEmpty(){!c&&!l||await new Promise(x=>p.push(x))},clear(){n=!0,g()}}}function Tr(e,t=null){let s=131072,d=512,a=t,c=null,l=0,n=null,h=!1,p=()=>{let b=e.bufferedAmount||0;b>256*1024?s=Math.max(16384,Math.floor(s/2)):b<32*1024&&(s=Math.min(262144,s*2))},i=async b=>{if(e.readyState!==1)throw new Error("ws.readyState is not open");e.send(b),typeof e.bufferedAmount=="number"&&e.bufferedAmount>1024*1024&&await tr(e)},y=b=>{if(!a)return b;let u=new Uint8Array(a.length+b.byteLength);return u.set(a,0),u.set(b,a.length),a=null,u},m=async()=>{for(h=!1;n;)await n;if(!l)return;let b=c.slice(0,l);return p(),l=0,n=i(b).finally(()=>{n=null}),n};return{async sendDirect(b){let u=xe(b);u.byteLength&&(u=y(u),await i(u))},async send(b){let u=xe(b);if(!u.byteLength)return;u=y(u);let g=0,k=u.byteLength;for(;g<k;){if(!l&&k-g>=s){let L=Math.min(s,k-g),E=g||L!==k?u.subarray(g,g+L):u;await i(E),g+=L,p();continue}let S=Math.min(s-l,k-g);c||(c=new Uint8Array(262144)),c.set(u.subarray(g,g+S),l),l+=S,g+=S,l>=s||s-l<d?await m():h||(h=!0,queueMicrotask(()=>{l&&m().catch(()=>ge(e))}))}},flush:m}}async function tr(e){if(typeof e.bufferedAmount=="number"){let t=e.bufferedAmount,r=Date.now();for(;e.bufferedAmount>1024*1024&&e.readyState===WebSocket.OPEN;){if(e.bufferedAmount<t&&(r=Date.now()),t=e.bufferedAmount,Date.now()-r>6e4){ge(e);break}await new Promise(o=>setTimeout(o,5))}}}async function It(e,t,r,o,s,d=null){let a=r,c=!1;d&&(a=a?Re(d.salt,a):d.salt);let l=async h=>{let p=[],i=0;for(;i<h.byteLength;){let y=Math.min(h.byteLength-i,16383),m=new Uint8Array([y>>8&255,y&255]),b=await Be.encryptChunk(d.key,d.nonce,m),u=await Be.encryptChunk(d.key,d.nonce,h.subarray(i,i+y));if(!b||!u)throw new Error("ss encrypt failed");p.push(b,u),i+=y}return Re(...p)},n=Tr(t,a);a=null;try{let h=e.readable.getReader({mode:"byob"}),p=!0;if(h.releaseLock(),p){let i=new TransformStream({async transform(m,b){c=!0,typeof s=="function"&&s(m.byteLength),b.enqueue(d?await l(m):m)}},new ByteLengthQueuingStrategy({highWaterMark:131072}),new ByteLengthQueuingStrategy({highWaterMark:131072})),y=i.readable.pipeTo(new WritableStream({async write(m){await n.send(m)}}));await e.readable.pipeTo(i.writable),await y}}catch{let p=null;try{p=e.readable.getReader()}catch{p=null}if(p)try{for(;;){t.bufferedAmount>1024*1024&&await tr(t);let{done:i,value:y}=await p.read();if(i)break;!y||y.byteLength===0||(c=!0,typeof s=="function"&&s(y.byteLength),await n.send(d?await l(y):y))}}finally{try{p.cancel()}catch{}try{p.releaseLock()}catch{}}}finally{await n.flush(),ge(t)}!c&&o&&await o()}function ct(e){return typeof e!="string"||!e?!1:(e.startsWith("[")&&e.endsWith("]")?e.slice(1,-1):e).includes(":")}function Ke(e){return ct(e)&&!e.startsWith("[")?`[${e}]`:e}async function je(e,t,r=null,o="https://cloudflare-dns.com/dns-query"){let s=Xe({hostname:Ke(e),port:t}),d=null;try{await Promise.race([s.opened,new Promise((a,c)=>{d=setTimeout(()=>c(new Error("timeout")),5e3)})])}catch(a){try{s.close()}catch{}let c=a instanceof Error?a:new Error(String(a));throw c.connectPhase=!0,c}finally{d&&clearTimeout(d)}if(r&&r.byteLength>0){let a=s.writable.getWriter();await a.write(xe(r)),a.releaseLock()}return s}async function Jt(e,t,r,o,s="8.8.4.4"){let d=xe(e),a=0;for(let h=0;h+2<=d.byteLength;){let p=d[h]<<8|d[h+1];a++,h+=2+p}a<1&&(a=1);let c=null,l=null,n=null;try{c=Xe({hostname:Ke(s),port:53}),n=setTimeout(()=>{try{c.close()}catch{}},4e3);let h=c.writable.getWriter();await h.write(d),h.releaseLock(),l=c.readable.getReader();let p=r,i=new Uint8Array(0),y=0;for(;y<a;){let{done:m,value:b}=await l.read();if(m)break;if(!b||!b.byteLength)continue;i=i.byteLength?Re(i,b):b;let u=0;for(;i.byteLength-u>=2;){let g=i[u]<<8|i[u+1];if(i.byteLength-u<2+g)break;let k=i.subarray(u,u+2+g);if(u+=2+g,y++,typeof o=="function"&&o(k.byteLength),t.readyState!==WebSocket.OPEN)return;if(p){let S=new Uint8Array(p.length+k.byteLength);S.set(p,0),S.set(k,p.length),t.send(S.buffer),p=null}else t.send(k)}u>0&&(i=i.slice(u))}}catch{}finally{n&&clearTimeout(n);try{l&&l.releaseLock()}catch{}try{c&&c.close()}catch{}}}function Sr(e){if(e.byteLength<17)return null;let t=[...e.slice(1,17)].map(r=>r.toString(16).padStart(2,"0")).join("");return`${t.substring(0,8)}-${t.substring(8,12)}-${t.substring(12,16)}-${t.substring(16,20)}-${t.substring(20)}`}function jr(e,t){De++;let r=Date.now();if((r-At>9e5||De>5e3)&&De>0){At=r;let o=De;De=0;let s=async()=>{try{let d=new Date().toISOString().split("T")[0];await e.DB.prepare("INSERT INTO settings (key, value) VALUES ('req_total', ?) ON CONFLICT(key) DO UPDATE SET value = CAST(value AS INTEGER) + ?").bind(String(o),String(o)).run();let a=await e.DB.prepare("SELECT value FROM settings WHERE key = 'req_last_date'").first();!a||a.value!==d?(await e.DB.prepare("INSERT INTO settings (key, value) VALUES ('req_last_date', ?) ON CONFLICT(key) DO UPDATE SET value = ?").bind(d,d).run(),await e.DB.prepare("INSERT INTO settings (key, value) VALUES ('req_today', ?) ON CONFLICT(key) DO UPDATE SET value = ?").bind(String(o),String(o)).run()):await e.DB.prepare("INSERT INTO settings (key, value) VALUES ('req_today', ?) ON CONFLICT(key) DO UPDATE SET value = CAST(value AS INTEGER) + ?").bind(String(o),String(o)).run()}catch{}};t?t.waitUntil(s()):s()}}async function Me(e,t,r,o){let s=e;if(e.includes("t.me/socks")||e.includes("tg://socks")){let l=e.match(/server=([^&]+)/)?.[1],n=e.match(/port=([^&]+)/)?.[1],h=e.match(/user=([^&]+)/)?.[1],p=e.match(/pass=([^&]+)/)?.[1];l&&n&&(s=h&&p?`socks5://${h}:${p}@${l}:${n}`:`socks5://${l}:${n}`)}let d=s.toLowerCase().startsWith("http://")||s.toLowerCase().startsWith("https://"),a=s.toLowerCase().startsWith("socks4://"),c=s.replace(/^(socks4|socks5|socks|http|https):\/\//i,"");return d?await Lr(c,t,r,o):a?await Br(c,t,r,o):await Ar(c,t,r,o)}async function Br(e,t,r,o){let{user:s,pass:d,host:a,port:c,auth:l}=St(e,1080),n=Xe({hostname:Ke(a),port:c}),h=n.readable.getReader(),p=n.writable.getWriter();try{let i=r>>8&255,y=r&255,m;if(er(t)){let u=t.split(".").map(Number);m=new Uint8Array([4,1,i,y,u[0],u[1],u[2],u[3],0])}else{let u=new TextEncoder().encode(t);m=new Uint8Array(9+u.length+1),m[0]=4,m[1]=1,m[2]=i,m[3]=y,m[4]=0,m[5]=0,m[6]=0,m[7]=1,m[8]=0,m.set(u,9),m[9+u.length]=0}await p.write(m);let b=await h.read();if(b.done||!b.value||b.value[0]!==0||b.value[1]!==90)throw new Error("\u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC SOCKS4 \u0648\u0635\u0644 \u0646\u0634\u062F \u06CC\u0627 \u0627\u062A\u0635\u0627\u0644 \u0631\u0627 \u0631\u062F \u06A9\u0631\u062F");return o&&o.byteLength>0&&await p.write(xe(o)),p.releaseLock(),h.releaseLock(),n}catch(i){try{p.releaseLock()}catch{}try{h.releaseLock()}catch{}try{n.close()}catch{}throw i}}function St(e,t){let r="",o="",s="",d=t,a=!1,c=e;if(c.includes("@")){let l=c.lastIndexOf("@"),n=c.substring(0,l);c=c.substring(l+1);let h=n.indexOf(":");h!==-1?(r=n.substring(0,h),o=n.substring(h+1)):r=n,a=!0}if(c.startsWith("[")){let l=c.indexOf("]");l!==-1&&(s=c.substring(1,l),c.length>l+1&&c[l+1]===":"&&(d=parseInt(c.substring(l+2))||t))}else{let l=c.lastIndexOf(":");l!==-1&&c.indexOf(":")===l?(s=c.substring(0,l),d=parseInt(c.substring(l+1))||t):s=c}return{user:r,pass:o,host:s,port:d,auth:a}}async function Ar(e,t,r,o){let{user:s,pass:d,host:a,port:c,auth:l}=St(e,1080),n=Xe({hostname:Ke(a),port:c}),h=n.readable.getReader(),p=n.writable.getWriter(),i=(y,m)=>Promise.race([y.read(),new Promise((b,u)=>setTimeout(()=>u(new Error("timeout")),m))]);try{l?await p.write(new Uint8Array([5,2,0,2])):await p.write(new Uint8Array([5,1,0]));let y=await i(h,4e3);if(y.done||!y.value||y.value[0]!==5)throw new Error("\u067E\u0627\u0633\u062E \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0632 \u0633\u0631\u0648\u0631 (\u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC SOCKS5 \u0646\u06CC\u0633\u062A \u06CC\u0627 \u062E\u0627\u0645\u0648\u0634 \u0627\u0633\u062A)");if(y.value[1]===2){let L=new TextEncoder().encode(s),E=new TextEncoder().encode(d),x=new Uint8Array(2+L.length+1+E.length);x[0]=1,x[1]=L.length,x.set(L,2),x[2+L.length]=E.length,x.set(E,3+L.length),await p.write(x);let _=await i(h,4e3);if(_.done||!_.value||_.value[1]!==0)throw new Error("\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u06CC\u0627 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A")}let b=3,u;if(er(t))b=1,u=new Uint8Array(t.split(".").map(Number));else if(t.includes(":")){b=4,u=new Uint8Array(16);let L=t.split(":");for(let E=0;E<8;E++){let x=parseInt(L[E]||"0",16);u[E*2]=x>>8&255,u[E*2+1]=x&255}}else{let L=new TextEncoder().encode(t);u=new Uint8Array(1+L.length),u[0]=L.length,u.set(L,1)}let g=new Uint8Array(4+u.length+2);g[0]=5,g[1]=1,g[2]=0,g[3]=b,g.set(u,4);let k=4+u.length;g[k]=r>>8&255,g[k+1]=r&255,await p.write(g);let S=await i(h,4e3);if(S.done||!S.value||S.value[1]!==0)throw new Error("\u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC \u0648\u0635\u0644 \u0634\u062F \u0627\u0645\u0627 \u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u0627\u06CC\u0646\u062A\u0631\u0646\u062A \u0622\u0632\u0627\u062F \u0646\u062F\u0627\u0631\u062F");return o&&o.byteLength>0&&await p.write(xe(o)),p.releaseLock(),h.releaseLock(),n}catch(y){try{p.releaseLock()}catch{}try{h.releaseLock()}catch{}try{n.close()}catch{}throw y}}async function Lr(e,t,r,o){let{user:s,pass:d,host:a,port:c,auth:l}=St(e,80),n=Xe({hostname:Ke(a),port:c}),h=n.readable.getReader(),p=n.writable.getWriter();try{let i=t.includes(":")?`[${t}]`:t,y=`CONNECT ${i}:${r} HTTP/1.1\r
Host: ${i}:${r}\r
`;if(l){let u=btoa(`${s}:${d}`);y+=`Proxy-Authorization: Basic ${u}\r
`}y+=`\r
`,await p.write(new TextEncoder().encode(y));let m="",b=new TextDecoder;for(;;){let u=await h.read();if(u.done||!u.value)throw new Error("proxy_closed");if(m+=b.decode(u.value,{stream:!0}),m.includes(`\r
\r
`)){let g=m.match(/^HTTP\/\d\.\d\s+(\d+)/);if(g&&g[1]==="200")break;throw new Error("proxy_error_"+(g?g[1]:"unknown"))}}return o&&o.byteLength>0&&await p.write(xe(o)),p.releaseLock(),h.releaseLock(),n}catch(i){try{p.releaseLock()}catch{}try{h.releaseLock()}catch{}try{n.close()}catch{}throw i}}var Dr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0e2348"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <filter id="glowFx" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="16" flood-color="#3b82f6" flood-opacity="0.6"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="128" fill="#000000"/>
  <rect x="48" y="48" width="416" height="416" rx="96" fill="url(#bgGrad)" stroke="#3b82f6" stroke-width="16" filter="url(#glowFx)"/>
  <rect x="56" y="56" width="400" height="400" rx="88" fill="none" stroke="#60a5fa" stroke-width="4" stroke-opacity="0.4"/>
  <g transform="translate(128, 128) scale(10.666)" filter="url(#glowFx)">
    <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="#38bdf8" fill-opacity="0.3" stroke="#60a5fa" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`,Rr=JSON.stringify({name:"Alireza Panel",short_name:"Alireza Panel",description:"\u067E\u0646\u0644 \u0645\u062F\u06CC\u0631\u06CC\u062A \u067E\u06CC\u0634\u0631\u0641\u062A\u0647 \u06A9\u0627\u0646\u0641\u06CC\u06AF \u0648 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0632\u0626\u0648\u0633",start_url:"/adminas",scope:"/",display:"standalone",background_color:"#000000",theme_color:"#000000",dir:"rtl",lang:"fa-IR",orientation:"any",icons:[{src:"/icon.svg",sizes:"192x192 512x512",type:"image/svg+xml",purpose:"any maskable"}],categories:["utilities","productivity"]}),Mr=`
const ejmnvu5 = "app-cache-v3";
const zd4pw2j = [
	"https://cdn.tailwindcss.com",
	"https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js",
	"https://cdn.jsdelivr.net/npm/qr-code-styling@1.5.0/lib/qr-code-styling.js"
];
self.addEventListener("install", (e) => {
	self.skipWaiting();
	e.waitUntil(
		caches.open(ejmnvu5).then((cache) => {
			return cache.addAll(zd4pw2j).catch(() => {});
		})
	);
});
self.addEventListener("activate", (e) => {
	e.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys.map((k) => {
					if (k !== ejmnvu5) return caches.delete(k);
				})
			);
		}).then(() => self.clients.claim())
	);
});
self.addEventListener("fetch", (e) => {
	const url = new URL(e.request.url);
	if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/sub/") || url.pathname.startsWith("/feed/") || url.pathname.startsWith("/singbox/") || url.pathname.startsWith("/status/") || url.pathname.startsWith("/stream/")) {
		return;
	}
	if (zd4pw2j.includes(e.request.url)) {
		e.respondWith(
			caches.match(e.request).then((cached) => cached || fetch(e.request).then((res) => {
				const clone = res.clone();
				caches.open(ejmnvu5).then((cache) => cache.put(e.request, clone));
				return res;
			}))
		);
	}
});
`,Ze=`
	<script>
		if (localStorage.getItem('gfx-enabled') === 'false') {
			document.documentElement.classList.add('gfx-off');
		}
		if (localStorage.getItem('color-theme') === 'light') {
			document.documentElement.classList.remove('dark');
		} else {
			document.documentElement.classList.add('dark');
		}
		if (localStorage.getItem('grayscale-theme') === 'true') {
			document.documentElement.classList.add('grayscale-active');
		}
		/* \u067E\u0627\u06A9\u200C\u0633\u0627\u0632\u06CC \u06A9\u0634 \u0642\u062F\u06CC\u0645\u06CC \u067E\u0631\u0686\u0645\u200C\u0647\u0627 (\u0646\u0633\u062E\u0647 \u0642\u0628\u0644\u06CC emoji \u0645\u062A\u0646\u06CC \u06A9\u0647 \u062F\u0631 \u0648\u06CC\u0646\u062F\u0648\u0632 \u062E\u0631\u0627\u0628 \u0628\u0648\u062F) */
		try { localStorage.removeItem('pf_c1'); } catch(e) {}
	</script>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/qr-code-styling@1.5.0/lib/qr-code-styling.js"></script>
	<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css">
<script>
	tailwind.config = {
		darkMode: 'class',
		theme: {
			extend: {
				fontFamily: { sans: ['Vazirmatn', 'sans-serif'] },
				colors: { amoled: { bg: '#000105', card: '#040914', input: '#081224', border: '#102040' } }
			}
		}
	}
</script>
<style>
	.cursor-wrapper {
		pointer-events: none;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		display: none;
	}
	@media (pointer: fine) {
		html:not(.gfx-off) * {
			cursor: none !important;
		}
		html:not(.gfx-off) .cursor-wrapper {
			display: block;
		}
	}
	#cursor-dot {
		width: 6px;
		height: 6px;
		background-color: #2563eb;
		border-radius: 50%;
		box-shadow: 0 0 8px #2563eb, 0 0 16px #1d4ed8;
		transform: translate(-50%, -50%);
	}
	#cursor-ring-pos {
		width: 36px;
		height: 36px;
		transform: translate(-50%, -50%);
		transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}
	#cursor-ring-visual {
		width: 100%;
		height: 100%;
		border: 1.5px dashed rgba(37, 99, 235, 0.9);
		border-radius: 50%;
		animation: spinRing 10s linear infinite;
		transition: border-color 0.2s, background-color 0.2s;
	}
	@keyframes spinRing {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	body.hover-active #cursor-ring-pos {
		width: 48px;
		height: 48px;
	}
	body.hover-active #cursor-ring-visual {
		border: 2px solid #2563eb;
		background-color: rgba(37, 99, 235, 0.2);
		animation: spinRingFast 3s linear infinite;
	}
	@keyframes spinRingFast {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	#cursor-glow-pos {
		width: 40px;
		height: 40px;
		transform: translate(-50%, -50%);
		transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}
	body.hover-active #cursor-glow-pos {
		width: 54px;
		height: 54px;
	}
	#cursor-glow-visual {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, rgba(29, 78, 216, 0.1) 40%, transparent 70%);
	}
		:root {
			--bg-tint: rgba(59, 130, 246, 0.03);
			--plane-color: #93c5fd; 
			--plane-dark: #f9fafb;
			--plane-opacity: 0.20;
		}
		.dark {
			--bg-tint: rgba(16, 32, 64, 0.4); 
			--plane-color: #1d4ed8; 
			--plane-dark: #000105;
			--plane-opacity: 0.15;
		}
		.bg-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
		#waves { position: fixed; inset: 0; width: 100%; height: 100%; display: block; }
		.vignette {
			position: fixed; inset: 0; z-index: 2; pointer-events: none;
			background: radial-gradient(ellipse at center, transparent 35%, rgba(255,255,255,0.5) 100%);
		}
		.dark .vignette {
			background: radial-gradient(ellipse at center, transparent 35%, rgba(0,1,5,0.85) 100%);
		}
		.ambient {
			position: fixed; inset: 0; z-index: 1; pointer-events: none;
			background:
				radial-gradient(700px 500px at 12% 20%, var(--bg-tint), transparent 60%),
				radial-gradient(800px 600px at 90% 90%, var(--bg-tint), transparent 60%);
		}
</style>
<script>
	document.addEventListener('DOMContentLoaded', () => {
		if (window.matchMedia('(pointer: fine)').matches && localStorage.getItem('gfx-enabled') !== 'false') {
			const glowPos = document.createElement('div');
			glowPos.id = 'cursor-glow-pos';
			glowPos.className = 'cursor-wrapper';
			glowPos.innerHTML = '<div id="cursor-glow-visual"></div>';
			document.body.appendChild(glowPos);
			const ringPos = document.createElement('div');
			ringPos.id = 'cursor-ring-pos';
			ringPos.className = 'cursor-wrapper';
			ringPos.innerHTML = '<div id="cursor-ring-visual"></div>';
			document.body.appendChild(ringPos);
			const dot = document.createElement('div');
			dot.id = 'cursor-dot';
			dot.className = 'cursor-wrapper';
			document.body.appendChild(dot);
			let mouseX = window.innerWidth / 2;
			let mouseY = window.innerHeight / 2;
			let ringX = mouseX, ringY = mouseY;
			let glowX = mouseX, glowY = mouseY;
			let isMoving = false;
			window.addEventListener('mousemove', (e) => {
				mouseX = e.clientX;
				mouseY = e.clientY;
				dot.style.transform = 'translate3d(' + mouseX + 'px, ' + mouseY + 'px, 0) translate(-50%, -50%)';
				if (!isMoving) {
					isMoving = true;
					requestAnimationFrame(y5rpt2z);
				}
			}, { passive: true });
			function y5rpt2z() {
				ringX += (mouseX - ringX) * 0.45;
				ringY += (mouseY - ringY) * 0.45;
				ringPos.style.transform = 'translate3d(' + ringX + 'px, ' + ringY + 'px, 0) translate(-50%, -50%)';
				glowX += (mouseX - glowX) * 0.25;
				glowY += (mouseY - glowY) * 0.25;
				glowPos.style.transform = 'translate3d(' + glowX + 'px, ' + glowY + 'px, 0) translate(-50%, -50%)';
				if (Math.abs(mouseX - ringX) < 0.5 && Math.abs(mouseY - ringY) < 0.5) {
					isMoving = false;
				} else {
					requestAnimationFrame(y5rpt2z);
				}
			}
			document.addEventListener('mouseover', (e) => {
				if (e.target.closest('a, button, input, select, label, [role="button"], textarea')) {
					document.body.classList.add('hover-active');
				}
			});
			document.addEventListener('mouseout', (e) => {
				if (e.target.closest('a, button, input, select, label, [role="button"], textarea')) {
					document.body.classList.remove('hover-active');
				}
			});
		}
	});
</script>`,at='<div id="toast-container" class="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none"></div>',Ye=`
	<canvas id="waves" class="bg-canvas"></canvas>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
	<script>
	  (function initWaves(){
		const canvas = document.getElementById('waves');
		if (!canvas) return;
		if (document.documentElement.classList.contains('gfx-off')) {
			canvas.style.display = 'none';
			return;
		}
		const IS_MOBILE = window.innerWidth < 768;
		const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false, powerPreference: "default" });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
		renderer.setSize(window.innerWidth, window.innerHeight);
		
		const isDarkInit = document.documentElement.classList.contains('dark');
		renderer.setClearColor(isDarkInit ? 0x000105 : 0xf9fafb, 1);
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 200);
		camera.position.set(0, 0, IS_MOBILE ? 35 : 14);
		const segX = IS_MOBILE ? 80 : 80;
		const segY = IS_MOBILE ? 40 : 40;
		const geom = new THREE.PlaneGeometry(80, IS_MOBILE ? 90 : 40, segX, segY);
		const vertShader = "uniform float uTime; uniform float uStrength; varying float vElev; void main(){ vec3 p = position; float x = p.x * 0.2 + uTime * 0.3; float y = p.y * 0.2 + uTime * 0.25; float wave = sin(x)*cos(y)*1.6 + sin(x*2.1 + uTime)*0.7 + cos(y*1.7 - uTime*0.6)*0.7; wave *= uStrength * 1.5; p.z += wave; vElev = wave; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }";
		const fragShader = "varying float vElev; uniform vec3 uHigh; uniform vec3 uLow; uniform float uFade; void main(){ float t = clamp((vElev + 2.0) / 4.0, 0.0, 1.0); vec3 col = mix(uLow, uHigh, t); gl_FragColor = vec4(col, uFade); }";
		function bwtw9pk(px, py, pz, rx, ry, rz, high, low, fade){
		  const mat = new THREE.ShaderMaterial({
			wireframe: true, 
			transparent: true, 
			depthWrite: false,
			uniforms:{
			  uTime:{value:0}, 
			  uStrength:{value:1.1},
			  uHigh:{value:new THREE.Color(high)}, 
			  uLow:{value:new THREE.Color(low)},
			  uFade:{value:fade}
			},
			vertexShader: vertShader, 
			fragmentShader: fragShader
		  });
		  const m = new THREE.Mesh(geom, mat);
		  m.position.set(px, py, pz);
		  m.rotation.set(rx, ry, rz);
		  return m;
		}
		const cs = getComputedStyle(document.documentElement);
		const yOffset = IS_MOBILE ? 14 : 8;
		
		const topPlane = bwtw9pk(0, yOffset, -5, -Math.PI/2.4, 0, 0, '#1e40af', '#040914', 0.35);
		const midPlane = bwtw9pk(
		  0, 0, -25, 0, 0, 0, 
		  cs.getPropertyValue('--plane-color').trim() || '#1d4ed8', 
		  cs.getPropertyValue('--plane-dark').trim() || '#000105', 
		  (parseFloat(cs.getPropertyValue('--plane-opacity')) || 0.35) * 0.7
		);
		const botPlane = bwtw9pk(
		  0, -yOffset, -5, Math.PI/2.4, 0, 0, 
		  cs.getPropertyValue('--plane-color').trim() || '#1d4ed8', 
		  cs.getPropertyValue('--plane-dark').trim() || '#000105', 
		  parseFloat(cs.getPropertyValue('--plane-opacity')) || 0.35
		);
		scene.add(topPlane);
		scene.add(midPlane);
		scene.add(botPlane);
		
		window.__dxTopPlane = topPlane;
		window.__dxMidPlane = midPlane;
		window.__dxBotPlane = botPlane;
		const clock = new THREE.Clock();
		let lastFrameTime = 0;
		function animate(timestamp) {
		  requestAnimationFrame(animate);
		  if (timestamp - lastFrameTime < 30) return;
		  lastFrameTime = timestamp;
		  
		  const t = clock.getElapsedTime();
		  topPlane.material.uniforms.uTime.value = t * 0.8; 
		  midPlane.material.uniforms.uTime.value = t * 0.6;
		  botPlane.material.uniforms.uTime.value = t * 0.8; 
		  renderer.render(scene, camera);
		}
		requestAnimationFrame(animate);
		window.addEventListener('resize', function(){
		  camera.aspect = window.innerWidth/window.innerHeight;
		  camera.updateProjectionMatrix();
		  renderer.setSize(window.innerWidth, window.innerHeight);
		});
		function hus7ufu(){
		  const isDark = document.documentElement.classList.contains('dark');
		  if (renderer) renderer.setClearColor(isDark ? 0x000105 : 0xf9fafb, 1);
		  const pColor = isDark ? '#1d4ed8' : '#93c5fd';
		  const pDark = isDark ? '#000105' : '#f9fafb';
		  const pOpacity = isDark ? 0.15 : 0.20;
		  if (botPlane) {
			botPlane.material.uniforms.uHigh.value.set(pColor);
			botPlane.material.uniforms.uLow.value.set(pDark);
			botPlane.material.uniforms.uFade.value = pOpacity;
		  }
		  if (midPlane) {
			midPlane.material.uniforms.uHigh.value.set(pColor);
			midPlane.material.uniforms.uLow.value.set(pDark);
			midPlane.material.uniforms.uFade.value = pOpacity * 0.7;
		  }
		  if (topPlane) {
			 if (!isDark) {
				topPlane.material.uniforms.uLow.value.set('#f9fafb');
				topPlane.material.uniforms.uHigh.value.set('#bfdbfe');
			 } else {
				topPlane.material.uniforms.uLow.value.set('#040914');
				topPlane.material.uniforms.uHigh.value.set('#1e40af');
			 }
		  }
		}
		
		const observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.attributeName === 'class') {
					hus7ufu();
				}
			});
		});
		observer.observe(document.documentElement, { attributes: true });
		hus7ufu();
	  })();
	</script>
`,Ct=`
		function bm3pzm2(message, type = 'success') {
			const container = document.getElementById('toast-container');
			const toast = document.createElement('div');
			const colors = type === 'error' 
				? 'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400' 
				: 'bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-800 text-green-700 dark:text-green-500';
			toast.className = 'px-4 py-3 border rounded-md shadow-lg font-bold text-sm transform transition-all duration-300 -translate-y-full opacity-0 ' + colors;
			toast.innerText = message;
			container.appendChild(toast);
			requestAnimationFrame(() => {
				toast.classList.remove('-translate-y-full', 'opacity-0');
			});
			setTimeout(() => {
				toast.classList.add('-translate-y-full', 'opacity-0');
				setTimeout(() => toast.remove(), 300);
			}, 3000);
		}
		window.alert = function(message) {
			const msgStr = message ? message.toString() : '';
			if (msgStr.includes('\u062E\u0637\u0627') || msgStr.includes('\u26A0\uFE0F') || msgStr.includes('\u274C')) {
				bm3pzm2(msgStr, 'error');
			} else {
				bm3pzm2(msgStr, 'success');
			}
		};
`,ot={nginx:`<!DOCTYPE html>
<html lang="fa" dir="rtl" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>\u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u067E\u0640\u0646\u0640\u0644</title>
	${Ze}
</head>
<body class="bg-gray-50 text-gray-900 dark:bg-amoled-bg dark:text-zinc-100 min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md shadow-xl p-8 text-center flex flex-col items-center gap-4 relative z-10">
		<div class="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full mb-2">
			<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
		</div>
		<h2 class="text-xl font-bold text-gray-900 dark:text-white">\u0648\u0631\u0648\u062F \u0628\u0647 \u067E\u0640\u0640\u0646\u0640\u0640\u0644 \u0645\u062F\u06CC\u0631\u06CC\u062A</h2>
		<p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-2">
			\u0628\u0631\u0627\u06CC \u0648\u0631\u0648\u062F \u0628\u0647 \u067E\u0640\u0646\u0640\u0644\u060C \u0644\u0637\u0641\u0627\u064B \u0639\u0628\u0627\u0631\u062A 
			<span class="inline-block px-2 py-1 bg-gray-100 dark:bg-amoled-input border border-gray-200 dark:border-zinc-800 rounded-md font-mono text-blue-500 font-bold mx-1 shadow-sm" dir="ltr">/panel</span> 
			\u0631\u0627 \u0628\u0647 \u0627\u0646\u062A\u0647\u0627\u06CC \u0622\u062F\u0631\u0633 \u0645\u0631\u0648\u0631\u06AF\u0631 \u062E\u0648\u062F \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F \u06CC\u0627 \u0631\u0648\u06CC \u062F\u06A9\u0645\u0647 \u0632\u06CC\u0631 \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F.
		</p>
		<button onclick="window.location.href='/adminas'" class="mt-4 w-full py-2.5 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 font-medium rounded-md text-sm transition-colors duration-200 shadow-lg font-bold">
			\u0648\u0631\u0648\u062F \u0628\u0647 \u067E\u0640\u0646\u0640\u0644
		</button>
	</div>
	${Ye}
</body>
</html>`,setup:`<!DOCTYPE html>
<html lang="fa" dir="rtl" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>\u062A\u0639\u0631\u06CC\u0641 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u067E\u0640\u0646\u0640\u0644</title>
	${Ze}
</head>
<body class="bg-gray-50 text-gray-900 dark:bg-amoled-bg dark:text-zinc-100 min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md shadow-xl p-6 relative z-10">
		<h2 class="text-xl font-bold mb-2 text-center text-blue-600 dark:text-blue-400">\u062A\u0646\u0638\u06CC\u0645 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062C\u062F\u06CC\u062F</h2>
		<p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">\u0627\u06CC\u0646 \u0627\u0648\u0644\u06CC\u0646 \u0648\u0631\u0648\u062F \u0634\u0645\u0627 \u0628\u0647 \u067E\u0640\u0646\u0640\u0644 \u0645\u062F\u06CC\u0631\u06CC\u062A \u0627\u0633\u062A. \u0644\u0637\u0641\u0627\u064B \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062E\u0648\u062F \u0631\u0627 \u062A\u0639\u06CC\u06CC\u0646 \u06A9\u0646\u06CC\u062F.</p>
		<form onsubmit="handleSetup(event)" class="space-y-4">
			<div>
				<label class="block text-sm font-medium mb-1.5">\u0631\u0645\u0632 \u0639\u0628\u0648\u0631</label>
				<input type="password" id="password" class="w-full px-3 py-2 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center font-mono" required minlength="4">
			</div>
			<div>
				<label class="block text-sm font-medium mb-1.5">\u062A\u06A9\u0631\u0627\u0631 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631</label>
				<input type="password" id="confirm-password" class="w-full px-3 py-2 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center font-mono" required minlength="4">
			</div>
			<button type="submit" id="submit-btn" class="w-full py-2.5 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 font-medium rounded-md text-sm transition font-bold">\u062B\u0628\u062A \u0648 \u0648\u0631\u0648\u062F</button>
		</form>
	</div>
	${at}
	<script>
		${Ct};
		async function handleSetup(event) {
			event.preventDefault();
			const password = document.getElementById('password').value.trim();
			const confirmPassword = document.getElementById('confirm-password').value.trim();
			const btn = document.getElementById('submit-btn');
			if (password !== confirmPassword) {
				alert('\u26A0\uFE0F \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0648 \u062A\u06A9\u0631\u0627\u0631 \u0622\u0646 \u0645\u0637\u0627\u0628\u0642\u062A \u0646\u062F\u0627\u0631\u0646\u062F!');
				return;
			}
			btn.disabled = true;
			btn.innerText = '\u062F\u0631 \u062D\u0627\u0644 \u062B\u0628\u062A...';
			try {
				const res = await fetch('/api/setup-password', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ password })
				});
				const data = await res.json();
				if (res.ok && data.success) {
					alert('\u2705 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062A\u0646\u0638\u06CC\u0645 \u0634\u062F. \u062F\u0631 \u062D\u0627\u0644 \u0648\u0631\u0648\u062F...');
					setTimeout(() => {
						window.location.reload();
					}, 1500);
				} else {
					alert('\u062E\u0637\u0627: ' + (data.error || '\u0639\u0645\u0644\u06CC\u0627\u062A \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F'));
				}
			} catch (err) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
			} finally {
				btn.disabled = false;
				btn.innerText = '\u062B\u0628\u062A \u0648 \u0648\u0631\u0648\u062F';
			}
		}
	</script>
	${Ye}
</body>
</html>`,login:`<!DOCTYPE html>
<html lang="fa" dir="rtl" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>\u0648\u0631\u0648\u062F \u0628\u0647 \u067E\u0640\u0640\u0646\u0640\u0640\u0644 \u0645\u062F\u06CC\u0631\u06CC\u062A</title>
	${Ze}
</head>
<body class="bg-gray-50 text-gray-900 dark:bg-amoled-bg dark:text-zinc-100 min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md shadow-xl p-6 relative z-10">
		<div id="login-section">
			<h2 class="text-xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">\u0648\u0631\u0648\u062F \u0628\u0647 \u067E\u0640\u0646\u0640\u0644 \u0645\u062F\u06CC\u0631\u06CC\u062A</h2>
			<form onsubmit="handleLogin(event)" class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-1.5">\u0631\u0645\u0632 \u0639\u0628\u0648\u0631</label>
					<input type="password" id="password" class="w-full px-3 py-2 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center font-mono" required>
				</div>
				<button type="submit" id="submit-btn" class="w-full py-2.5 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 font-medium rounded-md text-sm transition font-bold">\u0648\u0631\u0648\u062F</button>
			</form>
			<div class="mt-4 text-center">
				<button onclick="toggleRecovery(true)" class="text-xs text-blue-500 hover:text-blue-600 transition font-medium">\u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0631\u0645\u0632 \u067E\u0640\u0646\u0640\u0644</button>
			</div>
		</div>
		<div id="recovery-section" class="hidden">
			<h2 class="text-xl font-bold mb-4 text-center text-orange-600 dark:text-orange-400">\u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0631\u0645\u0632 \u067E\u0640\u0646\u0640\u0644</h2>
			<div class="mb-5 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-md text-xs leading-relaxed text-orange-800 dark:text-orange-300">
				\u0628\u0631\u0627\u06CC \u0627\u062D\u0631\u0627\u0632 \u0647\u0648\u06CC\u062A \u0648 \u0627\u062B\u0628\u0627\u062A \u0645\u0627\u0644\u06A9\u06CC\u062A \u067E\u0640\u0646\u0640\u0644\u060C \u0627\u0632 \u0637\u0631\u06CC\u0642 \u062F\u06A9\u0645\u0647 \u0632\u06CC\u0631 \u0648\u0627\u0631\u062F \u06A9\u0644\u0648\u062F\u0641\u0644\u0631 \u0634\u0648\u06CC\u062F \u0648 \u062A\u0648\u06A9\u0646 \u062F\u0631\u06CC\u0627\u0641\u062A\u06CC \u0631\u0627 \u06A9\u067E\u06CC \u06A9\u0631\u062F\u0647 \u0648 \u062F\u0631 \u06A9\u0627\u062F\u0631 \u0632\u06CC\u0631 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F.
				<a href="https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22workers_scripts%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22d1%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_settings%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22workers_subdomain%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_analytics%22%2C%22type%22%3A%22read%22%7D%5D&accountId=*&zoneId=all&name=Deploy-Token" target="_blank" class="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 rounded-md font-bold transition shadow-md">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
					\u062F\u0631\u06CC\u0627\u0641\u062A \u062A\u0648\u06A9\u0646
				</a>
			</div>
			<form onsubmit="handleRecovery(event)" class="space-y-4">
				<div>
					<input type="password" id="api-token" placeholder="\u062A\u0648\u06A9\u0646 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F" class="w-full px-3 py-2 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs text-center font-mono" required>
				</div>
				<div class="flex gap-2 pt-2">
					<button type="button" onclick="toggleRecovery(false)" class="w-1/3 py-2.5 bg-transparent border-2 border-red-700 text-red-700 hover:bg-red-900/20 hover:text-red-800 dark:border-red-700 dark:text-red-500 dark:hover:bg-red-900/40 dark:hover:text-red-400 font-bold rounded-md text-sm transition shadow-sm">\u0627\u0646\u0635\u0631\u0627\u0641</button>
					<button type="submit" id="recover-btn" class="w-2/3 py-2.5 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 font-medium rounded-md text-sm transition font-bold">\u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0631\u0645\u0632 \u067E\u0640\u0646\u0640\u0644</button>
				</div>
			</form>
		</div>
	</div>
	${at}
	<script>
		${Ct}
		async function handleLogin(event) {
			event.preventDefault();
			const password = document.getElementById('password').value.trim();
			const btn = document.getElementById('submit-btn');
			btn.disabled = true;
			try {
				const res = await fetch('/api/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ password })
				});
				const data = await res.json();
				if (res.ok && data.success) {
					window.location.reload();
				} else {
					alert(data.error || '\u274C \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A');
				}
			} catch (err) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
			} finally {
				btn.disabled = false;
			}
		}
		function toggleRecovery(show) {
			document.getElementById('login-section').classList.toggle('hidden', show);
			document.getElementById('recovery-section').classList.toggle('hidden', !show);
		}
		async function handleRecovery(event) {
			event.preventDefault();
			const apiToken = document.getElementById('api-token').value;
			const btn = document.getElementById('recover-btn');
			btn.disabled = true;
			btn.innerText = '\u062F\u0631 \u062D\u0627\u0644 \u0628\u0631\u0631\u0633\u06CC...';
			try {
				const res = await fetch('/api/recover', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ api_token: apiToken })
				});
				const data = await res.json();
				if (res.ok && data.success) {
					alert('\u2705 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062D\u0630\u0641 \u0634\u062F. \u062F\u0631 \u062D\u0627\u0644 \u0627\u0646\u062A\u0642\u0627\u0644 \u0628\u0647 \u0635\u0641\u062D\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0627\u0648\u0644\u06CC\u0647...');
					setTimeout(() => {
						window.location.reload();
					}, 1500);
				} else {
					alert('\u274C ' + (data.error || '\u062E\u0637\u0627 \u062F\u0631 \u062A\u0627\u06CC\u06CC\u062F \u0627\u0637\u0644\u0627\u0639\u0627\u062A'));
				}
			} catch (err) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
			} finally {
				btn.disabled = false;
				btn.innerText = '\u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0631\u0645\u0632 \u067E\u0640\u0646\u0640\u0644';
			}
		}
	</script>
	${Ye}
</body>
</html>`,panel:`
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Z E U S</title>
	<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>\u26A1</text></svg>">
	<script>
		const originalWarn = console.warn;
		console.warn = (...args) => {
			if (typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com')) return;
			originalWarn(...args);
		};
	</script>
	${Ze}
	<style>
		body { font-family: 'Vazirmatn', sans-serif; }
		/* \u067E\u0631\u0686\u0645\u200C\u0647\u0627\u06CC SVG \u0628\u0631\u0627\u06CC \u0633\u0627\u0632\u06AF\u0627\u0631\u06CC \u0628\u0627 \u0648\u06CC\u0646\u062F\u0648\u0632 */
		.flg {
			display: inline-block;
			width: 1.35em;
			height: 1em;
			vertical-align: -0.15em;
			border-radius: 2px;
			background-size: cover;
			background-position: 50%;
			background-repeat: no-repeat;
		}
		.flg-g {
			font-size: 1.1em;
			line-height: 1;
			vertical-align: -0.05em;
		}
		.dark input[type="checkbox"] {
			filter: invert(1) hue-rotate(180deg);
		}
		html.grayscale-active {
			filter: grayscale(100%);
		}
		::-webkit-scrollbar {
			width: 6px;
			height: 6px;
		}
		::-webkit-scrollbar-track {
			background: #f3f4f6; 
			border-radius: 4px;
		}
		::-webkit-scrollbar-thumb {
			background: #d1d5db; 
			border-radius: 4px;
		}
		::-webkit-scrollbar-thumb:hover {
			background: #9ca3af;
		}

		html.dark::-webkit-scrollbar-track,
		.dark *::-webkit-scrollbar-track {
			background: #000105 !important;
		}
		html.dark::-webkit-scrollbar-thumb,
		.dark *::-webkit-scrollbar-thumb {
			background: #102040 !important;
		}
		html.dark::-webkit-scrollbar-thumb:hover,
		.dark *::-webkit-scrollbar-thumb:hover {
			background: #172e5c !important;
		}

		html.dark, .dark * {
			scrollbar-width: thin;
			scrollbar-color: #102040 #000105 !important;
		}
		@media (min-width: 769px) {
			header, main { zoom: 1.18; }
		}
		@media (max-width: 768px) {
			header, main { zoom: 0.90; }
		}
		input[type="number"]::-webkit-outer-spin-button,
		input[type="number"]::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
		input[type="number"] {
			-moz-appearance: textfield;
		}
		:root {
			--bg-tint: rgba(59, 130, 246, 0.03);
			--plane-color: #93c5fd; 
			--plane-dark: #f9fafb;
			--plane-opacity: 0.20;
		}
		.dark {
			--bg-tint: rgba(16, 32, 64, 0.4); 
			--plane-color: #1d4ed8; 
			--plane-dark: #000105;
			--plane-opacity: 0.15;
		}
		.bg-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; will-change: transform; transform: translateZ(0); }
		#waves { position: fixed; inset: 0; width: 100%; height: 100%; display: block; }
		.vignette {
			position: fixed; inset: 0; z-index: 2; pointer-events: none;
			background: radial-gradient(ellipse at center, transparent 35%, rgba(255,255,255,0.5) 100%);
		}
		.dark .vignette {
			background: radial-gradient(ellipse at center, transparent 35%, rgba(0,1,5,0.85) 100%);
		}
		.ambient {
			position: fixed; inset: 0; z-index: 1; pointer-events: none;
			background:
				radial-gradient(700px 500px at 12% 20%, var(--bg-tint), transparent 60%),
				radial-gradient(800px 600px at 90% 90%, var(--bg-tint), transparent 60%);
		}
	</style>
</head>
<body class="bg-gray-50 dark:bg-amoled-bg text-gray-900 dark:text-zinc-100 min-h-screen transition-colors duration-200">
	<canvas id="waves" class="bg-canvas"></canvas>
	<header class="border-b border-gray-200 dark:border-amoled-border bg-white/95 dark:bg-amoled-card/95 px-4 py-4 relative z-10">
		<div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
			<div class="flex flex-row flex-wrap justify-center items-center gap-3 w-full md:w-auto">
				<h1 class="text-lg font-bold flex items-center gap-2" dir="ltr">
					\u26A1\uFE0F A L I R E Z A
					<span id="panel-version" class="text-xs px-2 py-0.5 font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">v3.4.1</span>
				</h1>
				<div class="flex items-center gap-3 bg-gray-100 dark:bg-zinc-800/60 px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-800/80 shadow-sm flex-shrink-0 w-fit">
					<a href="https://github.com/aaaaaaaaaa" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-all transform hover:scale-125 duration-200 flex-shrink-0" title="GitHub">
						<svg class="w-[22px] h-[22px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
						</svg>
					</a>
					<a href="https://t.me/aaaaaaaaaa" target="_blank" rel="noopener noreferrer" class="text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-all transform hover:scale-125 duration-200 flex-shrink-0" title="Telegram">
						<svg class="w-[22px] h-[22px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
						</svg>
					</a>
					<a href="https://t.me/aaaaaaaaaa_BOT" target="_blank" rel="noopener noreferrer" class="text-green-500 hover:text-green-600 dark:hover:text-green-400 transition-all transform hover:scale-125 duration-200 flex-shrink-0" title="Bot">
						<svg class="w-[22px] h-[22px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M12 8V4H8"/>
							<rect width="16" height="12" x="4" y="8" rx="2"/>
							<path d="M2 14h2"/>
							<path d="M20 14h2"/>
							<path d="M15 13v2"/>
							<path d="M9 13v2"/>
						</svg>
					</a>
				</div>
			</div>
			<div class="flex flex-col items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
			<div class="flex items-center justify-center flex-wrap gap-3 w-full md:w-auto">
				<button onclick="toggleSupportModal(true)" 
						class="p-2 rounded-md 
							   bg-red-50 dark:bg-red-950/30 
							   border border-red-200 dark:border-red-900 
							   hover:bg-red-100 dark:hover:bg-red-900/50 
							   transition-all duration-200 
							   text-red-600 dark:text-red-400 shadow-sm" 
						title="\u062D\u0645\u0627\u06CC\u062A \u0627\u0632 \u0645\u0627">
					<svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
					</svg>
				</button>
				<button onclick="restartCore()"
						class="p-2 rounded-md 
							   bg-blue-50 dark:bg-blue-950/30 
							   border border-blue-200 dark:border-blue-900 
							   hover:bg-blue-100 dark:hover:bg-blue-900/50 
							   transition-all duration-200 
							   text-blue-600 dark:text-blue-400 shadow-sm" 
						title="\u0631\u06CC \u0627\u0633\u062A\u0627\u0631\u062A \u067E\u0640\u0646\u0640\u0644">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
					</svg>
				</button>
				<button id="grayscale-toggle"
						class="p-2 rounded-md
							   bg-zinc-100 dark:bg-zinc-800/80
							   border border-zinc-300 dark:border-zinc-700
							   hover:bg-zinc-200 dark:hover:bg-zinc-700
							   transition-all duration-200
							   text-zinc-600 dark:text-zinc-400 shadow-sm"
						title="\u062D\u0627\u0644\u062A \u0633\u06CC\u0627\u0647\u200C\u0633\u0641\u06CC\u062F">
					<svg class="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 2v20" />
						<path d="M12 2a10 10 0 0 1 0 20Z" fill="currentColor" opacity="0.3" />
						<path d="M12 2a10 10 0 0 0 0 20Z" />
					</svg>
				</button>
				<button id="pwa-install-btn" onclick="triggerPwaInstall()"
						class="p-2 rounded-md
							   bg-gradient-to-r from-indigo-500 to-purple-500
							   hover:from-indigo-600 hover:to-purple-600
							   transition-all duration-300
							   text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/30"
						title="\u062F\u0627\u0646\u0644\u0648\u062F \u0648 \u0646\u0635\u0628 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646 \u067E\u0646\u0644">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
					</svg>
				</button>
			</div>
			<div class="flex items-center justify-center flex-wrap gap-3 w-full md:w-auto">
				<button id="theme-toggle" 
						class="p-2 rounded-md 
							   bg-amber-50 dark:bg-amber-950/30 
							   border border-amber-200 dark:border-amber-900 
							   hover:bg-amber-100 dark:hover:bg-amber-900/50 
							   transition-all duration-200 
							   text-amber-500 dark:text-amber-400 shadow-sm"
						title="\u062A\u063A\u06CC\u06CC\u0631 \u062A\u0645">
					<svg id="sun-icon" class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z"></path>
					</svg>
					<svg id="moon-icon" class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
					</svg>
				</button>
				<button onclick="toggleSettingsModal(true)" 
						class="p-2 rounded-md 
							   bg-gray-50 dark:bg-zinc-800/50 
							   border border-gray-200 dark:border-zinc-700 
							   hover:bg-gray-100 dark:hover:bg-zinc-700/80 
							   transition-all duration-200 
							   text-gray-600 dark:text-zinc-400 shadow-sm" 
						title="\u062A\u0646\u0638\u06CC\u0645\u0627\u062A">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
					</svg>
				</button>
				<button onclick="logoutAdmin()"
					class="p-2 rounded-md 
						   bg-red-50 dark:bg-red-950/30 
						   border border-red-200 dark:border-red-900 
						   hover:bg-red-100 dark:hover:bg-red-900/50 
						   transition-all duration-200 
						   text-red-600 dark:text-red-400 
						   shadow-sm hover:shadow-md"
					title="\u062E\u0631\u0648\u062C">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
					</svg>
				</button>
			</div>
			</div>
		</div>
	</header>
	<main class="max-w-6xl mx-auto px-4 py-8 pb-56 md:pb-32 relative z-10">
<div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
	<div class="bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md p-2.5 shadow-sm flex flex-col justify-center gap-1 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/50 transition duration-300 relative overflow-hidden group min-h-[64px]">
		<div class="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-150 transition duration-500"></div>
		<div class="flex items-center justify-between relative z-10">
			<span class="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-zinc-400 whitespace-nowrap">\u062A\u0639\u062F\u0627\u062F \u06A9\u0644 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646</span>
			<div class="p-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-md flex-shrink-0">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
			</div>
		</div>
		<div class="flex items-end justify-between relative z-10 w-full mt-0.5">
			<div class="text-lg font-black text-gray-900 dark:text-zinc-100 transition-all leading-none" id="stat-total-users">0</div>
			<span class="text-[9px] text-indigo-500 dark:text-indigo-400 flex items-center gap-1 font-medium whitespace-nowrap leading-none mb-0.5">
				<span class="w-1 h-1 bg-indigo-500 rounded-full animate-ping"></span>
				\u06A9\u0644 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u062A\u0639\u0631\u06CC\u0641 \u0634\u062F\u0647
			</span>
		</div>
	</div>
	<div class="bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md p-2.5 shadow-sm flex flex-col justify-center gap-1 hover:shadow-md hover:border-green-400 dark:hover:border-green-500/50 transition duration-300 relative overflow-hidden group min-h-[64px]">
		<div class="absolute -right-4 -bottom-4 w-16 h-16 bg-green-500/10 rounded-full blur-xl group-hover:scale-150 transition duration-500"></div>
		<div class="flex items-center justify-between relative z-10">
			<span class="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-zinc-400 whitespace-nowrap flex items-center gap-1">
				<span>\u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0641\u0639\u0627\u0644 (\u0622\u0646\u0644\u0627\u06CC\u0646)</span>
				<button type="button" onclick="openOnlineCounterWarning();" class="text-red-500 hover:text-red-400 transition-transform hover:scale-110 cursor-pointer inline-flex items-center" title="\u0647\u0634\u062F\u0627\u0631">
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
				</button>
			</span>
			<div class="p-1 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-md flex-shrink-0">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
			</div>
		</div>
		<div class="flex items-end justify-between relative z-10 w-full mt-0.5">
			<div class="text-lg font-black text-green-600 dark:text-green-400 transition-all leading-none" id="stat-active-users">0</div>
			<span class="text-[9px] text-green-500 dark:text-green-400 flex items-center gap-1 font-medium whitespace-nowrap leading-none mb-0.5">
				<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
				\u0645\u062A\u0635\u0644 \u062F\u0631 \u0627\u06CC\u0646 \u0644\u062D\u0638\u0647
			</span>
		</div>
	</div>
	<div id="card-cf-requests" class="bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md p-2.5 shadow-sm flex flex-col justify-center gap-1 hover:shadow-md hover:border-orange-400 dark:hover:border-orange-500/50 transition duration-300 relative overflow-hidden group min-h-[64px]">
		<div class="absolute -right-4 -bottom-4 w-16 h-16 bg-orange-500/10 rounded-full blur-xl group-hover:scale-150 transition duration-500"></div>
		<div class="flex items-center justify-between relative z-10">
			<span class="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-zinc-400 whitespace-nowrap">\u0631\u06CC\u06A9\u0648\u0626\u0633\u062A\u200C\u0647\u0627\u06CC \u0631\u0648\u0632\u0627\u0646\u0647</span>
			<div class="p-1 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-md flex-shrink-0">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
			</div>
		</div>
		<div class="relative z-10 min-w-0 flex-1 w-full mt-0.5">
			<div class="flex items-end justify-between w-full mb-1.5">
				<div class="flex items-baseline gap-1">
					<span class="text-lg font-black text-orange-600 dark:text-orange-400 transition-all leading-none" id="stat-cf-requests">0</span>
					<span class="text-[9px] font-bold text-gray-400 mr-0.5 leading-none">/ 100k</span>
					<button id="cf-warning-btn" onclick="openUsageWarning()" class="hidden flex items-center justify-center w-3 h-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full font-bold text-[9px] animate-bounce shadow-sm border border-red-300 dark:border-red-700 mr-1 leading-none">!</button>
				</div>
				<span class="text-[9px] text-orange-500 dark:text-orange-400 flex items-center gap-1 font-medium whitespace-nowrap leading-none">
					<span>Total: <span id="stat-cf-total">0</span></span>
				</span>
			</div>
			<div class="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-1">
				<div id="stat-cf-progress" class="bg-orange-500 h-1 rounded-full transition-all duration-500" style="width: 0%"></div>
			</div>
		</div>
	</div>
	<div id="card-d1-usage" class="bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md p-2.5 shadow-sm flex flex-col justify-center gap-1 hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500/50 transition duration-300 relative overflow-hidden group min-h-[64px]">
		<div class="absolute -right-4 -bottom-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition duration-500"></div>
		<div class="flex items-center justify-between relative z-10">
			<span class="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-zinc-400 whitespace-nowrap">\u0645\u0635\u0631\u0641 \u062F\u06CC\u062A\u0627\u0628\u06CC\u0633 D1</span>
			<div class="p-1 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-md flex-shrink-0">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
			</div>
		</div>
		<div class="relative z-10 min-w-0 flex-1 w-full mt-1">
			<div class="grid grid-cols-2 gap-2 w-full">
				<div class="flex flex-col items-start justify-center">
					<div class="flex items-baseline gap-1">
						<span class="text-sm font-black text-purple-600 dark:text-purple-400 transition-all leading-none" id="stat-d1-writes">0</span>
						<span class="text-[9px] font-bold text-gray-400 leading-none">/ 100k</span>
					</div>
					<span class="text-[9px] font-medium text-gray-500 dark:text-zinc-400 mt-1">\u0646\u0648\u0634\u062A\u0646</span>
				</div>
				<div class="flex flex-col items-end justify-center border-r border-gray-100 dark:border-zinc-800 pr-2">
					<div class="flex items-baseline gap-1">
						<span class="text-sm font-black text-purple-600 dark:text-purple-400 transition-all leading-none" id="stat-d1-reads">0</span>
						<span class="text-[9px] font-bold text-gray-400 leading-none">/ 5M</span>
					</div>
					<span class="text-[9px] font-medium text-gray-500 dark:text-zinc-400 mt-1">\u062E\u0648\u0627\u0646\u062F\u0646</span>
				</div>
			</div>
		</div>
	</div>
	<div class="bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md p-2.5 shadow-sm flex flex-col justify-center gap-1 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/50 transition duration-300 relative overflow-hidden group min-h-[64px]">
		<div class="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:scale-150 transition duration-500"></div>
		<div class="flex items-center justify-between relative z-10">
			<span class="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-zinc-400 whitespace-nowrap">\u062A\u0631\u0627\u0641\u06CC\u06A9 \u0645\u0635\u0631\u0641\u06CC \u0633\u0631\u0648\u0631</span>
			<div class="p-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-md flex-shrink-0">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
			</div>
		</div>
		<div class="flex items-end justify-between relative z-10 w-full mt-0.5">
			<div class="text-lg font-black text-blue-600 dark:text-blue-400 transition-all whitespace-nowrap leading-none" id="stat-total-usage">0 GB</div>
			<span class="text-[9px] text-blue-500 dark:text-blue-400 flex items-center gap-0.5 font-medium whitespace-nowrap leading-none mb-0.5">
				<svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
				\u0645\u062C\u0645\u0648\u0639
			</span>
		</div>
	</div>
</div>
		<div id="loading-state" class="text-center py-12">
			<span class="text-gray-500 dark:text-gray-400">\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC \u06A9\u0627\u0631\u0628\u0631\u0627\u0646...</span>
		</div>
		<div class="mb-5 flex flex-col md:flex-row gap-2 justify-between items-center bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md p-2 shadow-sm">
			<div class="relative w-full md:w-80">
				<input type="text" id="search-input" oninput="filterAndRenderUsers()" placeholder="\u062C\u0633\u062A\u062C\u0648\u06CC \u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u06CC\u0627 UUID..." class="w-full pl-3 pr-8 py-1.5 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs">
				<div class="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-400">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
				</div>
			</div>
			<div class="flex items-center gap-2 w-full md:w-auto">
				<select id="filter-status" onchange="filterAndRenderUsers()" class="flex-1 min-w-0 px-2 py-1.5 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-300 cursor-pointer truncate">
					<option value="all">\u{1F50D} \u0647\u0645\u0647</option>
					<option value="active">\u2705 \u0641\u0639\u0627\u0644</option>
					<option value="inactive">\u274C \u063A\u06CC\u0631\u0641\u0639\u0627\u0644</option>
					<option value="online">\u26A1 \u0622\u0646\u0644\u0627\u06CC\u0646</option>
					<option value="offline">\u{1F4A4} \u0622\u0641\u0644\u0627\u06CC\u0646</option>
					<option value="expired">\u23F3 \u0645\u0646\u0642\u0636\u06CC</option>
				</select>
				<select id="sort-users" onchange="filterAndRenderUsers()" class="flex-1 min-w-0 px-2 py-1.5 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-300 cursor-pointer truncate">
					<option value="newest">\u{1F4C5} \u062C\u062F\u06CC\u062F\u062A\u0631\u06CC\u0646</option>
					<option value="name">\u{1F524} \u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC (\u0627\u0644\u0641\u0628\u0627)</option>
					<option value="usage-desc">\u{1F4CA} \u0628\u06CC\u0634\u062A\u0631\u06CC\u0646 \u0645\u0635\u0631\u0641</option>
					<option value="usage-asc">\u{1F4C8} \u06A9\u0645\u062A\u0631\u06CC\u0646 \u0645\u0635\u0631\u0641</option>
					<option value="expiry-asc">\u23F3 \u06A9\u0645\u062A\u0631\u06CC\u0646 \u0632\u0645\u0627\u0646 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647</option>
				</select>
			</div>
		</div>
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-bold text-gray-800 dark:text-zinc-200 shrink-0 whitespace-nowrap">\u0644\u06CC\u0633\u062A \u06A9\u0627\u0631\u0628\u0631\u0627\u0646</h2>
			<div class="flex flex-col items-end gap-3">
				<div class="flex items-center justify-end gap-4">
				<button onclick="quickCreateUser(this)" title="\u0627\u0641\u0632\u0648\u062F\u0646 \u06A9\u0627\u0631\u0628\u0631 \u0633\u0631\u06CC\u0639 (VIP)" class="p-2 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-500 dark:border-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all duration-300 text-indigo-600 dark:text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.6)] hover:shadow-[0_0_25px_rgba(99,102,241,0.95)] hover:scale-125 active:scale-110 cursor-pointer inline-flex items-center justify-center relative group">
					<span class="absolute -inset-1 rounded-md bg-indigo-500/20 animate-ping opacity-75 group-hover:opacity-100 pointer-events-none"></span>
					<svg id="quick-add-icon" class="w-6 h-6 transition-transform duration-300 group-hover:rotate-12 drop-shadow-[0_0_6px_rgba(99,102,241,0.8)] relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
				</button>
				<button onclick="copyAllConfigs(this)" title="\u06A9\u067E\u06CC \u0647\u0645\u0647\u200C\u06CC \u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627\u06CC \u0647\u0645\u0647\u200C\u06CC \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 (\u06CC\u06A9\u062C\u0627)" class="p-2 rounded-md bg-fuchsia-50 dark:bg-fuchsia-950/40 border-2 border-fuchsia-500 dark:border-fuchsia-500 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/60 transition-all duration-300 text-fuchsia-600 dark:text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.6)] hover:shadow-[0_0_25px_rgba(217,70,239,0.95)] hover:scale-125 active:scale-110 cursor-pointer inline-flex items-center justify-center relative group">
					<svg class="w-6 h-6 drop-shadow-[0_0_6px_rgba(217,70,239,0.8)] relative z-10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V6a2 2 0 0 1 2-2h9"></path><path d="M12 14.5h5M12 17.5h5"></path></svg>
				</button>
				<button onclick="createDualCountryConfigs(this)" title="\u0633\u0627\u062E\u062A \u06F2 \u06A9\u0627\u0646\u0641\u06CC\u06AF (\u0645\u0639\u0645\u0648\u0644\u06CC + Hard) \u0627\u0632 \u06A9\u0634\u0648\u0631 \u062B\u0627\u0628\u062A\u200C\u0634\u062F\u0647" class="p-2 rounded-md bg-cyan-50 dark:bg-cyan-950/40 border-2 border-cyan-500 dark:border-cyan-500 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 transition-all duration-300 text-cyan-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] hover:shadow-[0_0_25px_rgba(6,182,212,0.95)] hover:scale-125 active:scale-110 cursor-pointer inline-flex items-center justify-center relative group">
					<svg id="dual-add-icon" class="w-6 h-6 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)] relative z-10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M4 16V6a2 2 0 0 1 2-2h10"></path><path d="M14 11v6M11 14h6"></path></svg>
				</button>
				<button onclick="openCreateModal()" title="\u0627\u0641\u0632\u0648\u062F\u0646 \u06A9\u0627\u0631\u0628\u0631" class="p-2 rounded-md bg-green-50 dark:bg-green-950/30 border-2 border-green-600 dark:border-green-700/60 hover:bg-green-100 dark:hover:bg-green-900/50 transition-all duration-300 text-green-700 dark:text-green-400 shadow-sm hover:shadow hover:scale-110 cursor-pointer inline-flex items-center justify-center">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
				</button>
				</div>
				<div class="flex items-center justify-end gap-4">
				<button onclick="openRocketModal(this)" title="\u0627\u0641\u0632\u0648\u062F\u0646 \u06A9\u0627\u0631\u0628\u0631 \u062A\u06A9 \u0644\u0648\u06A9\u06CC\u0634\u0646 (VIP)" class="p-2 rounded-md bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-500 dark:border-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-all duration-300 text-orange-600 dark:text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.6)] hover:shadow-[0_0_25px_rgba(249,115,22,0.95)] hover:scale-125 active:scale-110 cursor-pointer inline-flex items-center justify-center relative group">
					<svg id="rocket-add-icon" class="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 drop-shadow-[0_0_6px_rgba(249,115,22,0.8)] relative z-10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
						<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
						<path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
						<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
						<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
					</svg>
				</button>
				<button onclick="createNoFilteringConfigs(this)" title="\u0633\u0627\u062E\u062A \u06F4 \u06A9\u0627\u0646\u0641\u06CC\u06AF: \u06F2 \u0645\u0639\u0645\u0648\u0644\u06CC + \u06F2 Hard (\u062F\u0648\u200C\u062A\u0627 \u0628\u0627 ECH\u060C \u062F\u0648\u200C\u062A\u0627 \u0628\u0627 \u0628\u0647\u06CC\u0646\u0647\u200C\u0633\u0627\u0632\u06CC Patterniha) \u0627\u0632 \u06A9\u0634\u0648\u0631 \u062B\u0627\u0628\u062A\u200C\u0634\u062F\u0647" class="px-2.5 py-2 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 dark:border-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all duration-300 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)] hover:shadow-[0_0_25px_rgba(16,185,129,0.95)] hover:scale-110 active:scale-100 cursor-pointer inline-flex items-center justify-center gap-1.5 relative group">
					<svg id="nf-add-icon" class="w-5 h-5 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)] relative z-10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M4 16V6a2 2 0 0 1 2-2h10"></path><path d="M14 11v6M11 14h6"></path></svg>
					<span class="text-[11px] font-black relative z-10 whitespace-nowrap">no filtering</span>
				</button>
				</div>
			</div>
		</div>
		<div style="height:1px;margin:12px 0;background:linear-gradient(to left,transparent,rgba(125,211,252,.75),transparent)"></div>
		<div class="flex flex-wrap items-center justify-end gap-2">
			<label class="flex items-center gap-2 cursor-pointer select-none px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50/60 dark:bg-amber-950/20" title="\u0627\u0636\u0627\u0641\u0647 \u0634\u062F\u0646 \u06F3 \u06A9\u0627\u0646\u0641\u06CC\u06AF \u0627\u0637\u0644\u0627\u0639\u200C\u0631\u0633\u0627\u0646\u06CC (\u0645\u0635\u0631\u0641/\u0632\u0645\u0627\u0646 + \u06F2 \u06A9\u0627\u0646\u0641\u06CC\u06AF \u0631\u0627\u06CC\u06AF\u0627\u0646 \u0628\u0648\u062F\u0646 \u067E\u0646\u0644) \u0628\u0647 \u0627\u0628\u062A\u062F\u0627\u06CC \u0633\u0627\u0628 \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646">
				<span class="text-[11px] font-bold text-amber-800 dark:text-amber-300">\u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627\u06CC \u0627\u0637\u0644\u0627\u0639\u200C\u0631\u0633\u0627\u0646\u06CC (\u0645\u0635\u0631\u0641 + \u0631\u0627\u06CC\u06AF\u0627\u0646)</span>
				<span class="relative inline-flex items-center">
					<input type="checkbox" id="info-configs-toggle" onchange="toggleInfoConfigs(this)" class="sr-only peer">
					<span class="w-8 h-4 bg-gray-300 dark:bg-zinc-700 rounded-full peer-checked:bg-amber-500 transition-colors"></span>
					<span class="absolute top-[2px] right-[2px] w-3 h-3 bg-white rounded-full transition-transform peer-checked:-translate-x-4"></span>
				</span>
			</label>
			<button type="button" onclick="openBulkAdvancedModal()" title="\u062A\u063A\u06CC\u06CC\u0631 Advanced Fragment / Cipher Suites / TLS Mask \u0628\u0631\u0627\u06CC \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646" class="px-2.5 py-1 rounded-lg border border-purple-300 dark:border-purple-700/60 bg-purple-50/60 dark:bg-purple-950/20 text-[11px] font-bold text-purple-800 dark:text-purple-300">\u2699\uFE0F \u062A\u0646\u0638\u06CC\u0645 \u06CC\u06A9\u062C\u0627\u06CC \u067E\u06CC\u0634\u0631\u0641\u062A\u0647</button>
			<button type="button" onclick="openEchModal()" title="\u062A\u0646\u0638\u06CC\u0645\u0627\u062A ECH (SNI \u0648 DoH) \u06A9\u0647 \u0631\u0648\u06CC \u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627 \u0627\u0639\u0645\u0627\u0644 \u0645\u06CC\u200C\u0634\u0648\u062F" class="px-2.5 py-1 rounded-lg border border-purple-300 dark:border-purple-700/60 bg-purple-50/60 dark:bg-purple-950/20 text-[11px] font-bold text-purple-800 dark:text-purple-300">\u{1F510} \u062A\u0646\u0638\u06CC\u0645\u0627\u062A ECH</button>
		</div>
		<div style="height:1px;margin:12px 0;background:linear-gradient(to left,transparent,rgba(125,211,252,.75),transparent)"></div>
		<div class="flex flex-wrap items-center justify-end gap-2 mb-3">
			<label class="flex items-center gap-2 cursor-pointer select-none px-2.5 py-1 rounded-lg border border-purple-300 dark:border-purple-700/60 bg-purple-50/60 dark:bg-purple-950/20" title="\u0631\u0648\u0634\u0646: \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u067E\u06CC\u0634\u0631\u0641\u062A\u0647 \u0628\u0647\u06CC\u0646\u0647\u200C\u0633\u0627\u0632\u06CC (\u0645\u0642\u0627\u062F\u06CC\u0631 Patterniha) \u0631\u0648\u06CC \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0627\u0639\u0645\u0627\u0644 \u0645\u06CC\u200C\u0634\u0648\u062F">
				<span class="text-[11px] font-bold text-purple-800 dark:text-purple-300">\u0628\u0647\u06CC\u0646\u0647\u200C\u0633\u0627\u0632\u06CC Patterniha (\u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646)</span>
				<span class="relative inline-flex items-center">
					<input type="checkbox" id="patterniha-all-toggle" onchange="togglePatternihaAll(this)" class="sr-only peer">
					<span class="w-8 h-4 bg-gray-300 dark:bg-zinc-700 rounded-full peer-checked:bg-purple-500 transition-colors"></span>
					<span class="absolute top-[2px] right-[2px] w-3 h-3 bg-white rounded-full transition-transform peer-checked:-translate-x-4"></span>
				</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer select-none px-2.5 py-1 rounded-lg border border-fuchsia-300 dark:border-fuchsia-700/60 bg-fuchsia-50/60 dark:bg-fuchsia-950/20" title="\u0631\u0648\u0634\u0646: finalmask (fm) \u062E\u0627\u0644\u06CC\u060C \u0641\u06CC\u0646\u06AF\u0631\u067E\u0631\u06CC\u0646\u062A Chrome \u0648 ECH \u0631\u0648\u06CC \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 (Cipher Suites \u0648 TLS Mask \u0647\u0645 \u062E\u0627\u0644\u06CC \u0645\u06CC\u200C\u0634\u0646)">
				<span class="text-[11px] font-bold text-fuchsia-800 dark:text-fuchsia-300">\u0628\u0647\u06CC\u0646\u0647\u200C\u0633\u0627\u0632\u06CC Chrome + ECH (\u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646)</span>
				<span class="relative inline-flex items-center">
					<input type="checkbox" id="patterniha-ech-toggle" onchange="togglePatternihaEchAll(this)" class="sr-only peer">
					<span class="w-8 h-4 bg-gray-300 dark:bg-zinc-700 rounded-full peer-checked:bg-fuchsia-500 transition-colors"></span>
					<span class="absolute top-[2px] right-[2px] w-3 h-3 bg-white rounded-full transition-transform peer-checked:-translate-x-4"></span>
				</span>
			</label>
		</div>
		<div id="users-table-container" class="hidden overflow-x-auto pb-4 px-1">
			<table class="w-full text-right border-separate" style="border-spacing: 0 8px;">
				<thead>
					<tr class="bg-gray-200/90 dark:bg-zinc-800/80 backdrop-blur-md text-xs font-bold text-gray-700 dark:text-zinc-200 text-center leading-tight shadow-md">
						<th class="py-2 px-1.5 w-10 text-center rounded-r-md border-y border-r border-gray-200 dark:border-zinc-800"><input type="checkbox" id="select-all-users" onchange="toggleSelectAllUsers(this)" class="w-5 h-5 rounded-md border-2 border-gray-300 dark:border-zinc-700 text-blue-600 bg-white dark:bg-zinc-800 checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500/50 focus:ring-offset-0 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"></th>
						<th class="py-2 px-2 border-y border-gray-200 dark:border-zinc-800">\u0627\u0637\u0644\u0627\u0639\u0627\u062A</th>
						<th class="py-2 px-2 border-y border-gray-200 dark:border-zinc-800">\u0639\u0645\u0644\u06CC\u0627\u062A</th>
						<th class="py-2 px-2 border-y border-gray-200 dark:border-zinc-800">\u0644\u06CC\u0646\u06A9 \u0633\u0627\u0628</th>
						<th class="py-2 px-2 border-y border-gray-200 dark:border-zinc-800 w-1 whitespace-nowrap">
							<div class="flex items-center justify-center gap-1">
								<span>\u062A\u0639\u062F\u0627\u062F \u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627</span>
								<button type="button" onclick="openConfigCountWarning();" class="text-amber-500 hover:text-amber-400 transition-transform hover:scale-125 cursor-pointer inline-flex items-center" title="\u0647\u0634\u062F\u0627\u0631">
									<svg class="w-5 h-5 animate-pulse drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
								</button>
							</div>
						</th>
						<th class="py-2 px-2 border-y border-gray-200 dark:border-zinc-800">\u067E\u0648\u0631\u062A</th>
						<th class="py-2 px-2 border-y border-gray-200 dark:border-zinc-800 w-[115px]">\u062D\u062C\u0645</th>
						<th class="py-2 px-2 border-y border-gray-200 dark:border-zinc-800 w-[115px]">\u0631\u06CC\u06A9\u0648\u0626\u0633\u062A</th>
						<th class="py-2 px-2 border-y border-gray-200 dark:border-zinc-800 w-[115px]">\u0632\u0645\u0627\u0646</th>
						<th class="py-2 px-2 rounded-l-md border-y border-l border-gray-200 dark:border-zinc-800 w-[115px]">
							<div class="flex items-center justify-center gap-1">
								<span>\u0645\u062A\u0635\u0644</span>
								<button type="button" onclick="openOnlineCounterWarning();" class="text-red-500 hover:text-red-400 transition-transform hover:scale-110 cursor-pointer inline-flex items-center" title="\u0647\u0634\u062F\u0627\u0631">
									<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
								</button>
							</div>
						</th>
					</tr>
				</thead>
				<tbody id="users-tbody" class="text-sm"></tbody>
			</table>
		</div>
		<div id="empty-state" class="hidden p-8 border-2 border-dashed border-red-500/60 dark:border-red-500/50 bg-red-50 dark:bg-red-900/10 rounded-md text-center animate-pulse shadow-sm">
			<p class="text-red-600 dark:text-red-400 font-bold text-lg">\u06A9\u0627\u0631\u0628\u0631\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F. \u0628\u0631\u0627\u06CC \u0633\u0627\u062E\u062A \u0627\u0648\u0644\u06CC\u0646 \u06A9\u0627\u0631\u0628\u0631 \u0631\u0648\u06CC \u062F\u06A9\u0645\u0647 \xAB + \xBB \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F \u06CC\u0627 \u0627\u0632 \u062F\u06A9\u0645\u0647 \u26A1\uFE0F \u0628\u0631\u0627\u06CC \u0627\u06CC\u062C\u0627\u062F \u0633\u0631\u06CC\u0639 \u06A9\u0627\u0631\u0628\u0631 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.</p>
		</div>
	</main>
<div id="pwa-install-modal" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 opacity-0 pointer-events-none transition-opacity duration-200 ease-out">
	<div class="w-full max-w-sm bg-white dark:bg-amoled-card border border-green-500/40 rounded-2xl shadow-2xl p-6 transform transition-all scale-95 opacity-0 duration-200 text-center relative overflow-hidden">
		<div class="absolute -right-12 -top-12 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none"></div>
		<div class="flex justify-between items-center mb-4 relative z-10">
			<h3 class="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
				<span class="text-lg">\u{1F4F2}</span>
				<span id="pwa-modal-title">\u0631\u0627\u0647\u0646\u0645\u0627\u06CC \u0646\u0635\u0628 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646 \u0632\u0626\u0648\u0633</span>
			</h3>
			<button onclick="togglePwaModal(false)" class="p-1 rounded-md text-gray-400 hover:text-red-500 cursor-pointer transition">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
			</button>
		</div>
		<div class="flex items-center gap-3 p-3 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-200/70 dark:border-green-800/50 mb-4 text-right">
			<div class="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-950/60 border-2 border-green-500 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0 shadow-md">
				<svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
			</div>
			<div>
				<h4 class="text-xs font-black text-gray-900 dark:text-white">\u067E\u0646\u0644 \u0632\u0626\u0648\u0633</h4>
				<span class="text-[10px] text-gray-500 dark:text-zinc-400 block">\u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646 \u067E\u06CC\u0634\u0631\u0641\u062A\u0647 \u0648 \u0645\u0633\u062A\u0642\u0644 \u0648\u0628 (PWA)</span>
			</div>
		</div>
		<div id="pwa-instructions-list" class="space-y-2.5 text-right text-xs text-gray-700 dark:text-zinc-300 font-medium leading-relaxed select-none mb-5 max-h-48 overflow-y-auto pr-1">
		</div>
		<button onclick="togglePwaModal(false)" class="w-full py-2.5 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/40 dark:hover:text-green-300 font-bold rounded-xl text-xs transition shadow-sm cursor-pointer active:scale-95">\u0645\u062A\u0648\u062C\u0647 \u0634\u062F\u0645</button>
	</div>
</div>
<div id="rocket-modal" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 opacity-0 pointer-events-none transition-all duration-300 ease-out">
	<div class="w-full max-w-sm bg-white dark:bg-amoled-card border border-orange-500/50 rounded-2xl shadow-2xl p-6 transform transition-all scale-95 opacity-0 duration-200">
		<div class="flex justify-between items-center mb-4">
			<div class="flex items-center gap-2">
				<div class="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-sm">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
						<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
						<path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
						<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
						<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
					</svg>
				</div>
				<h3 class="text-sm font-black text-gray-900 dark:text-white">\u06A9\u0627\u0646\u0641\u06CC\u06AF \u062A\u06A9 \u0644\u0648\u06A9\u06CC\u0634\u0646</h3>
			</div>
			<button onclick="toggleRocketModal(false)" class="p-1.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 shadow-sm" title="\u0628\u0633\u062A\u0646">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
			</button>
		</div>
		<p class="text-[11px] text-gray-600 dark:text-gray-400 mb-5 font-medium leading-relaxed">\u06A9\u0634\u0648\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F \u062A\u0627 \u06A9\u0627\u0646\u0641\u06CC\u06AF \u062A\u06A9 \u0644\u0648\u06A9\u06CC\u0634\u0646 \u067E\u0631\u0633\u0631\u0639\u062A \u0633\u0627\u062E\u062A\u0647 \u0634\u0648\u062F.</p>
		<div class="space-y-4">
			<div>
				<select id="rocket-country-select" class="w-full px-3 py-2.5 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-gray-800 dark:text-zinc-100 cursor-pointer shadow-sm transition">
					<option value="">\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC \u06A9\u0634\u0648\u0631\u0647\u0627...</option>
				</select>
			</div>
			<button id="rocket-submit-btn" onclick="executeRocketCreate()" class="w-full py-2.5 bg-transparent border-2 border-orange-600 text-orange-700 hover:bg-orange-900/20 hover:text-orange-800 dark:border-orange-500 dark:text-orange-500 dark:hover:bg-orange-900/40 dark:hover:text-orange-400 font-black rounded-xl text-xs sm:text-sm transition shadow-lg">\u0634\u0631\u0648\u0639 \u0627\u0633\u06A9\u0646 \u0648 \u0633\u0627\u062E\u062A</button>
		</div>
	</div>
</div>
<div id="usage-warning-modal" class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60  opacity-0 pointer-events-none transition-all duration-300 ease-out">
	<div class="w-full max-w-md bg-white dark:bg-amoled-card border border-orange-500/50 rounded-md shadow-2xl overflow-hidden p-6 text-center transition-all transform duration-300 opacity-0 scale-95 ease-out">
		<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 mb-4 shadow-inner">
			<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
		</div>
		<h3 class="font-black text-xl text-gray-900 dark:text-white mb-2">\u0647\u0634\u062F\u0627\u0631 \u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0631\u0648\u0632\u0627\u0646\u0647</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed font-medium">
			\u062F\u0631\u062E\u0648\u0627\u0633\u062A\u200C\u0647\u0627\u06CC \u0631\u0648\u0632\u0627\u0646\u0647 \u06A9\u0644\u0648\u062F\u0641\u0644\u0631 \u0634\u0645\u0627 \u0627\u0632 \u06F9\u06F0,\u06F0\u06F0\u06F0 \u0639\u0628\u0648\u0631 \u06A9\u0631\u062F\u0647 \u0627\u0633\u062A. \u062F\u0631 \u0635\u0648\u0631\u062A \u0639\u0628\u0648\u0631 \u0627\u0632 \u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0631\u0627\u06CC\u06AF\u0627\u0646 \u06F1\u06F0\u06F0,\u06F0\u06F0\u06F0 \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u060C \u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u067E\u0640\u0646\u0640\u0644 \u0648 \u0627\u062A\u0635\u0627\u0644\u0627\u062A \u062A\u0627 \u0633\u0627\u0639\u062A \u06F3:\u06F3\u06F0 \u0628\u0627\u0645\u062F\u0627\u062F (\u0628\u0647 \u0648\u0642\u062A \u0627\u06CC\u0631\u0627\u0646) \u0642\u0637\u0639 \u062E\u0648\u0627\u0647\u062F \u0634\u062F.
		</p>
		<button onclick="closeUsageWarning()" class="w-full py-3.5 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 font-black rounded-md text-sm transition duration-300 shadow-lg">
			\u0645\u062A\u0648\u062C\u0647 \u0634\u062F\u0645
		</button>
	</div>
</div>
<div id="online-counter-warning-modal" class="fixed inset-0 z-[87] flex items-center justify-center p-4 bg-black/60  opacity-0 pointer-events-none transition-all duration-300 ease-out">
	<div class="w-full max-w-md bg-white dark:bg-amoled-card border border-red-500/50 rounded-md shadow-2xl overflow-hidden p-6 text-center transition-all transform duration-300 opacity-0 scale-95 ease-out">
		<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mb-4 shadow-inner">
			<svg class="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
		</div>
		<h3 class="font-black text-xl text-gray-900 dark:text-white mb-2">\u0647\u0634\u062F\u0627\u0631 \u0634\u0645\u0627\u0631\u0646\u062F\u0647 \u0622\u0646\u0644\u0627\u06CC\u0646</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed font-medium">
			\u0628\u0647 \u062F\u0644\u06CC\u0644 \u0645\u0627\u0647\u06CC\u062A \u0633\u0627\u062E\u062A\u0627\u0631 \u06A9\u0644\u0648\u062F\u0641\u0644\u0631\u060C \u0622\u0645\u0627\u0631 \u0634\u0645\u0627\u0631\u0646\u062F\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0622\u0646\u0644\u0627\u06CC\u0646 \u0628\u0627 \u062F\u0642\u062A \u0645\u0637\u0644\u0642 \u0645\u062D\u0627\u0633\u0628\u0647 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F\u061B \u0647\u0645\u0686\u0646\u06CC\u0646 \u0627\u0631\u0633\u0627\u0644 \u067E\u06CC\u0646\u06AF \u06CC\u0627 \u0628\u0631\u0631\u0633\u06CC \u0645\u062F\u0627\u0648\u0645 \u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627 \u062A\u0648\u0633\u0637 \u06A9\u0644\u0627\u06CC\u0646\u062A \u0645\u0645\u06A9\u0646 \u0627\u0633\u062A \u0628\u0647 \u0635\u0648\u0631\u062A \u0645\u0648\u0642\u062A \u0645\u0646\u062C\u0631 \u0628\u0647 \u0646\u0645\u0627\u06CC\u0634 \u0627\u0641\u0632\u0627\u06CC\u0634 \u06A9\u0627\u0630\u0628 \u062A\u0639\u062F\u0627\u062F \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0641\u0639\u0627\u0644 \u06AF\u0631\u062F\u062F.		</p>
		<button onclick="closeOnlineCounterWarning()" class="w-full py-3.5 bg-transparent border-2 border-red-600 text-red-700 hover:bg-red-900/20 hover:text-red-800 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-900/40 dark:hover:text-red-400 font-black rounded-md text-sm transition duration-300 shadow-lg">
			\u0645\u062A\u0648\u062C\u0647 \u0634\u062F\u0645
		</button>
	</div>
</div>
<div id="config-count-warning-modal" class="fixed inset-0 z-[88] flex items-center justify-center p-4 bg-black/60  opacity-0 pointer-events-none transition-all duration-300 ease-out">
	<div class="w-full max-w-md bg-white dark:bg-amoled-card border border-amber-500/50 rounded-md shadow-2xl overflow-hidden p-6 text-center transition-all transform duration-300 opacity-0 scale-95 ease-out">
		<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 mb-4 shadow-inner">
			<svg class="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
		</div>
		<h3 class="font-black text-xl text-gray-900 dark:text-white mb-3">\u0645\u062D\u0627\u0633\u0628\u0647 \u062A\u0639\u062F\u0627\u062F \u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed font-medium">
			\u062A\u0639\u062F\u0627\u062F \u06A9\u0644 \u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627\u06CC \u0647\u0631 \u06A9\u0627\u0631\u0628\u0631 \u0627\u0632 \u0627\u06CC\u0646 \u0641\u0631\u0645\u0648\u0644 \u0628\u0647 \u062F\u0633\u062A \u0645\u06CC\u200C\u0622\u06CC\u062F
		</p>
		<div class="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-md p-3 mb-4 text-xs font-bold text-gray-800 dark:text-zinc-200 text-center shadow-inner" dir="rtl">
			\u062A\u0639\u062F\u0627\u062F \u06A9\u0644 = \u06F3 + (\u062A\u0639\u062F\u0627\u062F \u067E\u0631\u0648\u06A9\u0633\u06CC \u0647\u0627 + \u06F1) \xD7 (\u062A\u0639\u062F\u0627\u062F \u0622\u06CC\u200C\u067E\u06CC \u062A\u0645\u06CC\u0632) \xD7 (\u062A\u0639\u062F\u0627\u062F \u067E\u0648\u0631\u062A)
		</div>
		<div class="text-[11px] text-amber-700 dark:text-amber-500 mb-6 leading-relaxed font-bold bg-amber-50 dark:bg-amber-950/20 p-3 rounded text-right border border-amber-200 dark:border-amber-900/50">
			\u26A0\uFE0F <b>\u062A\u0648\u0635\u06CC\u0647 \u0645\u0647\u0645:</b> \u0628\u0631\u0627\u06CC \u062C\u0644\u0648\u06AF\u06CC\u0631\u06CC \u0627\u0632 \u0632\u06CC\u0627\u062F \u0634\u062F\u0646 \u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627 \u0648 \u062F\u0631 \u0646\u062A\u06CC\u062C\u0647 \u0633\u0646\u06AF\u06CC\u0646 \u0634\u062F\u0646 \u0648 \u0647\u0646\u06AF \u06A9\u0631\u062F\u0646 \u0646\u0631\u0645\u200C\u0627\u0641\u0632\u0627\u0631 \u06A9\u0627\u0631\u0628\u0631\u060C \u067E\u06CC\u0634\u0646\u0647\u0627\u062F \u0645\u06CC\u200C\u0634\u0648\u062F \u067E\u0648\u0631\u062A\u200C\u0647\u0627\u06CC \u06A9\u0645\u062A\u0631\u06CC \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F \u0648 \u062A\u0639\u062F\u0627\u062F \u0622\u06CC\u200C\u067E\u06CC\u200C\u0647\u0627\u06CC \u062A\u0645\u06CC\u0632 \u0631\u0627 \u062F\u0631 \u062D\u062F \u0645\u0639\u0642\u0648\u0644 \u0646\u06AF\u0647 \u062F\u0627\u0631\u06CC\u062F.
		</div>
		<button onclick="closeConfigCountWarning()" class="w-full py-3.5 bg-transparent border-2 border-amber-600 text-amber-700 hover:bg-amber-900/20 hover:text-amber-800 dark:border-amber-500 dark:text-amber-500 dark:hover:bg-amber-900/40 dark:hover:text-amber-400 font-black rounded-md text-sm transition duration-300 shadow-lg">
			\u0645\u062A\u0648\u062C\u0647 \u0634\u062F\u0645
		</button>
	</div>
</div>
	<div id="user-modal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-200 ease-out">
		<div id="user-modal-card" class="w-full max-w-5xl bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-2xl shadow-2xl overflow-hidden transition-[opacity,transform] duration-200 opacity-0 scale-95 ease-out flex flex-col max-h-[92vh] transform-gpu">
			<div class="px-5 py-4 border-b border-gray-150 dark:border-amoled-border flex justify-between items-center bg-gray-50/70 dark:bg-amoled-bg/60">
				<div class="flex items-center gap-3">
					<div class="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
					</div>
					<div>
						<h3 id="modal-title" class="font-black text-gray-900 dark:text-zinc-100 text-sm sm:text-base tracking-tight">\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631 \u062C\u062F\u06CC\u062F</h3>
						<p class="text-[11px] text-gray-500 dark:text-zinc-400 font-medium">\u0645\u0634\u062E\u0635\u0627\u062A\u060C \u062F\u0633\u062A\u0631\u0633\u06CC\u200C\u0647\u0627 \u0648 \u067E\u0631\u0648\u062A\u06A9\u0644\u200C\u0647\u0627\u06CC \u0627\u062A\u0635\u0627\u0644 \u06A9\u0627\u0631\u0628\u0631</p>
					</div>
				</div>
				<button type="button" onclick="toggleModal(false)" class="p-2 rounded-lg bg-transparent border-2 border-red-500 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 shadow-sm" title="\u0628\u0633\u062A\u0646">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
				</button>
			</div>
			<form id="create-user-form" class="flex flex-col flex-1 min-h-0 overflow-hidden" onsubmit="handleFormSubmit(event)">
				<input type="hidden" id="hidden-auto-rotate" value="0">
				<input type="hidden" id="hidden-rotate-time" value="">
				<input type="hidden" id="hidden-ip-operator" value="all">
				<input type="hidden" id="hidden-ip-count" value="20">
				<div class="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
					<div class="w-full md:w-64 bg-gray-50/90 dark:bg-amoled-bg/80 border-b md:border-b-0 md:border-l border-gray-200 dark:border-amoled-border p-3 md:p-4 flex flex-row md:flex-col gap-2 flex-shrink-0 overflow-x-auto md:overflow-x-visible md:justify-between">
						<div class="flex flex-row md:flex-col gap-2 w-full">
							<button type="button" onclick="switchUserTab('tab-user-info')" id="tab-btn-user-info" class="user-modal-tab-btn active flex-1 md:flex-initial flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-3 p-1.5 sm:p-3 rounded-xl transition text-center sm:text-right cursor-pointer select-none bg-blue-600/10 dark:bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold shadow-sm">
								<div class="flex-shrink-0 w-4 h-4 sm:w-8 sm:h-8 rounded sm:rounded-lg flex items-center justify-center bg-blue-500/15 dark:bg-blue-400/20 text-blue-600 dark:text-blue-300">
									<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
								</div>
								<div class="hidden sm:block text-right">
									<div class="text-xs font-black">\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0648 \u0645\u0634\u062E\u0635\u0627\u062A</div>
									<div class="text-[10px] opacity-75 font-normal">\u062D\u062C\u0645\u060C \u0632\u0645\u0627\u0646\u060C \u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0648 \u062A\u0645\u062F\u06CC\u062F</div>
								</div>
								<span class="sm:hidden text-[10px] sm:text-xs font-bold whitespace-nowrap">\u0645\u0634\u062E\u0635\u0627\u062A</span>
							</button>
							<button type="button" onclick="switchUserTab('tab-ports-network')" id="tab-btn-ports-network" class="user-modal-tab-btn flex-1 md:flex-initial flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-3 p-1.5 sm:p-3 rounded-xl transition text-center sm:text-right cursor-pointer select-none bg-transparent hover:bg-gray-100 dark:hover:bg-amoled-input/50 border border-transparent text-gray-600 dark:text-zinc-400 font-medium">
								<div class="flex-shrink-0 w-4 h-4 sm:w-8 sm:h-8 rounded sm:rounded-lg flex items-center justify-center bg-gray-200/60 dark:bg-slate-900 text-gray-500 dark:text-zinc-400">
									<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
								</div>
								<div class="hidden sm:block text-right">
									<div class="text-xs font-black">\u067E\u0648\u0631\u062A\u200C\u0647\u0627\u06CC \u0627\u062A\u0635\u0627\u0644 \u0648 \u0634\u0628\u06A9\u0647</div>
									<div class="text-[10px] opacity-75 font-normal">\u067E\u0648\u0631\u062A\u200C\u0647\u0627\u060C \u0622\u06CC\u200C\u067E\u06CC \u062A\u0645\u06CC\u0632 \u0648 \u0641\u0631\u06AF\u0645\u0646\u062A</div>
								</div>
								<span class="sm:hidden text-[10px] sm:text-xs font-bold whitespace-nowrap">\u067E\u0648\u0631\u062A \u0648 IP</span>
							</button>
							<button type="button" onclick="switchUserTab('tab-proxy-settings')" id="tab-btn-proxy-settings" class="user-modal-tab-btn flex-1 md:flex-initial flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-3 p-1.5 sm:p-3 rounded-xl transition text-center sm:text-right cursor-pointer select-none bg-transparent hover:bg-gray-100 dark:hover:bg-amoled-input/50 border border-transparent text-gray-600 dark:text-zinc-400 font-medium">
								<div class="flex-shrink-0 w-4 h-4 sm:w-8 sm:h-8 rounded sm:rounded-lg flex items-center justify-center bg-gray-200/60 dark:bg-slate-900 text-gray-500 dark:text-zinc-400">
									<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
								</div>
								<div class="hidden sm:block text-right">
									<div class="text-xs font-black">\u062A\u0646\u0638\u06CC\u0645 \u067E\u0631\u0648\u06A9\u0633\u06CC \u0648 \u06A9\u0634\u0648\u0631</div>
									<div class="text-[10px] opacity-75 font-normal">\u0622\u06CC\u200C\u067E\u06CC \u062B\u0627\u0628\u062A \u0648 \u0632\u0646\u062C\u06CC\u0631\u0647 \u0627\u062A\u0635\u0627\u0644</div>
								</div>
								<span class="sm:hidden text-[10px] sm:text-xs font-bold whitespace-nowrap">\u067E\u0631\u0648\u06A9\u0633\u06CC</span>
							</button>
						</div>
						
						<div class="hidden md:flex flex-col gap-2 mt-auto pt-4 border-t border-gray-200 dark:border-amoled-border w-full">
							<button type="submit" id="submit-btn-desktop" class="w-full py-2.5 bg-transparent border-2 border-green-600 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 font-black rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
								<span>\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631</span>
							</button>
							<button type="button" onclick="toggleModal(false)" class="w-full py-2 bg-transparent border-2 border-red-600 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold rounded-xl text-xs transition shadow-sm">
								\u0627\u0646\u0635\u0631\u0627\u0641
							</button>
						</div>
					</div>
					<div class="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[72vh] space-y-4 custom-scrollbar overscroll-contain">
						
						<div id="tab-user-info" class="user-tab-panel space-y-4">
							<div class="p-4 bg-gray-50/70 dark:bg-amoled-input/30 border border-gray-200/70 dark:border-amoled-border rounded-xl space-y-3">
								<div class="flex items-center justify-between">
									<label class="block text-xs font-black text-gray-700 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
										<span class="w-2 h-2 rounded-full bg-indigo-500"></span>
										<span>\u067E\u0631\u0648\u062A\u06A9\u0644\u200C\u0647\u0627\u06CC \u0627\u062A\u0635\u0627\u0644 (\u0627\u0646\u062A\u062E\u0627\u0628 \u062D\u062F\u0627\u0642\u0644 \u06CC\u06A9 \u0645\u0648\u0631\u062F \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A)</span>
									</label>
								</div>
								<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
									<label class="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-amoled-border rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition select-none">
										<div class="flex items-center gap-2.5">
											<div class="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
												<svg class="w-5 h-5 -ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
											</div>
											<div>
												<span class="text-xs font-black text-gray-800 dark:text-zinc-200 block">\u067E\u0631\u0648\u062A\u06A9\u0644 VLESS</span>
												<span class="text-[10px] text-gray-500 dark:text-zinc-400 block font-normal">\u067E\u0631\u0648\u062A\u06A9\u0644 \u0633\u0628\u06A9 \u0648 \u067E\u0631\u0633\u0631\u0639\u062A </span>
											</div>
										</div>
										<input type="checkbox" id="input-proto-vless" checked onchange="handleProtocolChange(this)" class="w-4 h-4 rounded focus:ring-green-500/50 bg-white dark:bg-amoled-input border-gray-300 dark:border-amoled-border cursor-pointer text-green-600" style="filter: none !important; accent-color: #16a34a !important;">
									</label>
									<label class="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-amoled-border rounded-xl cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition select-none">
										<div class="flex items-center gap-2.5">
											<div class="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xs">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 11a2 2 0 100-4 2 2 0 000 4z"></path><path d="M12 11v3"></path></svg>
											</div>
											<div>
												<span class="text-xs font-black text-gray-800 dark:text-zinc-200 block">\u067E\u0631\u0648\u062A\u06A9\u0644 Trojan</span>
												<span class="text-[10px] text-gray-500 dark:text-zinc-400 block font-normal">\u067E\u0631\u0648\u062A\u06A9\u0644 \u0627\u0645\u0646\u06CC\u062A\u06CC \u067E\u06CC\u0634\u0631\u0641\u062A\u0647 </span>
											</div>
										</div>
										<input type="checkbox" id="input-proto-trojan" onchange="handleProtocolChange(this)" class="w-4 h-4 rounded focus:ring-green-500/50 bg-white dark:bg-amoled-input border-gray-300 dark:border-amoled-border cursor-pointer text-green-600" style="filter: none !important; accent-color: #16a34a !important;">
									</label>
									<label class="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-amoled-border rounded-xl cursor-pointer hover:border-yellow-500 dark:hover:border-yellow-500 transition select-none">
										<div class="flex items-center gap-2.5">
											<div class="w-8 h-8 rounded-lg bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-black text-xs">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
											</div>
											<div>
												<span class="text-xs font-black text-gray-800 dark:text-zinc-200 block">\u067E\u0631\u0648\u062A\u06A9\u0644 Shadowsocks</span>
												<span class="text-[10px] text-gray-500 dark:text-zinc-400 block font-normal">\u067E\u0631\u0648\u062A\u06A9\u0644 \u0627\u0645\u0646 \u0633\u0628\u06A9</span>
											</div>
										</div>
										<input type="checkbox" id="input-proto-ss" onchange="handleProtocolChange(this)" class="w-4 h-4 rounded focus:ring-green-500/50 bg-white dark:bg-amoled-input border-gray-300 dark:border-amoled-border cursor-pointer text-green-600" style="filter: none !important; accent-color: #16a34a !important;">
									</label>
								</div>
								<div class="mt-2.5 p-2 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg flex items-start gap-2 shadow-sm">
									<svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
									<span class="text-[10px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed text-justify">\u0647\u0634\u062F\u0627\u0631: \u067E\u0631\u0648\u062A\u06A9\u0644 \u0634\u062F\u0648\u0633\u0627\u06A9\u0633 \u062F\u0631 \u0645\u0648\u0628\u0627\u06CC\u0644 \u0641\u0642\u0637 \u0631\u0648\u06CC \u0628\u0631\u0646\u0627\u0645\u0647 <a href="https://www.happ.su/main" target="_blank" class="text-blue-600 dark:text-blue-400 underline hover:opacity-80 transition-opacity">happ</a> \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0645\u06CC\u0634\u0648\u062F.</span>
								</div>
							</div>
							
							<div class="p-4 bg-gray-50/70 dark:bg-amoled-input/30 border border-gray-200/70 dark:border-amoled-border rounded-xl space-y-3">
								<div class="flex items-center justify-between">
									<label class="block text-xs font-black text-gray-700 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
										<span class="w-2 h-2 rounded-full bg-blue-500"></span>
										<span>\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC (\u0627\u0644\u0632\u0627\u0645\u06CC)</span>
									</label>
									<button type="button" onclick="generateRandomUsername()" class="px-2.5 py-1 bg-transparent border-2 border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md text-[11px] font-bold transition flex items-center gap-1">
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
										<span>\u0646\u0627\u0645 \u062A\u0635\u0627\u062F\u0641\u06CC</span>
									</button>
								</div>
								<div class="relative">
									<span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
									</span>
									<input type="text" id="input-name" placeholder="my-config" dir="ltr" class="w-full pl-3 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs font-semibold text-gray-800 dark:text-zinc-100 placeholder-gray-400 transition shadow-sm">
								</div>
							</div>
							
							<div class="p-4 bg-gray-50/70 dark:bg-amoled-input/30 border border-gray-200/70 dark:border-amoled-border rounded-xl space-y-4">
								<div class="space-y-3">
									<h4 class="text-xs font-black text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
										<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
										<span>\u0627\u0639\u062A\u0628\u0627\u0631 \u062D\u062C\u0645\u06CC \u0648 \u0632\u0645\u0627\u0646\u06CC</span>
									</h4>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
										<div>
											<label class="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 mb-1">\u062D\u062C\u0645 \u0645\u062C\u0627\u0632 (\u06AF\u06CC\u06AF\u0627\u0628\u0627\u06CC\u062A)</label>
											<div class="relative">
												<span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
													<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
												</span>
												<input type="number" id="input-limit" step="0.1" min="0" placeholder="\u0646\u0627\u0645\u062D\u062F\u0648\u062F" class="w-full pl-3 pr-9 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs font-semibold text-gray-800 dark:text-zinc-100 placeholder-gray-400 transition shadow-sm">
											</div>
											<div class="flex items-center gap-1 mt-1.5 flex-wrap">
												<span class="text-[9px] text-gray-400 dark:text-zinc-500 font-bold ml-1">\u0627\u0646\u062A\u062E\u0627\u0628 \u0633\u0631\u06CC\u0639:</span>
												<button type="button" onclick="setQuickVol(10)" class="px-2 py-0.5 rounded bg-transparent border border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-bold transition cursor-pointer">\u06F1\u06F0 \u06AF\u06CC\u06AF</button>
												<button type="button" onclick="setQuickVol(50)" class="px-2 py-0.5 rounded bg-transparent border border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-bold transition cursor-pointer">\u06F5\u06F0 \u06AF\u06CC\u06AF</button>
												<button type="button" onclick="setQuickVol(100)" class="px-2 py-0.5 rounded bg-transparent border border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-bold transition cursor-pointer">\u06F1\u06F0\u06F0 \u06AF\u06CC\u06AF</button>
												<button type="button" onclick="setQuickVol('')" class="px-2 py-0.5 rounded bg-transparent border border-gray-500 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-amoled-input text-[10px] font-bold transition cursor-pointer">\u0646\u0627\u0645\u062D\u062F\u0648\u062F</button>
											</div>
										</div>
										<div>
											<label class="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 mb-1">\u0645\u062F\u062A \u0632\u0645\u0627\u0646 \u0627\u0639\u062A\u0628\u0627\u0631 (\u0631\u0648\u0632)</label>
											<div class="relative">
												<span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
													<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
												</span>
												<input type="number" id="input-expiry" min="1" placeholder="\u0646\u0627\u0645\u062D\u062F\u0648\u062F" class="w-full pl-3 pr-9 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs font-semibold text-gray-800 dark:text-zinc-100 placeholder-gray-400 transition shadow-sm">
											</div>
											<div class="flex items-center gap-1 mt-1.5 flex-wrap">
												<span class="text-[9px] text-gray-400 dark:text-zinc-500 font-bold ml-1">\u0627\u0646\u062A\u062E\u0627\u0628 \u0633\u0631\u06CC\u0639:</span>
												<button type="button" onclick="setQuickExp(30)" class="px-2 py-0.5 rounded bg-transparent border border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-bold transition cursor-pointer">\u06F1 \u0645\u0627\u0647</button>
												<button type="button" onclick="setQuickExp(60)" class="px-2 py-0.5 rounded bg-transparent border border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-bold transition cursor-pointer">\u06F2 \u0645\u0627\u0647</button>
												<button type="button" onclick="setQuickExp(90)" class="px-2 py-0.5 rounded bg-transparent border border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-bold transition cursor-pointer">\u06F3 \u0645\u0627\u0647</button>
												<button type="button" onclick="setQuickExp('')" class="px-2 py-0.5 rounded bg-transparent border border-gray-500 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-amoled-input text-[10px] font-bold transition cursor-pointer">\u0646\u0627\u0645\u062D\u062F\u0648\u062F</button>
											</div>
										</div>
									</div>
									<div class="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-amoled-border rounded-lg">
										<div class="flex items-center gap-2">
											<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
											<span class="text-xs font-bold text-gray-700 dark:text-zinc-300">\u0634\u0631\u0648\u0639 \u0645\u062D\u0627\u0633\u0628\u0647 \u0632\u0645\u0627\u0646 \u0627\u0632 \u0627\u0648\u0644\u06CC\u0646 \u0627\u062A\u0635\u0627\u0644 \u06A9\u0627\u0631\u0628\u0631</span>
										</div>
										<label class="relative inline-flex items-center cursor-pointer select-none">
											<input type="checkbox" id="input-start-on-first-connect" class="sr-only peer">
											<div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:-translate-x-[16px]"></div>
										</label>
									</div>
								</div>
								
								<div class="border-t border-gray-200/70 dark:border-amoled-border"></div>
								
								<div class="space-y-3">
									<h4 class="text-xs font-black text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
										<span class="w-2 h-2 rounded-full bg-purple-500"></span>
										<span>\u0645\u062D\u062F\u0648\u062F\u06CC\u062A\u200C\u0647\u0627\u06CC \u0627\u062A\u0635\u0627\u0644 \u0648 \u0627\u0645\u0646\u06CC\u062A</span>
									</h4>
									<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
										<div>
											<label class="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 mb-1">\u062A\u0639\u062F\u0627\u062F \u062F\u0631\u062E\u0648\u0627\u0633\u062A (\u0631\u06CC\u06A9\u0648\u0626\u0633\u062A)</label>
											<div class="relative">
												<span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
													<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
												</span>
												<input type="number" id="input-req-limit" min="0" placeholder="\u0646\u0627\u0645\u062D\u062F\u0648\u062F" class="w-full pl-3 pr-9 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs font-semibold text-gray-800 dark:text-zinc-100 placeholder-gray-400 transition shadow-sm">
											</div>
										</div>
										<div>
											<label class="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
												<span>\u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u06A9\u0627\u0631\u0628\u0631</span>
												<button type="button" onclick="openOnlineCounterWarning();" class="text-red-500 hover:text-red-400 cursor-pointer inline-flex items-center animate-sym-bounce hover:animate-none transition-transform hover:scale-125" title="\u0647\u0634\u062F\u0627\u0631 \u0645\u0647\u0645">
													<svg class="w-4 h-4 drop-shadow-[0_0_6px_rgba(239,68,68,0.9)] dark:drop-shadow-[0_0_8px_rgba(248,113,113,1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
												</button>
											</label>
											<div class="relative">
												<span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
													<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
												</span>
												<input type="number" id="input-ip-limit" min="0" placeholder="\u0646\u0627\u0645\u062D\u062F\u0648\u062F" class="w-full pl-3 pr-9 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs font-semibold text-gray-800 dark:text-zinc-100 placeholder-gray-400 transition shadow-sm">
											</div>
										</div>
										<div>
											<label class="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 mb-1">\u0641\u06CC\u0646\u06AF\u0631\u067E\u0631\u06CC\u0646\u062A TLS</label>
											<div class="relative">
												<select id="fingerprint-select" class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer appearance-none shadow-sm">
													<option value="chrome">\u{1F310} Chrome</option>
													<option value="firefox">\u{1F98A} Firefox</option>
													<option value="safari">\u{1F9ED} Safari</option>
													<option value="ios">\u{1F4F1} iOS</option>
													<option value="android">\u{1F916} Android</option>
													<option value="edge">\u{1F300} Edge</option>
													<option value="360">\u{1F512} 360 Browser</option>
													<option value="qq">\u{1F4AC} QQ Browser</option>
													<option value="random">\u{1F3B2} Random</option>
													<option value="randomized">\u{1F3AD} Dynamic</option>
													<option value="unsafe" selected>\u{1F680} Unsafe (\u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC)</option>
												</select>
												<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
													<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div class="p-4 bg-gray-50/70 dark:bg-amoled-input/30 border border-gray-200/70 dark:border-amoled-border rounded-xl space-y-3">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2">
										<svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
										<div>
											<span class="text-xs font-black text-gray-800 dark:text-zinc-200">\u062A\u0645\u062F\u06CC\u062F \u062E\u0648\u062F\u06A9\u0627\u0631 \u062A\u0631\u0627\u0641\u06CC\u06A9</span>
											<span class="text-[10px] text-gray-400 block font-normal">\u0631\u06CC\u0633\u062A \u0627\u062A\u0648\u0645\u0627\u062A\u06CC\u06A9 \u062F\u0631 \u0633\u0627\u0639\u062A \u06F3:\u06F3\u06F0 \u0628\u0627\u0645\u062F\u0627\u062F</span>
										</div>
									</div>
									<label class="relative inline-flex items-center cursor-pointer select-none">
										<input type="checkbox" id="input-auto-reset-toggle" onchange="toggleAutoResetInputs(this.checked)" class="sr-only peer">
										<div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-emerald-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:-translate-x-[16px]"></div>
									</label>
								</div>
								<div id="auto-reset-inputs-container" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200/60 dark:border-amoled-border opacity-50 pointer-events-none transition-all duration-200">
									<div>
										<label class="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 mb-1">\u062F\u0648\u0631\u0647 \u062A\u0645\u062F\u06CC\u062F \u062D\u062C\u0645 (\u0631\u0648\u0632)</label>
										<input type="number" id="input-auto-reset-vol" min="1" placeholder="\u062E\u0627\u0644\u06CC = \u0628\u062F\u0648\u0646 \u062A\u0645\u062F\u06CC\u062F" class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs font-mono text-center text-gray-800 dark:text-zinc-100 transition" dir="ltr" disabled>
									</div>
									<div>
										<label class="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 mb-1">\u062F\u0648\u0631\u0647 \u062A\u0645\u062F\u06CC\u062F \u0631\u06CC\u06A9\u0648\u0626\u0633\u062A (\u0631\u0648\u0632)</label>
										<input type="number" id="input-auto-reset-req" min="1" placeholder="\u062E\u0627\u0644\u06CC = \u0628\u062F\u0648\u0646 \u062A\u0645\u062F\u06CC\u062F" class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs font-mono text-center text-gray-800 dark:text-zinc-100 transition" dir="ltr" disabled>
									</div>
								</div>
							</div>
							
							<div>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div class="flex items-center justify-between p-3.5 bg-gray-50/70 dark:bg-amoled-input/30 border border-gray-200/70 dark:border-amoled-border rounded-xl">
										<div class="flex items-center gap-2">
											<span class="text-base">\u{1F51E}</span>
											<span class="text-xs font-bold text-gray-700 dark:text-zinc-300">\u0645\u0633\u062F\u0648\u062F\u0633\u0627\u0632\u06CC \u0633\u0627\u06CC\u062A\u200C\u0647\u0627\u06CC \u063A\u06CC\u0631\u0627\u062E\u0644\u0627\u0642\u06CC</span>
										</div>
										<label class="relative inline-flex items-center cursor-pointer select-none">
											<input type="checkbox" id="input-block-porn" class="sr-only peer">
											<div class="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-red-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform peer-checked:after:-translate-x-[16px]"></div>
										</label>
									</div>
									<div class="flex items-center justify-between p-3.5 bg-gray-50/70 dark:bg-amoled-input/30 border border-gray-200/70 dark:border-amoled-border rounded-xl">
										<div class="flex items-center gap-2">
											<span class="text-base">\u{1F6AB}</span>
											<span class="text-xs font-bold text-gray-700 dark:text-zinc-300">\u0645\u0633\u062F\u0648\u062F\u0633\u0627\u0632\u06CC \u062A\u0628\u0644\u06CC\u063A\u0627\u062A \u0627\u06CC\u0646\u062A\u0631\u0646\u062A\u06CC</span>
										</div>
										<label class="relative inline-flex items-center cursor-pointer select-none">
											<input type="checkbox" id="input-block-ads" class="sr-only peer">
											<div class="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-amber-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform peer-checked:after:-translate-x-[16px]"></div>
										</label>
									</div>
								</div>
								<div class="mt-2.5 p-2 bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-2 shadow-sm">
									<svg class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
									<span class="text-[10px] font-bold text-red-700 dark:text-red-400 leading-relaxed text-justify">\u0647\u0634\u062F\u0627\u0631: \u062F\u0631 \u0635\u0648\u0631\u062A \u0631\u0648\u0634\u0646 \u0628\u0648\u062F\u0646 \u0641\u0631\u06AF\u0645\u0646\u062A (Fragment) \u06AF\u0632\u06CC\u0646\u0647 \u0647\u0627\u06CC \u0645\u0633\u062F\u0648\u062F\u0633\u0627\u0632\u06CC \u0639\u0645\u0644\u0627\u064B \u06A9\u0627\u0631 \u0646\u062E\u0648\u0627\u0647\u0646\u062F \u06A9\u0631\u062F.</span>
								</div>
							</div>
						</div>
						
						<div id="tab-ports-network" class="user-tab-panel hidden space-y-4">
							<div class="p-4 bg-gray-50/70 dark:bg-amoled-input/30 border border-gray-200/70 dark:border-amoled-border rounded-xl space-y-3">
								<h4 class="text-xs font-black text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
									<span class="w-2 h-2 rounded-full bg-blue-500"></span>
									<span>\u067E\u0648\u0631\u062A\u200C\u0647\u0627\u06CC \u0627\u062A\u0635\u0627\u0644 VLESS</span>
								</h4>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div class="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg flex flex-col">
										<div class="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-gray-100 dark:border-amoled-border">
											<span class="w-2 h-2 rounded-full bg-blue-500"></span>
											<span class="text-[11px] font-bold text-blue-600 dark:text-blue-400">TLS PORT (\u0631\u0645\u0632\u0646\u06AF\u0627\u0631\u06CC \u0634\u062F\u0647)</span>
										</div>
										<div class="grid grid-cols-3 gap-1.5 flex-1 content-start" id="tls-ports-list"></div>
									</div>
									<div class="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg flex flex-col">
										<div class="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-gray-100 dark:border-amoled-border">
											<span class="w-2 h-2 rounded-full bg-amber-500"></span>
											<span class="text-[11px] font-bold text-amber-600 dark:text-amber-400">Non-TLS PORT (\u0628\u062F\u0648\u0646 \u0631\u0645\u0632\u0646\u06AF\u0627\u0631\u06CC)</span>
										</div>
										<div class="grid grid-cols-3 gap-1.5 flex-1 content-start" id="nontls-ports-list"></div>
									</div>
								</div>
								<div class="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg space-y-1.5">
									<label class="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
										<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
										<span>\u067E\u0648\u0631\u062A\u200C\u0647\u0627\u06CC \u062F\u0644\u062E\u0648\u0627\u0647 \u0648 \u0633\u0641\u0627\u0631\u0634\u06CC (\u0628\u0627 \u0641\u0627\u0635\u0644\u0647 \u062C\u062F\u0627 \u06A9\u0646\u06CC\u062F)</span>
									</label>
									<input type="text" id="input-custom-ports" placeholder="\u0645\u062B\u0627\u0644: 8080 2096 8443 5000" dir="ltr" class="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs font-mono text-gray-800 dark:text-zinc-100 transition shadow-sm">
								</div>
							</div>
							
							<div class="p-4 bg-gray-50/70 dark:bg-amoled-input/30 border border-gray-200/70 dark:border-amoled-border rounded-xl space-y-3">
								<div class="flex items-center justify-between flex-wrap gap-2">
									<h4 class="text-xs font-black text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
										<span class="w-2 h-2 rounded-full bg-sky-500"></span>
										<span>\u0622\u06CC\u200C\u067E\u06CC\u200C\u0647\u0627\u06CC \u062A\u0645\u06CC\u0632 \u06A9\u0644\u0648\u062F\u0641\u0644\u0631 (Clean IPs)</span>
									</h4>
									<div class="flex items-center gap-1.5">
										<button type="button" onclick="openIpSelectorModal()" class="px-2.5 py-1 bg-transparent border-2 border-amber-500 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md text-[11px] font-bold transition flex items-center gap-1 shadow-sm">
											<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
										<span>\u0645\u062E\u0632\u0646 \u0622\u06CC\u200C\u067E\u06CC</span>
										</button>
									</div>
								</div>
								<textarea id="input-ips" placeholder="104.16.0.1&#10;104.17.0.1&#10;162.159.192.1" class="w-full h-24 px-3 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs font-mono text-gray-800 dark:text-zinc-100 placeholder-gray-400 transition resize-none shadow-sm"></textarea>
	
								<div class="flex items-center justify-between p-3 mt-2 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200/60 dark:border-emerald-800/40 rounded-lg shadow-sm">
									<div class="flex items-center gap-2">
										<svg class="w-4 h-4 text-emerald-600 dark:text-emerald-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
										<div>
											<span class="text-xs font-black text-gray-800 dark:text-zinc-200">\u062A\u0639\u0648\u06CC\u0636 \u062E\u0648\u062F\u06A9\u0627\u0631 \u0622\u06CC\u200C\u067E\u06CC (\u062A\u0648\u0635\u06CC\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F)</span>
											<span class="text-[10px] text-gray-500 dark:text-zinc-400 block font-normal mt-0.5">\u062C\u0627\u0628\u062C\u0627\u06CC\u06CC \u0622\u06CC\u200C\u067E\u06CC\u200C\u0647\u0627 \u0628\u0627 \u0647\u0631 \u0628\u0627\u0631 \u0631\u0641\u0631\u0634 \u06A9\u0644\u0627\u06CC\u0646\u062A</span>
										</div>
									</div>
									<label class="relative inline-flex items-center cursor-pointer select-none">
										<input type="checkbox" id="input-auto-rotate-ip-toggle" class="sr-only peer" checked>
										<div class="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-emerald-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:-translate-x-[16px]"></div>
									</label>
								</div>
							</div>
							
							<div class="bg-gradient-to-b from-blue-50/50 to-indigo-50/20 dark:from-amoled-input/50 dark:to-amoled-bg/50 border border-blue-200/70 dark:border-amoled-border rounded-2xl overflow-hidden shadow-sm">
								<div class="flex items-center justify-between p-4 cursor-pointer" onclick="document.getElementById('input-frag-toggle').click()">
									<div class="flex items-center gap-2.5">
										<div class="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shadow-sm">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
										</div>
										<div>
											<span class="text-xs font-black text-gray-900 dark:text-zinc-100 flex items-center gap-1.5">
												<span>\u0641\u0631\u06AF\u0645\u0646\u062A \u0636\u062F \u0641\u06CC\u0644\u062A\u0631\u06CC\u0646\u06AF</span>
											</span>
											<span class="text-[10px] text-gray-500 dark:text-zinc-400 block font-normal mt-0.5">\u062A\u062C\u0632\u06CC\u0647 \u067E\u06A9\u062A\u200C\u0647\u0627\u06CC \u0627\u062A\u0635\u0627\u0644 \u0628\u0631\u0627\u06CC \u0639\u0628\u0648\u0631 \u062A\u0636\u0645\u06CC\u0646\u06CC</span>
										</div>
									</div>
									<div class="flex items-center gap-2" onclick="event.stopPropagation()">
										<label class="relative inline-flex items-center cursor-pointer select-none">
											<input type="checkbox" id="input-frag-toggle" onchange="toggleFragInputs(this.checked)" checked class="sr-only peer">
											<div class="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:-translate-x-[20px]"></div>
										</label>
										<svg id="frag-settings-icon" class="w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform duration-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
									</div>
								</div>
								<div id="frag-inputs-container" class="p-4 pt-0 space-y-3.5 transition-all duration-300">
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-blue-100 dark:border-amoled-border transition-all duration-200">
										<div>
											<label class="block text-[10px] font-bold text-gray-600 dark:text-zinc-300 mb-1 flex items-center justify-between">
												<span>\u0637\u0648\u0644 \u0641\u0631\u06AF\u0645\u0646\u062A (Length)</span>
												<span class="text-[9px] text-gray-400">\u0628\u0627\u06CC\u062A\u200C\u0647\u0627\u06CC \u062A\u0642\u0633\u06CC\u0645 \u067E\u06A9\u062A</span>
											</label>
											<input type="text" id="input-frag-len" value="200-3000" class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs font-mono text-center text-gray-800 dark:text-zinc-100 transition shadow-sm" dir="ltr" placeholder="\u0645\u062B\u0627\u0644: 10-30 \u06CC\u0627 200-3000">
										</div>
										<div>
											<label class="block text-[10px] font-bold text-gray-600 dark:text-zinc-300 mb-1 flex items-center justify-between">
												<span>\u0628\u0627\u0632\u0647 \u0641\u0631\u06AF\u0645\u0646\u062A (Interval ms)</span>
												<span class="text-[9px] text-gray-400">\u062A\u0627\u062E\u06CC\u0631 \u0645\u06CC\u0644\u06CC\u200C\u062B\u0627\u0646\u06CC\u0647</span>
											</label>
											<input type="text" id="input-frag-int" value="1-2" class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-amoled-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xs font-mono text-center text-gray-800 dark:text-zinc-100 transition shadow-sm" dir="ltr" placeholder="\u0645\u062B\u0627\u0644: 1-2 \u06CC\u0627 2-5">
										</div>
									</div>
									<div class="pt-2 border-t border-blue-100/80 dark:border-amoled-border space-y-2">
										<div class="flex items-center justify-between">
											<span class="text-[11px] font-black text-gray-800 dark:text-zinc-200 flex items-center gap-1.5">
												<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
												<span>\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC \u0641\u0631\u06AF\u0645\u0646\u062A \u0628\u0631\u0627\u06CC \u0627\u067E\u0631\u0627\u062A\u0648\u0631\u0647\u0627 (\u06A9\u0644\u06CC\u06A9 \u0628\u0631\u0627\u06CC \u0627\u0639\u0645\u0627\u0644 \u062E\u0648\u062F\u06A9\u0627\u0631):</span>
											</span>
										</div>
										<div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
											<button type="button" onclick="applyFragPreset('mci', this)" class="frag-preset-card group p-2.5 rounded-xl border border-teal-300/80 dark:border-teal-800/70 bg-white dark:bg-slate-950 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md hover:shadow-teal-500/10 text-right transition-all flex flex-col justify-between cursor-pointer">
												<div class="flex items-center justify-between mb-1.5">
													<span class="text-xs font-black text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
														<span class="w-2 h-2 rounded-full bg-teal-500"></span>
														\u0647\u0645\u0631\u0627\u0647 \u0627\u0648\u0644 (MCI)
													</span>
													<span class="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono font-bold whitespace-nowrap">10-30</span>
												</div>
												<p class="text-[10px] text-teal-600/90 dark:text-teal-400/80 font-medium leading-tight">\u0634\u06A9\u0633\u062A\u0646 \u067E\u06A9\u062A + \u062A\u0627\u062E\u06CC\u0631 \u06F2-\u06F5 ms</p>
											</button>
											<button type="button" onclick="applyFragPreset('irancell', this)" class="frag-preset-card group p-2.5 rounded-xl border border-amber-300/80 dark:border-amber-800/70 bg-white dark:bg-slate-950 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md hover:shadow-amber-500/10 text-right transition-all flex flex-col justify-between cursor-pointer">
												<div class="flex items-center justify-between mb-1.5">
													<span class="text-xs font-black text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
														<span class="w-2 h-2 rounded-full bg-amber-500"></span>
														\u0627\u06CC\u0631\u0627\u0646\u0633\u0644 (MTN)
													</span>
													<span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold whitespace-nowrap">100-200</span>
												</div>
												<p class="text-[10px] text-amber-600/90 dark:text-amber-400/80 font-medium leading-tight">\u067E\u0627\u06CC\u062F\u0627\u0631\u06CC 4G/5G + \u062A\u0627\u062E\u06CC\u0631 \u06F5-\u06F1\u06F0 ms</p>
											</button>
											<button type="button" onclick="applyFragPreset('rightel', this)" class="frag-preset-card group p-2.5 rounded-xl border border-fuchsia-300/80 dark:border-fuchsia-800/70 bg-white dark:bg-slate-950 hover:border-fuchsia-500 dark:hover:border-fuchsia-500 hover:shadow-md hover:shadow-fuchsia-500/10 text-right transition-all flex flex-col justify-between cursor-pointer">
												<div class="flex items-center justify-between mb-1.5">
													<span class="text-xs font-black text-fuchsia-700 dark:text-fuchsia-300 flex items-center gap-1.5">
														<span class="w-2 h-2 rounded-full bg-fuchsia-500"></span>
														\u0631\u0627\u06CC\u062A\u0644 (Rightel)
													</span>
													<span class="text-[9px] px-1.5 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-mono font-bold whitespace-nowrap">50-100</span>
												</div>
												<p class="text-[10px] text-fuchsia-600/90 dark:text-fuchsia-400/80 font-medium leading-tight">\u0628\u0647\u06CC\u0646\u0647 \u06F3G/4G + \u062A\u0627\u062E\u06CC\u0631 \u06F2-\u06F5 ms</p>
											</button>
											<button type="button" onclick="applyFragPreset('tci', this)" class="frag-preset-card group p-2.5 rounded-xl border border-indigo-300/80 dark:border-indigo-800/70 bg-white dark:bg-slate-950 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/10 text-right transition-all flex flex-col justify-between cursor-pointer">
												<div class="flex items-center justify-between mb-1.5">
													<span class="text-xs font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
														<span class="w-2 h-2 rounded-full bg-indigo-500"></span>
														\u0645\u062E\u0627\u0628\u0631\u0627\u062A / \u062B\u0627\u0628\u062A
													</span>
													<span class="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold whitespace-nowrap">50-200</span>
												</div>
												<p class="text-[10px] text-indigo-600/90 dark:text-indigo-400/80 font-medium leading-tight">\u0622\u0633\u06CC\u0627\u062A\u06A9\u060C \u0641\u06CC\u0628\u0631 \u0648 ... + \u062A\u0627\u062E\u06CC\u0631 \u06F1-\u06F3 ms</p>
											</button>
										</div>
										<button type="button" onclick="applyFragPreset('gaming', this)" class="frag-preset-card w-full p-2.5 rounded-xl border border-emerald-300/80 dark:border-emerald-800/70 bg-white dark:bg-slate-950 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/10 transition-all flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300 cursor-pointer">
											<div class="flex items-center gap-2">
												<span class="text-base">\u{1F680}</span>
												<span>\u062D\u0627\u0644\u062A \u0641\u0648\u0642 \u0633\u0631\u06CC\u0639 (\u0637\u0648\u0644 \u06F2\u06F0\u06F0-\u06F3\u06F0\u06F0\u06F0 | \u062A\u0627\u062E\u06CC\u0631 \u06F1-\u06F2 ms)</span>
											</div>
											<span class="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-black whitespace-nowrap">\u067E\u06CC\u0646\u06AF \u067E\u0627\u06CC\u06CC\u0646</span>
										</button>
									</div>
								</div>
							</div>
							
							<div class="border border-purple-200 dark:border-amoled-border rounded-xl overflow-hidden shadow-sm">
								<div class="flex items-center justify-between p-3.5 bg-purple-50/60 dark:bg-amoled-input/30 cursor-pointer" onclick="document.getElementById('input-advanced-settings-toggle').click()">
									<div class="flex items-center gap-2">
										<svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
										<span class="text-xs font-black text-purple-900 dark:text-purple-300">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u067E\u06CC\u0634\u0631\u0641\u062A\u0647 \u0628\u0647\u06CC\u0646\u0647 \u0633\u0627\u0632\u06CC</span>
										<span onclick="event.stopPropagation(); togglePattNgModal(true)" class="mr-2 px-1.5 py-0.5 bg-[#33FB1F]/10 text-[#33FB1F] border border-[#33FB1F]/30 rounded text-[10px] hover:bg-[#33FB1F]/20 transition-colors shadow-[0_0_8px_rgba(51,251,31,0.3)] animate-pulse cursor-pointer">\u0645\u0647\u0645\u{1F6A8}</span>
									</div>
									<div class="flex items-center gap-2" onclick="event.stopPropagation()">
										<label class="relative inline-flex items-center cursor-pointer select-none">
											<input type="checkbox" id="input-advanced-settings-toggle" onchange="toggleAdvancedSettingsInputs(this.checked)" class="sr-only peer">
											<div class="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-purple-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform peer-checked:after:-translate-x-[16px]"></div>
										</label>
										<svg id="advanced-settings-icon" class="w-4 h-4 text-purple-600 dark:text-purple-400 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
									</div>
								</div>
								<div id="advanced-settings-container" class="hidden opacity-50 pointer-events-none transition-opacity duration-300 p-4 border-t border-purple-100 dark:border-amoled-border space-y-3 bg-white dark:bg-slate-900">
									<div>
										<label class="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 mb-1">Advanced Fragment (fm JSON)</label>
										<input type="text" id="input-advanced-frag" placeholder="{&quot;tcp&quot;: [{&quot;type&quot;: &quot;fragment&quot;..." dir="ltr" class="w-full px-3 py-2 bg-gray-50 dark:bg-amoled-input border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-[10px] font-mono text-gray-800 dark:text-zinc-100 placeholder-gray-400">
									</div>
									<div>
										<label class="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 mb-1">Cipher Suites (cs)</label>
										<input type="text" id="input-cipher-suites" placeholder="TLS_AES_256_GCM_SHA384..." dir="ltr" class="w-full px-3 py-2 bg-gray-50 dark:bg-amoled-input border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-[10px] font-mono text-gray-800 dark:text-zinc-100 placeholder-gray-400">
									</div>
									<div>
										<label class="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 mb-1">TLS Mask (Custom SNI / Host)</label>
										<input type="text" id="input-tls-mask" placeholder="www.speedtest.net" dir="ltr" class="w-full px-3 py-2 bg-gray-50 dark:bg-amoled-input border border-gray-200 dark:border-amoled-border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-[10px] font-mono text-gray-800 dark:text-zinc-100 placeholder-gray-400">
									</div>
									<button type="button" onclick="fillPatternihaValues()" class="w-full py-2 bg-transparent border-2 border-purple-500 text-purple-600 dark:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 mt-1 shadow-sm">
										<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
										<span>\u067E\u0631 \u06A9\u0631\u062F\u0646 \u062E\u0648\u062F\u06A9\u0627\u0631 \u0645\u0642\u0627\u062F\u06CC\u0631 \u0628\u0647\u06CC\u0646\u0647 \u0633\u0627\u0632 Patterniha</span>
									</button>
								</div>
							</div>
							
							<div class="mt-1 p-2.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg flex items-start gap-2 shadow-sm">
								<svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
								<span class="text-[10px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed">\u0647\u0634\u062F\u0627\u0631: \u0627\u06CC\u0646 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0631\u0648\u06CC \u067E\u0631\u0648\u062A\u06A9\u0644 \u0634\u062F\u0648\u0633\u0627\u06A9\u0633 (Shadowsocks) \u0627\u0639\u0645\u0627\u0644 \u0646\u0645\u06CC\u200C\u0634\u0648\u0646\u062F.</span>
							</div>
						</div>
						
						<div id="tab-proxy-settings" class="user-tab-panel hidden space-y-4">
							<div class="p-3 bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-2 shadow-sm">
							<svg class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
							<span class="text-[11px] font-bold text-red-700 dark:text-red-400 leading-relaxed">\u0633\u0627\u06CC\u062A\u200C\u0647\u0627\u06CC\u06CC \u0645\u062B\u0644 <span class="text-emerald-600 dark:text-emerald-400 font-black">ChatGPT</span>\u060C <span class="text-amber-600 dark:text-amber-400 font-black">Claude</span> \u0648 <span class="text-purple-600 dark:text-purple-400 font-black">Speedtest</span> \u067E\u0634\u062A \u06A9\u0644\u0648\u062F\u0641\u0644\u0631 \u0647\u0633\u062A\u0646\u062F\u061B \u0628\u0631\u0627\u06CC \u0628\u0627\u0632 \u06A9\u0631\u062F\u0646 \u0627\u06CC\u0646 \u0633\u0627\u06CC\u062A\u200C\u0647\u0627 \u062D\u062A\u0645\u0627\u064B \u0628\u0627\u06CC\u062F <span class="text-blue-600 dark:text-blue-400 font-black">\u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC</span> \u062A\u0646\u0638\u06CC\u0645 \u06A9\u0646\u06CC\u062F.</span>
						</div>

						<div class="p-4 bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40 rounded-xl flex flex-col gap-3 shadow-sm">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<svg class="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
									<div>
										<span class="text-xs font-black text-gray-800 dark:text-zinc-200">\u062A\u0633\u062A \u0627\u062A\u0635\u0627\u0644 \u0645\u0633\u062A\u0642\u06CC\u0645 (\u0628\u062F\u0648\u0646 \u067E\u0631\u0648\u06A9\u0633\u06CC)</span>
										<span class="text-[10px] text-gray-500 dark:text-zinc-400 block font-normal mt-0.5">\u062A\u0633\u062A \u0627\u0631\u062A\u0628\u0627\u0637 \u0634\u0645\u0627 \u0628\u0627 \u06A9\u0644\u0648\u062F\u0641\u0644\u0631 \u0648 \u06A9\u0644\u0648\u062F\u0641\u0644\u0631 \u0628\u0627 \u0646\u062A \u0622\u0632\u0627\u062F</span>
									</div>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-2 bg-white/60 dark:bg-amoled-bg/50 p-2.5 rounded-lg border border-sky-100 dark:border-sky-900/30">
								<div class="flex flex-col items-center justify-center gap-1 border-l border-gray-200 dark:border-zinc-800">
									<span class="text-[9px] font-bold text-gray-400">\u2601\uFE0F \u067E\u06CC\u0646\u06AF \u0634\u0645\u0627 \u0628\u0647 \u06A9\u0644\u0648\u062F\u0641\u0644\u0631</span>
									<span id="client-to-server-ping" class="text-[10px] font-bold text-gray-600 dark:text-zinc-300">-</span>
								</div>
								<div class="flex flex-col items-center justify-center gap-1">
									<span class="text-[9px] font-bold text-gray-400">\u{1F30D} \u067E\u06CC\u0646\u06AF \u06A9\u0644\u0648\u062F\u0641\u0644\u0631 \u0628\u0647 \u0627\u06CC\u0646\u062A\u0631\u0646\u062A \u0622\u0632\u0627\u062F</span>
									<span id="server-to-net-ping" class="text-[10px] font-bold text-gray-600 dark:text-zinc-300">-</span>
								</div>
							</div>
							<button type="button" id="test-direct-btn" onclick="testDirectPing()" class="w-full py-2 bg-transparent border-2 border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-1">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
								<span>\u062A\u0633\u062A \u0627\u062A\u0635\u0627\u0644 \u0645\u0633\u062A\u0642\u06CC\u0645</span>
							</button>
						</div>
						<div class="flex items-center justify-between p-3.5 bg-blue-50/80 dark:bg-amoled-input/30 border border-blue-500/40 dark:border-amoled-border rounded-xl shadow-sm">
							<div class="flex items-center gap-2">
								<span class="text-lg drop-shadow-sm">\u{1F310}</span>
								<span class="text-xs font-black text-blue-900 dark:text-blue-300">\u0627\u062A\u0635\u0627\u0644 \u0645\u0633\u062A\u0642\u06CC\u0645 (\u0628\u062F\u0648\u0646 \u067E\u0631\u0648\u06A9\u0633\u06CC \u062E\u0631\u0648\u062C\u06CC)</span>
							</div>
							<label class="relative inline-flex items-center cursor-pointer select-none">
								<input type="checkbox" id="input-enable-direct" checked class="sr-only peer">
								<div class="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:-translate-x-[16px]"></div>
							</label>
						</div>

						<div class="p-4 bg-gray-50/70 dark:bg-amoled-input/30 border border-gray-200/70 dark:border-amoled-border rounded-xl space-y-3">
								<div class="flex items-center justify-between border-b pb-3 border-gray-200/50 dark:border-amoled-border">
									<div class="flex items-center gap-2">
										<svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
										<div>
											<span class="text-xs font-black text-gray-800 dark:text-zinc-200">\u062A\u0646\u0638\u06CC\u0645 \u06A9\u0634\u0648\u0631 \u0648 \u062B\u0627\u0628\u062A \u06A9\u0631\u062F\u0646 \u0622\u06CC\u067E\u06CC</span>
											<span class="text-[10px] text-gray-400 block font-normal">\u0632\u0646\u062C\u06CC\u0631\u0647 \u0627\u062A\u0635\u0627\u0644 \u062E\u0631\u0648\u062C\u06CC \u062C\u0647\u062A \u0639\u0628\u0648\u0631 \u0627\u0632 \u062A\u062D\u0631\u06CC\u0645\u200C\u0647\u0627 \u0648 \u062A\u063A\u06CC\u06CC\u0631 \u0644\u0648\u06A9\u06CC\u0634\u0646</span>
										</div>
									</div>
									<label class="relative inline-flex items-center cursor-pointer select-none">
										<input type="checkbox" id="user-proxy-mode-toggle" onchange="toggleUserProxyMode(this.checked)" class="sr-only peer">
										<div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-emerald-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:-translate-x-[16px]"></div>
									</label>
								</div>
								<div class="transition-opacity duration-300 opacity-50 pointer-events-none space-y-3 pt-1" id="user-socks5-container">
									<div id="proxies-fields-wrapper" class="flex flex-col gap-2 w-full"></div>
									<button type="button" id="add-proxy-field-btn" onclick="addProxyFieldUI()" class="w-full py-2.5 bg-transparent border-2 border-emerald-500 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
										<span>+ \u0627\u0641\u0632\u0648\u062F\u0646 \u06A9\u0634\u0648\u0631</span>
									</button>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
										<button type="button" onclick="testUserSocksProxy()" id="test-user-proxy-btn" class="w-full py-2.5 bg-transparent border-2 border-sky-500 text-sky-600 dark:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-1">
											<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
											<span>\u062A\u0633\u062A \u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC</span>
										</button>
										<button type="button" onclick="openProxySelectorModal()" class="w-full py-2.5 bg-transparent border-2 border-amber-500 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-1">
											<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
											<span>\u0645\u062E\u0632\u0646 \u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC</span>
										</button>
									</div>
									<div class="flex items-center justify-between gap-2 p-3.5 bg-sky-50/80 dark:bg-amoled-input/30 border border-sky-500/40 dark:border-amoled-border rounded-xl shadow-sm">
										<div class="flex items-center gap-2 flex-shrink-0">
											<label class="relative inline-flex items-center cursor-pointer select-none flex-shrink-0">
												<input type="checkbox" id="input-user-iata-toggle" onchange="window.toggleUserIataLock(this.checked)" class="sr-only peer">
												<div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-sky-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:-translate-x-[16px]"></div>
											</label>
											<span id="user-iata-flag-preview" class="text-base leading-none">\u{1F310}</span>
											<span class="text-xs font-black text-sky-800 dark:text-sky-400 whitespace-nowrap">\u062B\u0627\u0628\u062A \u06A9\u0631\u062F\u0646 \u06A9\u0634\u0648\u0631 (IATA)</span>
										</div>
										<input type="text" id="input-user-proxy-iata" maxlength="2" placeholder="\u0645\u062B\u0644\u0627 DE" dir="ltr" disabled oninput="this.value=this.value.toUpperCase(); window.userProxyIata=this.value||null; window.updateUserIataPreview();" class="w-20 px-2 py-1.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-xs font-mono text-center uppercase focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800 dark:text-zinc-100 disabled:opacity-50 transition">
									</div>
									<div class="flex items-center justify-between gap-2 p-3.5 bg-indigo-50/80 dark:bg-amoled-input/30 border border-indigo-500/40 dark:border-amoled-border rounded-xl shadow-sm">
										<div class="flex items-center gap-2 flex-shrink-0">
											<label class="relative inline-flex items-center cursor-pointer select-none flex-shrink-0">
												<input type="checkbox" id="input-user-ipv6-toggle" class="sr-only peer">
												<div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-indigo-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:-translate-x-[16px]"></div>
											</label>
											<span class="text-xs font-black text-indigo-800 dark:text-indigo-400 whitespace-nowrap">\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0627\u0632 IPv6</span>
										</div>
										<span class="text-[10px] text-indigo-600 dark:text-indigo-500 font-medium">\u0631\u0648\u0634\u0646 = \u0647\u0645 IPv4 \u0647\u0645 IPv6 \u0645\u062C\u0627\u0632\u0646 (\u06AF\u0648\u0634\u06CC \u062E\u0648\u062F\u0634 \u0627\u0646\u062A\u062E\u0627\u0628 \u0645\u06CC\u200C\u06A9\u0646\u0647) / \u062E\u0627\u0645\u0648\u0634 = \u0641\u0642\u0637 IPv4</span>
									</div>
									<div class="flex items-center justify-between p-3.5 bg-emerald-50/80 dark:bg-amoled-input/30 border border-emerald-500/40 dark:border-amoled-border rounded-xl shadow-sm">
										<div class="flex items-center gap-2">
											<svg class="w-4 h-4 text-emerald-600 dark:text-emerald-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
											<div>
												<span class="text-xs font-black text-emerald-800 dark:text-emerald-400">\u062A\u0639\u0648\u06CC\u0636 \u062E\u0648\u062F\u06A9\u0627\u0631 \u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC (\u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC)</span>
												<span class="text-[10px] text-emerald-600 dark:text-emerald-500 block font-medium">\u062C\u0627\u06CC\u06AF\u0632\u06CC\u0646\u06CC \u0647\u0648\u0634\u0645\u0646\u062F \u062F\u0631 \u0635\u0648\u0631\u062A \u0642\u0637\u0639 \u0634\u062F\u0646 \u067E\u0631\u0648\u06A9\u0633\u06CC</span>
											</div>
										</div>
										<label class="relative inline-flex items-center cursor-pointer select-none">
											<input type="checkbox" id="input-auto-rotate-user-proxy" class="sr-only peer">
											<div class="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-emerald-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-transform peer-checked:after:-translate-x-[16px]"></div>
										</label>
									</div>
								</div>
							</div>
							
						</div>
					</div>
				</div>
				<div class="px-5 py-3.5 border-t border-gray-150 dark:border-amoled-border bg-gray-50/70 dark:bg-amoled-bg/60 flex md:hidden items-center justify-between gap-3">
					<button type="button" onclick="toggleModal(false)" class="px-5 py-2.5 bg-transparent border-2 border-red-600 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold rounded-xl text-xs sm:text-sm transition shadow-sm">
						\u0627\u0646\u0635\u0631\u0627\u0641
					</button>
					<div class="flex items-center gap-2">
						<button type="submit" id="submit-btn" class="px-7 py-2.5 bg-transparent border-2 border-green-600 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 font-black rounded-xl text-xs sm:text-sm transition shadow-lg flex items-center gap-1.5 cursor-pointer">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
							<span>\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631</span>
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
<div id="ip-selector-modal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60  opacity-0 pointer-events-none transition-all duration-300 ease-out">
	<div class="w-full max-w-sm bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md shadow-xl overflow-hidden transition-all transform duration-300 opacity-0 scale-95 ease-out">
		<div class="px-6 py-4 border-b border-gray-150 dark:border-amoled-border flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
			<h3 class="font-bold text-gray-900 dark:text-zinc-100 text-sm">\u0645\u062E\u0632\u0646 \u0622\u06CC\u067E\u06CC \u062A\u0645\u06CC\u0632</h3>
			<button type="button" onclick="toggleIpSelectorModal(false)" class="p-1.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 shadow-sm">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
			</button>
		</div>
		<div class="p-6 space-y-4">
			<div id="ip-loading-state" class="text-center text-sm text-gray-500 dark:text-zinc-400 hidden">
				Loading IPs...
			</div>
			<div id="ip-selection-form" class="space-y-4">
				<div>
					<label class="block text-xs font-medium mb-1.5 text-gray-700 dark:text-zinc-300">\u0627\u0648\u067E\u0631\u0627\u062A\u0648\u0631</label>
					<select id="ip-operator-select" class="w-full px-3 py-2.5 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-300 cursor-pointer">
						<option value="all">\u0647\u0645\u0647 (\u062A\u0648\u0635\u06CC\u0647 \u0634\u062F\u0647)</option>
					</select>
				</div>
				<div>
					<label class="block text-xs font-medium mb-1.5 text-gray-700 dark:text-zinc-300">\u062A\u0639\u062F\u0627\u062F</label>
					<input type="number" id="ip-count-input" min="1" value="20" dir="ltr" class="w-full px-3 py-2.5 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono text-center">
				</div>
				<div class="flex flex-col gap-2 border-t border-gray-100 dark:border-zinc-800/60 pt-3 mt-2">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold text-gray-700 dark:text-zinc-300">\u062A\u0639\u0648\u06CC\u0636 \u062E\u0648\u062F\u06A9\u0627\u0631 \u0622\u06CC\u067E\u06CC(\u062A\u0648\u0635\u06CC\u0647 \u0645\u06CC\u0634\u0648\u062F)</span>
						<label class="relative inline-flex items-center cursor-pointer select-none">
							<input type="checkbox" id="input-auto-rotate-ip-toggle" onchange="toggleAutoRotateIpInputs(this.checked)" class="sr-only peer">
							<div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:bg-green-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:-translate-x-[18px]"></div>
						</label>
					</div>
					<div id="auto-rotate-ip-inputs-container" class="hidden transition-all duration-300 pt-1">
						<label class="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 mb-1">\u0632\u0645\u0627\u0646 \u062A\u0639\u0648\u06CC\u0636 (\u062F\u0642\u06CC\u0642\u0647)</label>
						<input type="number" id="input-auto-rotate-ip-time" min="1" placeholder="\u062A\u0648\u0635\u06CC\u0647 \u0634\u062F\u0647 5" onblur="if(this.value === '' || parseInt(this.value) < 1) this.value = '5';" class="w-full px-3 py-2.5 bg-gray-50 dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono text-center" dir="ltr">
					</div>
				</div>
			</div>
			<div class="pt-4 flex gap-3">
				<button type="button" onclick="toggleIpSelectorModal(false)" class="flex-1 py-2 bg-transparent border-2 border-red-700 text-red-700 hover:bg-red-900/20 hover:text-red-800 dark:border-red-700 dark:text-red-500 dark:hover:bg-red-900/40 dark:hover:text-red-400 font-bold rounded-md text-xs transition shadow-sm">\u0644\u063A\u0648</button>
				<button type="button" onclick="applySelectedIps()" class="flex-1 py-2 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 font-medium rounded-md text-xs transition">\u062F\u0631\u06CC\u0627\u0641\u062A</button>
			</div>
		</div>
	</div>
</div>
<div id="proxy-selector-modal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60  opacity-0 pointer-events-none transition-all duration-300 ease-out">
	<div class="w-full max-w-md bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md shadow-xl overflow-hidden transition-all transform duration-300 opacity-0 scale-95 ease-out">
		<div class="px-6 py-4 border-b border-gray-150 dark:border-amoled-border flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
			<h3 class="font-bold text-gray-900 dark:text-zinc-100 text-sm">\u0645\u062E\u0632\u0646 \u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC\u200C\u0647\u0627\u06CC \u0622\u06CC\u200C\u067E\u06CC \u062B\u0627\u0628\u062A</h3>
			<button type="button" onclick="toggleProxySelectorModal(false)" class="p-1.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 shadow-sm">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
			</button>
		</div>
		<div class="p-5 space-y-4">
			<div class="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/30 rounded-md relative">
				<h4 class="text-[13px] font-black text-green-700 dark:text-green-400 mb-2 flex items-center gap-1.5">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
					\u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC\u200C\u0647\u0627\u06CC \u0627\u062E\u062A\u0635\u0627\u0635\u06CC (VIP)
				</h4>
				<p class="text-[10px] text-green-600/80 dark:text-green-500/70 mb-3 leading-relaxed font-medium">
					\u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC\u200C\u0647\u0627\u06CC \u0627\u0647\u062F\u0627\u06CC\u06CC \u0627\u0632 \u0637\u0631\u0641 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646. \u06A9\u06CC\u0641\u06CC\u062A \u0628\u0627\u0644\u0627 \u0648 \u0628\u062F\u0648\u0646 \u0646\u06CC\u0627\u0632 \u0628\u0647 \u0627\u0633\u06A9\u0646.
				</p>
				<div class="flex flex-col sm:flex-row gap-2">
					<select id="vip-country-select" class="flex-1 px-3 py-2 bg-white dark:bg-amoled-input border border-green-200 dark:border-green-800/50 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 dark:text-zinc-300 cursor-pointer">
						<option value="">\u062F\u0631 \u062D\u0627\u0644 \u0628\u0631\u0631\u0633\u06CC \u0645\u062E\u0632\u0646...</option>
					</select>
					<button type="button" onclick="loadVipProxy()" id="vip-fetch-btn" class="sm:w-auto w-full px-4 py-2 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 font-bold rounded-md text-xs transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap" disabled>
						\u062F\u0631\u06CC\u0627\u0641\u062A
					</button>
				</div>
			</div>
			<div class="pt-1">
				<button type="button" onclick="toggleProxySelectorModal(false)" class="w-full py-2.5 bg-transparent border-2 border-red-700 text-red-700 hover:bg-red-900/20 hover:text-red-800 dark:border-red-700 dark:text-red-500 dark:hover:bg-red-900/40 dark:hover:text-red-400 font-bold rounded-md text-xs transition shadow-sm">\u0627\u0646\u0635\u0631\u0627\u0641 \u0648 \u0628\u0633\u062A\u0646</button>
			</div>
		</div>
	</div>
</div>

<div id="support-modal" class="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-black/60  opacity-0 pointer-events-none transition-all duration-300 ease-out">
	<div class="w-full max-w-md bg-white dark:bg-amoled-card border border-red-500/50 rounded-md shadow-2xl overflow-hidden p-6 text-center transition-all transform duration-300 opacity-0 scale-95 ease-out">
		<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mb-4 shadow-inner">
			<svg class="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
			</svg>
		</div>
		<h3 class="font-black text-xl text-gray-900 dark:text-white mb-3">\u062D\u0645\u0627\u06CC\u062A \u0627\u0632 \u0632\u0626\u0640\u0640\u0648\u0633</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed font-medium">
			\u0627\u06CC\u0646 \u067E\u0631\u0648\u0698\u0647 \u0645\u062A\u0646 \u0628\u0627\u0632 \u0648 \u0631\u0627\u06CC\u06AF\u0627\u0646 \u0627\u0633\u062A. \u0628\u0631\u0627\u06CC \u062A\u0636\u0645\u06CC\u0646 \u067E\u0627\u06CC\u062F\u0627\u0631\u06CC \u0648 \u0627\u062F\u0627\u0645\u0647 \u0645\u0633\u06CC\u0631 \u062A\u0648\u0633\u0639\u0647\u060C \u0646\u06CC\u0627\u0632\u0645\u0646\u062F \u0647\u0645\u0631\u0627\u0647\u06CC \u0648 \u062D\u0645\u0627\u06CC\u062A \u0634\u0645\u0627 \u0639\u0632\u06CC\u0632\u0627\u0646 \u0647\u0633\u062A\u0645. \u0647\u0631\u06AF\u0648\u0646\u0647 \u062D\u0645\u0627\u06CC\u062A \u0634\u0645\u0627\u060C \u0627\u0646\u06AF\u06CC\u0632\u0647 \u0645\u0646 \u0631\u0627 \u0628\u0631\u0627\u06CC \u0627\u0631\u0627\u0626\u0647 \u0627\u0645\u06A9\u0627\u0646\u0627\u062A \u0628\u0647\u062A\u0631 \u062F\u0648\u0686\u0646\u062F\u0627\u0646 \u0645\u06CC\u200C\u06A9\u0646\u062F. \u2764\uFE0F
		</p>
		<div class="space-y-3">
			<a href="https://donatonion.ir-aaaaaaaaaa.workers.dev/" target="_blank" class="w-full py-3 bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-500/60 dark:text-orange-400 dark:hover:bg-orange-500/10 font-bold rounded-md text-sm transition duration-300 shadow-sm flex items-center justify-center gap-2">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-.75-3.25h1.5v-1.5h-1.5v1.5zm0-3.5h1.5v-3h-1.5v3z"/></svg>
				\u062D\u0645\u0627\u06CC\u062A \u0645\u0627\u0644\u06CC (\u0631\u0645\u0632 \u0627\u0631\u0632)
			</a>
			<a href="https://t.me/boost/aaaaaaaaaa" target="_blank" class="w-full py-3 bg-transparent border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-500/60 dark:text-blue-400 dark:hover:bg-blue-500/10 font-bold rounded-md text-sm transition duration-300 shadow-sm flex items-center justify-center gap-2">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
				\u06A9\u0627\u0646\u0627\u0644 \u062A\u0644\u06AF\u0631\u0627\u0645
			</a>
			<a href="https://github.com/aaaaaaaaaa" target="_blank" class="w-full py-3 bg-transparent border-2 border-gray-600 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-zinc-800 font-bold rounded-md text-sm transition duration-300 shadow-sm flex items-center justify-center gap-2">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
				\u06AF\u06CC\u062A\u0647\u0627\u0628 
			</a>
		</div>
			<button onclick="toggleSupportModal(false)" class="mt-4 w-full py-2.5 bg-transparent text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 font-bold rounded-md text-sm transition duration-300">
				\u0628\u0633\u062A\u0646
			</button>
		</div>
	</div>
	<div id="settings-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60  opacity-0 pointer-events-none transition-all duration-300 ease-out">
		<div class="w-full max-w-md bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md shadow-xl overflow-hidden transition-all transform duration-300 opacity-0 scale-95 ease-out flex flex-col max-h-[90vh]">
			<div class="px-6 py-4 border-b border-gray-150 dark:border-amoled-border flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
				<h3 class="font-bold text-gray-900 dark:text-zinc-100">\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u067E\u0640\u0646\u0640\u0644</h3>
				<button onclick="toggleSettingsModal(false)" class="p-1.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 shadow-sm">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
				</button>
			</div>
			<div class="p-6 space-y-4 overflow-y-auto flex-1 overscroll-contain">
				<div class="pt-2">
					<label class="block text-sm font-medium mb-1.5 text-gray-700 dark:text-zinc-300">\u0646\u0631\u062E \u0631\u0641\u0631\u0634 \u062E\u0648\u062F\u06A9\u0627\u0631 \u067E\u0640\u0646\u0640\u0644</label>
					<div class="relative">
						<select id="refresh-rate-select" onchange="changeRefreshRate(this.value)" class="w-full pl-8 pr-3 py-2.5 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-200 cursor-pointer appearance-none">
							<option value="1000">\u06F1 \u062B\u0627\u0646\u06CC\u0647</option>
							<option value="2000">\u06F2 \u062B\u0627\u0646\u06CC\u0647</option>
							<option value="5000">\u06F5 \u062B\u0627\u0646\u06CC\u0647</option>
							<option value="10000" selected>\u06F1\u06F0 \u062B\u0627\u0646\u06CC\u0647 (\u067E\u06CC\u0634\u200C\u0641\u0631\u0636)</option>
							<option value="30000">\u06F3\u06F0 \u062B\u0627\u0646\u06CC\u0647</option>
							<option value="60000">\u06F1 \u062F\u0642\u06CC\u0642\u0647</option>
							<option value="300000">\u06F5 \u062F\u0642\u06CC\u0642\u0647</option>
							<option value="600000">\u06F1\u06F0 \u062F\u0642\u06CC\u0642\u0647</option>
						</select>
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-zinc-400">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
						</div>
					</div>
				</div>
				<div class="pt-4 border-t-2 border-gray-300 dark:border-zinc-700">
					<h4 class="text-sm font-bold mb-3 text-gray-800 dark:text-zinc-200">\u{1F4CD} \u062B\u0627\u0628\u062A \u06A9\u0631\u062F\u0646 \u06A9\u0634\u0648\u0631 (Cloudflare)</h4>
					<div class="space-y-2">
						<input type="text" id="global-location-search" oninput="filterGlobalLocations()" placeholder="\u062C\u0633\u062A\u062C\u0648\u06CC \u0634\u0647\u0631\u060C \u06A9\u0634\u0648\u0631 \u06CC\u0627 IATA" class="w-full px-3 py-2 bg-gray-50 dark:bg-amoled-input border border-gray-200 dark:border-amoled-border rounded-md shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-200 transition">
						<div class="relative">
							<select id="location-select" class="w-full pl-8 pr-3 py-2.5 bg-gray-50 dark:bg-amoled-input border border-gray-200 dark:border-amoled-border rounded-md shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-zinc-200 cursor-pointer appearance-none">
								<option value="">\u{1F310} \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 (\u0644\u0648\u06A9\u06CC\u0634\u0646 \u062E\u0648\u062F\u06A9\u0627\u0631)</option>
							</select>
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-zinc-400">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
							</div>
						</div>
						<p class="text-[11px] text-gray-500 dark:text-gray-400">\u0627\u06CC\u0646 \u062A\u0646\u0638\u06CC\u0645 \u0631\u0648\u06CC \u06A9\u0644 \u067E\u0646\u0644 \u0627\u062B\u0631 \u0645\u06CC\u200C\u06AF\u0630\u0627\u0631\u062F\u061B \u06A9\u0634\u0648\u0631 \u0627\u0646\u062A\u062E\u0627\u0628\u06CC \u0628\u0647 \u06CC\u06A9 IP \u062B\u0627\u0628\u062A resolve \u0648 \u0630\u062E\u06CC\u0631\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.</p>
					</div>
				</div>
				<div class="pt-4 border-t-2 border-gray-300 dark:border-zinc-700 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<span class="text-sm font-bold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5">
							<svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
							\u067E\u0633 \u0632\u0645\u06CC\u0646\u0647 \u0645\u062A\u062D\u0631\u06A9 \u0648 \u0627\u0641\u06A9\u062A \u0645\u0648\u0633
						</span>
					</div>
					<label class="relative inline-flex items-center cursor-pointer select-none">
						<input type="checkbox" id="gfx-toggle" onchange="toggleGfx(this.checked)" class="sr-only peer">
						<div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-500"></div>
					</label>
				</div>
				<div class="pt-4 border-t-2 border-gray-300 dark:border-zinc-700">
					<h4 class="text-sm font-bold mb-3 text-gray-800 dark:text-zinc-200">\u{1F512} \u062A\u063A\u06CC\u06CC\u0631 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0645\u062F\u06CC\u0631\u06CC\u062A</h4>
					<div class="space-y-3">
						<div>
							<label class="block text-[11px] text-gray-500 dark:text-gray-400 font-medium mb-1">\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0641\u0639\u0644\u06CC</label>
							<input type="password" id="change-pwd-current" class="w-full px-3 py-2 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono text-center">
						</div>
						<div>
							<label class="block text-[11px] text-gray-500 dark:text-gray-400 font-medium mb-1">\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062C\u062F\u06CC\u062F</label>
							<input type="password" id="change-pwd-new" class="w-full px-3 py-2 bg-white dark:bg-amoled-input border border-gray-300 dark:border-amoled-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono text-center">
						</div>
						<button type="button" onclick="changeAdminPassword()" id="change-pwd-btn" class="w-full py-2 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 font-semibold rounded-md text-xs transition-all shadow-sm">\u062A\u063A\u06CC\u06CC\u0631 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631</button>
					</div>
				</div>
				<div class="pt-4 border-t-2 border-gray-300 dark:border-zinc-700">
					<h4 class="text-sm font-bold mb-3 text-gray-800 dark:text-zinc-200">\u{1F4BE} \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u200C\u06AF\u06CC\u0631\u06CC \u0648 \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC</h4>
					<div class="grid grid-cols-2 gap-3">
						<button type="button" onclick="exportUsersBackup()" class="py-2.5 bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-500/60 dark:hover:bg-orange-500/10 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> \u067E\u0634\u062A\u06CC\u0628\u0627\u0646 \u06AF\u06CC\u0631\u06CC
						</button>
						<button type="button" onclick="triggerImportBackup()" class="py-2.5 bg-transparent border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-500/60 dark:hover:bg-blue-500/10 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC
						</button>
					</div>
					<input type="file" id="backup-file-input" onchange="importUsersBackup(event)" accept=".json" class="hidden">
				</div>
				<div class="pt-4 flex gap-3">
					<button type="button" onclick="toggleSettingsModal(false)" class="flex-1 py-2 bg-transparent border-2 border-red-700 text-red-700 hover:bg-red-900/20 hover:text-red-800 dark:border-red-700 dark:text-red-500 dark:hover:bg-red-900/40 dark:hover:text-red-400 font-bold rounded-md text-sm transition shadow-sm">\u0627\u0646\u0635\u0631\u0627\u0641</button>
					<button type="button" onclick="saveSettings()" id="save-settings-btn" class="flex-1 py-2 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 font-medium rounded-md text-sm transition">\u0630\u062E\u06CC\u0631\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A</button>
				</div>
			</div>
		</div>
	</div>
<div id="qr-modal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 opacity-0 pointer-events-none transition-opacity duration-200 ease-out">
	<div id="qr-modal-card" class="w-full max-w-sm bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md shadow-2xl p-6 transform transition-all scale-95 opacity-0 duration-200 text-center">
		<div class="flex justify-between items-center mb-4">
			<h3 class="text-lg font-bold text-gray-900 dark:text-white">QR Code</h3>
			<button onclick="toggleQrModal(false)" class="p-1.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 shadow-sm">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
			</button>
		</div>
		<div class="flex justify-center bg-gray-100 dark:bg-amoled-bg p-4 rounded-md mb-4 border border-gray-200 dark:border-zinc-800">
			<div id="qrcode-container"></div>
		</div>
		<button onclick="downloadQrCode()" class="w-full py-2.5 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 font-bold rounded-md text-sm transition duration-200 shadow-sm flex items-center justify-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
			\u062F\u0627\u0646\u0644\u0648\u062F \u062A\u0635\u0648\u06CC\u0631 QR
		</button>
	</div>
</div>
	<div id="bulk-actions-bar" class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[40] bg-white dark:bg-zinc-900/90 border border-gray-200 dark:border-zinc-800/80 px-6 py-4 rounded-md shadow-2xl flex flex-wrap items-center justify-between gap-4 w-[95%] max-w-4xl transition-all duration-300 transform translate-y-28 opacity-0 pointer-events-none ">
		<div class="flex items-center gap-2">
			<span class="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-sm shadow-blue-500/50"></span>
			<span id="bulk-selected-count" class="text-sm font-bold text-gray-800 dark:text-zinc-200">\u06F0 \u06A9\u0627\u0631\u0628\u0631 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647</span>
		</div>
		<div class="flex flex-wrap gap-2 justify-end">
			<button onclick="bulkToggleStatus(1)" class="px-3 py-1.5 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-md text-xs font-bold transition border border-green-200 dark:border-green-900/50 flex items-center gap-1">
				<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC
			</button>
			<button onclick="bulkToggleStatus(0)" class="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-md text-xs font-bold transition border border-amber-200 dark:border-amber-900/50 flex items-center gap-1">
				<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> \u063A\u06CC\u0631\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC
			</button>
			<button onclick="bulkReset('volume')" class="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md text-xs font-bold transition border border-blue-200 dark:border-blue-900/50 flex items-center gap-1">
				<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg> \u0631\u06CC\u0633\u062A \u062D\u062C\u0645
			</button>
			<button onclick="bulkReset('req')" class="px-3 py-1.5 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded-md text-xs font-bold transition border border-sky-200 dark:border-sky-900/50 flex items-center gap-1">
				<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> \u0631\u06CC\u0633\u062A \u0631\u06CC\u06A9\u0648\u0626\u0633\u062A
			</button>
			<button onclick="bulkReset('time')" class="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-md text-xs font-bold transition border border-purple-200 dark:border-purple-900/50 flex items-center gap-1">
				<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> \u0631\u06CC\u0633\u062A \u0632\u0645\u0627\u0646
			</button>
			<button onclick="bulkDelete()" class="px-3 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-450 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-md text-xs font-bold transition border border-red-200 dark:border-red-900/50 flex items-center gap-1">
				<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> \u062D\u0630\u0641 \u06AF\u0631\u0648\u0647\u06CC
			</button>
		</div>
	</div>
${at}
<div id="custom-confirm-modal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60  opacity-0 pointer-events-none transition-all duration-300 ease-out">
	<div id="custom-confirm-card" class="w-full max-w-sm bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md shadow-2xl overflow-hidden p-6 text-center transform transition-all scale-95 duration-300">
		<h3 class="font-black text-xl text-gray-900 dark:text-white mb-3">\u062A\u0623\u06CC\u06CC\u062F \u0639\u0645\u0644\u06CC\u0627\u062A</h3>
		<p id="custom-confirm-message" class="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed font-medium"></p>
		<div class="flex gap-3">
			<button id="custom-confirm-cancel" class="flex-1 py-3 bg-transparent border-2 border-red-700 text-red-700 hover:bg-red-900/20 hover:text-red-800 dark:border-red-700 dark:text-red-500 dark:hover:bg-red-900/40 dark:hover:text-red-400 font-bold rounded-md text-sm transition duration-200 shadow-sm">\u0627\u0646\u0635\u0631\u0627\u0641</button>
			<button id="custom-confirm-ok" class="flex-1 py-3 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 font-bold rounded-md text-sm transition duration-200 shadow-lg">\u062A\u0623\u06CC\u06CC\u062F</button>
		</div>
	</div>
</div>
	<script>
		async function kc5inhw(path, options = {}) {
			const primaryUrl = 'https://subs.alis1.ir/Ip.txt';
			try {
				const res = await fetch(primaryUrl, options);
				if (res.ok) return res;
			} catch (e) {}
			return await fetch(primaryUrl, options);
		}
		async function ggsyffs(path, options = {}) {
			const primaryUrl = 'https://subs.alis1.ir/vipprox.txt';
			const fallbackUrl = 'https://subs.alis1.ir/vipprox.txt';
			try {
				const res = await fetch(primaryUrl, options);
				if (res.ok) return res;
			} catch (e) {}
			return await fetch(fallbackUrl, options);
		}
		function bm3pzm2(message, type = 'success') {
			const container = document.getElementById('toast-container');
			const toast = document.createElement('div');
			const colors = type === 'error' 
				? 'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400' 
				: 'bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-800 text-green-700 dark:text-green-500';
			toast.className = 'px-4 py-3 border rounded-md shadow-lg font-bold text-sm transform transition-all duration-300 -translate-y-full opacity-0 ' + colors;
			toast.innerText = message;
			container.appendChild(toast);
			requestAnimationFrame(() => {
				toast.classList.remove('-translate-y-full', 'opacity-0');
			});
			setTimeout(() => {
				toast.classList.add('-translate-y-full', 'opacity-0');
				setTimeout(() => toast.remove(), 300);
			}, 3000);
		}
		function pw6sr5c(message) {
			return new Promise((resolve) => {
				const modal = document.getElementById('custom-confirm-modal');
				const card = document.getElementById('custom-confirm-card');
				const msgEl = document.getElementById('custom-confirm-message');
				const btnOk = document.getElementById('custom-confirm-ok');
				const btnCancel = document.getElementById('custom-confirm-cancel');
				msgEl.innerText = message;
				modal.classList.remove('opacity-0', 'pointer-events-none');
				modal.classList.add('opacity-100', 'pointer-events-auto');
				card.classList.remove('scale-95');
				card.classList.add('scale-100');
				const cleanup = () => {
					modal.classList.remove('opacity-100', 'pointer-events-auto');
					modal.classList.add('opacity-0', 'pointer-events-none');
					card.classList.remove('scale-100');
					card.classList.add('scale-95');
					btnOk.removeEventListener('click', onOk);
					btnCancel.removeEventListener('click', onCancel);
				};
				const onOk = () => { cleanup(); resolve(true); };
				const onCancel = () => { cleanup(); resolve(false); };
				btnOk.addEventListener('click', onOk);
				btnCancel.addEventListener('click', onCancel);
			});
		}
		window.alert = function(message) {
			const msgStr = message ? message.toString() : '';
			if (msgStr.includes('\u062E\u0637\u0627') || msgStr.includes('\u26A0\uFE0F') || msgStr.includes('\u274C')) {
				bm3pzm2(msgStr, 'error');
			} else {
				bm3pzm2(msgStr, 'success');
			}
		};
		window.selectedUsernames = new Set();
		function toggleSelectAllUsers(el) {
			const checkboxes = document.querySelectorAll('input[name="select-user"]');
			checkboxes.forEach(cb => {
				cb.checked = el.checked;
				const username = decodeURIComponent(cb.value);
				if (el.checked) {
					window.selectedUsernames.add(username);
				} else {
					window.selectedUsernames.delete(username);
				}
			});
			i5ta7ay();
		}
		function onUserSelectChange(el) {
			const username = decodeURIComponent(el.value);
			if (el.checked) {
				window.selectedUsernames.add(username);
			} else {
				window.selectedUsernames.delete(username);
			}
			i5ta7ay();
		}
		function i5ta7ay() {
			const bar = document.getElementById('bulk-actions-bar');
			const countSpan = document.getElementById('bulk-selected-count');
			const selectAllCheckbox = document.getElementById('select-all-users');
			const selectedCount = window.selectedUsernames.size;
			if (countSpan) {
				countSpan.innerText = selectedCount + ' \u06A9\u0627\u0631\u0628\u0631 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647';
			}
			const checkboxes = document.querySelectorAll('input[name="select-user"]');
			if (checkboxes.length > 0) {
				const allChecked = Array.from(checkboxes).every(cb => cb.checked);
				if (selectAllCheckbox) selectAllCheckbox.checked = allChecked;
			} else {
				if (selectAllCheckbox) selectAllCheckbox.checked = false;
			}
			if (selectedCount > 0) {
				bar.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-28');
				bar.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
			} else {
				bar.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
				bar.classList.add('opacity-0', 'pointer-events-none', 'translate-y-28');
			}
		}
		async function bulkDelete() {
			const usernames = Array.from(window.selectedUsernames);
			if (usernames.length === 0) return;
			if (await pw6sr5c('\u26A0\uFE0F \u0622\u06CC\u0627 \u0627\u0632 \u062D\u0630\u0641 \u06AF\u0631\u0648\u0647\u06CC ' + usernames.length + ' \u06A9\u0627\u0631\u0628\u0631 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647 \u0645\u0637\u0645\u0626\u0646 \u0647\u0633\u062A\u06CC\u062F\u061F \u0627\u06CC\u0646 \u0639\u0645\u0644 \u063A\u06CC\u0631\u0642\u0627\u0628\u0644 \u0628\u0627\u0632\u06AF\u0634\u062A \u0627\u0633\u062A.')) {
				const bar = document.getElementById('bulk-actions-bar');
				const buttons = bar.querySelectorAll('button');
				buttons.forEach(btn => btn.disabled = true);
				try {
					let successCount = 0;
					await Promise.all(usernames.map(async (uname) => {
						try {
							const res = await fetch('/api/users/' + encodeURIComponent(uname), { method: 'DELETE' });
							if (res.ok) {
								successCount++;
								window.selectedUsernames.delete(uname);
							}
						} catch(e) {}
					}));
					alert('\u2705 \u0639\u0645\u0644\u06CC\u0627\u062A \u062D\u0630\u0641 \u06AF\u0631\u0648\u0647\u06CC \u0627\u0646\u062C\u0627\u0645 \u0634\u062F. ' + successCount + ' \u06A9\u0627\u0631\u0628\u0631 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062D\u0630\u0641 \u0634\u062F\u0646\u062F.');
				} finally {
					buttons.forEach(btn => btn.disabled = false);
					i5ta7ay();
					await axmsbp4(true);
				}
			}
		}
		async function bulkToggleStatus(targetActive) {
			const usernames = Array.from(window.selectedUsernames);
			if (usernames.length === 0) return;
			const actionText = targetActive === 1 ? '\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC' : '\u063A\u06CC\u0631\u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC';
			if (await pw6sr5c('\u0622\u06CC\u0627 \u0627\u0632 ' + actionText + ' \u06AF\u0631\u0648\u0647\u06CC ' + usernames.length + ' \u06A9\u0627\u0631\u0628\u0631 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647 \u0645\u0637\u0645\u0626\u0646 \u0647\u0633\u062A\u06CC\u062F\u061F')) {
				const bar = document.getElementById('bulk-actions-bar');
				const buttons = bar.querySelectorAll('button');
				buttons.forEach(btn => btn.disabled = true);
				try {
					let successCount = 0;
					await Promise.all(usernames.map(async (uname) => {
						const user = window.allUsers.find(u => u.username === uname);
						if (!user) return;
						const isCurrentActive = user.is_active !== 0;
						const shouldToggle = (targetActive === 1 && !isCurrentActive) || (targetActive === 0 && isCurrentActive);
						if (shouldToggle) {
							try {
								const res = await fetch('/api/users/' + encodeURIComponent(uname), {
									method: 'PUT',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ toggle_only: true })
								});
								if (res.ok) successCount++;
							} catch(e) {}
						} else {
							successCount++;
						}
					}));
					alert('\u2705 \u0639\u0645\u0644\u06CC\u0627\u062A ' + actionText + ' \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0628\u0631\u0627\u06CC \u062A\u0645\u0627\u0645\u06CC \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0648\u0627\u062C\u062F \u0634\u0631\u0627\u06CC\u0637 \u0627\u0639\u0645\u0627\u0644 \u0634\u062F.');
				} finally {
					buttons.forEach(btn => btn.disabled = false);
					i5ta7ay();
					await axmsbp4(true);
				}
			}
		}
		async function bulkReset(actionType) {
			const usernames = Array.from(window.selectedUsernames);
			if (usernames.length === 0) return;
			let actionName = '';
			if (actionType === 'volume') actionName = '\u062D\u062C\u0645 \u0645\u0635\u0631\u0641\u06CC';
			else if (actionType === 'req') actionName = '\u062A\u0639\u062F\u0627\u062F \u0631\u06CC\u06A9\u0648\u0626\u0633\u062A\u200C\u0647\u0627';
			else if (actionType === 'time') actionName = '\u0632\u0645\u0627\u0646 \u0627\u0634\u062A\u0631\u0627\u06A9';
			if (await pw6sr5c('\u0622\u06CC\u0627 \u0627\u0632 \u0631\u06CC\u0633\u062A \u06A9\u0631\u062F\u0646 \u06AF\u0631\u0648\u0647\u06CC ' + actionName + ' \u0628\u0631\u0627\u06CC ' + usernames.length + ' \u06A9\u0627\u0631\u0628\u0631 \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647 \u0645\u0637\u0645\u0626\u0646 \u0647\u0633\u062A\u06CC\u062F\u061F')) {
				const bar = document.getElementById('bulk-actions-bar');
				const buttons = bar.querySelectorAll('button');
				buttons.forEach(btn => btn.disabled = true);
				try {
					let successCount = 0;
					await Promise.all(usernames.map(async (uname) => {
						try {
							const res = await fetch('/api/users/' + encodeURIComponent(uname), {
								method: 'PUT',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ reset_action: actionType })
							});
							if (res.ok) successCount++;
						} catch(e) {}
					}));
					alert('\u2705 \u0639\u0645\u0644\u06CC\u0627\u062A \u0631\u06CC\u0633\u062A \u06AF\u0631\u0648\u0647\u06CC ' + actionName + ' \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0628\u0631\u0627\u06CC ' + successCount + ' \u06A9\u0627\u0631\u0628\u0631 \u0627\u0639\u0645\u0627\u0644 \u0634\u062F.');
				} finally {
					buttons.forEach(btn => btn.disabled = false);
					i5ta7ay();
					await axmsbp4(true);
				}
			}
		}
		const tlsPorts = ['443', '2053', '2083', '2087', '2096', '8443'];
		const nonTlsPorts = ['80', '8080', '8880', '2052', '2082', '2086', '2095'];
		let isEditMode = false;
		let editingUsername = '';
		function yok43r5() {
			const tlsContainer = document.getElementById('tls-ports-list');
			const nonTlsContainer = document.getElementById('nontls-ports-list');
			if (nonTlsContainer) {
				nonTlsContainer.className = "grid grid-cols-12 gap-1.5 flex-1 content-start";
			}
			tlsContainer.innerHTML = tlsPorts.map(function(port) {
				const isCheckedDefault = port === '443' ? 'checked' : '';
				return '<label class="relative cursor-pointer">' +
					'<input type="checkbox" name="ports" value="' + port + '" ' + isCheckedDefault + ' class="peer sr-only">' +
					'<div class="flex items-center justify-center gap-1 px-1.5 py-1 border border-gray-200 dark:border-zinc-800/80 rounded-md text-[11px] font-semibold select-none transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-700 dark:text-zinc-300 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-950/25 peer-checked:border-blue-500 dark:peer-checked:border-blue-500/70 peer-checked:text-blue-600 dark:peer-checked:text-blue-400 shadow-sm">' +
						'<span>' + port + '</span>' +
						'<svg class="w-3 h-3 hidden peer-checked:block text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>' +
					'</div>' +
				'</label>';
			}).join('');
			nonTlsContainer.innerHTML = nonTlsPorts.map(function(port, index) {
				const isCheckedDefault = port === '80' ? 'checked' : '';
				const colSpanClass = index < 3 ? 'col-span-4' : 'col-span-3';
				return '<label class="relative cursor-pointer ' + colSpanClass + '">' +
					'<input type="checkbox" name="ports" value="' + port + '" ' + isCheckedDefault + ' class="peer sr-only">' +
					'<div class="flex items-center justify-center gap-1 px-1.5 py-1 border border-gray-200 dark:border-zinc-800/80 rounded-md text-[11px] font-semibold select-none transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-700 dark:text-zinc-300 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-950/25 peer-checked:border-amber-500 dark:peer-checked:border-amber-500/70 peer-checked:text-amber-600 dark:peer-checked:text-amber-400 shadow-sm">' +
						'<span>' + port + '</span>' +
						'<svg class="w-3 h-3 hidden peer-checked:block text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>' +
					'</div>' +
				'</label>';
			}).join('');
		}
		setTimeout(function() {
			const cb443 = document.querySelector('input[name="ports"][value="443"]');
			if (cb443) cb443.checked = true;
			const cb80 = document.querySelector('input[name="ports"][value="80"]');
			if (cb80) cb80.checked = true;
		}, 100);
		function toggleSettingsModal(show) { ys5v6m0('settings-modal', show); if (show && typeof jyfwoo1 === 'function') jyfwoo1(); }
		window.toggleAutoResetInputs = function(show) {
			const container = document.getElementById('auto-reset-inputs-container');
			const volInput = document.getElementById('input-auto-reset-vol');
			const reqInput = document.getElementById('input-auto-reset-req');
			if (container) {
				if (show) {
					container.classList.remove('opacity-50', 'pointer-events-none');
					if (volInput) volInput.disabled = false;
					if (reqInput) reqInput.disabled = false;
				} else {
					container.classList.add('opacity-50', 'pointer-events-none');
					if (volInput) volInput.disabled = true;
					if (reqInput) reqInput.disabled = true;
				}
			}
		};
		window.toggleAutoRotateIpInputs = function(show) {
			const container = document.getElementById('auto-rotate-ip-inputs-container');
			if (container) {
				if (show) container.classList.remove('hidden');
				else container.classList.add('hidden');
			}
		};
		window.toggleFragInputs = function(show) {
			const container = document.getElementById('frag-inputs-container');
			if (container) {
				if (show) {
					container.classList.remove('hidden');
				} else {
					container.classList.add('hidden');
				}
			}
		};
		window.toggleAdvancedSettingsInputs = function(show) {
			const container = document.getElementById('advanced-settings-container');
			const icon = document.getElementById('advanced-settings-icon');
			if (container) {
				if (show) {
					container.classList.remove('opacity-50', 'pointer-events-none', 'hidden');
					if (icon) icon.classList.add('rotate-180');
					const fragToggle = document.getElementById('input-frag-toggle');
					if (fragToggle && fragToggle.checked) {
						fragToggle.checked = false;
						if (typeof window.toggleFragInputs === 'function') window.toggleFragInputs(false);
					}
				} else {
					container.classList.add('opacity-50', 'pointer-events-none', 'hidden');
					if (icon) icon.classList.remove('rotate-180');
				}
			}
		};
		window.applyFragPreset = function(op, btnEl) {
			const presets = {
				'mci': { len: '10-30', int: '2-5', name: '\u0647\u0645\u0631\u0627\u0647 \u0627\u0648\u0644' },
				'irancell': { len: '100-200', int: '5-10', name: '\u0627\u06CC\u0631\u0627\u0646\u0633\u0644' },
				'rightel': { len: '50-100', int: '2-5', name: '\u0631\u0627\u06CC\u062A\u0644' },
				'tci': { len: '50-200', int: '1-3', name: '\u0645\u062E\u0627\u0628\u0631\u0627\u062A \u0648 \u0627\u06CC\u0646\u062A\u0631\u0646\u062A \u062B\u0627\u0628\u062A' },
				'gaming': { len: '200-3000', int: '1-2', name: '\u067E\u06CC\u0646\u06AF \u067E\u0627\u06CC\u06CC\u0646' }
			};
			const p = presets[op];
			if (!p) return;
			const lenInput = document.getElementById('input-frag-len');
			const intInput = document.getElementById('input-frag-int');
			const isActive = btnEl && btnEl.classList.contains('ring-2');
			document.querySelectorAll('.frag-preset-card').forEach(card => {
				card.classList.remove('ring-2', 'ring-blue-500', 'border-blue-500', 'bg-blue-50/50', 'dark:bg-blue-950/40');
			});
			if (isActive) {
				if (lenInput) lenInput.value = '200-3000';
				if (intInput) intInput.value = '1-2';
				if (typeof bm3pzm2 === 'function') bm3pzm2('\u{1F504} \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0641\u0631\u06AF\u0645\u0646\u062A \u0628\u0647 \u062D\u0627\u0644\u062A \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 \u0628\u0627\u0632\u06AF\u0634\u062A.', 'success');
				return;
			}
			const toggle = document.getElementById('input-frag-toggle');
			if (toggle && !toggle.checked) {
				toggle.checked = true;
				if (typeof window.toggleFragInputs === 'function') window.toggleFragInputs(true);
			}
			if (lenInput) lenInput.value = p.len;
			if (intInput) intInput.value = p.int;
			if (btnEl) btnEl.classList.add('ring-2', 'ring-blue-500', 'border-blue-500', 'bg-blue-50/50', 'dark:bg-blue-950/40');
			if (typeof bm3pzm2 === 'function') bm3pzm2('\u26A1 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0641\u0631\u06AF\u0645\u0646\u062A ' + p.name + ' \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0639\u0645\u0627\u0644 \u0634\u062F.', 'success');
		};
		window.setQuickVol = function(val) {
			const input = document.getElementById('input-limit');
			if (input) input.value = val;
		};
		window.setQuickExp = function(val) {
			const input = document.getElementById('input-expiry');
			if (input) input.value = val;
		};
		window.fillPatternihaValues = function() {
			const fragInput = document.getElementById('input-advanced-frag');
			const csInput = document.getElementById('input-cipher-suites');
			if (fragInput) fragInput.value = '{"tcp": [{"type": "fragment", "settings": {"packets": "tlshello", "lengths": ["0", "104", "1"], "delays": ["0"], "maxSplit": "0"}},{"type": "fragment", "settings": {"packets": "1-1", "lengths": ["114", "1"], "delays": ["1"], "maxSplit": "11"}}]}';
			if (csInput) csInput.value = 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256';
			if (typeof bm3pzm2 === 'function') bm3pzm2('\u2705 \u0645\u0642\u0627\u062F\u06CC\u0631 \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 Patterniha \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0639\u0645\u0627\u0644 \u0634\u062F.', 'success');
		};
		window.generateRandomUsername = function() {
			const adjectives = ['swift','silent','crimson','golden','shadow','azure','lunar','solar','rapid','mystic'];
			const nouns = ['falcon','tiger','wolf','phoenix','viper','hawk','dragon','panther','eagle','cobra'];
			const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
			const noun = nouns[Math.floor(Math.random() * nouns.length)];
			const num = Math.floor(100 + Math.random() * 900);
			const nameInput = document.getElementById('input-name');
			if (nameInput) nameInput.value = adj + '_' + noun + num;
		};
		/* \u0645\u062B\u0644 \u067E\u0631\u0686\u0645\u06CC \u06A9\u0647 \u0627\u0632 \u0631\u0648\u06CC \u06A9\u0634\u0648\u0631 \u062B\u0627\u0628\u062A\u200C\u0634\u062F\u0647 (IATA) \u0633\u0627\u062E\u062A\u0647 \u0645\u06CC\u200C\u0634\u0647\u060C \u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 \u0647\u0645 \u0627\u0632 \u0627\u0633\u0645 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0647\u0645\u0648\u0646 \u06A9\u0634\u0648\u0631 \u0633\u0627\u062E\u062A\u0647 \u0645\u06CC\u200C\u0634\u0647 */
		window.autoFillUsernameFromCountry = function() {
			const nameInput = document.getElementById('input-name');
			if (!nameInput) return;
			const cca2 = window._globalActiveCountry || '';
			let base = '';
			if (cca2 && typeof m79lr3o === 'function') {
				const enName = m79lr3o(cca2);
				base = (enName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
			}
			if (!base) {
				const adjectives = ['swift','silent','crimson','golden','shadow','azure','lunar','solar','rapid','mystic'];
				const nouns = ['falcon','tiger','wolf','phoenix','viper','hawk','dragon','panther','eagle','cobra'];
				base = adjectives[Math.floor(Math.random() * adjectives.length)] + '_' + nouns[Math.floor(Math.random() * nouns.length)];
			}
			const num = Math.floor(100 + Math.random() * 900);
			nameInput.value = base + num;
		};
		window.handleProtocolChange = function(changedInput) {
			const vlessCb = document.getElementById('input-proto-vless');
			const trojanCb = document.getElementById('input-proto-trojan');
			const ssCb = document.getElementById('input-proto-ss');
			const anyChecked = (vlessCb && vlessCb.checked) || (trojanCb && trojanCb.checked) || (ssCb && ssCb.checked);
			if (!anyChecked && changedInput) {
				changedInput.checked = true;
				if (typeof bm3pzm2 === 'function') bm3pzm2('\u26A0\uFE0F \u062D\u062F\u0627\u0642\u0644 \u06CC\u06A9 \u067E\u0631\u0648\u062A\u06A9\u0644 \u0628\u0627\u06CC\u062F \u0641\u0639\u0627\u0644 \u0628\u0627\u0634\u062F.', 'error');
			}
		};
		function jutlx8s(text, disable = null) {
			const btnMob = document.getElementById('submit-btn');
			const btnDesk = document.getElementById('submit-btn-desktop');
			if (btnMob) {
				const span = btnMob.querySelector('span');
				if (span) span.innerText = text; else btnMob.innerText = text;
				if (disable !== null) btnMob.disabled = disable;
			}
			if (btnDesk) {
				const span = btnDesk.querySelector('span');
				if (span) span.innerText = text; else btnDesk.innerText = text;
				if (disable !== null) btnDesk.disabled = disable;
			}
		}
		function toggleModal(show) {
			ys5v6m0('user-modal', show);
			if (typeof window.switchUserTab === 'function') window.switchUserTab('tab-user-info');
			if (!show) {
				isEditMode = false;
				editingUsername = '';
				document.getElementById('modal-title').innerText = '\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631 \u062C\u062F\u06CC\u062F';
				jutlx8s('\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631', false);
				document.getElementById('input-name').disabled = false;
				document.getElementById('create-user-form').reset();
				const vlessCb1 = document.getElementById('input-proto-vless');
				const trojanCb1 = document.getElementById('input-proto-trojan');
				const ssCb1 = document.getElementById('input-proto-ss');
				if (vlessCb1) vlessCb1.checked = true;
				if (trojanCb1) trojanCb1.checked = false;
				if (ssCb1) ssCb1.checked = true;
				const cb443 = document.querySelector('input[name="ports"][value="443"]');
				if (cb443) cb443.checked = true;
				const cb80 = document.querySelector('input[name="ports"][value="80"]');
				if (cb80) cb80.checked = true;
				const fpSelect = document.getElementById('fingerprint-select');
				if (fpSelect) fpSelect.value = 'unsafe';
				const bpCheck = document.getElementById('input-block-porn');
				if (bpCheck) bpCheck.checked = false;
				const baCheck = document.getElementById('input-block-ads');
				if (baCheck) baCheck.checked = false;
				const autoRotateUserProxyCheck = document.getElementById('input-auto-rotate-user-proxy');
				if (autoRotateUserProxyCheck) autoRotateUserProxyCheck.checked = false;
				const fragLenInput = document.getElementById('input-frag-len');
				if (fragLenInput) fragLenInput.value = '200-3000';
				const fragIntInput = document.getElementById('input-frag-int');
				if (fragIntInput) fragIntInput.value = '1-2';
				document.querySelectorAll('.frag-preset-card').forEach(card => card.classList.remove('ring-2', 'ring-blue-500', 'border-blue-500', 'bg-blue-50/50', 'dark:bg-blue-950/40'));
				const fragToggle = document.getElementById('input-frag-toggle');
				if (fragToggle) fragToggle.checked = true;
				window.toggleFragInputs(true);
				const customPortInput = document.getElementById('input-custom-ports');
				if (customPortInput) customPortInput.value = '';
				document.getElementById('hidden-auto-rotate').value = '0';
				document.getElementById('hidden-rotate-time').value = '';
				document.getElementById('hidden-ip-operator').value = 'all';
				document.getElementById('hidden-ip-count').value = '15';
				const autoResetToggle = document.getElementById('input-auto-reset-toggle');
				if (autoResetToggle) autoResetToggle.checked = false;
				document.getElementById('input-auto-reset-vol').value = '';
				document.getElementById('input-auto-reset-req').value = '';
				window.toggleAutoResetInputs(false);
				const advToggleReset = document.getElementById('input-advanced-settings-toggle');
				if (advToggleReset) advToggleReset.checked = false;
				if (typeof window.toggleAdvancedSettingsInputs === 'function') window.toggleAdvancedSettingsInputs(false);
			}
		}
		let activeRocketBtn = null;
		function toggleRocketModal(show) {
			ys5v6m0('rocket-modal', show);
		}
		async function openRocketModal(btn) {
			activeRocketBtn = btn;
			toggleRocketModal(true);
			const select = document.getElementById('rocket-country-select');
			const submitBtn = document.getElementById('rocket-submit-btn');
			select.innerHTML = '<option value="ALL">\u{1F310} \u0627\u0646\u062A\u062E\u0627\u0628 \u062A\u0635\u0627\u062F\u0641\u06CC \u0627\u0632 \u06A9\u0644 \u0645\u062E\u0632\u0646 VIP</option>';
			submitBtn.disabled = false;
		}
		async function executeRocketCreate() {
			const select = document.getElementById('rocket-country-select');
			const country = select.value || 'ALL';
			toggleRocketModal(false);
			const btn = activeRocketBtn;
			if (btn) btn.disabled = true;
			const icon = btn ? btn.querySelector('svg') : null;
			if (icon) {
				icon.classList.add('animate-spin');
				icon.classList.remove('group-hover:-translate-y-1', 'group-hover:translate-x-1');
			}
			try {
				const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
				let randStr = '';
				for (let i = 0; i < 8; i++) randStr += chars.charAt(Math.floor(Math.random() * chars.length));
				const username = 'Alireza-' + randStr;

				const resVip = await ggsyffs('vipprox.txt?t=' + Date.now());
				if (!resVip.ok) {
					alert('\u0647\u06CC\u0686 \u067E\u0631\u0648\u06A9\u0633\u06CC VIP \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.');
					return;
				}
				const text = await resVip.text();
				const lines = text.split('\\n').map(l => l.trim()).filter(l => l.length > 5);
				if (lines.length === 0) {
					alert('\u0647\u06CC\u0686 \u067E\u0631\u0648\u06A9\u0633\u06CC VIP \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.');
					return;
				}

				bm3pzm2('\u{1F680} \u062F\u0631 \u062D\u0627\u0644 \u0627\u0633\u06A9\u0646 \u067E\u06CC\u0646\u06AF ' + lines.length + ' \u067E\u0631\u0648\u06A9\u0633\u06CC VIP...');

				const controller = new AbortController();
				let successProxies = [];
				const testPromises = lines.map(async (proxyLine) => {
					await new Promise(r => setTimeout(r, Math.floor(Math.random() * 200)));
					try {
						const res = await fetch('/api/test-proxy', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ proxy: proxyLine, skip_country: true }),
							signal: controller.signal
						});
						const data = await res.json();
						if (data.success && data.ping) {
							successProxies.push({ proxy: proxyLine, ping: data.ping });
						}
					} catch (e) {}
				});
				const timeoutPromise = new Promise(resolve => setTimeout(resolve, 12000));
				await Promise.race([Promise.all(testPromises), timeoutPromise]);
				controller.abort();

				if (successProxies.length === 0) {
					alert('\u062E\u0637\u0627: \u0647\u06CC\u0686 \u067E\u0631\u0648\u06A9\u0633\u06CC \u0633\u0627\u0644\u0645\u06CC \u0628\u0627 \u067E\u06CC\u0646\u06AF \u0645\u0648\u0641\u0642 \u062F\u0631 \u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.');
					return;
				}
				successProxies.sort((a, b) => a.ping - b.ping);
				const bestProxy = successProxies[0].proxy;

				let availableIps = [];
				if (Object.keys(l76xmsu).length === 0) {
					try {
						const resIps = await kc5inhw('ips.txt');
						if (resIps.ok) {
							const text2 = await resIps.text();
							const blocks = text2.split('----------');
							blocks.forEach(block => {
								const l = block.trim().split('\\n').map(x => x.trim()).filter(x => x.length > 0);
								l.forEach(line => {
									if (!line.includes('#') && !line.startsWith('[source')) availableIps.push(line);
								});
							});
						}
					} catch (e) {}
				} else {
					Object.values(l76xmsu).forEach(ips => { availableIps = availableIps.concat(ips); });
				}
				availableIps = [...new Set(availableIps)];
				let selectedIps = [];
				if (availableIps.length > 0) {
					const shuffledIps = availableIps.slice();
					for (let i = shuffledIps.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));
						[shuffledIps[i], shuffledIps[j]] = [shuffledIps[j], shuffledIps[i]];
					}
					selectedIps = shuffledIps.slice(0, 10);
				}
				const ipsStr = selectedIps.join('\\n');
				const finalSocks5 = JSON.stringify([{ proxy: bestProxy, country: country }]);

				const response = await fetch('/api/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						username: username, limit_gb: null, expiry_days: null, limit_req: null, ip_limit: null,
						auto_reset_vol_days: 0, auto_reset_req_days: 0, frag_len: "", frag_int: "",
						fingerprint: "unsafe", block_ads: 1, block_porn: 0, port: "443", tls: "on",
						ips: ipsStr, ip_operator: "all", ip_count: 10, auto_rotate_ip: 1, rotate_time: 5,
						user_socks5: finalSocks5, auto_rotate_user_proxy: 1
					})
				});
				if (response.ok) {
					bm3pzm2('\u{1F680} \u06A9\u0627\u0631\u0628\u0631 \u062A\u06A9 \u06A9\u0634\u0648\u0631\u0647 \u0628\u0627 \u0628\u0647\u062A\u0631\u06CC\u0646 \u067E\u06CC\u0646\u06AF \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u06CC\u062C\u0627\u062F \u0634\u062F.');
					await axmsbp4(true);
				} else {
					const errData = await response.json();
					alert('\u062E\u0637\u0627: ' + (errData.error || '\u0639\u0645\u0644\u06CC\u0627\u062A \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F'));
				}
			} catch (err) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
			} finally {
				if (btn) btn.disabled = false;
				if (icon) {
					icon.classList.remove('animate-spin');
					icon.classList.add('group-hover:-translate-y-1', 'group-hover:translate-x-1');
				}
			}
		}
		window.copyAllConfigs = function(btn) {
			const users = Array.isArray(window.allUsers) ? window.allUsers : [];
			if (users.length === 0) {
				alert('\u06A9\u0627\u0631\u0628\u0631\u06CC \u0628\u0631\u0627\u06CC \u06A9\u067E\u06CC \u06A9\u0631\u062F\u0646 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F!');
				return;
			}
			const prevInfo = window._infoConfigsEnabled;
			window._infoConfigsEnabled = false;
			const all = [];
			let usersCount = 0;
			try {
				users.forEach(function(u) {
					let text = '';
					try { text = fv9a4g0(u.username); } catch (e) { text = ''; }
					if (!text) return;
					usersCount++;
					text.split('\\n').forEach(function(l) { l = l.trim(); if (l) all.push(l); });
				});
			} finally {
				window._infoConfigsEnabled = prevInfo;
			}
			if (all.length === 0) {
				alert('\u06A9\u0627\u0646\u0641\u06CC\u06AF\u06CC \u0628\u0631\u0627\u06CC \u06A9\u067E\u06CC \u06A9\u0631\u062F\u0646 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F!');
				return;
			}
			const text = all.join('\\n');
			const done = function() {
				if (typeof bm3pzm2 === 'function') bm3pzm2('\u2705 ' + all.length + ' \u06A9\u0627\u0646\u0641\u06CC\u06AF \u0627\u0632 ' + usersCount + ' \u06A9\u0627\u0631\u0628\u0631 \u06A9\u067E\u06CC \u0634\u062F.');
				else alert('\u2705 ' + all.length + ' \u06A9\u0627\u0646\u0641\u06CC\u06AF \u0627\u0632 ' + usersCount + ' \u06A9\u0627\u0631\u0628\u0631 \u06A9\u067E\u06CC \u0634\u062F.');
			};
			const fallback = function() {
				try {
					const ta = document.createElement('textarea');
					ta.value = text;
					ta.style.position = 'fixed';
					ta.style.opacity = '0';
					document.body.appendChild(ta);
					ta.select();
					const ok = document.execCommand('copy');
					ta.remove();
					if (ok) done(); else alert('\u062E\u0637\u0627 \u062F\u0631 \u06A9\u067E\u06CC \u06A9\u0631\u062F\u0646 \u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627!');
				} catch (e) {
					alert('\u062E\u0637\u0627 \u062F\u0631 \u06A9\u067E\u06CC \u06A9\u0631\u062F\u0646 \u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627!');
				}
			};
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(text).then(done).catch(fallback);
			} else {
				fallback();
			}
		};
		window.applyInfoConfigsState = function(on) {
			window._infoConfigsEnabled = !!on;
			const cb = document.getElementById('info-configs-toggle');
			if (cb) cb.checked = !!on;
		};
		window.toggleInfoConfigs = async function(cb) {
			const want = cb.checked;
			cb.disabled = true;
			try {
				const r = await fetch('/api/proxy-ip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ info_configs: want }) });
				if (!r.ok) throw new Error('save failed');
				window._infoConfigsEnabled = want;
				if (typeof bm3pzm2 === 'function') bm3pzm2(want ? '\u2705 \u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627\u06CC \u0627\u0637\u0644\u0627\u0639\u200C\u0631\u0633\u0627\u0646\u06CC \u0641\u0639\u0627\u0644 \u0634\u062F.' : '\u2705 \u06A9\u0627\u0646\u0641\u06CC\u06AF\u200C\u0647\u0627\u06CC \u0627\u0637\u0644\u0627\u0639\u200C\u0631\u0633\u0627\u0646\u06CC \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0634\u062F.');
			} catch (e) {
				cb.checked = !want;
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A');
			} finally {
				cb.disabled = false;
			}
		};
		window.PATTERNIHA_FM = '{"tcp": [{"type": "fragment", "settings": {"packets": "tlshello", "lengths": ["0", "104", "1"], "delays": ["0"], "maxSplit": "0"}},{"type": "fragment", "settings": {"packets": "1-1", "lengths": ["114", "1"], "delays": ["1"], "maxSplit": "11"}}]}';
		window.PATTERNIHA_CS = 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256';
		window.applyPatternihaState = function(on) {
			const cb = document.getElementById('patterniha-all-toggle');
			if (cb) cb.checked = !!on;
		};
		window.PATTERNIHA_ECH = 'cloudflare-ech.com+udp://1.1.1.1';
		window.ECH_PRESETS = { 'cf-udp': 'udp://1.1.1.1', 'google-udp': 'udp://8.8.8.8', 'quad9-udp': 'udp://9.9.9.9', 'cf-doh': 'https://1.1.1.1/dns-query', 'google-doh': 'https://8.8.8.8/dns-query' };
		window._ech = { sni: 'cloudflare-ech.com', doh: 'udp://1.1.1.1', preset: 'cf-udp', api: '' };
		window.getEchString = function() { return window._ech.sni + '+' + window._ech.doh; };
		window.refreshEchPreview = function() {
			const el = document.getElementById('ech-preview');
			const sni = (document.getElementById('ech-sni-input') || {}).value || '';
			const doh = (document.getElementById('ech-doh-input') || {}).value || '';
			if (el) el.textContent = 'ech=' + sni.trim() + '+' + doh.trim();
		};
		window.applyEchSettings = function(d) {
			if (!d) return;
			window._ech = { sni: d.ech_sni || 'cloudflare-ech.com', doh: d.ech_doh || 'udp://1.1.1.1', preset: d.ech_doh_preset || 'cf-udp', api: d.ech_api || '' };
			const a = document.getElementById('ech-sni-input'); if (a) a.value = window._ech.sni;
			const b = document.getElementById('ech-doh-input'); if (b) b.value = window._ech.doh;
			const c = document.getElementById('ech-doh-preset'); if (c) c.value = window._ech.preset;
			const e = document.getElementById('ech-api-input'); if (e) e.value = window._ech.api;
			window.refreshEchPreview();
		};
		window.onEchPresetChange = function(v) {
			if (window.ECH_PRESETS[v]) document.getElementById('ech-doh-input').value = window.ECH_PRESETS[v];
			window.refreshEchPreview();
		};
		window.onEchDohInput = function() {
			const v = document.getElementById('ech-doh-input').value.trim();
			const hit = Object.keys(window.ECH_PRESETS).find(function(k) { return window.ECH_PRESETS[k] === v; });
			document.getElementById('ech-doh-preset').value = hit || 'custom';
			window.refreshEchPreview();
		};
		window.closeEchModal = function() {
			const m = document.getElementById('ech-modal');
			if (m) m.remove();
		};
		window.openEchModal = async function() {
			window.closeEchModal();
			try {
				const r = await fetch('/api/proxy-ip');
				if (r.ok) window.applyEchSettings(await r.json());
			} catch (e) {}
			const inputCls = 'w-full px-3 py-2.5 bg-gray-50 dark:bg-amoled-input border border-gray-200 dark:border-amoled-border rounded-xl text-sm text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400';
			const lblCls = 'block text-[11px] font-bold text-gray-600 dark:text-zinc-400 mb-1.5';
			const wrap = document.createElement('div');
			wrap.id = 'ech-modal';
			wrap.setAttribute('style', 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);padding:12px');
			wrap.innerHTML =
				'<div class="w-full max-w-md rounded-2xl bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border overflow-hidden" style="max-height:90vh;overflow:auto" dir="rtl">' +
				'<div class="px-4 py-3 border-b border-gray-200 dark:border-amoled-border text-sm font-bold text-gray-800 dark:text-zinc-100">ECH \u0648 \u0645\u0631\u06A9\u0632\u06CC</div>' +
				'<div class="p-4 space-y-3">' +
				'<div><label class="' + lblCls + '">ECH SNI</label><input type="text" id="ech-sni-input" dir="ltr" placeholder="cloudflare-ech.com" oninput="refreshEchPreview()" class="' + inputCls + '"></div>' +
				'<div><label class="' + lblCls + '">ECH DoH preset</label><select id="ech-doh-preset" onchange="onEchPresetChange(this.value)" class="' + inputCls + ' cursor-pointer">' +
				'<option value="custom">Custom</option>' +
				'<option value="cf-udp">Cloudflare (udp://1.1.1.1)</option>' +
				'<option value="google-udp">Google (udp://8.8.8.8)</option>' +
				'<option value="quad9-udp">Quad9 (udp://9.9.9.9)</option>' +
				'<option value="cf-doh">Cloudflare DoH (https://1.1.1.1/dns-query)</option>' +
				'<option value="google-doh">Google DoH (https://8.8.8.8/dns-query)</option>' +
				'</select></div>' +
				'<div><label class="' + lblCls + '">ECH DoH</label><input type="text" id="ech-doh-input" dir="ltr" placeholder="udp://1.1.1.1" oninput="onEchDohInput()" class="' + inputCls + '"></div>' +
				'<div><label class="' + lblCls + '">API \u0645\u0631\u06A9\u0632\u06CC (\u0627\u062E\u062A\u06CC\u0627\u0631\u06CC)</label><input type="text" id="ech-api-input" dir="ltr" placeholder="https://your-central-server" class="' + inputCls + '">' +
				'<p class="text-[10px] text-gray-500 dark:text-zinc-500 mt-1">\u0641\u0639\u0644\u0627\u064B \u0641\u0642\u0637 \u0630\u062E\u06CC\u0631\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F \u0648 \u062F\u0631 \u0633\u0627\u062E\u062A \u06A9\u0627\u0646\u0641\u06CC\u06AF \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F.</p></div>' +
				'<p class="text-[10px] text-gray-500 dark:text-zinc-500" dir="ltr" id="ech-preview"></p>' +
				'<div class="flex gap-2">' +
				'<button type="button" id="ech-save-btn" class="flex-1 py-2.5 rounded-xl bg-fuchsia-600 text-white text-xs font-bold">\u0630\u062E\u06CC\u0631\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A ECH</button>' +
				'<button type="button" id="ech-close-btn" class="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 dark:text-zinc-300 text-xs font-bold">\u0628\u0633\u062A\u0646</button>' +
				'</div></div></div>';
			document.body.appendChild(wrap);
			document.getElementById('ech-sni-input').value = window._ech.sni;
			document.getElementById('ech-doh-input').value = window._ech.doh;
			document.getElementById('ech-doh-preset').value = window._ech.preset;
			document.getElementById('ech-api-input').value = window._ech.api;
			window.refreshEchPreview();
			document.getElementById('ech-close-btn').onclick = window.closeEchModal;
			wrap.addEventListener('click', function(e) { if (e.target === wrap) window.closeEchModal(); });
			document.getElementById('ech-save-btn').onclick = async function() {
				const ok = await window.saveEchSettings(this);
				if (ok) window.closeEchModal();
			};
		};
		window.saveEchSettings = async function(btn) {
			const sni = document.getElementById('ech-sni-input').value.trim();
			const doh = document.getElementById('ech-doh-input').value.trim();
			const preset = document.getElementById('ech-doh-preset').value;
			const api = document.getElementById('ech-api-input').value.trim();
			if (!sni || !doh) { alert('ECH SNI \u0648 ECH DoH \u0646\u0628\u0627\u06CC\u062F \u062E\u0627\u0644\u06CC \u0628\u0627\u0634\u0646\u062F.'); return false; }
			btn.disabled = true;
			try {
				const r = await fetch('/api/proxy-ip', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ech_sni: sni, ech_doh: doh, ech_doh_preset: preset, ech_api: api }) });
				if (!r.ok) {
					let m = '\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A ECH';
					try { const j = await r.json(); if (j && j.error) m = j.error; } catch (e) {}
					alert(m);
					return false;
				}
				window._ech = { sni: sni, doh: doh, preset: preset, api: api };
				if (typeof bm3pzm2 === 'function') bm3pzm2('\u2705 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A ECH \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F. \u0628\u0631\u0627\u06CC \u0627\u0639\u0645\u0627\u0644 \u0631\u0648\u06CC \u06A9\u0627\u0631\u0628\u0631\u0627\u0646\u060C \u062A\u0627\u06AF\u0644 Chrome + ECH \u0631\u0627 \u062F\u0648\u0628\u0627\u0631\u0647 \u0628\u0632\u0646.');
				return true;
			} catch (e) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
				return false;
			} finally {
				btn.disabled = false;
			}
		};
		window.applyPatternihaEchState = function(on) {
			const cb = document.getElementById('patterniha-ech-toggle');
			if (cb) cb.checked = !!on;
		};
		window.togglePatternihaEchAll = async function(cb) {
			const want = cb.checked;
			const msg = want
				? '\u0628\u0647\u06CC\u0646\u0647\u200C\u0633\u0627\u0632\u06CC Chrome + ECH \u0631\u0648\u06CC \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0627\u0639\u0645\u0627\u0644 \u0634\u0648\u062F\u061F (finalmask \u062E\u0627\u0644\u06CC\u060C \u0641\u06CC\u0646\u06AF\u0631\u067E\u0631\u06CC\u0646\u062A Chrome\u060C ECH \u0627\u0636\u0627\u0641\u0647\u061B Cipher Suites \u0648 TLS Mask \u0647\u0645 \u062E\u0627\u0644\u06CC \u0645\u06CC\u200C\u0634\u0646 \u0648 \u0645\u0642\u0627\u062F\u06CC\u0631 \u0641\u0639\u0644\u06CC \u062C\u0627\u06CC\u06AF\u0632\u06CC\u0646 \u0645\u06CC\u200C\u0634\u0646)'
				: 'ECH \u0648 finalmask \u0648 Cipher Suites \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u067E\u0627\u06A9 \u0634\u0648\u062F \u0648 \u0641\u06CC\u0646\u06AF\u0631\u067E\u0631\u06CC\u0646\u062A \u0628\u0647 Unsafe \u0628\u0631\u06AF\u0631\u062F\u062F\u061F';
			if (!confirm(msg)) { cb.checked = !want; return; }
			cb.disabled = true;
			try {
				await window.bulkAdvancedRequest(want
					? { advanced_frag: '', cipher_suites: '', tls_mask: '', ech_config: window.getEchString(), fingerprint: 'chrome', patterniha_ech: true }
					: { advanced_frag: '', cipher_suites: '', ech_config: '', fingerprint: 'unsafe', patterniha_ech: false });
				if (want) window.applyPatternihaState(false);
				if (typeof bm3pzm2 === 'function') bm3pzm2(want ? '\u2705 \u0628\u0647\u06CC\u0646\u0647\u200C\u0633\u0627\u0632\u06CC Chrome + ECH \u0631\u0648\u06CC \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0627\u0639\u0645\u0627\u0644 \u0634\u062F.' : '\u2705 \u0628\u0647\u06CC\u0646\u0647\u200C\u0633\u0627\u0632\u06CC \u0627\u0632 \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u062D\u0630\u0641 \u0634\u062F.');
			} catch (e) {
				cb.checked = !want;
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A');
			} finally {
				cb.disabled = false;
			}
		};
		window.bulkAdvancedRequest = async function(payload) {
			const r = await fetch('/api/bulk-advanced', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
			if (!r.ok) throw new Error('bulk failed');
			if (typeof axmsbp4 === 'function') { try { await axmsbp4(true); } catch (e) {} }
		};
		window.togglePatternihaAll = async function(cb) {
			const want = cb.checked;
			const msg = want
				? '\u0645\u0642\u0627\u062F\u06CC\u0631 \u0628\u0647\u06CC\u0646\u0647\u200C\u0633\u0627\u0632 Patterniha (Advanced Fragment \u0648 Cipher Suites) \u0631\u0648\u06CC \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0627\u0639\u0645\u0627\u0644 \u0634\u0648\u062F\u061F \u0645\u0642\u0627\u062F\u06CC\u0631 \u0641\u0639\u0644\u06CC \u062C\u0627\u06CC\u06AF\u0632\u06CC\u0646 \u0645\u06CC\u200C\u0634\u0648\u062F.'
				: 'Advanced Fragment \u0648 Cipher Suites \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u067E\u0627\u06A9 \u0634\u0648\u062F\u061F (TLS Mask \u062F\u0633\u062A\u200C\u0646\u062E\u0648\u0631\u062F\u0647 \u0645\u06CC\u200C\u0645\u0627\u0646\u062F)';
			if (!confirm(msg)) { cb.checked = !want; return; }
			cb.disabled = true;
			try {
				await window.bulkAdvancedRequest(want
					? { advanced_frag: window.PATTERNIHA_FM, cipher_suites: window.PATTERNIHA_CS, patterniha: true }
					: { advanced_frag: '', cipher_suites: '', patterniha: false });
				if (want) window.applyPatternihaEchState(false);
				if (typeof bm3pzm2 === 'function') bm3pzm2(want ? '\u2705 \u0628\u0647\u06CC\u0646\u0647\u200C\u0633\u0627\u0632\u06CC Patterniha \u0631\u0648\u06CC \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0627\u0639\u0645\u0627\u0644 \u0634\u062F.' : '\u2705 \u0628\u0647\u06CC\u0646\u0647\u200C\u0633\u0627\u0632\u06CC \u0627\u0632 \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u062D\u0630\u0641 \u0634\u062F.');
			} catch (e) {
				cb.checked = !want;
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A');
			} finally {
				cb.disabled = false;
			}
		};
		window.closeBulkAdvancedModal = function() {
			const m = document.getElementById('bulk-advanced-modal');
			if (m) m.remove();
		};
		window.openBulkAdvancedModal = function() {
			window.closeBulkAdvancedModal();
			const inputCls = 'w-full px-3 py-2 bg-gray-50 dark:bg-amoled-input border border-gray-200 dark:border-amoled-border rounded-lg text-xs text-gray-800 dark:text-zinc-100 focus:outline-none';
			const lblCls = 'block text-[10px] font-bold text-gray-500 dark:text-zinc-400 mb-1';
			const clsSm = 'text-[10px] text-gray-500 dark:text-zinc-400';
			const wrap = document.createElement('div');
			wrap.id = 'bulk-advanced-modal';
			wrap.setAttribute('style', 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);padding:12px');
			wrap.innerHTML =
				'<div class="w-full max-w-lg rounded-2xl bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border p-4 space-y-3" style="max-height:90vh;overflow:auto" dir="rtl">' +
				'<div class="text-sm font-black text-gray-800 dark:text-zinc-100">\u2699\uFE0F \u062A\u0646\u0638\u06CC\u0645 \u06CC\u06A9\u062C\u0627\u06CC \u067E\u06CC\u0634\u0631\u0641\u062A\u0647 \u0628\u0631\u0627\u06CC \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646</div>' +
				'<div class="' + clsSm + '">\u0641\u06CC\u0644\u062F\u06CC \u06A9\u0647 \u062E\u0627\u0644\u06CC \u0628\u0645\u0627\u0646\u062F \u062A\u063A\u06CC\u06CC\u0631 \u0646\u0645\u06CC\u200C\u06A9\u0646\u062F. \u0628\u0631\u0627\u06CC \u067E\u0627\u06A9 \u06A9\u0631\u062F\u0646 \u06CC\u06A9 \u0645\u0642\u062F\u0627\u0631 \u0627\u0632 \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646\u060C \u062A\u06CC\u06A9 \xAB\u067E\u0627\u06A9 \u06A9\u0646\xBB \u06A9\u0646\u0627\u0631\u0634 \u0631\u0627 \u0628\u0632\u0646.</div>' +
				'<div><label class="' + lblCls + '">Advanced Fragment (fm JSON)</label><textarea id="bulk-adv-frag" rows="3" dir="ltr" class="' + inputCls + '"></textarea>' +
				'<label class="' + clsSm + '"><input type="checkbox" id="bulk-adv-frag-clear"> \u067E\u0627\u06A9 \u06A9\u0646</label></div>' +
				'<div><label class="' + lblCls + '">Cipher Suites (cs)</label><input type="text" id="bulk-adv-cs" dir="ltr" class="' + inputCls + '">' +
				'<label class="' + clsSm + '"><input type="checkbox" id="bulk-adv-cs-clear"> \u067E\u0627\u06A9 \u06A9\u0646</label></div>' +
				'<div><label class="' + lblCls + '">TLS Mask (Custom SNI / Host)</label><input type="text" id="bulk-adv-mask" dir="ltr" class="' + inputCls + '">' +
				'<label class="' + clsSm + '"><input type="checkbox" id="bulk-adv-mask-clear"> \u067E\u0627\u06A9 \u06A9\u0646</label></div>' +
				'<div class="flex gap-2">' +
				'<button type="button" id="bulk-adv-apply" class="flex-1 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold">\u0627\u0639\u0645\u0627\u0644 \u0631\u0648\u06CC \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646</button>' +
				'<button type="button" id="bulk-adv-fill" class="px-3 py-2 rounded-lg border border-purple-500 text-purple-600 text-xs font-bold">\u0645\u0642\u0627\u062F\u06CC\u0631 Patterniha</button>' +
				'<button type="button" id="bulk-adv-close" class="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 dark:text-zinc-300 text-xs font-bold">\u0628\u0633\u062A\u0646</button>' +
				'</div></div>';
			document.body.appendChild(wrap);
			document.getElementById('bulk-adv-close').onclick = window.closeBulkAdvancedModal;
			wrap.addEventListener('click', function(e) { if (e.target === wrap) window.closeBulkAdvancedModal(); });
			document.getElementById('bulk-adv-fill').onclick = function() {
				document.getElementById('bulk-adv-frag').value = window.PATTERNIHA_FM;
				document.getElementById('bulk-adv-cs').value = window.PATTERNIHA_CS;
			};
			document.getElementById('bulk-adv-apply').onclick = async function() {
				const btn = this;
				const payload = {};
				const pick = function(inputId, clearId, key) {
					const v = document.getElementById(inputId).value.trim();
					if (document.getElementById(clearId).checked) payload[key] = '';
					else if (v) payload[key] = v;
				};
				pick('bulk-adv-frag', 'bulk-adv-frag-clear', 'advanced_frag');
				pick('bulk-adv-cs', 'bulk-adv-cs-clear', 'cipher_suites');
				pick('bulk-adv-mask', 'bulk-adv-mask-clear', 'tls_mask');
				if (Object.keys(payload).length === 0) { alert('\u0647\u06CC\u0686 \u0645\u0642\u062F\u0627\u0631\u06CC \u0648\u0627\u0631\u062F \u0646\u0634\u062F\u0647.'); return; }
				if (payload.advanced_frag) {
					try { JSON.parse(payload.advanced_frag); } catch (e) { alert('Advanced Fragment \u0628\u0627\u06CC\u062F JSON \u0645\u0639\u062A\u0628\u0631 \u0628\u0627\u0634\u062F.'); return; }
				}
				if (!confirm('\u0627\u06CC\u0646 \u0645\u0642\u0627\u062F\u06CC\u0631 \u0631\u0648\u06CC \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0627\u0639\u0645\u0627\u0644 \u0634\u0648\u062F\u061F')) return;
				btn.disabled = true;
				try {
					await window.bulkAdvancedRequest(payload);
					if (typeof bm3pzm2 === 'function') bm3pzm2('\u2705 \u0631\u0648\u06CC \u0647\u0645\u0647 \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0627\u0639\u0645\u0627\u0644 \u0634\u062F.');
					window.closeBulkAdvancedModal();
				} catch (e) {
					alert('\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A');
					btn.disabled = false;
				}
			};
		};
		window.createDualCountryConfigs = async function(btn) {
			if (btn.disabled) return;
			const cca2 = String(window._globalActiveCountry || '').toUpperCase();
			if (!cca2) {
				alert('\u0627\u0648\u0644 \u0627\u0632 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u067E\u0646\u0644 \u06CC\u06A9 \u06A9\u0634\u0648\u0631 \u062B\u0627\u0628\u062A \u06A9\u0646 (IATA)\u060C \u0628\u0639\u062F \u0627\u06CC\u0646 \u062F\u06A9\u0645\u0647 \u0631\u0648 \u0628\u0632\u0646.');
				return;
			}
			btn.disabled = true;
			const icon = btn.querySelector('svg');
			if (icon) icon.classList.add('animate-spin');
			try {
				let base = '';
				if (typeof m79lr3o === 'function') base = String(m79lr3o(cca2) || '').toLowerCase().replace(/[^a-z0-9]/g, '');
				if (!base) base = cca2.toLowerCase();
				base = base.slice(0, 18);
				const num = Math.floor(100 + Math.random() * 900);
				let allIps = [];
				if (Object.keys(l76xmsu).length === 0) {
					try {
						const resIps = await kc5inhw('ips.txt');
						if (resIps.ok) {
							const text = await resIps.text();
							text.split('----------').forEach(block => {
								block.trim().split('\\n').map(l => l.trim()).filter(l => l.length > 0).forEach(line => {
									if (!line.includes('#') && !line.startsWith('[source')) allIps.push(line);
								});
							});
						}
					} catch (e) {}
				} else {
					Object.values(l76xmsu).forEach(list => { allIps = allIps.concat(list); });
				}
				allIps = [...new Set(allIps)];
				const pickIps = function() {
					const arr = allIps.slice();
					for (let i = arr.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));
						[arr[i], arr[j]] = [arr[j], arr[i]];
					}
					return arr.slice(0, 2).join('\\n');
				};
				const defs = [
					{ username: base + num, frag_len: '200-3000', frag_int: '1-2' },
					{ username: 'Hard-' + base + num, frag_len: '50-200', frag_int: '1-3' }
				];
				let created = 0;
				for (const d of defs) {
					const response = await fetch('/api/users', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							username: d.username, limit_gb: null, expiry_days: null, limit_req: null, ip_limit: null,
							auto_reset_vol_days: 0, auto_reset_req_days: 1, frag_len: d.frag_len, frag_int: d.frag_int,
							fingerprint: 'unsafe', block_ads: 0, block_porn: 0, port: '443', tls: 'on',
							ips: pickIps(), ip_operator: 'all', ip_count: 2, auto_rotate_ip: 1, rotate_time: 1,
							user_proxy_iata: cca2, user_ipv6_enabled: 1, enable_direct: 1,
							user_socks5: null, auto_rotate_user_proxy: 0,
							protocols: ['vl' + 'e' + 'ss']
						})
					});
					if (response.ok) {
						created++;
					} else {
						let msg = '\u0639\u0645\u0644\u06CC\u0627\u062A \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F';
						try { const errData = await response.json(); if (errData && errData.error) msg = errData.error; } catch (e) {}
						alert('\u062E\u0637\u0627 \u062F\u0631 \u0633\u0627\u062E\u062A ' + d.username + ': ' + msg);
						break;
					}
				}
				if (created > 0) {
					if (typeof bm3pzm2 === 'function') bm3pzm2('\u2705 ' + created + ' \u06A9\u0627\u0646\u0641\u06CC\u06AF (' + cca2 + ') \u0633\u0627\u062E\u062A\u0647 \u0634\u062F.');
					await axmsbp4(true);
				}
			} catch (err) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
			} finally {
				btn.disabled = false;
				if (icon) icon.classList.remove('animate-spin');
			}
		};
		window.createNoFilteringConfigs = async function(btn) {
			if (btn.disabled) return;
			const cca2 = String(window._globalActiveCountry || '').toUpperCase();
			if (!cca2) {
				alert('\u0627\u0648\u0644 \u0627\u0632 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u067E\u0646\u0644 \u06CC\u06A9 \u06A9\u0634\u0648\u0631 \u062B\u0627\u0628\u062A \u06A9\u0646 (IATA)\u060C \u0628\u0639\u062F \u0627\u06CC\u0646 \u062F\u06A9\u0645\u0647 \u0631\u0648 \u0628\u0632\u0646.');
				return;
			}
			btn.disabled = true;
			const icon = btn.querySelector('svg');
			if (icon) icon.classList.add('animate-spin');
			try {
				let base = '';
				if (typeof m79lr3o === 'function') base = String(m79lr3o(cca2) || '').toLowerCase().replace(/[^a-z0-9]/g, '');
				if (!base) base = cca2.toLowerCase();
				base = base.slice(0, 18);
				const num = Math.floor(100 + Math.random() * 900);
				let allIps = [];
				if (Object.keys(l76xmsu).length === 0) {
					try {
						const resIps = await kc5inhw('ips.txt');
						if (resIps.ok) {
							const text = await resIps.text();
							text.split('----------').forEach(block => {
								block.trim().split('\\n').map(l => l.trim()).filter(l => l.length > 0).forEach(line => {
									if (!line.includes('#') && !line.startsWith('[source')) allIps.push(line);
								});
							});
						}
					} catch (e) {}
				} else {
					Object.values(l76xmsu).forEach(list => { allIps = allIps.concat(list); });
				}
				allIps = [...new Set(allIps)];
				const pickIps = function() {
					const arr = allIps.slice();
					for (let i = arr.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));
						[arr[i], arr[j]] = [arr[j], arr[i]];
					}
					return arr.slice(0, 2).join('\\n');
				};
				const echStr = window.getEchString();
				const FRAG_N = { frag_len: '200-3000', frag_int: '1-2' };
				const FRAG_H = { frag_len: '50-200', frag_int: '1-3' };
				const defs = [
					Object.assign({ username: base + num + '-1', ech_config: echStr, fingerprint: 'chrome' }, FRAG_N),
					Object.assign({ username: 'Hard-' + base + num + '-2', ech_config: echStr, fingerprint: 'chrome' }, FRAG_H),
					Object.assign({ username: base + num + '-3', advanced_frag: window.PATTERNIHA_FM, cipher_suites: window.PATTERNIHA_CS }, FRAG_N),
					Object.assign({ username: 'Hard-' + base + num + '-4', advanced_frag: window.PATTERNIHA_FM, cipher_suites: window.PATTERNIHA_CS }, FRAG_H)
				];
				let created = 0;
				for (const d of defs) {
					const response = await fetch('/api/users', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							username: d.username, limit_gb: null, expiry_days: null, limit_req: null, ip_limit: null,
							auto_reset_vol_days: 0, auto_reset_req_days: 1, frag_len: d.frag_len, frag_int: d.frag_int,
							fingerprint: d.fingerprint || 'unsafe', advanced_frag: d.advanced_frag || null, cipher_suites: d.cipher_suites || null, ech_config: d.ech_config || null, block_ads: 0, block_porn: 0, port: '443', tls: 'on',
							ips: pickIps(), ip_operator: 'all', ip_count: 2, auto_rotate_ip: 1, rotate_time: 1,
							user_proxy_iata: cca2, user_ipv6_enabled: 1, enable_direct: 1,
							user_socks5: null, auto_rotate_user_proxy: 0,
							protocols: ['vl' + 'e' + 'ss']
						})
					});
					if (response.ok) {
						created++;
					} else {
						let msg = '\u0639\u0645\u0644\u06CC\u0627\u062A \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F';
						try { const errData = await response.json(); if (errData && errData.error) msg = errData.error; } catch (e) {}
						alert('\u062E\u0637\u0627 \u062F\u0631 \u0633\u0627\u062E\u062A ' + d.username + ': ' + msg);
						break;
					}
				}
				if (created > 0) {
					if (typeof bm3pzm2 === 'function') bm3pzm2('\u2705 ' + created + ' \u06A9\u0627\u0646\u0641\u06CC\u06AF (' + cca2 + ') \u0633\u0627\u062E\u062A\u0647 \u0634\u062F.');
					await axmsbp4(true);
				}
			} catch (err) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
			} finally {
				btn.disabled = false;
				if (icon) icon.classList.remove('animate-spin');
			}
		};
		async function quickCreateUser(btn) {
			btn.disabled = true;
			const icon = btn.querySelector('svg');
			if (icon) {
				icon.classList.add('animate-spin');
				icon.classList.remove('group-hover:rotate-12');
			}
			try {
				const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
				let randStr = '';
				for (let i = 0; i < 8; i++) randStr += chars.charAt(Math.floor(Math.random() * chars.length));
				const username = 'Alireza-' + randStr;
				
				let vipLines = [];
				try {
					const resVipList = await ggsyffs('vipprox.txt?t=' + Date.now());
					if (resVipList.ok) {
						const text = await resVipList.text();
						vipLines = text.split('\\n').map(l => l.trim()).filter(l => l.length > 5);
					}
				} catch (e) {}

				if (vipLines.length < 2) {
					alert('\u062E\u0637\u0627: \u0645\u062E\u0632\u0646 VIP \u0634\u0645\u0627 \u062F\u0631 \u062F\u0633\u062A\u0631\u0633 \u0646\u06CC\u0633\u062A \u06CC\u0627 \u06A9\u0645\u062A\u0631 \u0627\u0632 2 \u067E\u0631\u0648\u06A9\u0633\u06CC \u062F\u0627\u0631\u062F.');
					btn.disabled = false;
					if (icon) {
						icon.classList.remove('animate-spin');
						icon.classList.add('group-hover:rotate-12');
					}
					return;
				}

				for (let i = vipLines.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[vipLines[i], vipLines[j]] = [vipLines[j], vipLines[i]];
				}

				const candidateProxies = vipLines.slice(0, 8);
				const fastestFound = [];
				const controller = new AbortController();

				const findTwoProxiesPromise = new Promise((resolveFast) => {
					let successCount = 0;
					const proxyPromises = candidateProxies.map(async (proxyStr) => {
						try {
							const res = await fetch('/api/test-proxy', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ proxy: proxyStr, skip_country: true }),
								signal: controller.signal
							});
							const data = await res.json();
							if (data.success) {
								fastestFound.push({ proxy: proxyStr, ping: data.ping });
								successCount++;
								if (successCount >= 2) resolveFast();
							}
						} catch(e) {}
					});
					Promise.allSettled(proxyPromises).then(() => resolveFast());
				});

				const timeoutPromise = new Promise(resolve => setTimeout(resolve, 5000));
				await Promise.race([findTwoProxiesPromise, timeoutPromise]);
				controller.abort();

				if (fastestFound.length < 2) {
					alert('\u062E\u0637\u0627: \u062D\u062F\u0627\u0642\u0644 \u06F2 \u067E\u0631\u0648\u06A9\u0633\u06CC \u0633\u0627\u0644\u0645 \u062F\u0631 \u0632\u0645\u0627\u0646 \u0645\u062C\u0627\u0632 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.');
					btn.disabled = false;
					if (icon) {
						icon.classList.remove('animate-spin');
						icon.classList.add('group-hover:rotate-12');
					}
					return;
				}

				fastestFound.sort((a, b) => a.ping - b.ping);
				const fastestProxies = [fastestFound[0].proxy, fastestFound[1].proxy];

				const userSocks5 = JSON.stringify(fastestProxies);
				
				let availableIps = [];
				if (Object.keys(l76xmsu).length === 0) {
					try {
						const resIps = await kc5inhw('ips.txt');
						if (resIps.ok) {
							const text = await resIps.text();
							const blocks = text.split('----------');
							blocks.forEach(block => {
								const lines = block.trim().split('\\n').map(l => l.trim()).filter(l => l.length > 0);
								lines.forEach(line => {
									if (!line.includes('#') && !line.startsWith('[source')) availableIps.push(line);
								});
							});
						}
					} catch(e) {}
				} else {
					Object.values(l76xmsu).forEach(ips => { availableIps = availableIps.concat(ips); });
				}
				availableIps = [...new Set(availableIps)];
				let selectedIps = [];
				if (availableIps.length > 0) {
					const shuffledIps = availableIps.slice();
					for (let i = shuffledIps.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));
						[shuffledIps[i], shuffledIps[j]] = [shuffledIps[j], shuffledIps[i]];
					}
					selectedIps = shuffledIps.slice(0, 15);
				}
				const ipsStr = selectedIps.join('\\n');
				
				const response = await fetch('/api/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						username: username, limit_gb: null, expiry_days: null, limit_req: null, ip_limit: null,
						auto_reset_vol_days: 0, auto_reset_req_days: 1, frag_len: "200-3000", frag_int: "1-2",
						fingerprint: "unsafe", block_ads: 1, block_porn: 0, port: "443", tls: "on",
						ips: ipsStr, ip_operator: "all", ip_count: 15, auto_rotate_ip: 1, rotate_time: 1,
						user_socks5: userSocks5, auto_rotate_user_proxy: 1
					})
				});
				if (response.ok) {
					bm3pzm2('\u2705 \u06A9\u0627\u0631\u0628\u0631 \u0633\u0631\u06CC\u0639 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u06CC\u062C\u0627\u062F \u0634\u062F.');
					await axmsbp4(true);
				} else {
					const errData = await response.json();
					alert('\u062E\u0637\u0627: ' + (errData.error || '\u0639\u0645\u0644\u06CC\u0627\u062A \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F'));
				}
			} catch (err) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
			} finally {
				btn.disabled = false;
				if (icon) {
					icon.classList.remove('animate-spin');
					icon.classList.add('group-hover:rotate-12');
				}
			}
		}
		window.switchUserTab = function(tabId) {
			const tabs = [
				{ id: 'tab-user-info', btn: 'tab-btn-user-info' },
				{ id: 'tab-ports-network', btn: 'tab-btn-ports-network' },
				{ id: 'tab-proxy-settings', btn: 'tab-btn-proxy-settings' }
			];
			tabs.forEach(t => {
				const panel = document.getElementById(t.id);
				const btn = document.getElementById(t.btn);
				if (panel) panel.classList.toggle('hidden', t.id !== tabId);
				if (btn) {
					if (t.id === tabId) {
						btn.className = 'user-modal-tab-btn active flex-1 md:flex-initial flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-3 p-1.5 sm:p-3 rounded-xl transition text-center sm:text-right cursor-pointer select-none bg-blue-600/10 dark:bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold shadow-sm';
						const iconBox = btn.querySelector('div.flex-shrink-0');
						if (iconBox) iconBox.className = 'flex-shrink-0 w-4 h-4 sm:w-8 sm:h-8 rounded sm:rounded-lg flex items-center justify-center bg-blue-500/15 dark:bg-blue-400/20 text-blue-600 dark:text-blue-300';
					} else {
						btn.className = 'user-modal-tab-btn flex-1 md:flex-initial flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-3 p-1.5 sm:p-3 rounded-xl transition text-center sm:text-right cursor-pointer select-none bg-transparent hover:bg-gray-100 dark:hover:bg-amoled-input/50 border border-transparent text-gray-600 dark:text-zinc-400 font-medium';
						const iconBox = btn.querySelector('div.flex-shrink-0');
						if (iconBox) iconBox.className = 'flex-shrink-0 w-4 h-4 sm:w-8 sm:h-8 rounded sm:rounded-lg flex items-center justify-center bg-gray-200/60 dark:bg-slate-900 text-gray-500 dark:text-zinc-400';
					}
				}
			});
		}
		function openCreateModal() {
			isEditMode = false;
			editingUsername = '';
			if (typeof window.switchUserTab === 'function' || typeof switchUserTab === 'function') switchUserTab('tab-user-info');
			document.getElementById('modal-title').innerText = '\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631 \u062C\u062F\u06CC\u062F';
			jutlx8s('\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631', false);
			document.getElementById('input-name').disabled = false;
			document.getElementById('create-user-form').reset();
			const vlessCbC = document.getElementById('input-proto-vless');
			const trojanCbC = document.getElementById('input-proto-trojan');
			const ssCbC = document.getElementById('input-proto-ss');
			if (vlessCbC) vlessCbC.checked = true;
			if (trojanCbC) trojanCbC.checked = false;
			if (ssCbC) ssCbC.checked = true;
			if (typeof window.autoFillUsernameFromCountry === 'function') window.autoFillUsernameFromCountry();
			if (typeof window.autoFillCleanIps === 'function') window.autoFillCleanIps(2);
			const cb443 = document.querySelector('input[name="ports"][value="443"]');
			if (cb443) cb443.checked = true;
			const cb80 = document.querySelector('input[name="ports"][value="80"]');
			if (cb80) cb80.checked = true;
			const fpSelect = document.getElementById('fingerprint-select');
			if (fpSelect) fpSelect.value = 'unsafe';
			const fragToggle = document.getElementById('input-frag-toggle');
			if (fragToggle) fragToggle.checked = true;
			window.toggleFragInputs(true);
			const autoResetToggle = document.getElementById('input-auto-reset-toggle');
			if (autoResetToggle) autoResetToggle.checked = false;
			document.getElementById('input-auto-reset-vol').value = '';
			document.getElementById('input-auto-reset-req').value = '';
			window.toggleAutoResetInputs(false);
			const blockAdsToggle = document.getElementById('input-block-ads');
			if (blockAdsToggle) blockAdsToggle.checked = false;
			const enableDirectToggleReset = document.getElementById('input-enable-direct');
			if (enableDirectToggleReset) enableDirectToggleReset.checked = true;
			const autoRotateUserProxyCheck = document.getElementById('input-auto-rotate-user-proxy');
			if (autoRotateUserProxyCheck) autoRotateUserProxyCheck.checked = false;
			const userProxyToggle = document.getElementById('user-proxy-mode-toggle');
			if (userProxyToggle) userProxyToggle.checked = true;
			if (typeof window.toggleUserProxyMode === 'function') window.toggleUserProxyMode(true);
			window.proxyFieldsData = [""];
			window.activeProxyIndex = 0;
			const defaultIataCode = window._globalActiveCountry || '';
			window.userProxyIata = defaultIataCode || null;
			const iataToggleReset = document.getElementById('input-user-iata-toggle');
			if (iataToggleReset) iataToggleReset.checked = true;
			const iataInputReset = document.getElementById('input-user-proxy-iata');
			if (iataInputReset) { iataInputReset.disabled = false; iataInputReset.value = defaultIataCode; }
			if (typeof window.updateUserIataPreview === 'function') window.updateUserIataPreview();
			if (typeof window.renderProxyFieldsUI === 'function') window.renderProxyFieldsUI();
			document.getElementById('hidden-auto-rotate').value = '0';
			document.getElementById('hidden-rotate-time').value = '';
			document.getElementById('hidden-ip-operator').value = 'all';
			document.getElementById('hidden-ip-count').value = '15';
			toggleModal(true);
		}
		
		const themeToggleBtn = document.getElementById('theme-toggle');
		themeToggleBtn.addEventListener('click', () => {
			if (document.documentElement.classList.contains('dark')) {
				document.documentElement.classList.remove('dark');
				localStorage.setItem('color-theme', 'light');
			} else {
				document.documentElement.classList.add('dark');
				localStorage.setItem('color-theme', 'dark');
			}
		});
		const grayscaleToggleBtn = document.getElementById('grayscale-toggle');
		if (grayscaleToggleBtn) {
			grayscaleToggleBtn.addEventListener('click', () => {
				if (document.documentElement.classList.contains('grayscale-active')) {
					document.documentElement.classList.remove('grayscale-active');
					localStorage.setItem('grayscale-theme', 'false');
				} else {
					document.documentElement.classList.add('grayscale-active');
					localStorage.setItem('grayscale-theme', 'true');
				}
			});
		}
		async function dkulmtc(actionType) {
			if (!await pw6sr5c('\u0622\u06CC\u0627 \u0627\u0632 \u0631\u06CC \u0627\u0633\u062A\u0627\u0631\u062A \u067E\u0640\u0646\u0640\u0644 \u0645\u0637\u0645\u0626\u0646 \u0647\u0633\u062A\u06CC\u062F\u061F \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0634\u0645\u0627 \u0644\u062D\u0638\u0647 \u0627\u06CC \u0642\u0637\u0639 \u062E\u0648\u0627\u0647\u0646\u062F \u0634\u062F.')) return;
			const btn = document.querySelector('button[title="\u0631\u06CC \u0627\u0633\u062A\u0627\u0631\u062A \u067E\u0640\u0646\u0640\u0644"]');
			if (btn) btn.classList.add('animate-pulse');
			try {
				const res = await fetch('/api/restart-core', { method: 'POST' });
				const data = await res.json();
				if (res.ok && data.success) {
					alert('\u067E\u0640\u0646\u0640\u0644 \u0631\u06CC \u0627\u0633\u062A\u0627\u0631\u062A \u0634\u062F \u0635\u0641\u062D\u0647 \u0631\u0641\u0631\u0634 \u0645\u06CC \u0634\u0648\u062F.');
					window.location.href = window.location.pathname + '?t=' + Date.now();
				} else {
					alert('\u062E\u0637\u0627 \u062F\u0631 \u0631\u06CC\u200C\u0627\u0633\u062A\u0627\u0631\u062A \u067E\u0640\u0646\u0640\u0644: ' + (data.error || '\u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647'));
					if (btn) btn.classList.remove('animate-pulse');
				}
			} catch (err) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631.');
				if (btn) btn.classList.remove('animate-pulse');
			}
		}
		async function restartCore() {
			await dkulmtc('restart');
		}
		async function axmsbp4(silent = false) {
			if (window.isDraggingRow) return; 
			const loadingState = document.getElementById('loading-state');
			const tableContainer = document.getElementById('users-table-container');
			const emptyState = document.getElementById('empty-state');
			if (!silent) {
				loadingState.classList.remove('hidden');
				tableContainer.classList.add('hidden');
				emptyState.classList.add('hidden');
			}
			try {
				const res = await fetch('/api/users?t=' + Date.now());
				if (!res.ok) throw new Error();
				const data = await res.json();
				aisb7wy(data);
			} catch (err) {
				if (!silent) {
					loadingState.innerHTML = '<span class="text-red-500">\u062E\u0637\u0627 \u062F\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0627\u0632 \u0633\u0631\u0648\u0631</span>';
				}
			}
		}
		function aisb7wy(data) {
			try {
				const users = data.users || [];
				window.allUsers = users;
				const serverTime = data.serverTime || Date.now();
				window.lastServerTime = serverTime;
				const totalUsersCount = users.length;
				const activeUsersCount = users.reduce((sum, u) => sum + (u.online_count || 0), 0);
				const totalGbUsage = users.reduce((sum, u) => sum + (u.lifetime_used_gb || u.used_gb || 0), 0);
				document.getElementById('stat-total-users').innerText = totalUsersCount;
				document.getElementById('stat-active-users').innerText = activeUsersCount;
				document.getElementById('stat-total-usage').innerText = totalGbUsage < 1 ? (totalGbUsage * 1024).toFixed(0) + ' MB' : totalGbUsage.toFixed(2) + ' GB';
				const d1Reads = data.d1Reads || 0;
				const d1Writes = data.d1Writes || 0;
				const d1WritesEl = document.getElementById('stat-d1-writes');
				if (d1WritesEl) d1WritesEl.innerText = d1Writes >= 1000 ? (d1Writes / 1000).toFixed(1) + 'k' : d1Writes;
				const d1ReadsEl = document.getElementById('stat-d1-reads');
				if (d1ReadsEl) d1ReadsEl.innerText = d1Reads >= 1000000 ? (d1Reads / 1000000).toFixed(2) + 'M' : (d1Reads >= 1000 ? (d1Reads / 1000).toFixed(1) + 'k' : d1Reads);
				const cfRequests = data.cfRequestsToday || 0;
				const reqCard = document.getElementById('card-cf-requests');
				const warningBtn = document.getElementById('cf-warning-btn');
				if (cfRequests >= 90000) {
					if (reqCard) {
						reqCard.className = "bg-red-50 dark:bg-red-950/20 border border-red-500 rounded-md p-2.5 shadow-[0_0_15px_rgba(239,68,68,0.4)] flex flex-col justify-center gap-1 hover:shadow-md transition duration-300 relative overflow-hidden group min-h-[64px] animate-pulse";
					}
					if (warningBtn) {
						warningBtn.classList.remove('hidden');
					}
					if (!window.hasShownUsageWarning) {
						openUsageWarning();
						window.hasShownUsageWarning = true;
					}
				} else {
					if (reqCard) {
						reqCard.className = "bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md p-2.5 shadow-sm flex flex-col justify-center gap-1 hover:shadow-md hover:border-orange-400 dark:hover:border-orange-500/50 transition duration-300 relative overflow-hidden group min-h-[64px]";
					}
					if (warningBtn) {
						warningBtn.classList.add('hidden');
					}
				}
				const cfTotal = data.cfRequestsTotal || 0;
				document.getElementById('stat-cf-requests').innerText = cfRequests >= 1000 ? (cfRequests / 1000).toFixed(1) + 'k' : cfRequests;
				document.getElementById('stat-cf-total').innerText = cfTotal >= 1000000 ? (cfTotal / 1000000).toFixed(2) + 'M' : (cfTotal >= 1000 ? (cfTotal / 1000).toFixed(1) + 'k' : cfTotal);
				const progressPercent = Math.min((cfRequests / 100000) * 100, 100);
				document.getElementById('stat-cf-progress').style.width = progressPercent + '%';
				filterAndRenderUsers();
			} catch (err) {
				document.getElementById('loading-state').innerHTML = '<span class="text-red-500">\u062E\u0637\u0627 \u062F\u0631 \u067E\u0631\u062F\u0627\u0632\u0634 \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u0628\u0631\u0627\u0646</span>';
			}
		}
		function filterAndRenderUsers() {
			if (!window.allUsers) return;
			const searchQuery = (document.getElementById('search-input').value || '').toLowerCase().trim();
			const filterStatus = document.getElementById('filter-status').value;
			const sortVal = document.getElementById('sort-users').value;
			const serverTime = window.lastServerTime || Date.now();
			let filtered = [...window.allUsers];
			if (searchQuery) {
				filtered = filtered.filter(u => 
					(u.username || '').toLowerCase().includes(searchQuery) || 
					(u.uuid || '').toLowerCase().includes(searchQuery)
				);
			}
			if (filterStatus !== 'all') {
				filtered = filtered.filter(u => {
					const isOnline = u.is_online === 1;
					const isActive = u.is_active === 1;
					let isExpired = false;
					if (u.limit_gb && u.used_gb >= u.limit_gb) isExpired = true;
					if (u.expiry_days && u.created_at) {
						const created = new Date(u.created_at);
						const expiryDate = u.first_connection_time ? new Date(u.first_connection_time + u.expiry_days * 24 * 60 * 60 * 1000) : new Date(created.getTime() + u.expiry_days * 24 * 60 * 60 * 1000);
						if (new Date(serverTime) > expiryDate) isExpired = true;
					}
					if (filterStatus === 'active') return isActive && !isExpired;
					if (filterStatus === 'inactive') return !isActive;
					if (filterStatus === 'online') return isOnline;
					if (filterStatus === 'offline') return !isOnline;
					if (filterStatus === 'expired') return isExpired || !isActive;
					return true;
				});
			}
			const customOrderStr = localStorage.getItem('uo_k3');
			let customOrder = [];
			try { customOrder = JSON.parse(customOrderStr || '[]'); } catch(e) {}
			filtered.sort((a, b) => {
				if (sortVal === 'newest' && customOrder.length > 0) {
					const indexA = customOrder.indexOf(a.username);
					const indexB = customOrder.indexOf(b.username);
					if (indexA !== -1 && indexB !== -1) return indexA - indexB;
					if (indexA !== -1) return -1;
					if (indexB !== -1) return 1;
				}
				if (sortVal === 'newest') {
					return b.id - a.id;
				}
				if (sortVal === 'name') {
					return (a.username || '').localeCompare(b.username || '');
				}
				if (sortVal === 'usage-desc') {
					return (b.used_gb || 0) - (a.used_gb || 0);
				}
				if (sortVal === 'usage-asc') {
					return (a.used_gb || 0) - (b.used_gb || 0);
				}
				if (sortVal === 'expiry-asc') {
					const getRemaining = (u) => {
						if (!u.expiry_days) return Infinity;
						if (!u.created_at) return Infinity;
						const created = new Date(u.created_at);
						const expiryDate = u.first_connection_time ? new Date(u.first_connection_time + u.expiry_days * 24 * 60 * 60 * 1000) : new Date(created.getTime() + u.expiry_days * 24 * 60 * 60 * 1000);
						return expiryDate - new Date(serverTime);
					};
					return getRemaining(a) - getRemaining(b);
				}
				return 0;
			});
			hn4ik24(filtered, serverTime);
		}
		function hn4ik24(users, serverTime) {
			const loadingState = document.getElementById('loading-state');
			const tableContainer = document.getElementById('users-table-container');
			const emptyState = document.getElementById('empty-state');
			const tbody = document.getElementById('users-tbody');
			if (users.length === 0) {
				loadingState.classList.add('hidden');
				emptyState.classList.remove('hidden');
				tableContainer.classList.add('hidden');
				if (window.allUsers && window.allUsers.length > 0) {
					emptyState.querySelector('p').innerText = '\u06A9\u0627\u0631\u0628\u0631\u06CC \u0628\u0627 \u0645\u0634\u062E\u0635\u0627\u062A \u062C\u0633\u062A\u062C\u0648 \u0634\u062F\u0647 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.';
				} else {
					emptyState.querySelector('p').innerText = '\u06A9\u0627\u0631\u0628\u0631\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F. \u0628\u0631\u0627\u06CC \u0633\u0627\u062E\u062A \u0627\u0648\u0644\u06CC\u0646 \u06A9\u0627\u0631\u0628\u0631 \u0631\u0648\u06CC \u062F\u06A9\u0645\u0647 \xAB + \xBB \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F \u06CC\u0627 \u0627\u0632 \u062F\u06A9\u0645\u0647 \u26A1\uFE0F \u0628\u0631\u0627\u06CC \u0627\u06CC\u062C\u0627\u062F \u0633\u0631\u06CC\u0639 \u06A9\u0627\u0631\u0628\u0631 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.';
				}
			} else {
				loadingState.classList.add('hidden');
				emptyState.classList.add('hidden');
				tableContainer.classList.remove('hidden');
				let proxyFlagCache = {};
				try { proxyFlagCache = JSON.parse(localStorage.getItem('pf_c2') || '{}'); } catch(e) {}
				tbody.innerHTML = users.map(user => {
					let daysRemaining = '\u0646\u0627\u0645\u062D\u062F\u0648\u062F';
					let daysPercent = 100;
					let isTimerPending = false;
					if (user.expiry_days) {
						if (user.start_on_first_connect === 1) {
							if (!user.first_connection_time) {
								daysRemaining = user.expiry_days;
								daysPercent = 100;
								isTimerPending = true;
							} else {
								const expiryDate = new Date(user.first_connection_time + (user.expiry_days * 24 * 60 * 60 * 1000));
								const diffDays = Math.ceil((expiryDate - new Date(serverTime)) / (1000 * 60 * 60 * 24));
								daysRemaining = diffDays > 0 ? diffDays : 0;
								daysPercent = Math.max(0, Math.min(100, (daysRemaining / user.expiry_days) * 100));
							}
						} else if (user.created_at) {
							const created = new Date(user.created_at);
							const expiryDate = new Date(created.getTime() + (user.expiry_days * 24 * 60 * 60 * 1000));
							const diffDays = Math.ceil((expiryDate - new Date(serverTime)) / (1000 * 60 * 60 * 24));
							daysRemaining = diffDays > 0 ? diffDays : 0;
							daysPercent = Math.max(0, Math.min(100, (daysRemaining / user.expiry_days) * 100));
						} else {
							daysRemaining = user.expiry_days;
						}
					}
					const usedGb = user.used_gb || 0;
					const formattedUsed = usedGb < 1 ? (usedGb * 1024).toFixed(0) + ' MB' : usedGb.toFixed(2) + ' GB';
					const usedReq = user.used_req || 0;
					let reqHtml = '';
					if (user.limit_req) {
						const reqPercent = Math.min((usedReq / user.limit_req) * 100, 100);
						const reqHue = 120 - (reqPercent * 1.2);
						reqHtml = '<div class="flex flex-col gap-1.5 w-full min-w-[65px] max-w-[90px] mx-auto select-none">' +
							'<div class="flex flex-row items-center justify-between text-[9px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">' +
								'<span class="text-gray-800 dark:text-zinc-200 leading-none font-bold" dir="ltr">' + usedReq.toLocaleString() + '</span>' +
								'<button data-user="' + encodeURIComponent(user.username) + '" data-action="req" onclick="resetUserData(this.dataset.user, this.dataset.action)" title="\u0631\u06CC\u0633\u062A" class="mx-1.5 w-3.5 h-3.5 flex items-center justify-center bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-full border border-amber-200 dark:border-amber-800 transition shadow-sm cursor-pointer flex-shrink-0"><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>' +
								'<span class="leading-none font-bold" dir="ltr">' + user.limit_req.toLocaleString() + '</span>' +
							'</div>' +
							'<div class="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">' +
								'<div class="h-full rounded-full transition-all duration-500" style="width: ' + reqPercent + '%; background-color: hsl(' + reqHue + ', 80%, 45%)"></div>' +
							'</div>' +
						'</div>';
					} else {
						reqHtml = '<div class="flex flex-col gap-1.5 w-full min-w-[65px] max-w-[90px] mx-auto select-none">' +
							'<div class="flex flex-row items-center justify-between text-[9px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">' +
								'<span class="text-gray-800 dark:text-zinc-200 leading-none font-bold" dir="ltr">' + usedReq.toLocaleString() + '</span>' +
								'<button data-user="' + encodeURIComponent(user.username) + '" data-action="req" onclick="resetUserData(this.dataset.user, this.dataset.action)" title="\u0631\u06CC\u0633\u062A" class="mx-1.5 w-3.5 h-3.5 flex items-center justify-center bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-full border border-amber-200 dark:border-amber-800 transition shadow-sm cursor-pointer flex-shrink-0"><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>' +
								'<span class="leading-none text-[12px] font-bold">\u221E</span>' +
							'</div>' +
							'<div class="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">' +
								'<div class="w-full h-full bg-blue-500 rounded-full transition-all duration-500"></div>' +
							'</div>' +
						'</div>';
					}
					let volumeHtml = '';
					if (user.limit_gb) {
						const limitPercent = Math.min((usedGb / user.limit_gb) * 100, 100);
						const limitHue = 120 - (limitPercent * 1.2);
						const formattedLimit = user.limit_gb < 1 ? (user.limit_gb * 1024).toFixed(0) + 'MB' : user.limit_gb + 'GB';
						const formattedUsedClean = usedGb < 1 ? (usedGb * 1024).toFixed(0) + 'MB' : usedGb.toFixed(2) + 'GB';
						volumeHtml = '<div class="flex flex-col gap-1.5 w-full min-w-[65px] max-w-[90px] mx-auto select-none">' +
							'<div class="flex flex-row items-center justify-between text-[9px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">' +
								'<span class="text-gray-800 dark:text-zinc-200 leading-none font-bold" dir="ltr">' + formattedUsedClean + '</span>' +
								'<button data-user="' + encodeURIComponent(user.username) + '" data-action="volume" onclick="resetUserData(this.dataset.user, this.dataset.action)" title="\u0631\u06CC\u0633\u062A" class="mx-1.5 w-3.5 h-3.5 flex items-center justify-center bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-full border border-amber-200 dark:border-amber-800 transition shadow-sm cursor-pointer flex-shrink-0"><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>' +
								'<span class="leading-none font-bold" dir="ltr">' + formattedLimit + '</span>' +
							'</div>' +
							'<div class="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">' +
								'<div class="h-full rounded-full transition-all duration-500" style="width: ' + limitPercent + '%; background-color: hsl(' + limitHue + ', 80%, 45%)"></div>' +
							'</div>' +
						'</div>';
					} else {
						const formattedUsedClean = usedGb < 1 ? (usedGb * 1024).toFixed(0) + 'MB' : usedGb.toFixed(2) + 'GB';
						volumeHtml = '<div class="flex flex-col gap-1.5 w-full min-w-[65px] max-w-[90px] mx-auto select-none">' +
							'<div class="flex flex-row items-center justify-between text-[9px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">' +
								'<span class="text-gray-800 dark:text-zinc-200 leading-none font-bold" dir="ltr">' + formattedUsedClean + '</span>' +
								'<button data-user="' + encodeURIComponent(user.username) + '" data-action="volume" onclick="resetUserData(this.dataset.user, this.dataset.action)" title="\u0631\u06CC\u0633\u062A" class="mx-1.5 w-3.5 h-3.5 flex items-center justify-center bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-full border border-amber-200 dark:border-amber-800 transition shadow-sm cursor-pointer flex-shrink-0"><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>' +
								'<span class="leading-none text-[12px] font-bold">\u221E</span>' +
							'</div>' +
							'<div class="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">' +
								'<div class="w-full h-full bg-blue-500 rounded-full transition-all duration-500"></div>' +
							'</div>' +
						'</div>';
					}
					let expiryHtml = '';
					if (user.expiry_days) {
						const expiryHue = daysPercent * 1.2;
						const remainingLabel = isTimerPending ? '<span class="text-blue-600 dark:text-blue-400 leading-none font-bold text-[8px]" dir="rtl" title="\u0634\u0645\u0627\u0631\u0634 \u067E\u0633 \u0627\u0632 \u0627\u0648\u0644\u06CC\u0646 \u0627\u062A\u0635\u0627\u0644 \u0622\u063A\u0627\u0632 \u0645\u06CC\u200C\u0634\u0648\u062F">' + daysRemaining + ' \u0631\u0648\u0632 (\u0627\u0648\u0644\u06CC\u0646 \u0627\u062A\u0635\u0627\u0644)</span>' : '<span class="text-gray-800 dark:text-zinc-200 leading-none font-bold" dir="rtl">' + daysRemaining + ' \u0631\u0648\u0632</span>';
						expiryHtml = '<div class="flex flex-col gap-1.5 w-full min-w-[65px] max-w-[90px] mx-auto select-none">' +
							'<div class="flex flex-row items-center justify-between text-[9px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">' +
								remainingLabel +
								'<button data-user="' + encodeURIComponent(user.username) + '" data-action="time" onclick="resetUserData(this.dataset.user, this.dataset.action)" title="\u0631\u06CC\u0633\u062A" class="mx-1.5 w-3.5 h-3.5 flex items-center justify-center bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-full border border-amber-200 dark:border-amber-800 transition shadow-sm cursor-pointer flex-shrink-0"><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>' +
								'<span class="leading-none font-bold" dir="rtl">' + user.expiry_days + ' \u0631\u0648\u0632</span>' +
							'</div>' +
							'<div class="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden flex justify-end">' +
								'<div class="h-full rounded-full transition-all duration-500" style="width: ' + daysPercent + '%; background-color: ' + (isTimerPending ? '#3b82f6' : 'hsl(' + expiryHue + ', 80%, 45%)') + '"></div>' +
							'</div>' +
						'</div>';
					} else {
						expiryHtml = '<div class="flex flex-col gap-1.5 w-full min-w-[65px] max-w-[90px] mx-auto select-none">' +
							'<div class="flex flex-row items-center justify-between text-[9px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">' +
								'<span class="text-gray-800 dark:text-zinc-200 leading-none font-bold text-[12px]">\u221E</span>' +
								'<button data-user="' + encodeURIComponent(user.username) + '" data-action="time" onclick="resetUserData(this.dataset.user, this.dataset.action)" title="\u0631\u06CC\u0633\u062A" class="mx-1.5 w-3.5 h-3.5 flex items-center justify-center bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-full border border-amber-200 dark:border-amber-800 transition shadow-sm cursor-pointer flex-shrink-0"><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>' +
								'<span class="leading-none text-[12px] font-bold">\u221E</span>' +
							'</div>' +
							'<div class="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">' +
								'<div class="w-full h-full bg-blue-500 rounded-full transition-all duration-500"></div>' +
							'</div>' +
						'</div>';
					}
					const onlineCount = user.online_count || 0;
					const limit = user.ip_limit !== undefined ? user.ip_limit : user.max_connections;
					let onlineHtml = '';
					if (limit) {
						const onlinePercent = Math.min((onlineCount / limit) * 100, 100);
						const onlineHue = 120 - (onlinePercent * 1.2);
						onlineHtml = '<div class="flex flex-col gap-1.5 w-full min-w-[65px] max-w-[90px] mx-auto select-none">' +
							'<div class="flex flex-row items-center justify-between text-[9px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">' +
								'<span class="text-gray-800 dark:text-zinc-200 leading-none font-bold" dir="ltr">' + onlineCount + '</span>' +
								'<span class="leading-none font-bold" dir="ltr">' + limit + '</span>' +
							'</div>' +
							'<div class="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">' +
								'<div class="h-full rounded-full transition-all duration-500" style="width: ' + onlinePercent + '%; background-color: hsl(' + onlineHue + ', 80%, 45%)"></div>' +
							'</div>' +
						'</div>';
					} else {
						onlineHtml = '<div class="flex flex-col gap-1.5 w-full min-w-[65px] max-w-[90px] mx-auto select-none">' +
							'<div class="flex flex-row items-center justify-between text-[9px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">' +
								'<span class="text-gray-800 dark:text-zinc-200 leading-none font-bold" dir="ltr">' + onlineCount + '</span>' +
								'<span class="leading-none text-[12px] font-bold">\u221E</span>' +
							'</div>' +
							'<div class="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">' +
								'<div class="h-full ' + (onlineCount > 0 ? 'bg-green-600' : 'bg-gray-400') + ' rounded-full transition-all duration-500" style="width: 100%"></div>' +
							'</div>' +
						'</div>';
					}
					let isExpired = false;
					if (user.limit_gb && (user.used_gb || 0) >= user.limit_gb) isExpired = true;
					if (user.limit_req && (user.used_req || 0) >= user.limit_req) isExpired = true;
					if (user.expiry_days) {
						if (user.start_on_first_connect === 1) {
							if (user.first_connection_time) {
								const expiryDate = new Date(user.first_connection_time + (user.expiry_days * 24 * 60 * 60 * 1000));
								if (new Date(serverTime) > expiryDate) isExpired = true;
							}
						} else if (user.created_at) {
							const created = new Date(user.created_at);
							const expiryDate = new Date(created.getTime() + (user.expiry_days * 24 * 60 * 60 * 1000));
							if (new Date(serverTime) > expiryDate) isExpired = true;
						}
					}
					const isEffectivelyActive = user.is_active !== 0 && !isExpired;
					const statusBtnColor = user.is_active === 0 ? 'text-green-700 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30' : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30';
					const statusBtnTitle = user.is_active === 0 ? '\u0641\u0639\u0627\u0644 \u06A9\u0631\u062F\u0646 \u06A9\u0627\u0631\u0628\u0631' : '\u0642\u0637\u0639 \u06A9\u0631\u062F\u0646 \u06A9\u0627\u0631\u0628\u0631';
					const statusBtnIcon = user.is_active === 0 
						? '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
						: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
					const isChecked = (window.selectedUsernames && window.selectedUsernames.has(user.username)) ? 'checked' : '';
					let locBadge = '';
					if (user.user_proxy_iata) {
						const iata = user.user_proxy_iata.toUpperCase();
						const flag = typeof b00aqjk === 'function' ? b00aqjk(iata) : '\u{1F310}';
						locBadge = '<div class="flex justify-center mt-1"><span title="\u06A9\u0634\u0648\u0631: ' + iata + '" class="text-base leading-none drop-shadow-[0_0_2px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">' + flag + '</span></div>';
					} else if (user.user_socks5 || user.user_proxy_ip) {
						let proxyList = [];
						try {
							if (user.user_socks5 && user.user_socks5.trim().startsWith("[")) {
								proxyList = JSON.parse(user.user_socks5);
							} else {
								proxyList = [user.user_socks5 || user.user_proxy_ip];
							}
						} catch(e) {
							proxyList = [user.user_socks5 || user.user_proxy_ip];
						}

						let numFlags = proxyList.length;
						let layout = [];
						if (numFlags === 1) layout = [1];
						else if (numFlags === 2) layout = [2];
						else if (numFlags === 3) layout = [3];
						else if (numFlags === 4) layout = [2, 2];
						else if (numFlags === 5) layout = [3, 2];
						else if (numFlags === 6) layout = [3, 3];
						else if (numFlags === 7) layout = [4, 3];
						else if (numFlags === 8) layout = [4, 4];
						else if (numFlags === 9) layout = [5, 4];
						else if (numFlags === 10) layout = [4, 4, 2];
						else if (numFlags === 11) layout = [4, 4, 3];
						else if (numFlags === 12) layout = [4, 4, 4];
						else if (numFlags === 13) layout = [5, 5, 3];
						else if (numFlags === 14) layout = [5, 5, 4];
						else {
							let remaining = numFlags;
							while (remaining > 0) {
								layout.push(Math.min(remaining, 5));
								remaining -= 5;
							}
						}

						let flagSizeClass = 'text-base';
						if (numFlags > 12) flagSizeClass = 'text-[9px]';
						else if (numFlags >= 9) flagSizeClass = 'text-[10px]';
						else if (numFlags > 4) flagSizeClass = 'text-xs';

						const flagsHtmlArray = proxyList.map(item => {
							const targetProxy = typeof item === 'object' && item !== null ? item.proxy : item;
							const targetCountry = typeof item === 'object' && item !== null ? item.country : null;
							if (targetCountry && typeof b00aqjk === 'function') {
								return '<span title="\u06A9\u0634\u0648\u0631: ' + targetCountry + '" class="' + flagSizeClass + ' leading-none drop-shadow-[0_0_2px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] flex items-center justify-center">' + b00aqjk(targetCountry) + '</span>';
							}
							const cachedFlag = proxyFlagCache[targetProxy];
							if (cachedFlag && typeof cachedFlag === 'string' && /^[a-zA-Z]{2}$/.test(cachedFlag) && typeof b00aqjk === 'function') {
								return '<span title="\u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC \u0627\u062E\u062A\u0635\u0627\u0635\u06CC" class="' + flagSizeClass + ' leading-none drop-shadow-[0_0_2px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] flex items-center justify-center">' + b00aqjk(cachedFlag) + '</span>';
							} else {
								return '<span data-proxy="' + targetProxy + '" title="\u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC \u0627\u062E\u062A\u0635\u0627\u0635\u06CC" class="async-proxy-flag ' + flagSizeClass + ' leading-none drop-shadow-[0_0_2px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] flex items-center justify-center">\u23F3</span>';
							}
						});

						let rowsHtml = '';
						let startIndex = 0;
						for (let r = 0; r < layout.length; r++) {
							let rowCount = layout[r];
							let rowItems = flagsHtmlArray.slice(startIndex, startIndex + rowCount).join('');
							rowsHtml += '<div class="flex justify-center gap-0.5">' + rowItems + '</div>';
							startIndex += rowCount;
						}
						locBadge = '<div class="flex flex-col gap-0.5 justify-center items-center mt-1 w-max mx-auto" dir="ltr">' + rowsHtml + '</div>';
					}
					let proxyListConfig = [];
					try {
						if (user.user_socks5 && user.user_socks5.trim().startsWith("[")) {
							proxyListConfig = JSON.parse(user.user_socks5);
						} else if (user.user_socks5 || user.user_proxy_ip) {
							proxyListConfig = [user.user_socks5 || user.user_proxy_ip];
						} else {
							proxyListConfig = [null];
						}
					} catch(e) {
						proxyListConfig = [user.user_socks5 || user.user_proxy_ip];
					}
					if (!Array.isArray(proxyListConfig) || proxyListConfig.length === 0) proxyListConfig = [null];
					let hasDir = proxyListConfig.some(function(p) { return p === null || p === ""; });
					if (!hasDir) proxyListConfig.push(null);
					let numProxies = proxyListConfig.length;
					let numIps = user.ips ? user.ips.split('\\n').filter(function(ip) { return ip.trim().length > 0; }).length : 1;
					if (numIps === 0) numIps = 1;
					let numPorts = String(user.port || '443').split(',').filter(function(p) { return p.trim().length > 0; }).length;
					if (numPorts === 0) numPorts = 1;
					let pfCount = wbfdlk4(user);
					let protoCount = (pfCount.vless ? 1 : 0) + (pfCount.trojan ? 1 : 0) + (pfCount.ss ? 1 : 0);
					if (protoCount === 0) protoCount = 1;
					let totalConfigs = numProxies * numIps * numPorts * protoCount;
					let configColorClass = 'text-green-800 dark:text-green-700';
					if (totalConfigs > 100) configColorClass = 'text-red-600 dark:text-red-500';
					else if (totalConfigs > 80) configColorClass = 'text-orange-500';
					else if (totalConfigs > 50) configColorClass = 'text-amber-500';
					else if (totalConfigs > 20) configColorClass = 'text-green-500';
					let configsCountHtml = '<span class="font-black text-base ' + configColorClass + '" dir="ltr">' + totalConfigs + '</span>';
					return '<tr class="group transition-all drop-shadow-sm bg-white/40 dark:bg-zinc-900/20" data-username="' + user.username + '">' +
								'<td class="bg-white/60 dark:bg-zinc-900/40  group-hover:bg-white/80 dark:group-hover:bg-zinc-900/60 p-1 rounded-r-md border-y border-r border-gray-200 dark:border-zinc-800 text-center select-none">' +
									'<div class="flex items-center justify-center gap-1">' +
										'<input type="checkbox" name="select-user" value="' + encodeURIComponent(user.username) + '" onchange="onUserSelectChange(this)" ' + isChecked + ' class="w-4 h-4 rounded-md border-2 border-gray-300 dark:border-zinc-700 text-blue-600 bg-white dark:bg-zinc-800 checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500/50 focus:ring-offset-0 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95">' +
										'<span class="drag-handle text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 cursor-grab active:cursor-grabbing font-bold text-base select-none px-1" title="\u062C\u0627\u0628\u062C\u0627\u06CC\u06CC">\u2630</span>' +
									'</div>' +
								'</td>' +
								'<td class="bg-white/60 dark:bg-zinc-900/40  group-hover:bg-white/80 dark:group-hover:bg-zinc-900/60 p-1.5 border-y border-gray-200 dark:border-zinc-800 text-center">' +
									'<div class="flex flex-col items-center justify-center gap-1.5 w-full max-w-[120px] mx-auto select-none">' +
										'<div class="flex flex-row items-center justify-center gap-1">' +
											(!isEffectivelyActive ? '<span class="px-1 py-0 h-3.5 inline-flex items-center justify-center leading-none text-[9px] font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded">\u063A\u06CC\u0631\u0641\u0639\u0627\u0644</span>' : '<span class="px-1 py-0 h-3.5 inline-flex items-center justify-center leading-none text-[9px] font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded">\u0641\u0639\u0627\u0644</span>') +
											(user.is_online === 1 ? '<span class="px-1 py-0 h-3.5 inline-flex items-center justify-center leading-none text-[9px] font-medium bg-green-600 text-white rounded animate-pulse" dir="rtl">' + user.online_count + '</span>' : '<span class="px-1 py-0 h-3.5 inline-flex items-center justify-center leading-none text-[9px] font-medium bg-gray-200 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400 rounded">\u0622\u0641\u0644\u0627\u06CC\u0646</span>') +
										'</div>' +
										'<span class="font-bold text-gray-900 dark:text-zinc-100 text-xs truncate max-w-full pt-0.5 leading-normal">' + user.username + '</span>' +
										locBadge +
									'</div>' +
								'</td>' +
								'<td class="bg-white/60 dark:bg-zinc-900/40  group-hover:bg-white/80 dark:group-hover:bg-zinc-900/60 p-1.5 border-y border-gray-200 dark:border-zinc-800 text-center">' +
									'<div class="grid grid-cols-2 gap-1 w-max mx-auto">' +
										'<button data-user="' + encodeURIComponent(user.username) + '" onclick="copyConfig(this.dataset.user)" title="\u06A9\u067E\u06CC \u06A9\u0640\u0627\u0646\u0641\u0640\u06CC\u06AF" class="w-[24px] h-[24px] p-0 flex items-center justify-center bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-full transition shadow-sm"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button>' +
										'<button data-user="' + encodeURIComponent(user.username) + '" onclick="editUser(this.dataset.user)" title="\u0648\u06CC\u0631\u0627\u06CC\u0634" class="w-[24px] h-[24px] p-0 flex items-center justify-center bg-green-50 dark:bg-green-950/40 border border-green-300 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/60 text-green-600 dark:text-green-400 rounded-full transition shadow-sm"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>' +
										'<button data-user="' + encodeURIComponent(user.username) + '" onclick="deleteUser(this.dataset.user)" title="\u062D\u0630\u0641" class="w-[24px] h-[24px] p-0 flex items-center justify-center bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-full transition shadow-sm"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>' +
										'<button data-user="' + encodeURIComponent(user.username) + '" onclick="toggleUserStatus(this.dataset.user)" title="' + statusBtnTitle + '" class="w-[24px] h-[24px] p-0 flex items-center justify-center bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 ' + statusBtnColor + ' rounded-full transition shadow-sm">' + statusBtnIcon + '</button>' +
									'</div>' +
								'</td>' +
								'<td class="bg-white/60 dark:bg-zinc-900/40  group-hover:bg-white/80 dark:group-hover:bg-zinc-900/60 p-1.5 border-y border-gray-200 dark:border-zinc-800">' +
									'<div class="flex flex-col gap-1 w-[100px] mx-auto">' +
										'<button data-user="' + encodeURIComponent(user.username) + '" onclick="copySubLink(this.dataset.user)" class="w-full h-[24px] p-0 flex items-center justify-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-full text-[9px] font-bold transition border border-indigo-200 dark:border-indigo-800">' +
											'<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>' +
											'\u0633\u0627\u0628 \u0645\u062A\u0646\u06CC' +
										'</button>' +
										'<div class="flex flex-row gap-1 w-full h-[24px]">' +
											'<button data-user="' + encodeURIComponent(user.username) + '" onclick="copySingboxLink(this.dataset.user)" class="flex-1 h-[24px] p-0 flex items-center justify-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-full text-[9px] font-bold transition border border-purple-200 dark:border-purple-800 whitespace-nowrap">' +
												'<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>' +
												'Sing-box' +
											'</button>' +
											'<button data-user="' + encodeURIComponent(user.username) + '" onclick="showSingboxQr(this.dataset.user)" title="QR Sing-box" class="w-[24px] h-[24px] flex-shrink-0 p-0 flex items-center justify-center bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-full transition border border-purple-200 dark:border-purple-800">' +
												'<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 19h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>' +
											'</button>' +
										'</div>' +
										'<div class="flex flex-row gap-1 w-full h-[24px]">' +
											'<button data-user="' + encodeURIComponent(user.username) + '" onclick="copyStatusLink(this.dataset.user)" class="flex-1 h-[24px] p-0 flex items-center justify-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full text-[9px] font-bold transition border border-green-200 dark:border-green-800 whitespace-nowrap">' +
												'<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>' +
												'\u0648\u0636\u0639\u06CC\u062A' +
											'</button>' +
											'<button data-user="' + encodeURIComponent(user.username) + '" onclick="showSubQr(this.dataset.user)" title="QR \u0633\u0627\u0628" class="w-[24px] h-[24px] flex-shrink-0 p-0 flex items-center justify-center bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-full transition border border-amber-200 dark:border-amber-800">' +
												'<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 19h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>' +
											'</button>' +
										'</div>' +
									'</div>' +
								'</td>' +
								'<td class="bg-white/60 dark:bg-zinc-900/40  group-hover:bg-white/80 dark:group-hover:bg-zinc-900/60 p-1 border-y border-gray-200 dark:border-zinc-800 text-center">' + configsCountHtml + '</td>' +
								'<td class="bg-white/60 dark:bg-zinc-900/40  group-hover:bg-white/80 dark:group-hover:bg-zinc-900/60 p-1 border-y border-gray-200 dark:border-zinc-800 text-xs">' +
									(function() {
										var pts = String(user.port || "").split(",").map(function(p){ return p.trim(); }).filter(function(p){ return p !== ""; });
										if (pts.length === 0) return "";
										var r = Math.min(pts.length, 3);
										return '<div class="grid grid-flow-col gap-1 w-max mx-auto items-center" style="grid-template-rows: repeat(' + r + ', auto);">' +
											pts.map(function(p) {
												var isTls = tlsPorts.includes(p);
												var isNonTls = nonTlsPorts.includes(p);
												var colorClass = isTls ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
																 isNonTls ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
																 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
												return '<span class="inline-flex items-center justify-center px-1.5 h-[18px] text-[10px] font-semibold rounded ' + colorClass + '">' + p + '</span>';
											}).join("") +
										'</div>';
									})() +
								'</td>' +
								'<td class="bg-white/60 dark:bg-zinc-900/40  group-hover:bg-white/80 dark:group-hover:bg-zinc-900/60 p-1.5 border-y border-gray-200 dark:border-zinc-800">' + volumeHtml + '</td>' +
								'<td class="bg-white/60 dark:bg-zinc-900/40  group-hover:bg-white/80 dark:group-hover:bg-zinc-900/60 p-1.5 border-y border-gray-200 dark:border-zinc-800">' + reqHtml + '</td>' +
								'<td class="bg-white/60 dark:bg-zinc-900/40  group-hover:bg-white/80 dark:group-hover:bg-zinc-900/60 p-1.5 border-y border-gray-200 dark:border-zinc-800">' + expiryHtml + '</td>' +
								'<td class="bg-white/60 dark:bg-zinc-900/40  group-hover:bg-white/80 dark:group-hover:bg-zinc-900/60 p-1.5 rounded-l-md border-y border-l border-gray-200 dark:border-zinc-800">' + onlineHtml + '</td>' +
								'</tr>';
				}).join('');
				i5ta7ay();
				if (typeof y9x0sl1 === 'function') {
					setTimeout(y9x0sl1, 50);
				}
				if (window.usersSortable) {
					window.usersSortable.destroy();
				}
				window.usersSortable = new Sortable(document.getElementById('users-tbody'), {
					handle: '.drag-handle',
					animation: 250,
					ghostClass: "opacity-30",
					delay: 200,
					delayOnTouchOnly: true,
					touchStartThreshold: 5,
					onChoose: function () {
						window.isDraggingRow = true;
					},
					onUnchoose: function () {
						window.isDraggingRow = false;
					},
					onStart: function () {
						window.isDraggingRow = true;
					},
					onEnd: function (evt) {
						window.isDraggingRow = false;
						const newOrder = Array.from(evt.to.children).map(tr => tr.getAttribute('data-username')).filter(Boolean);
						localStorage.setItem('uo_k3', JSON.stringify(newOrder));
					}
				});
			}
		}
		async function resetUserData(encodedUsername, actionType) {
			const username = decodeURIComponent(encodedUsername);
			let actionName = '';
			if (actionType === 'volume') actionName = '\u062D\u062C\u0645';
			else if (actionType === 'req') actionName = '\u0631\u06CC\u06A9\u0648\u0626\u0633\u062A';
			else if (actionType === 'time') actionName = '\u0632\u0645\u0627\u0646';
			if (await pw6sr5c('\u0622\u06CC\u0627 \u0627\u0632 \u0631\u06CC\u0633\u062A \u06A9\u0631\u062F\u0646 ' + actionName + ' \u06A9\u0627\u0631\u0628\u0631 ' + username + ' \u0645\u0637\u0645\u0626\u0646 \u0647\u0633\u062A\u06CC\u062F\u061F')) {
				try {
					const response = await fetch('/api/users/' + encodeURIComponent(username), {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ reset_action: actionType })
					});
					if (response.ok) {
						alert('\u0639\u0645\u0644\u06CC\u0627\u062A \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0646\u062C\u0627\u0645 \u0634\u062F.');
						await axmsbp4(true);
					} else {
						const errData = await response.json();
						alert('\u062E\u0637\u0627: ' + (errData.error || '\u0639\u0645\u0644\u06CC\u0627\u062A \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F'));
					}
				} catch (err) {
					alert('\u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
				}
			}
		}
		async function toggleUserStatus(encodedUsername) {
			const username = decodeURIComponent(encodedUsername);
			try {
				const response = await fetch('/api/users/' + encodeURIComponent(username), {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ toggle_only: true })
				});
				if (response.ok) {
					await axmsbp4(true);
				} else {
					const errData = await response.json();
					alert('\u062E\u0637\u0627: ' + (errData.error || '\u0639\u0645\u0644\u06CC\u0627\u062A \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F'));
				}
			} catch (err) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
			}
		}
		async function handleFormSubmit(event) {
			event.preventDefault();
			jutlx8s(isEditMode ? '\u062F\u0631 \u062D\u0627\u0644 \u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A...' : '\u062F\u0631 \u062D\u0627\u0644 \u0627\u06CC\u062C\u0627\u062F...', true);
			const username = document.getElementById('input-name').value;
			const usernameRegex = /^[a-zA-Z0-9_-]+$/;
			if (!usernameRegex.test(username)) {
				alert('\u26A0\uFE0F \u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0641\u0642\u0637 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0634\u0627\u0645\u0644 \u062D\u0631\u0648\u0641 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC\u060C \u0627\u0639\u062F\u0627\u062F\u060C \u062E\u0637 \u062A\u06CC\u0631\u0647 (-) \u0648 \u0622\u0646\u062F\u0631\u0644\u0627\u06CC\u0646 (_) \u0628\u0627\u0634\u062F!');
				jutlx8s(isEditMode ? '\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A' : '\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631', false);
				return;
			}
			const limit = document.getElementById('input-limit').value || null;
			const expiry = document.getElementById('input-expiry').value || null;
			const reqLimit = document.getElementById('input-req-limit').value || null;
			const ipLimit = document.getElementById('input-ip-limit').value || null;
			if (limit !== null && parseFloat(limit) < 0) { alert('\u26A0\uFE0F \u062D\u062C\u0645 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0639\u062F\u062F \u0645\u0646\u0641\u06CC \u0628\u0627\u0634\u062F!'); jutlx8s(isEditMode ? '\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A' : '\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631', false); return; }
			if (expiry !== null && parseInt(expiry) < 0) { alert('\u26A0\uFE0F \u0632\u0645\u0627\u0646 (\u0631\u0648\u0632) \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0639\u062F\u062F \u0645\u0646\u0641\u06CC \u0628\u0627\u0634\u062F!'); jutlx8s(isEditMode ? '\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A' : '\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631', false); return; }
			if ((reqLimit !== null && parseInt(reqLimit) < 0) || (ipLimit !== null && parseInt(ipLimit) < 0)) { alert('\u26A0\uFE0F \u0645\u062D\u062F\u0648\u062F\u06CC\u062A\u200C\u0647\u0627 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u0646\u062F \u0645\u0646\u0641\u06CC \u0628\u0627\u0634\u0646\u062F!'); jutlx8s(isEditMode ? '\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A' : '\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631', false); return; }
			const autoResetToggle = document.getElementById('input-auto-reset-toggle').checked;
			const autoResetVolDays = document.getElementById('input-auto-reset-vol').value;
			const autoResetReqDays = document.getElementById('input-auto-reset-req').value;
			if (autoResetToggle) {
				const volDays = parseInt(autoResetVolDays) || 0;
				const reqDays = parseInt(autoResetReqDays) || 0;
				if (volDays <= 0 && reqDays <= 0) {
					alert('\u26A0\uFE0F \u0648\u0642\u062A\u06CC \u062A\u06CC\u06A9 \u062A\u0645\u062F\u06CC\u062F \u062E\u0648\u062F\u06A9\u0627\u0631 \u0631\u0648\u0634\u0646 \u0627\u0633\u062A\u060C \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06CC\u06A9\u06CC \u0627\u0632 \u0641\u06CC\u0644\u062F\u0647\u0627 (\u0632\u0645\u0627\u0646 \u062A\u0645\u062F\u06CC\u062F \u062D\u062C\u0645 \u06CC\u0627 \u0631\u06CC\u06A9\u0648\u0626\u0633\u062A) \u0631\u0627 \u067E\u0631 \u06A9\u0646\u06CC\u062F!');
					jutlx8s(isEditMode ? '\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A' : '\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631', false);
					return;
				}
			}
			const customPortsRaw = document.getElementById('input-custom-ports') ? document.getElementById('input-custom-ports').value : '';
			const customPortsArray = customPortsRaw.replace(/ +/g, ',').split(',').map(p => p.trim()).filter(p => p.length > 0);
			const checkedPorts = Array.from(document.querySelectorAll('input[name="ports"]:checked')).map(cb => cb.value).concat(customPortsArray);
			const block_porn = document.getElementById('input-block-porn').checked ? 1 : 0;
			const block_ads = document.getElementById('input-block-ads').checked ? 1 : 0;
			const enable_direct = document.getElementById('input-enable-direct') ? (document.getElementById('input-enable-direct').checked ? 1 : 0) : 1;
			const isFragEnabled = document.getElementById('input-frag-toggle').checked;
			const frag_len = isFragEnabled ? (document.getElementById('input-frag-len').value || "200-3000") : "";
			const frag_int = isFragEnabled ? (document.getElementById('input-frag-int').value || "1-2") : "";
			const isAutoReset = document.getElementById('input-auto-reset-toggle').checked;
			const auto_reset_vol_days = isAutoReset ? parseInt(document.getElementById('input-auto-reset-vol').value) || 0 : 0;
			const auto_reset_req_days = isAutoReset ? parseInt(document.getElementById('input-auto-reset-req').value) || 0 : 0;
			const auto_rotate_ip = parseInt(document.getElementById('hidden-auto-rotate').value) || 0;
			const rotate_time = parseInt(document.getElementById('hidden-rotate-time').value) || 0;
			const ip_operator = document.getElementById('hidden-ip-operator').value || 'all';
			const ip_count = parseInt(document.getElementById('hidden-ip-count').value) || 20;
			const userProxyMode = document.getElementById('user-proxy-mode-toggle') ? document.getElementById('user-proxy-mode-toggle').checked : false;
			let userSocks5 = null;
			if (userProxyMode && window.proxyFieldsData && window.proxyFieldsData.length > 0) {
				const cleanProxies = window.proxyFieldsData.map(p => p ? p.trim() : "").filter(p => p !== "");
				if (cleanProxies.length === 1) {
					userSocks5 = cleanProxies[0];
				} else if (cleanProxies.length > 1) {
					userSocks5 = JSON.stringify(cleanProxies);
				}
			}
			const auto_rotate_user_proxy = document.getElementById('input-auto-rotate-user-proxy') ? (document.getElementById('input-auto-rotate-user-proxy').checked ? 1 : 0) : 0;
			const start_on_first_connect = document.getElementById('input-start-on-first-connect') ? (document.getElementById('input-start-on-first-connect').checked ? 1 : 0) : 0;
			const isAdvancedSettingsOn = document.getElementById('input-advanced-settings-toggle') ? document.getElementById('input-advanced-settings-toggle').checked : false;
			const advanced_frag = (isAdvancedSettingsOn && document.getElementById('input-advanced-frag')) ? document.getElementById('input-advanced-frag').value.trim() : "";
			const cipher_suites = (isAdvancedSettingsOn && document.getElementById('input-cipher-suites')) ? document.getElementById('input-cipher-suites').value.trim() : "";
			const tls_mask = (isAdvancedSettingsOn && document.getElementById('input-tls-mask')) ? document.getElementById('input-tls-mask').value.trim() : "";
			if (checkedPorts.length === 0) {
				alert('\u26A0\uFE0F \u0644\u0637\u0641\u0627 \u062D\u062F\u0627\u0642\u0644 \u06CC\u06A9 \u067E\u0648\u0631\u062A \u0631\u0627 \u0628\u0631\u0627\u06CC \u0627\u062A\u0635\u0627\u0644 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F!');
				jutlx8s(isEditMode ? '\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A' : '\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631', false);
				return;
			}
			const port = checkedPorts.join(',');
			const tls = checkedPorts.some(p => tlsPorts.includes(p)) ? 'on' : 'off';
			const ips = document.getElementById('input-ips').value;
			const fingerprint = document.getElementById('fingerprint-select').value;
			const selectedProtocols = [];
			const cbV = document.getElementById('input-proto-vless');
			const cbT = document.getElementById('input-proto-trojan');
			const cbS = document.getElementById('input-proto-ss');
			if (!cbV || cbV.checked) selectedProtocols.push('vl' + 'e' + 'ss');
			if (cbT && cbT.checked) selectedProtocols.push('trojan');
			if (cbS && cbS.checked) selectedProtocols.push('shadowsocks');
			if (selectedProtocols.length === 0) selectedProtocols.push('vl' + 'e' + 'ss');
			const url = isEditMode ? '/api/users/' + encodeURIComponent(editingUsername) : '/api/users';
			const method = isEditMode ? 'PUT' : 'POST';
			try {
				const response = await fetch(url, {
					method: method,
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ 
						username, limit_gb: limit, expiry_days: expiry, limit_req: reqLimit, tls, port, ips, fingerprint, ip_limit: ipLimit, block_porn: block_porn, block_ads: block_ads, enable_direct: enable_direct, frag_len: frag_len, frag_int: frag_int,
						user_proxy_iata: (userProxyMode && document.getElementById('input-user-iata-toggle') && document.getElementById('input-user-iata-toggle').checked) ? ((document.getElementById('input-user-proxy-iata') && document.getElementById('input-user-proxy-iata').value.trim().toUpperCase()) || window.userProxyIata || null) : null,
						user_ipv6_enabled: (document.getElementById('input-user-ipv6-toggle') && document.getElementById('input-user-ipv6-toggle').checked) ? 1 : 0,
						user_socks5: userSocks5 || null,
						user_proxy_ip: null,
						auto_reset_vol_days: auto_reset_vol_days,
						auto_reset_req_days: auto_reset_req_days,
						auto_rotate_ip: auto_rotate_ip,
						rotate_time: rotate_time,
						ip_operator: ip_operator,
						ip_count: ip_count,
						auto_rotate_user_proxy: auto_rotate_user_proxy,
						start_on_first_connect: start_on_first_connect,
						advanced_frag: advanced_frag || null,
						cipher_suites: cipher_suites || null,
						tls_mask: tls_mask || null,
						protocols: selectedProtocols
					})
				});
				if (response.ok) {
					toggleModal(false);
					await axmsbp4(true);
				} else {
					const errData = await response.json();
					alert('\u062E\u0637\u0627: ' + (errData.error || '\u0639\u0645\u0644\u06CC\u0627\u062A \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F'));
				}
			} catch (err) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
			} finally {
				jutlx8s(isEditMode ? '\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A' : '\u0627\u06CC\u062C\u0627\u062F \u06A9\u0627\u0631\u0628\u0631', false);
			}
		}
window.activeProxyIndex = 0;
window.proxyFieldsData = [""];
window.userProxyIata = null;
window.updateUserIataPreview = function() {
	const input = document.getElementById('input-user-proxy-iata');
	const preview = document.getElementById('user-iata-flag-preview');
	if (!preview) return;
	const code = (input && input.value ? input.value : (window.userProxyIata || '')).trim().toUpperCase();
	if (code && /^[A-Z]{2}$/.test(code) && typeof b00aqjk === 'function') {
		preview.innerText = b00aqjk(code);
	} else {
		preview.innerText = '\u{1F310}';
	}
};
window.renderProxyFieldsUI = function() {
	const wrapper = document.getElementById("proxies-fields-wrapper");
	const addBtn = document.getElementById("add-proxy-field-btn");
	if (!wrapper) return;
	wrapper.innerHTML = "";
	window.proxyFieldsData.forEach((val, idx) => {
		const isFocused = idx === window.activeProxyIndex;
		const borderClass = isFocused ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200 dark:border-amoled-border";
		const row = document.createElement("div");
		row.className = "flex flex-col gap-0.5 w-full";
		const proxyStr = (val || "").trim();
		const pingObj = proxyStr ? (window.proxyPingMap && window.proxyPingMap[proxyStr]) : null;
		const pingClass = pingObj ? pingObj.className : "text-[10px] font-bold text-center empty:hidden min-h-[0px] transition-colors";
		const pingText = pingObj ? pingObj.text : "";
		let inputRow = '<div class="flex items-center gap-1 w-full">' +
			'<button type="button" onclick="swapProxyFieldUI(' + idx + ')" class="w-7 h-7 flex-shrink-0 bg-transparent border-2 border-green-500 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded flex items-center justify-center font-bold text-xs shadow-sm transition-all" title="\u062C\u0627 \u0628\u0647 \u062C\u0627\u06CC\u06CC \u067E\u0631\u0648\u06A9\u0633\u06CC"><svg id="swap-icon-' + idx + '" class="w-3.5 h-3.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg></button>' +
			'<input type="text" value="' + (val || "") + '" onfocus="setActiveProxyField(' + idx + ')" onclick="setActiveProxyField(' + idx + ')" oninput="updateProxyFieldData(' + idx + ', this.value)" placeholder="socks5:// \u06CC\u0627 http:// (\u06A9\u0634\u0648\u0631 ' + (idx + 1) + ')" dir="ltr" class="flex-1 px-2 py-1.5 bg-gray-50 dark:bg-slate-900 border ' + borderClass + ' rounded text-xs font-mono focus:outline-none text-gray-800 dark:text-zinc-100 transition">';
		if (idx > 0) {
			inputRow += '<button type="button" onclick="removeProxyFieldUI(' + idx + ')" class="w-7 h-7 flex-shrink-0 bg-transparent border-2 border-red-500 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center justify-center font-bold text-xs shadow-sm" title="\u062D\u0630\u0641"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
		}
		inputRow += '</div><span id="proxy-ping-label-' + idx + '" class="' + pingClass + '">' + pingText + '</span>';
		row.innerHTML = inputRow;
		wrapper.appendChild(row);
	});
	if (addBtn) {
		addBtn.style.display = window.proxyFieldsData.length >= 5 ? "none" : "flex";
	}
};
window.setActiveProxyField = function(idx) {
	if (window.activeProxyIndex === idx) return;
	window.activeProxyIndex = idx;
	const wrapper = document.getElementById("proxies-fields-wrapper");
	if (wrapper) {
		const inputs = wrapper.querySelectorAll("input[type='text']");
		inputs.forEach((inp, i) => {
			if (i === idx) {
				inp.classList.remove("border-gray-200", "dark:border-amoled-border");
				inp.classList.add("ring-2", "ring-blue-500", "border-blue-500");
			} else {
				inp.classList.remove("ring-2", "ring-blue-500", "border-blue-500");
				inp.classList.add("border-gray-200", "dark:border-amoled-border");
			}
		});
	}
};
window.updateProxyFieldData = function(idx, val) {
	window.proxyFieldsData[idx] = val;
	const span = document.getElementById('proxy-ping-label-' + idx);
	if (span) {
		span.innerText = '';
		span.className = 'text-[10px] font-bold text-center empty:hidden transition-colors';
	}
};
window.addProxyFieldUI = function() {
	if (window.proxyFieldsData.length < 5) {
		window.proxyFieldsData.push("");
		window.activeProxyIndex = window.proxyFieldsData.length - 1;
		window.renderProxyFieldsUI();
		setTimeout(() => {
			const wrapper = document.getElementById("proxies-fields-wrapper");
			if (wrapper) {
				const inputs = wrapper.querySelectorAll("input[type='text']");
				if (inputs[window.activeProxyIndex]) inputs[window.activeProxyIndex].focus();
			}
		}, 10);
	}
};
window.removeProxyFieldUI = function(idx) {
	if (window.proxyFieldsData.length > 1) {
		window.proxyFieldsData.splice(idx, 1);
		if (window.activeProxyIndex >= window.proxyFieldsData.length) {
			window.activeProxyIndex = window.proxyFieldsData.length - 1;
		}
		window.renderProxyFieldsUI();
	}
};
window.swapProxyFieldUI = async function(idx) {
	const currentProxy = (window.proxyFieldsData[idx] || "").trim();
	if (!currentProxy) {
		alert("\u26A0\uFE0F \u0627\u0628\u062A\u062F\u0627 \u06CC\u06A9 \u067E\u0631\u0648\u06A9\u0633\u06CC \u062F\u0631 \u0627\u06CC\u0646 \u0641\u06CC\u0644\u062F \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F!");
		return;
	}
	const icon = document.getElementById('swap-icon-' + idx);
	if (icon) icon.classList.add('animate-spin');
	
	let countryCode = "UN";
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 2000);
		const res = await fetch('/api/test-proxy', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ proxy: currentProxy }),
			signal: controller.signal
		});
		clearTimeout(timeoutId);
		const data = await res.json();
		if (res.ok && data.success && data.country && data.country !== "UN") {
			countryCode = data.country.toUpperCase();
		}
	} catch(e) {}
	let candidateProxies = [];
	let isRandomFallback = true;
	try {
		const resVip = await ggsyffs('vipprox.txt?t=' + Date.now());
		if (resVip.ok) {
			const text = await resVip.text();
			const lines = text.split('\\n').map(l => l.trim()).filter(l => l.length > 5);
			candidateProxies = candidateProxies.concat(lines);
		}
	} catch(e) {}
	candidateProxies = [...new Set(candidateProxies)];
	const alternatives = candidateProxies.filter(p => p !== currentProxy);
	if (alternatives.length > 0) {
		const newProxy = alternatives[Math.floor(Math.random() * alternatives.length)];
		window.proxyFieldsData[idx] = newProxy;
		if (countryCode !== "UN" && !isRandomFallback) {
			bm3pzm2('\u2705 \u067E\u0631\u0648\u06A9\u0633\u06CC \u0627\u062E\u062A\u0635\u0627\u0635\u06CC (VIP) \u0627\u0632 \u06A9\u0634\u0648\u0631 ' + countryCode + ' \u062C\u0627\u06CC\u06AF\u0632\u06CC\u0646 \u0634\u062F.');
		} else {
			bm3pzm2('\u2705 \u06CC\u06A9 \u067E\u0631\u0648\u06A9\u0633\u06CC \u0627\u062E\u062A\u0635\u0627\u0635\u06CC (VIP) \u0633\u0627\u0644\u0645 \u0628\u0647 \u0635\u0648\u0631\u062A \u0631\u0646\u062F\u0648\u0645 \u062C\u0627\u06CC\u06AF\u0632\u06CC\u0646 \u0634\u062F.');
		}
		if (countryCode && countryCode !== "UN") {
			window.userProxyIata = countryCode;
			const iataInput = document.getElementById('input-user-proxy-iata');
			if (iataInput) iataInput.value = countryCode;
			if (typeof window.updateUserIataPreview === 'function') window.updateUserIataPreview();
		}
	} else {
		window.proxyFieldsData[idx] = currentProxy;
		bm3pzm2('\u26A0\uFE0F \u0647\u06CC\u0686 \u067E\u0631\u0648\u06A9\u0633\u06CC \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u062C\u0627\u06CC\u06AF\u0632\u06CC\u0646\u06CC \u062F\u0631 \u0645\u062E\u0632\u0646 VIP \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!');
	}
	if (typeof window.renderProxyFieldsUI === 'function') window.renderProxyFieldsUI();
	testUserSocksProxy();
};
function ys5v6m0(modalId, show) {
			const modal = document.getElementById(modalId);
			if (!modal) return;
			const card = modal.querySelector('div');
			if (show) {
				modal.classList.remove('opacity-0', 'pointer-events-none');
				modal.classList.add('opacity-100', 'pointer-events-auto');
				card.classList.remove('opacity-0', 'scale-95');
				card.classList.add('opacity-100', 'scale-100');
			} else {
				modal.classList.remove('opacity-100', 'pointer-events-auto');
				modal.classList.add('opacity-0', 'pointer-events-none');
				card.classList.remove('opacity-100', 'scale-100');
				card.classList.add('opacity-0', 'scale-95');
			}
		}
window.deferredPwaPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	window.deferredPwaPrompt = e;
});
window.addEventListener('appinstalled', () => {
	window.deferredPwaPrompt = null;
	bm3pzm2('\u2705 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646 \u0632\u0626\u0648\u0633 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0631\u0648\u06CC \u062F\u0633\u062A\u06AF\u0627\u0647 \u0634\u0645\u0627 \u0646\u0635\u0628 \u0634\u062F!');
});
function pok6r0g() {
	return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
function lg6eyuo() {
	return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function togglePwaModal(show) {
	ys5v6m0('pwa-install-modal', show);
}
function d3g0pzj() {
	const ua = navigator.userAgent;
	const isOpera = ua.includes('OPR') || ua.includes('Opera') || ua.includes('OPT/');
	const isEdge = ua.includes('Edg');
	const isChrome = ua.includes('Chrome') && !isEdge && !isOpera;
	const isFirefox = ua.includes('Firefox');
	const isSafari = ua.includes('Safari') && !isChrome && !isEdge && !isOpera;
	const isAndroid = /Android/i.test(ua);
	const isIos = pok6r0g();
	return { isOpera, isEdge, isChrome, isFirefox, isSafari, isAndroid, isIos };
}
function caalpq9() {
	const info = d3g0pzj();
	const list = document.getElementById('pwa-instructions-list');
	const title = document.getElementById('pwa-modal-title');
	if (!list) return;
	list.innerHTML = '';
	if (info.isIos) {
		if (title) title.innerText = '\u0646\u0635\u0628 \u0631\u0648\u06CC \u0622\u06CC\u0641\u0648\u0646 / iOS';
		list.innerHTML = '<div class="flex items-start gap-2.5 p-2.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-900/30">' +
			'<span class="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">\u06F1</span>' +
			'<span>\u062F\u0631 \u0646\u0648\u0627\u0631 \u067E\u0627\u06CC\u06CC\u0646 \u0633\u0627\u0641\u0627\u0631\u06CC\u060C \u062F\u06A9\u0645\u0647 <b>\u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC (Share \u{1F4E4})</b> \u0631\u0627 \u0644\u0645\u0633 \u06A9\u0646\u06CC\u062F.</span>' +
		'</div>' +
		'<div class="flex items-start gap-2.5 p-2.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-900/30">' +
			'<span class="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">\u06F2</span>' +
			'<span>\u06AF\u0632\u06CC\u0646\u0647 <b>\xABAdd to Home Screen\xBB (\u0627\u0641\u0632\u0648\u062F\u0646 \u0628\u0647 \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC \u2795)</b> \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.</span>' +
		'</div>' +
		'<div class="flex items-start gap-2.5 p-2.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-900/30">' +
			'<span class="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">\u06F3</span>' +
			'<span>\u062F\u0631 \u06AF\u0648\u0634\u0647 \u0628\u0627\u0644\u0627 \u062F\u06A9\u0645\u0647 <b>\xABAdd\xBB (\u0627\u0641\u0632\u0648\u062F\u0646)</b> \u0631\u0627 \u0628\u0632\u0646\u06CC\u062F \u062A\u0627 \u0622\u06CC\u06A9\u0648\u0646 \u0628\u0631\u0646\u0627\u0645\u0647 \u0627\u06CC\u062C\u0627\u062F \u0634\u0648\u062F.</span>' +
		'</div>';
	} else if (info.isOpera) {
		if (title) title.innerText = '\u0646\u0635\u0628 \u062F\u0631 \u0645\u0631\u0648\u0631\u06AF\u0631 \u0627\u067E\u0631\u0627 (Opera)';
		if (info.isAndroid) {
			list.innerHTML = '<div class="flex items-start gap-2.5 p-2.5 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200/50 dark:border-red-900/30">' +
				'<span class="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">\u06F1</span>' +
				'<span>\u062F\u0631 \u0646\u0648\u0627\u0631 \u067E\u0627\u06CC\u06CC\u0646 \u0627\u067E\u0631\u0627\u060C \u0631\u0648\u06CC \u0645\u0646\u0648\u06CC <b>\u0633\u0647 \u0646\u0642\u0637\u0647 (\u22EE) \u06CC\u0627 \u0644\u0648\u06AF\u0648\u06CC \u0627\u067E\u0631\u0627</b> \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F.</span>' +
			'</div>' +
			'<div class="flex items-start gap-2.5 p-2.5 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200/50 dark:border-red-900/30">' +
				'<span class="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">\u06F2</span>' +
				'<span>\u06AF\u0632\u06CC\u0646\u0647 <b>\xAB\u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC\xBB (Home screen)</b> \u06CC\u0627 <b>\xAB\u0646\u0635\u0628 \u0628\u0631\u0646\u0627\u0645\u0647\xBB</b> \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.</span>' +
			'</div>';
		} else {
			list.innerHTML = '<div class="flex items-start gap-2.5 p-2.5 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200/50 dark:border-red-900/30">' +
				'<span class="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">\u06F1</span>' +
				'<span>\u062F\u0631 \u0646\u0648\u0627\u0631 \u0622\u062F\u0631\u0633 \u0628\u0627\u0644\u0627\u06CC \u0627\u067E\u0631\u0627 (\u0633\u0645\u062A \u0631\u0627\u0633\u062A \u0622\u062F\u0631\u0633)\u060C \u0631\u0648\u06CC \u0622\u06CC\u06A9\u0648\u0646 <b>\u{1F4E5} (\u0646\u0635\u0628)</b> \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F.</span>' +
			'</div>' +
			'<div class="flex items-start gap-2.5 p-2.5 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200/50 dark:border-red-900/30">' +
				'<span class="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">\u06F2</span>' +
				'<span>\u06CC\u0627 \u0631\u0648\u06CC \u0645\u0646\u0648\u06CC \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0633\u0631\u06CC\u0639 (Easy Setup) \u06CC\u0627 \u0645\u0646\u0648\u06CC \u0633\u0647 \u0646\u0642\u0637\u0647 \u06A9\u0644\u06CC\u06A9 \u06A9\u0631\u062F\u0647 \u0648 \u06AF\u0632\u06CC\u0646\u0647 <b>Install</b> \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.</span>' +
			'</div>';
		}
	} else if (info.isAndroid) {
		if (title) title.innerText = '\u0646\u0635\u0628 \u0631\u0648\u06CC \u06AF\u0648\u0634\u06CC \u0627\u0646\u062F\u0631\u0648\u06CC\u062F';
		list.innerHTML = '<div class="flex items-start gap-2.5 p-2.5 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-900/30">' +
			'<span class="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">\u06F1</span>' +
			'<span>\u0631\u0648\u06CC \u0645\u0646\u0648\u06CC <b>\u0633\u0647 \u0646\u0642\u0637\u0647 (\u22EE)</b> \u062F\u0631 \u0628\u0627\u0644\u0627\u06CC \u0645\u0631\u0648\u0631\u06AF\u0631 \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F.</span>' +
		'</div>' +
		'<div class="flex items-start gap-2.5 p-2.5 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-900/30">' +
			'<span class="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">\u06F2</span>' +
			'<span>\u06AF\u0632\u06CC\u0646\u0647 <b>\xAB\u0646\u0635\u0628 \u0628\u0631\u0646\u0627\u0645\u0647\xBB (Install app)</b> \u06CC\u0627 <b>\xAB\u0627\u0641\u0632\u0648\u062F\u0646 \u0628\u0647 \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC\xBB</b> \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.</span>' +
		'</div>';
	} else {
		if (title) title.innerText = '\u0646\u0635\u0628 \u062F\u0631 \u0645\u0631\u0648\u0631\u06AF\u0631 \u062F\u0633\u06A9\u062A\u0627\u067E';
		list.innerHTML = '<div class="flex items-start gap-2.5 p-2.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-900/30">' +
			'<span class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></span>' +
			'<span>\u062F\u0631 \u0646\u0648\u0627\u0631 \u0622\u062F\u0631\u0633 \u0628\u0627\u0644\u0627\u06CC \u0645\u0631\u0648\u0631\u06AF\u0631\u060C \u0631\u0648\u06CC \u0622\u06CC\u06A9\u0648\u0646 <b>\u0646\u0635\u0628 \u0628\u0631\u0646\u0627\u0645\u0647 (\u{1F5A5}\uFE0F \u06CC\u0627 \u2795)</b> \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F.</span>' +
		'</div>' +
		'<div class="flex items-start gap-2.5 p-2.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-900/30">' +
			'<span class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></span>' +
			'<span><b>\u06CC\u0627</b> \u0627\u0632 \u0645\u0646\u0648\u06CC \u0633\u0647 \u0646\u0642\u0637\u0647 (\u22EE) \u06AF\u0632\u06CC\u0646\u0647 <b>\xABInstall Alireza Panel\xBB</b> \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u0646\u0645\u0627\u06CC\u06CC\u062F.</span>' +
		'</div>';
	}
}
async function triggerPwaInstall() {
	if (lg6eyuo()) {
		bm3pzm2('\u2705 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646 \u0647\u0645\u200C\u0627\u06A9\u0646\u0648\u0646 \u0631\u0648\u06CC \u062F\u0633\u062A\u06AF\u0627\u0647 \u0634\u0645\u0627 \u0646\u0635\u0628 \u0627\u0633\u062A \u0648 \u062F\u0631 \u062D\u0627\u0644 \u0627\u062C\u0631\u0627 \u0645\u06CC\u200C\u0628\u0627\u0634\u062F.');
		return;
	}
	if (window.deferredPwaPrompt) {
		try {
			window.deferredPwaPrompt.prompt();
			const vlz8yee = await window.deferredPwaPrompt.userChoice;
			if (vlz8yee.outcome === 'accepted') {
				bm3pzm2('\u2705 \u062F\u0631 \u062D\u0627\u0644 \u0646\u0635\u0628 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646...');
			}
			window.deferredPwaPrompt = null;
			return;
		} catch (err) {}
	}
	caalpq9();
	togglePwaModal(true);
}
if ('serviceWorker' in navigator) {
	try {
		navigator.serviceWorker.register('/sw.js').catch(() => {});
	} catch(e) {}
}

		function closeUsageWarning() { ys5v6m0('usage-warning-modal', false); }
		function openUsageWarning() { ys5v6m0('usage-warning-modal', true); }
		function closeOnlineCounterWarning() { ys5v6m0('online-counter-warning-modal', false); }
		function openOnlineCounterWarning() { ys5v6m0('online-counter-warning-modal', true); }
		function closeConfigCountWarning() { ys5v6m0('config-count-warning-modal', false); }
		function openConfigCountWarning() { ys5v6m0('config-count-warning-modal', true); }
		function wbfdlk4(user) {
			var t = String((user && user.connection_type) || 'vl' + 'e' + 'ss').toLowerCase();
			var trojan = t.indexOf('trojan') !== -1;
			var ss = t.indexOf('shadowsocks') !== -1;
			var vless = t.indexOf('vl' + 'e' + 'ss') !== -1 || (!trojan && !ss);
			return { vless: vless, trojan: trojan, ss: ss };
		}
		function fv9a4g0(username) {
			const user = window.allUsers.find(u => u.username === username);
			if (!user) return '';
			const host = window.location.hostname;
			var ips = [host];
			if (user.ips) {
				const parsedIps = user.ips.split('\\n').map(function(ip) { return ip.trim(); }).filter(function(ip) { return ip.length > 0; });
				if (parsedIps.length > 0) ips = parsedIps;
			}
			var ports = String(user.port || '443').split(',').map(function(p) { return p.trim(); }).filter(function(p) { return p.length > 0; });
			var fp = user.fingerprint || 'unsafe';
			const dynPath = encodeURIComponent("/stream/aaaaaaaaaa/" + (user.uuid ? user.uuid.split("-")[4] : "default"));
			const pf = wbfdlk4(user);
			const links = [];
		const m1 = decodeURIComponent('%E2%9A%A0%EF%B8%8F%D9%BE%D9%86%D9%84%20%D8%B1%D8%A7%DB%8C%DA%AF%D8%A7%D9%86%D9%87%2B%D9%86%D9%81%D8%B1%D9%88%D8%B4%20%DA%A9.%D8%B5%D8%B5%D8%B5.%DA%A9%D8%B4%D8%B4%D8%B4%D8%B4%E2%9A%A0%EF%B8%8F');
		const m2 = decodeURIComponent('%F0%9F%9A%80%D9%BE%D9%86%D9%84%20%D8%AA%D9%88%D8%B3%D8%B7%20Alireza%20Tune%20%D8%AA%D9%88%D8%B3%D8%B9%D9%87%20%DB%8C%D8%A7%D9%81%D8%AA%D9%87%20%D8%A7%D8%B3%D8%AA%F0%9F%9A%80');
		if (window._infoConfigsEnabled) links.push('vle' + 'ss://' + (user.uuid || '') + '@0.0.0.0:1?encryption=none&security=none&type=ws&host=' + host + '&path=' + dynPath + '#' + encodeURIComponent(m1));
		if (window._infoConfigsEnabled) links.push('vle' + 'ss://' + (user.uuid || '') + '@0.0.0.0:1?encryption=none&security=none&type=ws&host=' + host + '&path=' + dynPath + '#' + encodeURIComponent(m2));
			let remVol = "Unlimited";
			if (user.limit_gb) {
				let rem = user.limit_gb - (user.used_gb || 0);
				remVol = rem > 0 ? rem.toFixed(2) + "GB" : "0GB";
			}
			let remTime = "Unlimited";
			if (user.expiry_days && user.created_at) {
				const created = new Date(user.created_at);
				const expiryDate = user.first_connection_time ? new Date(user.first_connection_time + user.expiry_days * 24 * 60 * 60 * 1000) : new Date(created.getTime() + user.expiry_days * 24 * 60 * 60 * 1000);
				const diffDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
				remTime = diffDays > 0 ? diffDays + "Days" : "0Days";
			}
			let remReq = "Unlimited";
			if (user.limit_req) {
				let rem = user.limit_req - (user.used_req || 0);
				remReq = rem > 0 ? rem.toLocaleString() + "Req" : "0Req";
			}
			const infoRemark = "\u{1F4CA} remaining | \u200E" + remVol + " | \u200E" + remTime + " | \u200E" + remReq;
			if (window._infoConfigsEnabled) links.push('vle' + 'ss://' + (user.uuid || '') + '@' + host + ':80?path=' + dynPath + '&security=none&encryption=none&host=' + host + '&fp=' + fp + '&type=ws#' + encodeURIComponent(infoRemark));
			const rawPath = "/stream/aaaaaaaaaa/" + (user.uuid ? user.uuid.split("-")[4] : "default");
			let proxyList = [];
			try {
				if (user.user_socks5 && user.user_socks5.trim().startsWith("[")) {
					proxyList = JSON.parse(user.user_socks5);
				} else if (user.user_socks5 || user.user_proxy_ip) {
					proxyList = [user.user_socks5 || user.user_proxy_ip];
				} else {
					proxyList = [null];
				}
			} catch (e) {
				proxyList = [user.user_socks5 || user.user_proxy_ip];
			}
			if (!Array.isArray(proxyList) || proxyList.length === 0) proxyList = [];
			const allowDirect = user.enable_direct !== 0;
			if (allowDirect) {
				let hasDirect = proxyList.some(function(p) { return p === null || p === ""; });
				if (!hasDirect) proxyList.push(null);
			} else {
				proxyList = proxyList.filter(function(p) { return p !== null && p !== ""; });
			}
			if (proxyList.length === 0) proxyList = [null];
			let proxyFlagCache = {};
			try { proxyFlagCache = JSON.parse(localStorage.getItem('pf_c2') || '{}'); } catch(e) {}
			for (let locIdx = 0; locIdx < proxyList.length; locIdx++) {
				let proxyItem = proxyList[locIdx];
				let proxyStr = typeof proxyItem === "object" && proxyItem !== null ? proxyItem.proxy : proxyItem;
				let countryCode = typeof proxyItem === "object" && proxyItem !== null
					? proxyItem.country
					: (proxyStr ? (proxyStr === user.user_proxy_ip ? (user.user_proxy_iata || "") : "") : (window._globalActiveCountry || ""));
				let flagEmoji = "\u{1F310}";
				if (countryCode && typeof nkis0ps === 'function') {
					flagEmoji = nkis0ps(countryCode);
				} else if (proxyStr && proxyFlagCache[proxyStr] && typeof nkis0ps === 'function') {
					flagEmoji = nkis0ps(proxyFlagCache[proxyStr]);
				}
				const currentDynPath = encodeURIComponent(rawPath + ((proxyItem !== null && proxyItem !== "") ? "/loc-" + locIdx : ""));
				const ssPlainPath = rawPath + "/ss" + ((proxyItem !== null && proxyItem !== "") ? "/loc-" + locIdx : "");
				ips.forEach((ip) => {
					ports.forEach((portStr) => {
						const isTlsPort = ["443", "2053", "2083", "2087", "2096", "8443"].includes(portStr);
						const tlsVal = isTlsPort ? "tls" : "none";
						let userFrag = user.frag_len && user.frag_int ? "&fragment=" + user.frag_len + "," + user.frag_int : "";
						if (user.advanced_frag) userFrag += "&fm=" + encodeURIComponent(user.advanced_frag);
						if (user.cipher_suites) userFrag += "&cs=" + encodeURIComponent(user.cipher_suites);
						if (user.tls_mask) userFrag += "&mask=" + encodeURIComponent(user.tls_mask);
					if (user.ech_config) userFrag += "&ech=" + encodeURIComponent(user.ech_config);
						const tagPrefix = (String(countryCode || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2)) || "NONE";
						const remark = tagPrefix + " | " + flagEmoji + " | " + user.username;
						if (pf.vless) links.push('vle' + 'ss://' + (user.uuid || '') + '@' + ip + ':' + portStr + '?path=' + currentDynPath + '&security=' + tlsVal + '&encryption=none&insecure=0&host=' + host + '&fp=' + fp + '&type=ws&allowInsecure=0&sni=' + host + userFrag + '#' + encodeURIComponent(remark));
						if (pf.trojan) {
							links.push('trojan://' + (user.uuid || '') + '@' + ip + ':' + portStr + '?security=' + tlsVal + '&type=ws&host=' + host + '&path=' + currentDynPath + '&sni=' + host + '&fp=' + fp + userFrag + '#' + encodeURIComponent(remark + ' (Trojan)'));
						}
						if (pf.ss) {
							const ssPlugin = 'v2ray-plugin;mode=websocket;host=' + host + ';path=' + ssPlainPath + (isTlsPort ? ';tls' : '');
							links.push('ss://' + btoa('aes-256-gcm:' + (user.uuid || '')) + '@' + ip + ':' + portStr + '/?plugin=' + encodeURIComponent(ssPlugin) + '#' + encodeURIComponent(remark + ' (SS)'));
						}
					});
				});
			}
			return links.join('\\n');
		}
		function lvwv8je(username) {
			return window.location.origin + '/feed/' + encodeURIComponent(username);
		}
		function k4jgpcl(username) {
			return window.location.origin + '/singbox/' + encodeURIComponent(username);
		}
		function dtzt6zg(username) {
			return window.location.origin + '/status/' + encodeURIComponent(username);
		}
		function copySubLink(encodedUsername) {
			const username = decodeURIComponent(encodedUsername);
			navigator.clipboard.writeText(lvwv8je(username)).then(() => {
				alert('\u2705 \u0644\u06CC\u0646\u06A9 \u0633\u0627\u0628 \u0645\u062A\u0646\u06CC \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u06A9\u067E\u06CC \u0634\u062F!');
			}).catch(() => {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u06A9\u067E\u06CC \u06A9\u0631\u062F\u0646 \u0644\u06CC\u0646\u06A9 \u0633\u0627\u0628!');
			});
		}
		function copySingboxLink(encodedUsername) {
			const username = decodeURIComponent(encodedUsername);
			navigator.clipboard.writeText(k4jgpcl(username)).then(() => {
				alert('\u2705 \u0644\u06CC\u0646\u06A9 \u0633\u0627\u0628 Sing-box \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u06A9\u067E\u06CC \u0634\u062F!');
			}).catch(() => {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u06A9\u067E\u06CC \u06A9\u0631\u062F\u0646 \u0644\u06CC\u0646\u06A9 \u0633\u0627\u0628 Sing-box!');
			});
		}
		function toggleQrModal(show, text) {
			const container = document.getElementById('qrcode-container');
			if (show) {
				container.innerHTML = '';
				const isDark = document.documentElement.classList.contains('dark');
				const qrCode = new QRCodeStyling({
					width: 220,
					height: 220,
					data: text,
					margin: 5,
					qrOptions: { errorCorrectionLevel: 'M' },
					dotsOptions: {
						color: isDark ? "#bfdbfe" : "#1e3a8a",
						type: "rounded"
					},
					backgroundOptions: {
						color: isDark ? "#0f172a" : "#ffffff"
					},
					cornersSquareOptions: {
						color: isDark ? "#60a5fa" : "#1e40af",
						type: "extra-rounded"
					},
					cornersDotOptions: {
						color: isDark ? "#60a5fa" : "#1d4ed8",
						type: "dot"
					}
				});
				qrCode.append(container);
			}
			ys5v6m0('qr-modal', show);
		}
		function downloadQrCode() {
			const container = document.getElementById('qrcode-container');
			if (!container) return;
			const canvas = container.querySelector('canvas');
			const img = container.querySelector('img');
			let dataUrl = '';
			if (canvas) {
				dataUrl = canvas.toDataURL("image/png");
			} else if (img && img.src) {
				dataUrl = img.src;
			}
			if (!dataUrl) {
				alert('\u26A0\uFE0F \u062A\u0635\u0648\u06CC\u0631 QR \u0628\u0631\u0627\u06CC \u062F\u0627\u0646\u0644\u0648\u062F \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!');
				return;
			}
			const downloadAnchor = document.createElement('a');
			downloadAnchor.href = dataUrl;
			downloadAnchor.download = "qr_" + Date.now() + ".png";
			document.body.appendChild(downloadAnchor);
			downloadAnchor.click();
			downloadAnchor.remove();
		}
		function showSubQr(encodedUsername) {
			const username = decodeURIComponent(encodedUsername);
			const link = lvwv8je(username);
			toggleQrModal(true, link);
		}
		function showSingboxQr(encodedUsername) {
			const username = decodeURIComponent(encodedUsername);
			const link = k4jgpcl(username);
			toggleQrModal(true, link);
		}
		function copyStatusLink(encodedUsername) {
			const username = decodeURIComponent(encodedUsername);
			navigator.clipboard.writeText(dtzt6zg(username)).then(() => {
				alert('\u2705 \u0644\u06CC\u0646\u06A9 \u0635\u0641\u062D\u0647 \u0648\u0636\u0639\u06CC\u062A \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u06A9\u067E\u06CC \u0634\u062F!');
			}).catch(() => {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u06A9\u067E\u06CC \u06A9\u0631\u062F\u0646 \u0644\u06CC\u0646\u06A9 \u0635\u0641\u062D\u0647 \u0648\u0636\u0639\u06CC\u062A!');
			});
		}
		function copyConfig(encodedUsername) {
			const username = decodeURIComponent(encodedUsername);
			const link = fv9a4g0(username);
			if (!link) return;
			navigator.clipboard.writeText(link).then(() => {
				alert('\u2705 \u06A9\u0640\u0627\u0646\u0641\u0640\u06CC\u06AF vIees \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u06A9\u067E\u06CC \u0634\u062F!');
			}).catch(() => {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u06A9\u067E\u06CC \u06A9\u0631\u062F\u0646 \u06A9\u0640\u0627\u0646\u0641\u0640\u06CC\u06AF!');
			});
		}
function editUser(encodedUsername) {
	const username = decodeURIComponent(encodedUsername);
	const user = window.allUsers.find(u => u.username === username);
	if (!user) {
		alert('\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!');
		return;
	}
	isEditMode = true;
	editingUsername = username;
	if (typeof switchUserTab === 'function') switchUserTab('tab-user-info');
	document.getElementById('modal-title').innerText = '\u0648\u06CC\u0631\u0627\u06CC\u0634 \u06A9\u0627\u0631\u0628\u0631: ' + username;
	jutlx8s('\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A', false);
	const nameInput = document.getElementById('input-name');
	nameInput.value = username;
	nameInput.disabled = false;
	const vlessCbE = document.getElementById('input-proto-vless');
	const trojanCbE = document.getElementById('input-proto-trojan');
	const ssCbE = document.getElementById('input-proto-ss');
	const userConnType = String(user.connection_type || 'vless');
	if (vlessCbE) vlessCbE.checked = userConnType.includes('vless') || userConnType === 'vl' + 'e' + 'ss' || (!userConnType.includes('trojan') && !userConnType.includes('shadowsocks'));
	if (trojanCbE) trojanCbE.checked = userConnType.includes('trojan');
	if (ssCbE) ssCbE.checked = userConnType.includes('shadowsocks');
	document.getElementById('input-limit').value = user.limit_gb || '';
	document.getElementById('input-expiry').value = user.expiry_days || '';
	document.getElementById('input-start-on-first-connect').checked = user.start_on_first_connect === 1;
	document.getElementById('input-req-limit').value = user.limit_req || '';
	document.getElementById('input-ip-limit').value = (user.ip_limit !== undefined && user.ip_limit !== null) ? user.ip_limit : (user.max_connections || '');
	document.getElementById('input-ips').value = user.ips || '';
	document.getElementById('fingerprint-select').value = user.fingerprint || 'unsafe';
	document.getElementById('hidden-auto-rotate').value = user.auto_rotate_ip || '0';
	document.getElementById('hidden-rotate-time').value = user.rotate_time || '';
	document.getElementById('hidden-ip-operator').value = user.ip_operator || 'all';
	document.getElementById('hidden-ip-count').value = user.ip_count || '20';
	document.getElementById('input-block-porn').checked = (user.block_porn === 1);
	if (document.getElementById('input-enable-direct')) document.getElementById('input-enable-direct').checked = (user.enable_direct !== 0);
	document.getElementById('input-block-ads').checked = (user.block_ads === 1);
	const autoRotateUserProxyCheck = document.getElementById('input-auto-rotate-user-proxy');
	if (autoRotateUserProxyCheck) autoRotateUserProxyCheck.checked = (user.auto_rotate_user_proxy === 1);
	const hasAutoReset = Boolean((user.auto_reset_vol_days && user.auto_reset_vol_days > 0) || (user.auto_reset_req_days && user.auto_reset_req_days > 0));
	const autoResetToggle = document.getElementById('input-auto-reset-toggle');
	if (autoResetToggle) autoResetToggle.checked = hasAutoReset;
	document.getElementById('input-auto-reset-vol').value = hasAutoReset && user.auto_reset_vol_days > 0 ? user.auto_reset_vol_days : '';
	document.getElementById('input-auto-reset-req').value = hasAutoReset && user.auto_reset_req_days > 0 ? user.auto_reset_req_days : '';
	window.toggleAutoResetInputs(hasAutoReset);
	const hasFrag = Boolean(user.frag_len && user.frag_len !== "" && user.frag_int && user.frag_int !== "");
	const fragToggle = document.getElementById('input-frag-toggle');
	if (fragToggle) fragToggle.checked = hasFrag;
	document.getElementById('input-frag-len').value = hasFrag ? user.frag_len : '200-3000';
	document.getElementById('input-frag-int').value = hasFrag ? user.frag_int : '1-2';
	window.toggleFragInputs(hasFrag);
	const hasAdvancedSettings = Boolean(user.advanced_frag || user.cipher_suites || user.tls_mask);
	const advancedToggle = document.getElementById('input-advanced-settings-toggle');
	if (advancedToggle) advancedToggle.checked = hasAdvancedSettings;
	document.getElementById('input-advanced-frag').value = user.advanced_frag || '';
	document.getElementById('input-cipher-suites').value = user.cipher_suites || '';
	document.getElementById('input-tls-mask').value = user.tls_mask || '';
	window.toggleAdvancedSettingsInputs(hasAdvancedSettings);
	const userPorts = String(user.port || '').split(',').map(p => p.trim());
	const predefinedPorts = [...tlsPorts, ...nonTlsPorts];
	const customPorts = userPorts.filter(p => !predefinedPorts.includes(p) && p !== '');
	document.querySelectorAll('input[name="ports"]').forEach(cb => {
		cb.checked = userPorts.includes(cb.value);
	});
	const customPortInput = document.getElementById('input-custom-ports');
	if (customPortInput) customPortInput.value = customPorts.join(' ');
	const userProxyToggle = document.getElementById('user-proxy-mode-toggle');
	const userSocksInput = document.getElementById('user-socks5-input');
	const targetProxy = user.user_socks5 || user.user_proxy_ip;
	const userProxyResult = document.getElementById('test-user-proxy-result');
	if (userProxyResult) userProxyResult.innerText = '';
	window.proxyFieldsData = [""];
	window.activeProxyIndex = 0;
	window.userProxyIata = user.user_proxy_iata || null;
	const iataInput = document.getElementById('input-user-proxy-iata');
	const iataToggle = document.getElementById('input-user-iata-toggle');
	const hasIata = Boolean(user.user_proxy_iata);
	if (iataToggle) iataToggle.checked = hasIata;
	if (iataInput) {
		iataInput.value = user.user_proxy_iata || '';
		iataInput.disabled = !hasIata;
	}
	if (typeof window.updateUserIataPreview === 'function') window.updateUserIataPreview();
	const ipv6Toggle = document.getElementById('input-user-ipv6-toggle');
	if (ipv6Toggle) ipv6Toggle.checked = (user.user_ipv6_enabled === 1);
	if (user.user_socks5) {
		if (userProxyToggle) userProxyToggle.checked = true;
		if (typeof window.toggleUserProxyMode === 'function') window.toggleUserProxyMode(true);
		try {
			if (user.user_socks5.trim().startsWith("[")) {
				const arr = JSON.parse(user.user_socks5);
				window.proxyFieldsData = arr.map(x => typeof x === "object" && x !== null ? x.proxy : x);
			} else {
				window.proxyFieldsData = [user.user_socks5];
			}
		} catch(e) {
			window.proxyFieldsData = [user.user_socks5];
		}
	} else {
		if (userProxyToggle) userProxyToggle.checked = false;
		if (typeof window.toggleUserProxyMode === 'function') window.toggleUserProxyMode(false);
	}
	if (typeof window.renderProxyFieldsUI === 'function') window.renderProxyFieldsUI();
	toggleModal(true);
}
		async function deleteUser(encodedUsername) {
			const username = decodeURIComponent(encodedUsername);
			if (await pw6sr5c('\u0622\u06CC\u0627 \u0627\u0632 \u062D\u0630\u0641 \u06A9\u0627\u0631\u0628\u0631 ' + username + ' \u0645\u0637\u0645\u0626\u0646 \u0647\u0633\u062A\u06CC\u062F\u061F')) {
				try {
					const response = await fetch('/api/users/' + encodeURIComponent(username), { method: 'DELETE' });
					if (response.ok) {
						alert('\u2705 \u06A9\u0627\u0631\u0628\u0631 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062D\u0630\u0641 \u0634\u062F.');
						window.selectedUsernames.delete(username);
						await axmsbp4(true);
					} else {
						const errData = await response.json();
						alert('\u062E\u0637\u0627: ' + (errData.error || '\u0639\u0645\u0644\u06CC\u0627\u062A \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F'));
					}
				} catch (err) {
					alert('\u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
				}
			}
		}
		/* \u067E\u0631\u0686\u0645\u200C\u0647\u0627 \u0628\u0647\u200C\u0635\u0648\u0631\u062A SVG \u0646\u0645\u0627\u06CC\u0634 \u062F\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u0646\u062F \u062A\u0627 \u0631\u0648\u06CC \u0648\u06CC\u0646\u062F\u0648\u0632 (\u06A9\u0647 \u0641\u0648\u0646\u062A \u067E\u0631\u0686\u0645 \u0646\u062F\u0627\u0631\u062F) \u0647\u0645 \u062F\u0631\u0633\u062A \u062F\u06CC\u062F\u0647 \u0634\u0648\u0646\u062F. */
		function b00aqjk(countryCode) {
			if (!countryCode) return '<span class="flg-g">\u{1F310}</span>';
			const cc = String(countryCode).toLowerCase().replace(/[^a-z]/g, '');
			if (cc.length !== 2) return '<span class="flg-g">\u{1F310}</span>';
			return '<span class="fi fi-' + cc + ' flg" title="' + cc.toUpperCase() + '"></span>';
		}
		/* \u0646\u0633\u062E\u0647 \u0645\u062A\u0646\u06CC (emoji) \u0628\u0631\u0627\u06CC \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u062F\u0627\u062E\u0644 URL/remark \u0644\u06CC\u0646\u06A9 VLESS - \u06A9\u0644\u0627\u06CC\u0646\u062A\u200C\u0647\u0627\u06CC v2ray HTML \u0631\u0646\u062F\u0631 \u0646\u0645\u06CC\u200C\u06A9\u0646\u0646\u062F */
		function nkis0ps(countryCode) {
			if (!countryCode) return '\u{1F310}';
			const cc = String(countryCode).toUpperCase().replace(/[^A-Z]/g, '');
			if (cc.length !== 2) return '\u{1F310}';
			try {
				return String.fromCodePoint(...cc.split('').map(char => 127397 + char.charCodeAt(0)));
			} catch (e) {
				return '\u{1F310}';
			}
		}
		/* \u0646\u0627\u0645 \u0641\u0627\u0631\u0633\u06CC \u06A9\u0634\u0648\u0631 \u0627\u0632 \u0631\u0648\u06CC \u06A9\u062F \u062F\u0648 \u062D\u0631\u0641\u06CC\u061B \u062F\u0627\u062E\u0644 <option> \u0641\u0642\u0637 \u0645\u062A\u0646 \u0633\u0627\u062F\u0647 (\u0646\u0647 SVG) \u0642\u0627\u0628\u0644 \u0646\u0645\u0627\u06CC\u0634\u0647 */
		function k6io158(countryCode) {
			if (!countryCode) return '';
			const cc = String(countryCode).toUpperCase().replace(/[^A-Z]/g, '');
			if (cc.length !== 2) return String(countryCode).toUpperCase();
			try {
				if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
					const dn = new Intl.DisplayNames(['fa'], { type: 'region' });
					const name = dn.of(cc);
					if (name && name.toUpperCase() !== cc) return name;
				}
			} catch (e) {}
			return cc;
		}
		/* \u0646\u0627\u0645 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u06A9\u0634\u0648\u0631 \u0627\u0632 \u0631\u0648\u06CC \u06A9\u062F \u062F\u0648 \u062D\u0631\u0641\u06CC\u061B \u0628\u0631\u0627\u06CC \u0686\u06CC\u062F\u0645\u0627\u0646 a \u062A\u0627 z \u0648 \u0646\u0645\u0627\u06CC\u0634 \u0642\u0628\u0644 \u0627\u0632 \u0646\u0627\u0645 \u0641\u0627\u0631\u0633\u06CC */
		function m79lr3o(countryCode) {
			if (!countryCode) return '';
			const cc = String(countryCode).toUpperCase().replace(/[^A-Z]/g, '');
			if (cc.length !== 2) return String(countryCode).toUpperCase();
			try {
				if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
					const dn = new Intl.DisplayNames(['en'], { type: 'region' });
					const name = dn.of(cc);
					if (name && name.toUpperCase() !== cc) return name;
				}
			} catch (e) {}
			return cc;
		}
/* --- \u0628\u062E\u0634 \u062B\u0627\u0628\u062A \u06A9\u0631\u062F\u0646 \u06A9\u0634\u0648\u0631/\u0622\u06CC\u200C\u067E\u06CC \u067E\u0646\u0644 (Cloudflare) --- */
window._globalLocationsList = window._globalLocationsList || [];
function bturbdj(locations, activeIata) {
	const select = document.getElementById('location-select');
	if (!select) return;
	const sorted = locations.slice().sort((a, b) => m79lr3o(a.cca2).localeCompare(m79lr3o(b.cca2)));
	let html = '<option value="">\u{1F310} \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 (\u0644\u0648\u06A9\u06CC\u0634\u0646 \u062E\u0648\u062F\u06A9\u0627\u0631)</option>';
	sorted.forEach(loc => {
		if (loc.iata && loc.city) {
			const isSelected = activeIata && loc.iata.toUpperCase() === activeIata.toUpperCase() ? 'selected' : '';
			const flag = nkis0ps(loc.cca2);
			const countryNameEn = m79lr3o(loc.cca2);
			const countryName = k6io158(loc.cca2);
			html += '<option value="' + loc.iata + '" data-cca2="' + (loc.cca2 || '') + '" data-search="' + (loc.iata + ' ' + loc.city + ' ' + (loc.cca2 || '') + ' ' + countryNameEn + ' ' + countryName).toLowerCase() + '" ' + isSelected + '>' + flag + ' ' + countryNameEn + ' (' + countryName + ')' + ' - ' + loc.city + ' (' + loc.iata + ')</option>';
		}
	});
	select.innerHTML = html;
}
function filterGlobalLocations() {
	const q = (document.getElementById('global-location-search').value || '').toLowerCase().trim();
	const select = document.getElementById('location-select');
	if (!select) return;
	const activeIata = select.value;
	if (!q) { bturbdj(window._globalLocationsList, activeIata); return; }
	const filtered = window._globalLocationsList.filter(loc => loc.iata && loc.city && (loc.iata + ' ' + loc.city + ' ' + (loc.cca2 || '') + ' ' + m79lr3o(loc.cca2) + ' ' + k6io158(loc.cca2)).toLowerCase().includes(q));
	bturbdj(filtered, activeIata);
}
async function jyfwoo1() {
	const select = document.getElementById('location-select');
	if (!select) return;
	try {
		const statusRes = await fetch('/api/proxy-ip');
		let activeIata = '';
		if (statusRes.ok) {
			const statusData = await statusRes.json();
			activeIata = statusData.iata || '';
			window._globalActiveIata = activeIata;
			window._globalActiveCountry = statusData.country || '';
			if (typeof window.applyInfoConfigsState === 'function') window.applyInfoConfigsState(!!statusData.info_configs);
			if (typeof window.applyPatternihaState === 'function') window.applyPatternihaState(!!statusData.patterniha_all);
			if (typeof window.applyPatternihaEchState === 'function') window.applyPatternihaEchState(!!statusData.patterniha_ech_all);
			if (typeof window.applyEchSettings === 'function') window.applyEchSettings(statusData);
		}
		const res = await fetch('/locations');
		if (!res.ok) throw new Error();
		const locations = await res.json();
		window._globalLocationsList = Array.isArray(locations) ? locations : [];
		bturbdj(window._globalLocationsList, activeIata);
	} catch (err) {
		select.innerHTML = '<option value="">\u26A0\uFE0F \u062E\u0637\u0627 \u062F\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u0644\u0648\u06A9\u06CC\u0634\u0646\u200C\u0647\u0627</option>';
	}
}
async function saveSettings() {
	const btn = document.getElementById('save-settings-btn');
	const select = document.getElementById('location-select');
	const iata = select ? select.value : '';
	const selectedOption = select && select.selectedIndex >= 0 ? select.options[select.selectedIndex] : null;
	const cca2 = selectedOption ? (selectedOption.dataset.cca2 || '') : '';
	if (btn) { btn.disabled = true; btn.innerText = '\u062F\u0631 \u062D\u0627\u0644 \u0630\u062E\u06CC\u0631\u0647...'; }
	try {
		let resolvedIp = '';
		let countryResolveFailed = false;
		if (iata) {
			const domain = iata.toLowerCase() + '.' + ['pro' + 'xy' + 'ip', 'cm' + 'liu' + 'ssss', 'ne' + 't'].join('.');
			let ips = [];
			try {
				const dnsRes = await fetch('https://cloudflare-dns.com/dns-query?name=' + domain + '&type=A', {
					headers: { 'accept': 'application/dns-json' }
				});
				if (dnsRes.ok) {
					const dnsData = await dnsRes.json();
					if (dnsData.Answer && dnsData.Answer.length > 0) {
						ips = dnsData.Answer.filter(ans => ans.type === 1).map(ans => ans.data);
					}
				}
			} catch (e) {}
			if (ips.length > 0) {
				/* \u0647\u0645\u06CC\u0634\u0647 \u0627\u0648\u0644\u06CC\u0646 IP \u0644\u06CC\u0633\u062A \u0627\u0646\u062A\u062E\u0627\u0628 \u0645\u06CC\u200C\u0634\u0648\u062F (\u0646\u0647 \u0631\u0646\u062F\u0648\u0645) \u062A\u0627 \u0647\u0631 \u06A9\u0634\u0648\u0631\u06CC\u060C \u0641\u0627\u0631\u063A \u0627\u0632 \u062A\u0639\u062F\u0627\u062F IP\u0647\u0627\u0634\u060C \u062B\u0627\u0628\u062A \u0628\u0645\u0627\u0646\u062F */
				resolvedIp = ips[0];
			} else {
				countryResolveFailed = true;
			}
		}
		const response = await fetch('/api/proxy-ip', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ proxy_ip: resolvedIp, iata: countryResolveFailed ? '' : (iata ? iata.toUpperCase() : ''), country: countryResolveFailed ? '' : (cca2 ? cca2.toUpperCase() : '') })
		});
		if (response.ok) {
			if (countryResolveFailed) {
				bm3pzm2('\u26A0\uFE0F \u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u062F\u0631 \u062D\u0627\u0644 \u062D\u0627\u0636\u0631 IP \u0641\u0639\u0627\u0644\u06CC \u0646\u062F\u0627\u0631\u0647\u061B \u06CC\u0647 \u06A9\u0634\u0648\u0631 \u062F\u06CC\u06AF\u0647 \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646\u06CC\u062F.');
			} else {
				window._globalActiveIata = iata ? iata.toUpperCase() : '';
				window._globalActiveCountry = cca2 ? cca2.toUpperCase() : '';
				toggleSettingsModal(false);
				bm3pzm2('\u2705 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F.' + (iata && resolvedIp ? ' \u0622\u06CC\u200C\u067E\u06CC: ' + resolvedIp : ' \u0622\u062F\u0631\u0633 \u067E\u0631\u0648\u06A9\u0633\u06CC \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 \u0634\u062F.'));
			}
		} else {
			bm3pzm2('\u274C \u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A');
		}
	} catch (err) {
		bm3pzm2('\u274C \u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
	} finally {
		if (btn) { btn.disabled = false; btn.innerText = '\u0630\u062E\u06CC\u0631\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A'; }
	}
}
window.toggleUserProxyMode = function(isSocksMode) {
	const socksContainer = document.getElementById('user-socks5-container');
	const socksInput = document.getElementById('user-socks5-input');
	if (isSocksMode) {
		if (socksContainer) socksContainer.classList.remove('opacity-50', 'pointer-events-none');
		if (socksInput) socksInput.disabled = false;
	} else {
		if (socksContainer) socksContainer.classList.add('opacity-50', 'pointer-events-none');
		if (socksInput) socksInput.disabled = true;
	}
};
window.toggleUserIataLock = function(isEnabled) {
	const iataInput = document.getElementById('input-user-proxy-iata');
	if (iataInput) {
		iataInput.disabled = !isEnabled;
		if (!isEnabled) {
			iataInput.value = '';
			window.userProxyIata = null;
			if (typeof window.updateUserIataPreview === 'function') window.updateUserIataPreview();
		}
	}
};
async function y9x0sl1() {
	const badges = document.querySelectorAll('.async-proxy-flag');
	if (badges.length === 0) return;
	let cache = {};
	try { cache = JSON.parse(localStorage.getItem('pf_c2') || '{}'); } catch(e) {}
	for (let badge of badges) {
		const proxyStr = badge.getAttribute('data-proxy');
		if (!proxyStr) continue;
		if (cache[proxyStr]) {
			/* \u06A9\u0634 \u06A9\u062F \u06A9\u0634\u0648\u0631 (\u06F2 \u062D\u0631\u0641) \u0631\u0627 \u0630\u062E\u06CC\u0631\u0647 \u0645\u06CC\u200C\u06A9\u0646\u062F\u061B \u0628\u0631\u0627\u06CC \u0646\u0645\u0627\u06CC\u0634 SVG \u0645\u06CC\u200C\u0633\u0627\u0632\u06CC\u0645 */
			const cachedCc = cache[proxyStr];
			badge.innerHTML = (typeof cachedCc === 'string' && /^[a-zA-Z]{2}$/.test(cachedCc) && typeof b00aqjk === 'function') ? b00aqjk(cachedCc) : '<span class="flg-g">\u{1F310}</span>';
			badge.classList.remove('async-proxy-flag');
			continue;
		}
		badge.classList.remove('async-proxy-flag');
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 4000);
			const res = await fetch('/api/test-proxy', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ proxy: proxyStr }),
				signal: controller.signal
			});
			clearTimeout(timeoutId);
			const data = await res.json();
			let flagSvg = '<span class="flg-g">\u{1F310}</span>';
			if (res.ok && data.success && data.country) {
				flagSvg = typeof b00aqjk === 'function' ? b00aqjk(data.country) : flagSvg;
				/* \u06A9\u0634 \u06A9\u062F \u06A9\u0634\u0648\u0631 (\u06F2 \u062D\u0631\u0641 \u0628\u0632\u0631\u06AF) \u0631\u0627 \u0630\u062E\u06CC\u0631\u0647 \u0645\u06CC\u200C\u06A9\u0646\u062F \u062A\u0627 \u0647\u0645 \u0628\u0631\u0627\u06CC UI (SVG) \u0648 \u0647\u0645 remark (text) \u0642\u0627\u0628\u0644 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0628\u0627\u0634\u062F */
				cache[proxyStr] = data.country.toUpperCase();
				localStorage.setItem('pf_c2', JSON.stringify(cache));
			}
			badge.innerHTML = flagSvg;
		} catch (e) {
			badge.innerHTML = '<span class="flg-g">\u{1F310}</span>';
		}
	}
}
window.testDirectPing = async function() {
	const btn = document.getElementById('test-direct-btn');
	const clientPingEl = document.getElementById('client-to-server-ping');
	const serverPingEl = document.getElementById('server-to-net-ping');
	if (!clientPingEl || !serverPingEl) return;

	if (btn) {
		btn.disabled = true;
		btn.innerHTML = '<svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg><span> \u062F\u0631 \u062D\u0627\u0644 \u062A\u0633\u062A...</span>';
	}
	clientPingEl.innerText = '\u062A\u0633\u062A...';
	clientPingEl.className = 'text-[10px] font-bold text-amber-500';
	serverPingEl.innerText = '\u062A\u0633\u062A...';
	serverPingEl.className = 'text-[10px] font-bold text-amber-500';

	try {
		const startClient = Date.now();
		await fetch('/icon.svg?t=' + startClient, { method: 'HEAD', cache: 'no-store' });
		const elapsed = Date.now() - startClient;
		let cColor = "text-red-500";
		if (elapsed <= 150) cColor = "text-green-500";
		else if (elapsed <= 300) cColor = "text-amber-500";
		clientPingEl.innerText = elapsed + ' ms';
		clientPingEl.className = 'text-[10px] font-bold ' + cColor;
	} catch (e) {
		clientPingEl.innerText = '\u062E\u0637\u0627';
		clientPingEl.className = 'text-[10px] font-bold text-red-500';
	}

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 6000);
		const res = await fetch('/api/test-proxy', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ proxy: 'direct', skip_country: true }),
			signal: controller.signal
		});
		clearTimeout(timeoutId);
		const data = await res.json();
		if (res.ok && data.success) {
			const sPing = data.ping;
			let sColor = "text-red-500";
			if (sPing <= 50) sColor = "text-green-500";
			else if (sPing <= 150) sColor = "text-amber-500";
			serverPingEl.innerText = sPing + ' ms';
			serverPingEl.className = 'text-[10px] font-bold ' + sColor;
		} else {
			serverPingEl.innerText = '\u062E\u0637\u0627';
			serverPingEl.className = 'text-[10px] font-bold text-red-500 text-center';
		}
	} catch (e) {
		serverPingEl.innerText = '\u062E\u0637\u0627';
		serverPingEl.className = 'text-[10px] font-bold text-red-500 text-center';
	}

	if (btn) {
		btn.disabled = false;
		btn.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg><span>\u062A\u0633\u062A \u0627\u062A\u0635\u0627\u0644 \u0645\u0633\u062A\u0642\u06CC\u0645</span>';
	}
};
async function testUserSocksProxy() {
	const btn = document.getElementById('test-user-proxy-btn');
	if (btn) {
		btn.disabled = true;
		btn.innerText = '\u0635\u0628\u0631 \u06A9\u0646\u06CC\u062F...';
	}
	window.proxyPingMap = {};
	const promises = window.proxyFieldsData.map(async (val, idx) => {
		const resultSpan = document.getElementById('proxy-ping-label-' + idx);
		const proxyStr = (val || "").trim();
		if (!proxyStr) {
			if (resultSpan) {
				resultSpan.innerText = '\u0648\u0627\u0631\u062F \u0646\u0634\u062F\u0647!';
				resultSpan.className = 'text-[10px] font-bold text-red-500 block mt-0.5 text-center';
			}
			return;
		}
		if (resultSpan) {
			resultSpan.innerText = '\u062F\u0631 \u062D\u0627\u0644 \u062A\u0633\u062A...';
			resultSpan.className = 'text-[10px] font-bold text-amber-500 block mt-0.5 text-center';
		}
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);
		try {
			const res = await fetch('/api/test-proxy', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ proxy: proxyStr }),
				signal: controller.signal
			});
			clearTimeout(timeoutId);
			const data = await res.json();
			if (res.ok && data.success) {
				const flag = typeof b00aqjk === 'function' ? b00aqjk(data.country) : '\u{1F310}';
				if (resultSpan) {
					resultSpan.innerHTML = flag + ' \u067E\u06CC\u0646\u06AF: ' + data.ping + 'ms';
					resultSpan.className = 'text-[10px] font-bold text-green-600 block mt-0.5 text-center';
					window.proxyPingMap[proxyStr] = { text: resultSpan.innerHTML, className: resultSpan.className };
				}
			} else {
				if (resultSpan) {
					resultSpan.innerText = '\u062E\u0637\u0627: ' + (data.error || '\u0646\u0627\u0645\u0648\u0641\u0642');
					resultSpan.className = 'text-[10px] font-bold text-red-500 block mt-0.5 break-words text-center';
					window.proxyPingMap[proxyStr] = { text: resultSpan.innerText, className: resultSpan.className };
				}
			}
		} catch (e) {
			clearTimeout(timeoutId);
			if (resultSpan) {
				if (e.name === 'AbortError') resultSpan.innerText = '\u062A\u0627\u06CC\u0645\u200C\u0627\u0648\u062A (\u062E\u0631\u0627\u0628)';
				else resultSpan.innerText = '\u062E\u0637\u0627 \u062F\u0631 \u0627\u0631\u062A\u0628\u0627\u0637';
				resultSpan.className = 'text-[10px] font-bold text-red-500 block mt-0.5 text-center';
				window.proxyPingMap[proxyStr] = { text: resultSpan.innerText, className: resultSpan.className };
			}
		}
	});
	await Promise.all(promises);
	if (btn) {
		btn.disabled = false;
		btn.innerText = '\u062A\u0633\u062A \u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC';
	}
}
		async function exportUsersBackup() {
			if (!window.allUsers || window.allUsers.length === 0) {
				alert('\u26A0\uFE0F \u06A9\u0627\u0631\u0628\u0631\u06CC \u0628\u0631\u0627\u06CC \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u200C\u06AF\u06CC\u0631\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F!');
				return;
			}
			try {
				const settingsRes = await fetch('/api/settings/bulk');
				const settingsData = await settingsRes.json();
				const backupData = {
					users: window.allUsers,
					settings: settingsData
				};
				const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
				const downloadAnchor = document.createElement('a');
				const host = window.location.hostname;
				const now = new Date();
				const dateTimeStr = now.getFullYear() + '-' + 
					String(now.getMonth() + 1).padStart(2, '0') + '-' + 
					String(now.getDate()).padStart(2, '0') + '_' + 
					String(now.getHours()).padStart(2, '0') + '-' + 
					String(now.getMinutes()).padStart(2, '0') + '-' + 
					String(now.getSeconds()).padStart(2, '0');
				downloadAnchor.setAttribute("href", dataStr);
				downloadAnchor.setAttribute("download", "bk_" + host + "_" + dateTimeStr + ".json");
				document.body.appendChild(downloadAnchor);
				downloadAnchor.click();
				downloadAnchor.remove();
			} catch (err) {
				alert('\u274C \u062E\u0637\u0627 \u062F\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0628\u0631\u0627\u06CC \u0628\u06A9\u200C\u0622\u067E.');
			}
		}
		function triggerImportBackup() {
			document.getElementById('backup-file-input').click();
		}
		async function importUsersBackup(event) {
			const file = event.target.files[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = async function(e) {
				const importBtn = document.querySelector('button[onclick="triggerImportBackup()"]');
				const exportBtn = document.querySelector('button[onclick="exportUsersBackup()"]');
				const closeBtn = document.querySelector('#settings-modal button[onclick="toggleSettingsModal(false)"]');
				try {
					const parsedData = JSON.parse(e.target.result);
					let backupUsers = [];
					let backupSettings = null;
					if (Array.isArray(parsedData)) {
						backupUsers = parsedData;
					} else if (parsedData && parsedData.users && Array.isArray(parsedData.users)) {
						backupUsers = parsedData.users;
						backupSettings = parsedData.settings;
					} else {
						alert('\u274C \u0641\u0627\u06CC\u0644 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A!');
						return;
					}
					const validBackupUsers = backupUsers.filter(u => u && typeof u === 'object' && u.username);
					if (validBackupUsers.length === 0 && !backupSettings) {
						alert('\u274C \u0647\u06CC\u0686 \u062F\u0627\u062F\u0647 \u0645\u0639\u062A\u0628\u0631\u06CC \u062F\u0631 \u0641\u0627\u06CC\u0644 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!');
						return;
					}
					if (backupSettings && Object.keys(backupSettings).length > 0) {
						const restoreSettings = await pw6sr5c('\u2699\uFE0F \u0641\u0627\u06CC\u0644 \u0628\u06A9\u200C\u0622\u067E \u0634\u0627\u0645\u0644 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u067E\u0640\u0646\u0640\u0644 \u0646\u06CC\u0632 \u0645\u06CC\u200C\u0628\u0627\u0634\u062F. \u0622\u06CC\u0627 \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u06CC\u062F \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0647\u0645 \u0628\u0627\u0632\u06AF\u0631\u062F\u0627\u0646\u06CC \u0634\u0648\u0646\u062F\u061F');
						if (restoreSettings) {
							try {
								await fetch('/api/settings/bulk', {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ settings: backupSettings })
								});
							} catch (err) {}
						}
					}
					const existingUsernames = new Set((window.allUsers || []).map(u => u.username));
					const duplicates = validBackupUsers.filter(u => existingUsernames.has(u.username));
					let overwrite = false;
					if (duplicates.length > 0) {
						overwrite = await pw6sr5c('\u26A0\uFE0F \u062A\u0639\u062F\u0627\u062F ' + duplicates.length + ' \u06A9\u0627\u0631\u0628\u0631 \u062A\u06A9\u0631\u0627\u0631\u06CC \u0634\u0646\u0627\u0633\u0627\u06CC\u06CC \u0634\u062F. \u0622\u06CC\u0627 \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u06CC\u062F \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0622\u0646\u200C\u0647\u0627 \u0628\u0627\u0632\u0646\u0648\u06CC\u0633\u06CC \u0634\u0648\u062F\u061F');
					}
					if (importBtn) importBtn.disabled = true;
					if (exportBtn) exportBtn.disabled = true;
					if (closeBtn) closeBtn.disabled = true;
					let successCount = 0;
					let currentStep = 0;
					for (const u of validBackupUsers) {
						currentStep++;
						if (importBtn) {
							importBtn.innerText = '\u23F3 \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC (' + currentStep + '/' + validBackupUsers.length + ')';
						}
						const exists = existingUsernames.has(u.username);
						if (exists) {
							if (overwrite) {
								try {
									await fetch('/api/users/' + encodeURIComponent(u.username), { method: 'DELETE' });
									const res = await fetch('/api/users', {
										method: 'POST',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({
											username: u.username,
											uuid: u.uuid,
											limit_gb: u.limit_gb,
											expiry_days: u.expiry_days,
											limit_req: u.limit_req,
											ips: u.ips,
											tls: u.tls,
											port: u.port,
											fingerprint: u.fingerprint,
											ip_limit: u.ip_limit !== undefined ? u.ip_limit : u.max_connections,
											used_gb: u.used_gb,
											used_req: u.used_req,
											created_at: u.created_at,
											is_active: u.is_active,
											block_porn: u.block_porn,
											block_ads: u.block_ads,
											enable_direct: u.enable_direct !== undefined ? u.enable_direct : 1,
											frag_len: u.frag_len,
											frag_int: u.frag_int,
											user_proxy_iata: u.user_proxy_iata,
											user_socks5: u.user_socks5,
											user_proxy_ip: u.user_proxy_ip,
											auto_reset_vol_days: u.auto_reset_vol_days,
											auto_reset_req_days: u.auto_reset_req_days,
											auto_rotate_ip: u.auto_rotate_ip,
											rotate_time: u.rotate_time,
											ip_operator: u.ip_operator,
											ip_count: u.ip_count,
											auto_rotate_user_proxy: u.auto_rotate_user_proxy,
											connection_type: u.connection_type
										})
									});
									if (res.ok) successCount++;
								} catch(err) {}
							}
						} else {
							try {
								const res = await fetch('/api/users', {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({
										username: u.username,
										uuid: u.uuid,
										limit_gb: u.limit_gb,
										expiry_days: u.expiry_days,
										limit_req: u.limit_req,
										ips: u.ips,
										tls: u.tls,
										port: u.port,
										fingerprint: u.fingerprint,
										ip_limit: u.ip_limit !== undefined ? u.ip_limit : u.max_connections,
										used_gb: u.used_gb,
										used_req: u.used_req,
										created_at: u.created_at,
										is_active: u.is_active,
										block_porn: u.block_porn,
										block_ads: u.block_ads,
										enable_direct: u.enable_direct !== undefined ? u.enable_direct : 1,
										frag_len: u.frag_len,
										frag_int: u.frag_int,
										user_proxy_iata: u.user_proxy_iata,
										user_socks5: u.user_socks5,
										user_proxy_ip: u.user_proxy_ip,
										auto_reset_vol_days: u.auto_reset_vol_days,
										auto_reset_req_days: u.auto_reset_req_days,
										auto_rotate_ip: u.auto_rotate_ip,
										rotate_time: u.rotate_time,
										ip_operator: u.ip_operator,
										ip_count: u.ip_count,
										auto_rotate_user_proxy: u.auto_rotate_user_proxy,
										connection_type: u.connection_type
									})
								});
								if (res.ok) successCount++;
							} catch(err) {}
						}
					}
					alert('\u2705 \u0639\u0645\u0644\u06CC\u0627\u062A \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0646\u062C\u0627\u0645 \u0634\u062F. \u0635\u0641\u062D\u0647 \u0631\u0641\u0631\u0634 \u0645\u06CC\u200C\u0634\u0648\u062F...');
					setTimeout(() => { window.location.reload(); }, 1500);
				} catch(err) {
					alert('\u274C \u062E\u0637\u0627 \u062F\u0631 \u062E\u0648\u0627\u0646\u062F\u0646 \u06CC\u0627 \u067E\u0631\u062F\u0627\u0632\u0634 \u0641\u0627\u06CC\u0644 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646!');
				} finally {
					if (importBtn) {
						importBtn.disabled = false;
						importBtn.innerText = '\u{1F4E5} \u0628\u0627\u0632\u06CC\u0627\u0628\u06CC';
					}
					if (exportBtn) exportBtn.disabled = false;
					if (closeBtn) closeBtn.disabled = false;
					event.target.value = '';
				}
			};
			reader.readAsText(file);
		}
		async function changeAdminPassword() {
			const currentPwd = document.getElementById('change-pwd-current').value.trim();
			const newPwd = document.getElementById('change-pwd-new').value.trim();
			const btn = document.getElementById('change-pwd-btn');
			if (!currentPwd || !newPwd) {
				alert('\u26A0\uFE0F \u0648\u0627\u0631\u062F \u06A9\u0631\u062F\u0646 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0641\u0639\u0644\u06CC \u0648 \u062C\u062F\u06CC\u062F \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A!');
				return;
			}
			if (newPwd.length < 4) {
				alert('\u26A0\uFE0F \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062C\u062F\u06CC\u062F \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06F4 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F!');
				return;
			}
			btn.disabled = true;
			btn.innerText = '\u062F\u0631 \u062D\u0627\u0644 \u062A\u063A\u06CC\u06CC\u0631...';
			try {
				const response = await fetch('/api/change-password', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ current_password: currentPwd, new_password: newPwd })
				});
				const data = await response.json();
				if (response.ok && data.success) {
					alert('\u2705 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0631\u062F.');
					document.getElementById('change-pwd-current').value = '';
					document.getElementById('change-pwd-new').value = '';
					toggleSettingsModal(false);
				} else {
					alert('\u274C \u062E\u0637\u0627: ' + (data.error || '\u0639\u0645\u0644\u06CC\u0627\u062A \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F'));
				}
			} catch (err) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06CC \u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631');
			} finally {
				btn.disabled = false;
				btn.innerText = '\u062A\u063A\u06CC\u06CC\u0631 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631';
			}
		}
		async function logoutAdmin() {
			if (await pw6sr5c('\u0622\u06CC\u0627 \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u06CC\u062F \u0627\u0632 \u067E\u0640\u0646\u0640\u0644 \u062E\u0627\u0631\u062C \u0634\u0648\u06CC\u062F\u061F \u26A0\uFE0F ')) {
				try {
					await fetch('/api/logout', { method: 'POST' });
				} catch (err) {}
				window.location.reload();
			}
		}
const yxb4u9v = '3.4.1';
		async function toggleGfx(isChecked) {
			document.documentElement.classList.toggle('gfx-off', !isChecked);
			localStorage.setItem('gfx-enabled', isChecked ? 'true' : 'false');
			try {
				await fetch('/api/settings/bulk', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ settings: { gfx_enabled: isChecked ? '1' : '0' } })
				});
			} catch (e) {}
			bm3pzm2('\u2699\uFE0F \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u06AF\u0631\u0627\u0641\u06CC\u06A9\u06CC \u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0631\u062F. \u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC \u0645\u062C\u062F\u062F...');
			setTimeout(() => window.location.reload(), 1200);
		}
let l76xmsu = {};
async function nbfm495() {
	try {
		const response = await kc5inhw('ips.txt');
		if (!response.ok) throw new Error('Fetch failed');
		const text = await response.text();
		const blocks = text.split('----------');
		l76xmsu = {};
		blocks.forEach(block => {
			const lines = block.trim().split('\\n').map(l => l.trim()).filter(l => l.length > 0);
			if (lines.length === 0) return;
			let opName = "Unknown";
			const ips = [];
			lines.forEach(line => {
				if (line.includes('#')) {
					opName = line.split('#')[1].trim();
				} else if (!line.startsWith('[source')) {
					ips.push(line);
				}
			});
			if (ips.length > 0) {
				l76xmsu[opName] = ips;
			}
		});
		umfeacy();
	} catch (err) {
		alert('Failed to load IP list from GitHub.');
		toggleIpSelectorModal(false);
	}
}
/* \u067E\u0631 \u06A9\u0631\u062F\u0646 \u062E\u0648\u062F\u06A9\u0627\u0631 \u0686\u0646\u062F \u0622\u06CC\u200C\u067E\u06CC \u062A\u0645\u06CC\u0632 \u0627\u0632 \u0647\u0645\u0648\u0646 \u0622\u062F\u0631\u0633 (ips.txt) \u0628\u062F\u0648\u0646 \u0646\u06CC\u0627\u0632 \u0628\u0647 \u0628\u0627\u0632 \u06A9\u0631\u062F\u0646 \u0627\u0633\u06A9\u0646\u0631/\u0645\u062E\u0632\u0646 \u0622\u06CC\u200C\u067E\u06CC */
window.autoFillCleanIps = async function(count) {
	const n = count || 2;
	const ipsInput = document.getElementById('input-ips');
	if (!ipsInput) return;
	try {
		let availableIps = [];
		if (!l76xmsu || Object.keys(l76xmsu).length === 0) {
			const response = await kc5inhw('ips.txt');
			if (response.ok) {
				const text = await response.text();
				const blocks = text.split('----------');
				blocks.forEach(block => {
					const lines = block.trim().split('\\n').map(l => l.trim()).filter(l => l.length > 0);
					lines.forEach(line => {
						if (!line.includes('#') && !line.startsWith('[source')) availableIps.push(line);
					});
				});
			}
		} else {
			Object.values(l76xmsu).forEach(ips => { availableIps = availableIps.concat(ips); });
		}
		availableIps = [...new Set(availableIps)];
		if (availableIps.length === 0) return;
		const shuffled = availableIps.slice();
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		const selected = shuffled.slice(0, n);
		if (selected.length > 0) ipsInput.value = selected.join('\\n');
	} catch (e) {}
};
function umfeacy() {
	const select = document.getElementById('ip-operator-select');
	select.innerHTML = '<option value="all">\u0647\u0645\u0647 (\u062A\u0648\u0635\u06CC\u0647 \u0634\u062F\u0647)</option>';
	Object.keys(l76xmsu).forEach(op => {
		const option = document.createElement('option');
		option.value = op;
		option.textContent = op;
		select.appendChild(option);
	});
}
function toggleIpSelectorModal(show) {
	ys5v6m0('ip-selector-modal', show);
	if (!show) {
		const rotateToggle = document.getElementById('input-auto-rotate-ip-toggle');
		if (rotateToggle) rotateToggle.checked = false;
		const rotateTime = document.getElementById('input-auto-rotate-ip-time');
		if (rotateTime) rotateTime.value = '';
		if (typeof window.toggleAutoRotateIpInputs === 'function') window.toggleAutoRotateIpInputs(false);
	}
}
async function openIpSelectorModal() {
	toggleIpSelectorModal(true);
	document.getElementById('ip-loading-state').classList.remove('hidden');
	document.getElementById('ip-selection-form').classList.add('hidden');
	await nbfm495();
	const op = document.getElementById('hidden-ip-operator').value;
	const selectOp = document.getElementById('ip-operator-select');
	if (selectOp.querySelector('option[value="' + op + '"]')) {
		selectOp.value = op;
	} else {
		selectOp.value = 'all';
	}
	document.getElementById('ip-count-input').value = document.getElementById('hidden-ip-count').value || 20;
	const isAuto = document.getElementById('hidden-auto-rotate').value === '1';
	document.getElementById('input-auto-rotate-ip-toggle').checked = isAuto;
	document.getElementById('input-auto-rotate-ip-time').value = document.getElementById('hidden-rotate-time').value;
	if (typeof window.toggleAutoRotateIpInputs === 'function') window.toggleAutoRotateIpInputs(isAuto);
	document.getElementById('ip-loading-state').classList.add('hidden');
	document.getElementById('ip-selection-form').classList.remove('hidden');
}
function applySelectedIps() {
	const operator = document.getElementById('ip-operator-select').value;
	let count = parseInt(document.getElementById('ip-count-input').value, 10);
	if (isNaN(count) || count < 1) count = 10;
	let availableIps = [];
	if (operator === 'all') {
		Object.values(l76xmsu).forEach(ips => {
			availableIps = availableIps.concat(ips);
		});
	} else {
		availableIps = l76xmsu[operator] || [];
	}
	availableIps = [...new Set(availableIps)];
	let selectedIps = [];
	if (count >= availableIps.length) {
		selectedIps = availableIps;
	} else {
		const shuffled = availableIps.slice();
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		selectedIps = shuffled.slice(0, count);
	}
	document.getElementById('input-ips').value = selectedIps.join('\\n');
	document.getElementById('hidden-auto-rotate').value = document.getElementById('input-auto-rotate-ip-toggle').checked ? '1' : '0';
	document.getElementById('hidden-rotate-time').value = document.getElementById('input-auto-rotate-ip-time').value || '';
	document.getElementById('hidden-ip-operator').value = operator;
	document.getElementById('hidden-ip-count').value = count;
	toggleIpSelectorModal(false);
}
document.addEventListener('DOMContentLoaded', () => {
			const versionBadge = document.getElementById('panel-version');
			if (versionBadge) versionBadge.innerText = 'v' + yxb4u9v;
			yok43r5();
			axmsbp4();
			if (typeof jyfwoo1 === 'function') jyfwoo1();
			window.usersRefreshIntervalId = null;
			window.startRefreshInterval = function(intervalMs) {
				if (window.usersRefreshIntervalId) {
					clearInterval(window.usersRefreshIntervalId);
				}
				window.usersRefreshIntervalId = setInterval(() => {
					if (!document.hidden) axmsbp4(true);
				}, intervalMs);
			};
			window.changeRefreshRate = function(val) {
				const ms = parseInt(val, 10);
				localStorage.setItem('rr_k3', ms);
				window.startRefreshInterval(ms);
				bm3pzm2('\u0646\u0631\u062E \u0631\u0641\u0631\u0634 \u067E\u0640\u0646\u0640\u0644 \u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0631\u062F');
			};
			const savedRate = localStorage.getItem('rr_k3');
			const initialRate = savedRate ? parseInt(savedRate, 10) : 10000;
			const selectEl = document.getElementById('refresh-rate-select');
			if (selectEl) {
				selectEl.value = String(initialRate);
			}
			window.startRefreshInterval(initialRate);
			const gfxToggleEl = document.getElementById('gfx-toggle');
			if (gfxToggleEl) gfxToggleEl.checked = localStorage.getItem('gfx-enabled') !== 'false';

			window.addEventListener('mousedown', (e) => {
				window._modalMouseDownTarget = e.target;
			});
			window.addEventListener('click', (e) => {
				if (window._modalMouseDownTarget && window._modalMouseDownTarget !== e.target) return;
				if (e.target.id === 'user-modal') toggleModal(false);
				if (e.target.id === 'ip-selector-modal') toggleIpSelectorModal(false);
					if (e.target.id === 'settings-modal') toggleSettingsModal(false);
			if (e.target.id === 'rocket-modal') toggleRocketModal(false);
				if (e.target.id === 'qr-modal') toggleQrModal(false);
				if (e.target.id === 'usage-warning-modal') closeUsageWarning();
				if (e.target.id === 'online-counter-warning-modal') closeOnlineCounterWarning();
				if (e.target.id === 'config-count-warning-modal') closeConfigCountWarning();
				if (e.target.id === 'custom-confirm-modal') {
					const cancelBtn = document.getElementById('custom-confirm-cancel');
					if (cancelBtn) cancelBtn.click();
				}
			});
		});
function toggleProxySelectorModal(show) { ys5v6m0('proxy-selector-modal', show); }
		async function bvxhocm() {
			const select = document.getElementById('vip-country-select');
			const btn = document.getElementById('vip-fetch-btn');
			select.innerHTML = '<option value="all">\u{1F310} \u0627\u0646\u062A\u062E\u0627\u0628 \u062A\u0635\u0627\u062F\u0641\u06CC \u0627\u0632 \u06A9\u0644 \u0645\u062E\u0632\u0646</option>';
			btn.disabled = false;
		}
		async function loadVipProxy() {
			const btn = document.getElementById('vip-fetch-btn');
			btn.disabled = true;
			btn.innerText = '...';
			try {
				const res = await ggsyffs('vipprox.txt?t=' + Date.now());
				if (!res.ok) throw new Error('\u0641\u0627\u06CC\u0644 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F');
				const text = await res.text();
				const lines = text.split('\\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 5; });
				if (lines.length > 0) {
					const randomProxy = lines[Math.floor(Math.random() * lines.length)];
					window.proxyFieldsData[window.activeProxyIndex || 0] = randomProxy;
					if (typeof window.renderProxyFieldsUI === 'function') window.renderProxyFieldsUI();
					const userProxyResult = document.getElementById('test-user-proxy-result');
					if (userProxyResult) {
						userProxyResult.innerText = '';
					}
					toggleProxySelectorModal(false);
					bm3pzm2('\u2705 \u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0639\u0645\u0627\u0644 \u0634\u062F.');
					testUserSocksProxy();
				} else {
					alert('\u0641\u0627\u06CC\u0644 \u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC \u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u062E\u0627\u0644\u06CC \u0627\u0633\u062A.');
				}
			} catch (e) {
				alert('\u062E\u0637\u0627 \u062F\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u067E\u0640\u0631\u0648\u06A9\u0640\u0633\u0640\u06CC \u0627\u062E\u062A\u0635\u0627\u0635\u06CC.');
			} finally {
				btn.disabled = false;
				btn.innerText = '\u062F\u0631\u06CC\u0627\u0641\u062A';
			}
		}
		async function openProxySelectorModal() {
			toggleProxySelectorModal(true);
			bvxhocm();
		}
		function toggleSupportModal(show) {
			const modal = document.getElementById('support-modal');
			const content = modal.firstElementChild;
			if (show) {
				modal.classList.remove('opacity-0', 'pointer-events-none');
				content.classList.remove('opacity-0', 'scale-95');
			} else {
				modal.classList.add('opacity-0', 'pointer-events-none');
				content.classList.add('opacity-0', 'scale-95');
			}
		}
window.addEventListener('click', (e) => {
	if (window._modalMouseDownTarget && window._modalMouseDownTarget !== e.target) return;
	if (e.target.id === 'proxy-selector-modal') toggleProxySelectorModal(false);
});
	</script>
	${Ye}
	  </body>
</html>`,status:`<!DOCTYPE html>
<html lang="fa" dir="rtl" class="dark">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>\u0648\u0636\u0639\u06CC\u062A \u0627\u0634\u062A\u0631\u0627\u06A9 \u06A9\u0627\u0631\u0628\u0631</title>
	${Ze}
	<style>
		body { font-family: 'Vazirmatn', sans-serif; }
		.glass {
			background: rgba(10, 10, 10, 0.6);
			border: 1px solid rgba(255, 255, 255, 0.05);
		}
		/* \u067E\u0631\u0686\u0645\u200C\u0647\u0627\u06CC SVG \u0628\u0631\u0627\u06CC \u0633\u0627\u0632\u06AF\u0627\u0631\u06CC \u0628\u0627 \u0648\u06CC\u0646\u062F\u0648\u0632 */
		.flg {
			display: inline-block;
			width: 1.35em;
			height: 1em;
			vertical-align: -0.15em;
			border-radius: 2px;
			background-size: cover;
			background-position: 50%;
			background-repeat: no-repeat;
		}
		.flg-g {
			font-size: 1.1em;
			line-height: 1;
			vertical-align: -0.05em;
		}
	</style>
</head>
<body class="bg-gray-50 text-gray-900 dark:bg-amoled-bg dark:text-zinc-100 min-h-screen flex flex-col items-center py-12 px-4 overflow-x-hidden">
	<div class="w-full max-w-xl glass rounded-md shadow-2xl p-6 md:p-8 relative overflow-hidden z-10">
		<div class="absolute -left-12 -top-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
		<div class="absolute -right-12 -bottom-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
		<div class="text-center mb-8 relative z-10">
			<div class="inline-flex items-center justify-center p-3 bg-blue-950/60 border border-blue-500 text-blue-400 rounded-md mb-4 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
				<svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
			</div>
			<h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">\u067E\u0640\u0646\u0640\u0644 \u0632\u0626\u0640\u0640\u0648\u0633 - \u0648\u0636\u0639\u06CC\u062A \u0627\u0634\u062A\u0631\u0627\u06A9</h1>
			<p id="display-username" class="text-sm font-bold text-blue-500 tracking-wide font-mono mb-2"></p>
			<p id="display-flag" class="text-2xl font-bold tracking-wide mb-3" style="display:none;"></p>
			<div id="live-connections-badge" style="display: none !important;">
				<span class="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
				<span id="live-connections-text" dir="rtl">\u06F0 \u062F\u0633\u062A\u06AF\u0627\u0647 \u0645\u062A\u0635\u0644</span>
			</div>
		</div>
		<div id="status-card" class="mb-6 rounded-md p-4 text-center border font-bold relative z-10 transition duration-300">
			<span id="status-text" class="text-sm">\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC \u0648\u0636\u0639\u06CC\u062A...</span>
		</div>
		<div class="grid grid-cols-2 gap-3 mb-8 relative z-10">
			<div class="bg-white/40 dark:bg-zinc-900/30 border border-gray-200 dark:border-amoled-border rounded-md p-3 shadow-sm flex flex-col justify-between">
				<div class="flex justify-between items-center mb-2">
					<span class="text-[10px] font-semibold text-gray-600 dark:text-zinc-400 flex items-center gap-1">
						<svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
						\u062D\u062C\u0645 \u0645\u0635\u0631\u0641\u06CC
					</span>
					<span id="volume-pct" class="text-[10px] font-bold text-gray-800 dark:text-zinc-200">\u06F0\u066A</span>
				</div>
				<div class="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden mb-2">
					<div id="volume-progress" class="h-1.5 rounded-full transition-all duration-1000" style="width: 0%"></div>
				</div>
				<div class="flex justify-between text-[9px] text-gray-500 dark:text-zinc-400 font-medium">
					<span id="used-vol" class="font-bold text-gray-800 dark:text-zinc-200" dir="ltr">-</span>
					<span id="limit-vol" class="font-bold text-gray-800 dark:text-zinc-200" dir="ltr">-</span>
				</div>
			</div>
			<div class="bg-white/40 dark:bg-zinc-900/30 border border-gray-200 dark:border-amoled-border rounded-md p-3 shadow-sm flex flex-col justify-between">
				<div class="flex justify-between items-center mb-2">
					<span class="text-[10px] font-semibold text-gray-600 dark:text-zinc-400 flex items-center gap-1">
						<svg class="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
						\u0632\u0645\u0627\u0646 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647
					</span>
					<span id="expiry-pct" class="text-[10px] font-bold text-gray-800 dark:text-zinc-200">\u06F0\u066A</span>
				</div>
				<div class="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden mb-2 flex justify-end">
					<div id="expiry-progress" class="h-1.5 rounded-full transition-all duration-1000" style="width: 0%"></div>
				</div>
				<div class="flex justify-between text-[9px] text-gray-500 dark:text-zinc-400 font-medium">
					<span id="days-remaining" class="font-bold text-gray-800 dark:text-zinc-200" dir="rtl">-</span>
					<span id="total-days" class="font-bold text-gray-800 dark:text-zinc-200" dir="rtl">-</span>
				</div>
			</div>
			<div class="bg-white/40 dark:bg-zinc-900/30 border border-gray-200 dark:border-amoled-border rounded-md p-3 shadow-sm flex flex-col justify-between">
				<div class="flex justify-between items-center mb-2">
					<span class="text-[10px] font-semibold text-gray-600 dark:text-zinc-400 flex items-center gap-1">
						<svg class="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
						\u0631\u06CC\u06A9\u0648\u0626\u0633\u062A\u200C\u0647\u0627
					</span>
					<span id="req-pct" class="text-[10px] font-bold text-gray-800 dark:text-zinc-200">\u06F0\u066A</span>
				</div>
				<div class="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden mb-2">
					<div id="req-progress" class="h-1.5 rounded-full transition-all duration-1000" style="width: 0%"></div>
				</div>
				<div class="flex justify-between text-[9px] text-gray-500 dark:text-zinc-400 font-medium">
					<span id="used-req" class="font-bold text-gray-800 dark:text-zinc-200" dir="ltr">-</span>
					<span id="limit-req" class="font-bold text-gray-800 dark:text-zinc-200" dir="ltr">-</span>
				</div>
			</div>
			<div class="bg-white/40 dark:bg-zinc-900/30 border border-gray-200 dark:border-amoled-border rounded-md p-3 shadow-sm flex flex-col justify-between">
				<div class="flex justify-between items-center mb-2">
					<span class="text-[10px] font-semibold text-gray-600 dark:text-zinc-400 flex items-center gap-1">
						<svg class="w-3.5 h-3.5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
						\u062F\u0633\u062A\u06AF\u0627\u0647 \u0645\u062A\u0635\u0644
					</span>
					<span id="online-pct" class="text-[10px] font-bold text-gray-800 dark:text-zinc-200">\u06F0\u066A</span>
				</div>
				<div class="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden mb-2">
					<div id="online-progress" class="h-1.5 rounded-full transition-all duration-1000" style="width: 0%"></div>
				</div>
				<div class="flex justify-between text-[9px] text-gray-500 dark:text-zinc-400 font-medium">
					<span id="online-count" class="font-bold text-gray-800 dark:text-zinc-200" dir="ltr">\u06F0</span>
					<span id="limit-online" class="font-bold text-gray-800 dark:text-zinc-200" dir="ltr">-</span>
				</div>
			</div>
		</div>
		<div class="border-t border-gray-100 dark:border-zinc-800 pt-6 relative z-10">
			<h2 class="text-sm font-bold mb-4 flex items-center gap-2">
				<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
				\u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u0640\u0627\u0646\u0641\u0640\u06CC\u06AF \u0648 \u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u0647\u0627
			</h2>
			<div class="space-y-3">
				<button onclick="copyTextSub()" class="w-full flex justify-between items-center px-4 py-3 bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border hover:border-indigo-500 dark:hover:border-indigo-500 rounded-md text-xs font-medium transition shadow-sm">
					<span class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg> \u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9 \u0633\u0627\u0628\u200C\u0627\u0633\u06A9\u0631\u06CC\u067E\u0634\u0646 \u0645\u062A\u0646\u06CC</span>
					<span class="text-indigo-500">\u06A9\u067E\u06CC</span>
				</button>
				<button onclick="showSubQr()" class="w-full flex justify-between items-center px-4 py-3 bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border hover:border-amber-500 dark:hover:border-amber-500 rounded-md text-xs font-medium transition shadow-sm">
					<span class="flex items-center gap-2"><svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 19h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg> \u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u06CC\u0648\u0622\u0631 \u06A9\u062F \u0633\u0627\u0628</span>
					<span class="text-amber-500">\u0646\u0645\u0627\u06CC\u0634</span>
				</button>
				<button onclick="copyvIeesConfig()" class="w-full flex justify-between items-center px-4 py-3 bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border hover:border-blue-500 dark:hover:border-blue-500 rounded-md text-xs font-medium transition shadow-sm">
					<span class="flex items-center gap-2"><svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> \u06A9\u067E\u06CC \u06A9\u0640\u0627\u0646\u0641\u0640\u06CC\u06AF vIees (\u0645\u0633\u062A\u0642\u06CC\u0645)</span>
					<span class="text-blue-500">\u06A9\u067E\u06CC</span>
				</button>
				<button onclick="copySingboxSub()" class="w-full flex justify-between items-center px-4 py-3 bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border hover:border-purple-500 dark:hover:border-purple-500 rounded-md text-xs font-medium transition shadow-sm">
					<span class="flex items-center gap-2"><svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg> \u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9 \u0633\u0627\u0628 Sing-box</span>
					<span class="text-purple-500">\u06A9\u067E\u06CC</span>
				</button>
				<button onclick="showSingboxQr()" class="w-full flex justify-between items-center px-4 py-3 bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border hover:border-purple-500 dark:hover:border-purple-500 rounded-md text-xs font-medium transition shadow-sm">
					<span class="flex items-center gap-2"><svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 19h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg> \u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u06CC\u0648\u0622\u0631 \u06A9\u062F Sing-box</span>
					<span class="text-purple-500">\u0646\u0645\u0627\u06CC\u0634</span>
				</button>
			</div>
		</div>
		<div class="border-t border-gray-100 dark:border-zinc-800 pt-6 mt-6 relative z-10 w-full">
			<button onclick="document.getElementById('software-downloads-content').classList.toggle('hidden'); document.getElementById('software-downloads-icon').classList.toggle('rotate-180');" class="w-full flex items-center justify-between text-sm font-bold mb-4 cursor-pointer focus:outline-none">
				<div class="flex items-center gap-2">
					<svg class="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
					<span>\u062F\u0627\u0646\u0644\u0648\u062F \u0646\u0631\u0645 \u0627\u0641\u0632\u0627\u0631 \u0647\u0627</span>
				</div>
				<svg id="software-downloads-icon" class="w-4 h-4 text-gray-500 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
			</button>
			<div id="software-downloads-content" class="hidden grid grid-cols-1 sm:grid-cols-3 gap-3">
				<!-- Android -->
				<div class="bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30 rounded-md p-2.5">
					<div class="flex items-center gap-1.5 mb-2.5 text-green-700 dark:text-green-500 font-bold text-[11px]">
						<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02L19.695 6.183c.1568-.2716.0637-.6182-.2079-.7754-.2716-.1564-.6183-.0633-.775.2082l-1.8584 3.2185c-1.3853-.6328-2.9697-.9881-4.6644-.9881-1.6946 0-3.279.3553-4.664.9881L5.6664 5.6158c-.1567-.2715-.5038-.3646-.775-.2082-.2716.1572-.3647.5038-.2079.7754l1.8136 3.1385C2.963 11.2384 1.1571 14.5422 1 18.4234h22c-.1572-3.8812-1.963-7.185-5.4955-9.102"/></svg>
						\u0627\u0646\u062F\u0631\u0648\u06CC\u062F
					</div>
					<div class="flex flex-col gap-1.5">
						<a href="https://github.com/2dust/v2rayNG/releases/latest" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-green-400 dark:hover:border-green-500 transition shadow-sm"><span>v2rayNG</span><span class="text-green-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://github.com/Happ-proxy/happ-android/releases/latest/download/Happ.apk" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-green-400 dark:hover:border-green-500 transition shadow-sm"><span>happ</span><span class="text-green-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://github.com/hiddify/hiddify-app/releases/latest/download/Hiddify-Android-universal.apk" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-green-400 dark:hover:border-green-500 transition shadow-sm"><span>Hiddify</span><span class="text-green-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://play.google.com/store/apps/details?id=com.napsternetlabs.napsternetv" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-green-400 dark:hover:border-green-500 transition shadow-sm"><span>Npv Tunnel</span><span class="text-green-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://play.google.com/store/apps/details?id=dev.hexasoftware.v2box" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-green-400 dark:hover:border-green-500 transition shadow-sm"><span>V2Box</span><span class="text-green-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://github.com/KaringX/karing/releases/latest" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-green-400 dark:hover:border-green-500 transition shadow-sm"><span>Karing</span><span class="text-green-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://github.com/ExclaveNetwork/Exclave/releases/latest" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-green-400 dark:hover:border-green-500 transition shadow-sm"><span>Exclave</span><span class="text-green-500 text-[12px]">\u{1F4E5}</span></a>
					</div>
				</div>
				<!-- Windows -->
				<div class="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-md p-2.5">
					<div class="flex items-center gap-1.5 mb-2.5 text-blue-700 dark:text-blue-500 font-bold text-[11px]">
						<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.801"/></svg>
						\u0648\u06CC\u0646\u062F\u0648\u0632
					</div>
					<div class="flex flex-col gap-1.5">
						<a href="https://github.com/2dust/v2rayN/releases/latest/download/v2rayN-windows-64.zip" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-blue-400 dark:hover:border-blue-500 transition shadow-sm"><span>v2rayN</span><span class="text-blue-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://github.com/Happ-proxy/happ-desktop/releases/latest/download/setup-Happ.x64.exe" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-blue-400 dark:hover:border-blue-500 transition shadow-sm"><span>happ</span><span class="text-blue-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://github.com/hiddify/hiddify-app/releases/latest/download/Hiddify-Windows-Setup-x64.exe" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-blue-400 dark:hover:border-blue-500 transition shadow-sm"><span>Hiddify</span><span class="text-blue-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://github.com/KaringX/karing/releases/latest" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-blue-400 dark:hover:border-blue-500 transition shadow-sm"><span>Karing</span><span class="text-blue-500 text-[12px]">\u{1F4E5}</span></a>
					</div>
				</div>
				<!-- iOS -->
				<div class="bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-200/50 dark:border-gray-700/50 rounded-md p-2.5">
					<div class="flex items-center gap-1.5 mb-2.5 text-gray-700 dark:text-gray-300 font-bold text-[11px]">
						<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.05 2.95.72 3.88 1.84-3.46 2.06-2.89 6.18.54 7.42-.85 1.58-1.54 2.82-3.07 3.75zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
						\u0622\u06CC\u0641\u0648\u0646
					</div>
					<div class="flex flex-col gap-1.5">
						<a href="https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-gray-400 dark:hover:border-gray-500 transition shadow-sm"><span>V2Box</span><span class="text-gray-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://apps.apple.com/us/app/streisand/id6450534064" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-gray-400 dark:hover:border-gray-500 transition shadow-sm"><span>Streisand</span><span class="text-gray-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://apps.apple.com/us/app/npv-tunnel/id1629465476" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-gray-400 dark:hover:border-gray-500 transition shadow-sm"><span>NapsternetV</span><span class="text-gray-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://apps.apple.com/us/app/happ-proxy-utility/id6504287215" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-gray-400 dark:hover:border-gray-500 transition shadow-sm"><span>happ</span><span class="text-gray-500 text-[12px]">\u{1F4E5}</span></a>
						<a href="https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532" target="_blank" class="flex justify-between items-center bg-white dark:bg-amoled-card border border-gray-100 dark:border-zinc-800 px-2 py-1.5 rounded text-[10px] font-semibold text-gray-700 dark:text-zinc-300 hover:border-gray-400 dark:hover:border-gray-500 transition shadow-sm"><span>Hiddify</span><span class="text-gray-500 text-[12px]">\u{1F4E5}</span></a>
					</div>
				</div>
			</div>
		</div>
	</div>
<div id="qr-modal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 opacity-0 pointer-events-none transition-opacity duration-200 ease-out">
	<div id="qr-modal-card" class="w-full max-w-sm bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-md shadow-2xl p-6 transform transition-all scale-95 opacity-0 duration-200 text-center">
		<div class="flex justify-between items-center mb-4">
			<h3 class="text-lg font-bold text-gray-900 dark:text-white">QR Code</h3>
			<button onclick="toggleQrModal(false)" class="p-1.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 shadow-sm">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
			</button>
		</div>
		<div class="flex justify-center bg-gray-100 dark:bg-amoled-bg p-4 rounded-md mb-4 border border-gray-200 dark:border-zinc-800">
			<div id="qrcode-container"></div>
		</div>
		<button onclick="downloadQrCode()" class="w-full py-2.5 bg-transparent border-2 border-green-600 text-green-700 hover:bg-green-900/20 hover:text-green-800 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/40 dark:hover:text-green-400 font-bold rounded-md text-sm transition duration-200 shadow-sm flex items-center justify-center gap-2">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
			\u062F\u0627\u0646\u0644\u0648\u062F \u062A\u0635\u0648\u06CC\u0631 QR
		</button>
	</div>
</div>
<div class="flex flex-col gap-4 mt-6 relative z-10">
	<div class="flex flex-wrap items-center gap-3 sm:gap-4 justify-center">
		<a href="https://github.com/aaaaaaaaaa" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-full shadow-sm hover:shadow-md transition text-sm font-bold text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white group">
			<svg class="w-5 h-5 group-hover:scale-110 transition" viewBox="0 0 24 24" fill="currentColor">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
			</svg>
			\u06AF\u06CC\u062A\u200C\u0647\u0627\u0628
		</a>
		<a href="https://t.me/aaaaaaaaaa" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-full shadow-sm hover:shadow-md transition text-sm font-bold text-gray-700 dark:text-zinc-300 hover:text-sky-500 dark:hover:text-sky-400 group">
			<svg class="w-5 h-5 text-sky-500 group-hover:scale-110 transition" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
			</svg>
			aaaaaaaaaa@
		</a>
	</div>
	<div class="flex flex-wrap items-center gap-3 sm:gap-4 justify-center">
		<a href="https://t.me/aaaaaaaaaa_BOT" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-full shadow-sm hover:shadow-md transition text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 group">
			<svg class="w-5 h-5 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
			</svg>
			\u0633\u0627\u062E\u062A \u0631\u0627\u06CC\u06AF\u0627\u0646 \u067E\u0640\u0646\u0640\u0644
		</a>
		<a href="https://donatonion.ir-aaaaaaa.workers.dev" target="_blank" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-amoled-card border border-gray-200 dark:border-amoled-border rounded-full shadow-sm hover:shadow-md transition text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 group">
			<svg class="w-5 h-5 text-red-500 dark:text-red-400 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3 9.24 3 10.91 3.81 12 5.08 13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
			</svg>
			\u062F\u0648\u0646\u06CC\u062A
		</a>
	</div>
</div>
${at}
	<script>
		/* {{USER_DATA_PLACEHOLDER}} */
		${Ct}
		function mash75l() {
			return window.location.host;
		}
		function wbfdlk4(user) {
			var t = String((user && user.connection_type) || 'vl' + 'e' + 'ss').toLowerCase();
			var trojan = t.indexOf('trojan') !== -1;
			var ss = t.indexOf('shadowsocks') !== -1;
			var vless = t.indexOf('vl' + 'e' + 'ss') !== -1 || (!trojan && !ss);
			return { vless: vless, trojan: trojan, ss: ss };
		}
		function fv9a4g0() {
			const u = window.statusUser;
			if (!u) return '';
			const host = mash75l();
			var ips = [host];
			if (u.ips) {
				const parsedIps = u.ips.split('\\n').map(function(ip) { return ip.trim(); }).filter(function(ip) { return ip.length > 0; });
				if (parsedIps.length > 0) ips = parsedIps;
			}
			var ports = String(u.port || '443').split(',').map(function(p) { return p.trim(); }).filter(function(p) { return p.length > 0; });
			var fp = u.fingerprint || 'unsafe';
			const dynPath = encodeURIComponent("/stream/aaaaaaaaaa/" + (u.uuid ? u.uuid.split("-")[4] : "default"));
			const pf = wbfdlk4(u);
			const links = [];
			const m1 = decodeURIComponent('%E2%9A%A0%EF%B8%8F%D9%BE%D9%86%D9%84%20%D8%B1%D8%A7%DB%8C%DA%AF%D8%A7%D9%86%D9%87%2B%D9%86%D9%81%D8%B1%D9%88%D8%B4%20%DA%A9.%D8%B5%D8%B5%D8%B5.%DA%A9%D8%B4%D8%B4%D8%B4%D8%B4%E2%9A%A0%EF%B8%8F');
			const m2 = decodeURIComponent('%F0%9F%9A%80%D9%BE%D9%86%D9%84%20%D8%AA%D9%88%D8%B3%D8%B7%20Alireza%20Tune%20%D8%AA%D9%88%D8%B3%D8%B9%D9%87%20%DB%8C%D8%A7%D9%81%D8%AA%D9%87%20%D8%A7%D8%B3%D8%AA%F0%9F%9A%80');
			if (window.statusUser && window.statusUser.info_configs) links.push('vle' + 'ss://' + (u.uuid || '') + '@0.0.0.0:1?encryption=none&security=none&type=ws&host=' + host + '&path=' + dynPath + '#' + encodeURIComponent(m1));
			if (window.statusUser && window.statusUser.info_configs) links.push('vle' + 'ss://' + (u.uuid || '') + '@0.0.0.0:1?encryption=none&security=none&type=ws&host=' + host + '&path=' + dynPath + '#' + encodeURIComponent(m2));
			let remVol = "Unlimited";
			if (u.limit_gb) {
				let rem = u.limit_gb - (u.used_gb || 0);
				remVol = rem > 0 ? rem.toFixed(2) + "GB" : "0GB";
			}
			let remTime = "Unlimited";
			if (u.expiry_days && u.created_at) {
				const created = new Date(u.created_at);
				const expiryDate = u.first_connection_time ? new Date(u.first_connection_time + u.expiry_days * 24 * 60 * 60 * 1000) : new Date(created.getTime() + u.expiry_days * 24 * 60 * 60 * 1000);
				const diffDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
				remTime = diffDays > 0 ? diffDays + "Days" : "0Days";
			}
			let remReq = "Unlimited";
			if (u.limit_req) {
				let rem = u.limit_req - (u.used_req || 0);
				remReq = rem > 0 ? rem.toLocaleString() + "Req" : "0Req";
			}
			const infoRemark = "\u{1F4CA} remaining | \u200E" + remVol + " | \u200E" + remTime + " | \u200E" + remReq;
			if (window.statusUser && window.statusUser.info_configs) links.push('vle' + 'ss://' + (u.uuid || '') + '@' + host + ':80?path=' + dynPath + '&security=none&encryption=none&host=' + host + '&fp=' + fp + '&type=ws#' + encodeURIComponent(infoRemark));
			const rawPath = "/stream/aaaaaaaaaa/" + (u.uuid ? u.uuid.split("-")[4] : "default");
			let proxyList = [];
			try {
				if (u.user_socks5 && u.user_socks5.trim().startsWith("[")) {
					proxyList = JSON.parse(u.user_socks5);
				} else if (u.user_socks5 || u.user_proxy_ip) {
					proxyList = [u.user_socks5 || u.user_proxy_ip];
				} else {
					proxyList = [null];
				}
			} catch (e) {
				proxyList = [u.user_socks5 || u.user_proxy_ip];
			}
			if (!Array.isArray(proxyList) || proxyList.length === 0) proxyList = [];
			const allowDirect = u.enable_direct !== 0;
			if (allowDirect) {
				let hasDirect = proxyList.some(function(p) { return p === null || p === ""; });
				if (!hasDirect) proxyList.push(null);
			} else {
				proxyList = proxyList.filter(function(p) { return p !== null && p !== ""; });
			}
			if (proxyList.length === 0) proxyList = [null];
			let proxyFlagCache = {};
			try { proxyFlagCache = JSON.parse(localStorage.getItem('pf_c2') || '{}'); } catch(e) {}
			for (let locIdx = 0; locIdx < proxyList.length; locIdx++) {
				let proxyItem = proxyList[locIdx];
				let proxyStr = typeof proxyItem === "object" && proxyItem !== null ? proxyItem.proxy : proxyItem;
				let countryCode = typeof proxyItem === "object" && proxyItem !== null
					? proxyItem.country
					: (proxyStr ? (proxyStr === u.user_proxy_ip ? (u.user_proxy_iata || "") : "") : (u.global_proxy_iata || ""));
				let flagEmoji = "\u{1F310}";
				if (countryCode && typeof nkis0ps === 'function') {
					flagEmoji = nkis0ps(countryCode);
				} else if (proxyStr && proxyFlagCache[proxyStr] && typeof nkis0ps === 'function') {
					flagEmoji = nkis0ps(proxyFlagCache[proxyStr]);
				}
				const currentDynPath = encodeURIComponent(rawPath + ((proxyItem !== null && proxyItem !== "") ? "/loc-" + locIdx : ""));
				const ssPlainPath = rawPath + "/ss" + ((proxyItem !== null && proxyItem !== "") ? "/loc-" + locIdx : "");
				ips.forEach((ip) => {
					ports.forEach((portStr) => {
						const isTlsPort = ["443", "2053", "2083", "2087", "2096", "8443"].includes(portStr);
						const tlsVal = isTlsPort ? "tls" : "none";
						let userFrag = u.frag_len && u.frag_int ? "&fragment=" + u.frag_len + "," + u.frag_int : "";
						if (u.advanced_frag) userFrag += "&fm=" + encodeURIComponent(u.advanced_frag);
						if (u.cipher_suites) userFrag += "&cs=" + encodeURIComponent(u.cipher_suites);
						if (u.tls_mask) userFrag += "&mask=" + encodeURIComponent(u.tls_mask);
						if (u.ech_config) userFrag += "&ech=" + encodeURIComponent(u.ech_config);
						const tagPrefix = (String(countryCode || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2)) || "NONE";
						const remark = tagPrefix + " | " + flagEmoji + " | " + u.username;
						if (pf.vless) links.push('vle' + 'ss://' + (u.uuid || '') + '@' + ip + ':' + portStr + '?path=' + currentDynPath + '&security=' + tlsVal + '&encryption=none&insecure=0&host=' + host + '&fp=' + fp + '&type=ws&allowInsecure=0&sni=' + host + userFrag + '#' + encodeURIComponent(remark));
						if (pf.trojan) {
							links.push('trojan://' + (u.uuid || '') + '@' + ip + ':' + portStr + '?security=' + tlsVal + '&type=ws&host=' + host + '&path=' + currentDynPath + '&sni=' + host + '&fp=' + fp + userFrag + '#' + encodeURIComponent(remark + ' (Trojan)'));
						}
						if (pf.ss) {
							const ssPlugin = 'v2ray-plugin;mode=websocket;host=' + host + ';path=' + ssPlainPath + (isTlsPort ? ';tls' : '');
							links.push('ss://' + btoa('aes-256-gcm:' + (u.uuid || '')) + '@' + ip + ':' + portStr + '/?plugin=' + encodeURIComponent(ssPlugin) + '#' + encodeURIComponent(remark + ' (SS)'));
						}
					});
				});
			}
			return links.join('\\n');
		}
		function copyvIeesConfig() {
			navigator.clipboard.writeText(fv9a4g0()).then(() => alert('\u2705 \u06A9\u0640\u0627\u0646\u0641\u0640\u06CC\u06AF vIees \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u06A9\u067E\u06CC \u0634\u062F!'));
		}
		function copyTextSub() {
			const link = window.location.protocol + '//' + mash75l() + '/sub/' + encodeURIComponent(window.statusUser.username);
			navigator.clipboard.writeText(link).then(() => alert('\u2705 \u0644\u06CC\u0646\u06A9 \u0633\u0627\u0628 \u0645\u062A\u0646\u06CC \u06A9\u067E\u06CC \u0634\u062F!'));
		}
		function copySingboxSub() {
			const link = window.location.protocol + '//' + mash75l() + '/singbox/' + encodeURIComponent(window.statusUser.username);
			navigator.clipboard.writeText(link).then(() => alert('\u2705 \u0644\u06CC\u0646\u06A9 \u0633\u0627\u0628 Sing-box \u06A9\u067E\u06CC \u0634\u062F!'));
		}
		function toggleQrModal(show, text) {
			const modal = document.getElementById('qr-modal');
			const card = document.getElementById('qr-modal-card');
			const container = document.getElementById('qrcode-container');
			if (show) {
				container.innerHTML = '';
				const isDark = document.documentElement.classList.contains('dark');
				const qrCode = new QRCodeStyling({
					width: 220,
					height: 220,
					data: text,
					margin: 5,
					qrOptions: { errorCorrectionLevel: 'M' },
					dotsOptions: {
						color: isDark ? "#bfdbfe" : "#1e3a8a",
						type: "rounded"
					},
					backgroundOptions: {
						color: isDark ? "#0f172a" : "#ffffff"
					},
					cornersSquareOptions: {
						color: isDark ? "#60a5fa" : "#1e40af",
						type: "extra-rounded"
					},
					cornersDotOptions: {
						color: isDark ? "#60a5fa" : "#1d4ed8",
						type: "dot"
					}
				});
				qrCode.append(container);
				modal.classList.remove('opacity-0', 'pointer-events-none');
				modal.classList.add('opacity-100', 'pointer-events-auto');
				card.classList.remove('opacity-0', 'scale-95');
				card.classList.add('opacity-100', 'scale-100');
			} else {
				modal.classList.remove('opacity-100', 'pointer-events-auto');
				modal.classList.add('opacity-0', 'pointer-events-none');
				card.classList.remove('opacity-100', 'scale-100');
				card.classList.add('opacity-0', 'scale-95');
			}
		}
		function downloadQrCode() {
			const container = document.getElementById('qrcode-container');
			if (!container) return;
			const canvas = container.querySelector('canvas');
			const img = container.querySelector('img');
			let dataUrl = '';
			if (canvas) {
				dataUrl = canvas.toDataURL("image/png");
			} else if (img && img.src) {
				dataUrl = img.src;
			}
			if (!dataUrl) {
				alert('\u26A0\uFE0F \u062A\u0635\u0648\u06CC\u0631 QR \u0628\u0631\u0627\u06CC \u062F\u0627\u0646\u0644\u0648\u062F \u06CC\u0627\u0641\u062A \u0646\u0634\u062F!');
				return;
			}
			const downloadAnchor = document.createElement('a');
			downloadAnchor.href = dataUrl;
			downloadAnchor.download = "qr_" + Date.now() + ".png";
			document.body.appendChild(downloadAnchor);
			downloadAnchor.click();
			downloadAnchor.remove();
		}
		function showSubQr() {
			const link = window.location.protocol + '//' + mash75l() + '/sub/' + encodeURIComponent(window.statusUser.username);
			toggleQrModal(true, link);
		}
		function showSingboxQr() {
			const link = window.location.protocol + '//' + mash75l() + '/singbox/' + encodeURIComponent(window.statusUser.username);
			toggleQrModal(true, link);
		}
		/* \u067E\u0631\u0686\u0645\u200C\u0647\u0627 \u0628\u0647\u200C\u0635\u0648\u0631\u062A SVG \u0646\u0645\u0627\u06CC\u0634 \u062F\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u0646\u062F \u062A\u0627 \u0631\u0648\u06CC \u0648\u06CC\u0646\u062F\u0648\u0632 (\u06A9\u0647 \u0641\u0648\u0646\u062A \u067E\u0631\u0686\u0645 \u0646\u062F\u0627\u0631\u062F) \u0647\u0645 \u062F\u0631\u0633\u062A \u062F\u06CC\u062F\u0647 \u0634\u0648\u0646\u062F. */
		function b00aqjk(countryCode) {
			if (!countryCode) return '<span class="flg-g">\u{1F310}</span>';
			const cc = String(countryCode).toLowerCase().replace(/[^a-z]/g, '');
			if (cc.length !== 2) return '<span class="flg-g">\u{1F310}</span>';
			return '<span class="fi fi-' + cc + ' flg" title="' + cc.toUpperCase() + '"></span>';
		}
		/* \u0646\u0633\u062E\u0647 \u0645\u062A\u0646\u06CC (emoji) \u0628\u0631\u0627\u06CC \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u062F\u0627\u062E\u0644 URL/remark \u0644\u06CC\u0646\u06A9 VLESS */
		function nkis0ps(countryCode) {
			if (!countryCode) return '\u{1F310}';
			const cc = String(countryCode).toUpperCase().replace(/[^A-Z]/g, '');
			if (cc.length !== 2) return '\u{1F310}';
			try {
				return String.fromCodePoint(...cc.split('').map(char => 127397 + char.charCodeAt(0)));
			} catch (e) {
				return '\u{1F310}';
			}
		}
		document.addEventListener('DOMContentLoaded', () => {
			const u = window.statusUser;
			if (!u) return;
			const limit = u.ip_limit !== undefined ? u.ip_limit : u.max_connections;
			document.getElementById('display-username').innerText = u.username;
const rkjjcq8 = document.getElementById('display-flag');
	if (u.user_proxy_iata) {
		const flag = b00aqjk(u.user_proxy_iata);
		rkjjcq8.innerHTML = flag + " " + u.user_proxy_iata.toUpperCase();
		rkjjcq8.style.display = 'block';
} else if (u.user_socks5 || u.user_proxy_ip) {
	rkjjcq8.style.display = 'block';
	let proxyList = [];
	try {
		if (u.user_socks5 && u.user_socks5.trim().startsWith("[")) {
			proxyList = JSON.parse(u.user_socks5);
		} else {
			proxyList = [u.user_socks5 || u.user_proxy_ip];
		}
	} catch(e) {
		proxyList = [u.user_socks5 || u.user_proxy_ip];
	}
	let initialFlags = proxyList.map(item => {
		let targetProxy = typeof item === 'object' && item !== null ? item.proxy : item;
		let targetCountry = typeof item === 'object' && item !== null ? item.country : null;
		if (targetCountry) return b00aqjk(targetCountry);
		try {
			const proxyFlagCache = JSON.parse(localStorage.getItem('pf_c2') || '{}');
			/* \u06A9\u0634 \u0647\u0645\u06CC\u0634\u0647 \u06A9\u062F \u06A9\u0634\u0648\u0631 (\u06F2 \u062D\u0631\u0641) \u0631\u0627 \u0630\u062E\u06CC\u0631\u0647 \u0645\u06CC\u200C\u06A9\u0646\u062F */
			const cached = proxyFlagCache[targetProxy];
			if (cached && typeof cached === 'string' && /^[a-zA-Z]{2}$/.test(cached)) return b00aqjk(cached);
		} catch(e) {}
		return '\u23F3';
	});
	rkjjcq8.innerHTML = initialFlags.join(' ');
	Promise.all(proxyList.map((item, index) => {
		let targetProxy = typeof item === 'object' && item !== null ? item.proxy : item;
		let targetCountry = typeof item === 'object' && item !== null ? item.country : null;
		if (targetCountry) return Promise.resolve(b00aqjk(targetCountry));
		try {
			const proxyFlagCache = JSON.parse(localStorage.getItem('pf_c2') || '{}');
			const cached = proxyFlagCache[targetProxy];
			if (cached && typeof cached === 'string' && /^[a-zA-Z]{2}$/.test(cached)) return Promise.resolve(b00aqjk(cached));
		} catch(e) {}
		return fetch('/api/test-proxy', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ proxy: targetProxy })
		})
		.then(res => res.json())
		.then(data => {
			if (data.success && data.country) {
				const flagSvg = b00aqjk(data.country);
				try {
					const cache = JSON.parse(localStorage.getItem('pf_c2') || '{}');
					/* \u06A9\u062F \u06A9\u0634\u0648\u0631 \u0631\u0627 \u06A9\u0634 \u0645\u06CC\u200C\u06A9\u0646\u06CC\u0645 \u062A\u0627 \u0647\u0645 \u0628\u0631\u0627\u06CC UI (SVG) \u0648 \u0647\u0645 remark (text) \u0642\u0627\u0628\u0644 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0628\u0627\u0634\u062F */
					cache[targetProxy] = data.country.toUpperCase();
					localStorage.setItem('pf_c2', JSON.stringify(cache));
				} catch(e) {}
				return flagSvg;
			}
			return '<span class="flg-g">\u{1F310}</span>';
		})
		.catch(() => '<span class="flg-g">\u{1F310}</span>');
	})).then(flags => {
		rkjjcq8.innerHTML = flags.join(' ');
	});
}
			const badge = document.getElementById('live-connections-badge');
			badge.classList.remove('hidden');
			if (u.online_count && u.online_count > 0) {
				document.getElementById('live-connections-text').innerText = u.online_count + (limit ? '/' + limit : '') + ' \u062F\u0633\u062A\u06AF\u0627\u0647 \u0645\u062A\u0635\u0644';
				badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 bg-green-600/10 border border-green-600/20 text-green-600 rounded-full text-xs font-bold shadow-sm';
				badge.querySelector('span.w-2').className = 'w-2 h-2 rounded-full bg-green-600 animate-pulse';
			} else {
				document.getElementById('live-connections-text').innerText = '\u06F0 \u062F\u0633\u062A\u06AF\u0627\u0647 \u0645\u062A\u0635\u0644';
				badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 bg-gray-500/10 border border-gray-500/20 text-gray-500 dark:text-zinc-400 rounded-full text-xs font-bold shadow-sm';
				badge.querySelector('span.w-2').className = 'w-2 h-2 rounded-full bg-gray-500';
			}
			const usedGb = u.used_gb || 0;
			const limitGb = u.limit_gb;
			const formattedUsed = usedGb < 1 ? (usedGb * 1024).toFixed(0) + ' MB' : usedGb.toFixed(2) + ' GB';
			document.getElementById('used-vol').innerText = formattedUsed;
			let isVolumeExpired = false;
			if (limitGb) {
				document.getElementById('limit-vol').innerText = limitGb + ' GB';
				const pct = Math.min((usedGb / limitGb) * 100, 100);
				document.getElementById('volume-pct').innerText = pct.toFixed(0) + '\u066A';
				document.getElementById('volume-progress').style.width = pct + '%';
				const hue = 120 - (pct * 1.2);
				document.getElementById('volume-progress').style.backgroundColor = 'hsl(' + hue + ', 80%, 45%)';
				if (usedGb >= limitGb) isVolumeExpired = true;
			} else {
				document.getElementById('limit-vol').innerText = '\u0646\u0627\u0645\u062D\u062F\u0648\u062F';
				document.getElementById('volume-pct').innerText = '\u06F0\u066A';
				document.getElementById('volume-progress').style.width = '100%';
				document.getElementById('volume-progress').style.backgroundColor = '#3b82f6';
			}
			let daysRemaining = '\u0646\u0627\u0645\u062D\u062F\u0648\u062F';
			let totalDays = '\u0646\u0627\u0645\u062D\u062F\u0648\u062F';
			let isTimeExpired = false;
			if (u.expiry_days) {
				totalDays = u.expiry_days + ' \u0631\u0648\u0632';
				if (u.created_at) {
					const created = new Date(u.created_at);
					const expiryDate = u.first_connection_time ? new Date(u.first_connection_time + u.expiry_days * 24 * 60 * 60 * 1000) : new Date(created.getTime() + u.expiry_days * 24 * 60 * 60 * 1000);
					const diffDays = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
					daysRemaining = diffDays > 0 ? diffDays : 0;
					const pct = Math.max(0, Math.min(100, (daysRemaining / u.expiry_days) * 100));
					document.getElementById('expiry-pct').innerText = pct.toFixed(0) + '\u066A';
					document.getElementById('expiry-progress').style.width = pct + '%';
					const hue = pct * 1.2;
					document.getElementById('expiry-progress').style.backgroundColor = 'hsl(' + hue + ', 80%, 45%)';
					if (new Date() > expiryDate) isTimeExpired = true;
				}
			} else {
				document.getElementById('expiry-pct').innerText = '\u06F0\u066A';
				document.getElementById('expiry-progress').style.width = '100%';
				document.getElementById('expiry-progress').style.backgroundColor = '#3b82f6';
			}
			document.getElementById('days-remaining').innerText = daysRemaining === '\u0646\u0627\u0645\u062D\u062F\u0648\u062F' ? '\u0646\u0627\u0645\u062D\u062F\u0648\u062F' : daysRemaining + ' \u0631\u0648\u0632';
			document.getElementById('total-days').innerText = totalDays;
			const usedReq = u.used_req || 0;
			const limitReq = u.limit_req;
			document.getElementById('used-req').innerText = usedReq.toLocaleString();
			let isReqExpired = false;
			if (limitReq) {
				document.getElementById('limit-req').innerText = limitReq.toLocaleString();
				const rPct = Math.min((usedReq / limitReq) * 100, 100);
				document.getElementById('req-pct').innerText = rPct.toFixed(0) + '\u066A';
				document.getElementById('req-progress').style.width = rPct + '%';
				const rHue = 120 - (rPct * 1.2);
				document.getElementById('req-progress').style.backgroundColor = 'hsl(' + rHue + ', 80%, 45%)';
				if (usedReq >= limitReq) isReqExpired = true;
			} else {
				document.getElementById('limit-req').innerText = '\u0646\u0627\u0645\u062D\u062F\u0648\u062F';
				document.getElementById('req-pct').innerText = '\u06F0\u066A';
				document.getElementById('req-progress').style.width = '100%';
				document.getElementById('req-progress').style.backgroundColor = '#3b82f6';
			}
			const onlineCount = u.online_count || 0;
			document.getElementById('online-count').innerText = onlineCount;
			if (limit) {
				document.getElementById('limit-online').innerText = limit;
				const oPct = Math.min((onlineCount / limit) * 100, 100);
				document.getElementById('online-pct').innerText = oPct.toFixed(0) + '\u066A';
				document.getElementById('online-progress').style.width = oPct + '%';
				const oHue = 120 - (oPct * 1.2);
				document.getElementById('online-progress').style.backgroundColor = 'hsl(' + oHue + ', 80%, 45%)';
			} else {
				document.getElementById('limit-online').innerText = '\u0646\u0627\u0645\u062D\u062F\u0648\u062F';
				document.getElementById('online-pct').innerText = '\u06F0\u066A';
				document.getElementById('online-progress').style.width = '100%';
				document.getElementById('online-progress').style.backgroundColor = onlineCount > 0 ? '#16a34a' : '#9ca3af'; 
			}
			const statusCard = document.getElementById('status-card');
			const statusText = document.getElementById('status-text');
			if (u.is_active === 0) {
				statusCard.className = 'mb-6 rounded-md p-4 text-center border font-bold relative z-10 bg-red-500/10 border-red-500/30 text-red-500 shadow-md shadow-red-500/5';
				statusCard.style.boxShadow = 'inset 0 0 12px rgba(239, 68, 68, 0.1)';
				statusText.innerText = '\u274C \u0648\u0636\u0639\u06CC\u062A \u0627\u0634\u062A\u0631\u0627\u06A9: \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 / \u0645\u0633\u062F\u0648\u062F \u062F\u0633\u062A\u06CC';
			} else if (isVolumeExpired || isReqExpired || isTimeExpired) {
				statusCard.className = 'mb-6 rounded-md p-4 text-center border font-bold relative z-10 bg-yellow-500/10 border-yellow-500/30 text-yellow-500 shadow-md shadow-yellow-500/5';
				if (isVolumeExpired) statusText.innerText = '\u26A0\uFE0F \u0648\u0636\u0639\u06CC\u062A \u0627\u0634\u062A\u0631\u0627\u06A9: \u062A\u0645\u0627\u0645 \u0634\u062F\u0646 \u062D\u062C\u0645 \u0645\u062C\u0627\u0632';
				else if (isReqExpired) statusText.innerText = '\u{1F4C8} \u0648\u0636\u0639\u06CC\u062A \u0627\u0634\u062A\u0631\u0627\u06A9: \u062A\u0645\u0627\u0645 \u0634\u062F\u0646 \u0631\u06CC\u06A9\u0648\u0626\u0633\u062A \u0645\u062C\u0627\u0632';
				else if (isTimeExpired) statusText.innerText = '\u23F3 \u0648\u0636\u0639\u06CC\u062A \u0627\u0634\u062A\u0631\u0627\u06A9: \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647 (\u067E\u0627\u06CC\u0627\u0646 \u0632\u0645\u0627\u0646 \u0627\u0639\u062A\u0628\u0627\u0631)';
			} else {
				statusCard.className = 'mb-6 rounded-md p-4 text-center border font-bold relative z-10 bg-green-600/10 border-green-600/30 text-green-600 shadow-md shadow-green-600/5';
				statusText.innerText = '\u2705 \u0648\u0636\u0639\u06CC\u062A \u0627\u0634\u062A\u0631\u0627\u06A9: \u0641\u0639\u0627\u0644 \u0648 \u0645\u062A\u0635\u0644';
			}
		});
		window.addEventListener('click', (e) => {
			if (e.target.id === 'qr-modal') toggleQrModal(false);
		});
	</script>
	${Ye}
</body>
</html>`},Pr=e=>new TextDecoder().decode(Uint8Array.from(atob(e),t=>t.charCodeAt(0))),Xt="";function rr(){return Xt||(Xt=Pr(nr))}export{Nr as default};
