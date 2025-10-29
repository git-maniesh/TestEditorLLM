
'use client';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import FileExplorer from '@/components/FileExplorer';
import Editor from '@/components/Editor';
import Terminal from '@/components/Terminal';

const fetcher = (url:string) => fetch(url).then(r=>r.json());

export default function Page() {
  const { data, mutate } = useSWR('/api/files', fetcher);
  const files = data?.files || [];
  const [activeFile, setActiveFile] = useState<any>(null);
  const [code, setCode] = useState('');

  useEffect(()=>{
    if (activeFile) setCode(activeFile.content || '');
  }, [activeFile]);

  async function openFile(f:any){
    setActiveFile(f);
    setCode(f.content || '');
  }

  async function save(){
    if (!activeFile) return alert('Select file');
    await fetch('/api/files/' + activeFile._id, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content: code }) });
    mutate();
    alert('Saved');
  }

  async function runPreview(){
    const win = window;
    if (!activeFile) return alert('Select an HTML file to preview');
    // pass content and postMessage will be used by iframe to forward logs
    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
    if (!iframe) return;
    const srcdoc = activeFile.name.endsWith('.html') ? code : '<pre>Preview only for HTML files</pre>';
    iframe.srcdoc = srcdoc + `
<script>
  (function(){
    const send = (type, msg) => parent.postMessage({ type, msg }, '*');
    const origLog = console.log;
    console.log = function(...args){ send('log', args.map(a=>typeof a==='object'?JSON.stringify(a):String(a)).join(' ')); origLog.apply(console, args); };
    window.onerror = function(msg, src, line, col, err){ send('error', String(msg)); };
    send('ready', 'iframe ready');
  })();
</script>`;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-3">
        <div><strong>Vibecode Playground</strong></div>
        <div className="space-x-2">
          <a href="/login" className="btn">Login</a>
          <a href="/register" className="btn">Register</a>
        </div>
      </div>

      <div className="flex gap-4 h-[75vh]">
        <div className="w-80 bg-slate-900 p-3 rounded overflow-auto">
          <FileExplorer files={files} onOpen={openFile} mutate={mutate} />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="mb-2 flex gap-2">
            <select className="p-2 rounded bg-slate-800 text-white">
              <option>Editor</option>
            </select>
            <button className="btn" onClick={save}>Save</button>
            <button className="btn" onClick={runPreview}>Run</button>
          </div>
          <div className="flex gap-4 flex-1">
            <div className="flex-1">
              <Editor code={code} onChange={(v)=>setCode(v)} />
            </div>
            <div className="w-96">
              <div className="mb-2"><strong>Preview / Console</strong></div>
              <iframe id="preview-iframe" title="preview" className="w-full h-[60vh] bg-white" sandbox="allow-scripts"></iframe>
              <div className="mt-2"><Terminal /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
