
'use client';
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default function Term() {
  const ref = useRef<HTMLDivElement|null>(null);
  const termRef = useRef<any>(null);

  useEffect(()=>{
    const term = new Terminal({ cols:80, rows:10 });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(ref.current!);
    fit.fit();
    term.writeln('Vibecode Console');
    termRef.current = term;

    function onMsg(e: MessageEvent){
      const data = e.data;
      if (!data || !data.type) return;
      if (data.type === 'log') term.writeln('> ' + data.msg);
      if (data.type === 'error') term.writeln('ERR: ' + data.msg);
    }
    window.addEventListener('message', onMsg);
    return ()=>{
      window.removeEventListener('message', onMsg);
      term.dispose();
    }
  }, []);

  return <div ref={ref} style={{height:120, background:'#000'}} />;
}
