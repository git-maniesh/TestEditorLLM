
'use client';
import React, { useState } from 'react';

export default function FileExplorer({ files=[], onOpen=()=>{}, mutate=()=>{} }: any) {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState(null);

  async function createFile(type='file'){
    if (!name) return alert('Enter name');
    await fetch('/api/files', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, type, parentId }) });
    setName(''); mutate();
  }

  async function deleteFile(id:any){
    if (!confirm('Delete?')) return;
    await fetch('/api/files/' + id, { method:'DELETE' });
    mutate();
  }

  // Simple flat tree grouping by parentId
  const roots = files.filter((f:any)=>!f.parentId);
  return (
    <div>
      <div className="mb-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="filename e.g. index.html" className="w-full p-2 rounded bg-slate-800" />
        <div className="flex gap-2 mt-2">
          <button className="btn" onClick={()=>createFile('file')}>New File</button>
          <button className="btn" onClick={()=>createFile('folder')}>New Folder</button>
        </div>
      </div>

      <div>
        {roots.map((r:any)=>(
          <div key={r._id} className="mb-2 border-b border-slate-700 pb-2">
            <div className="flex justify-between items-center">
              <div className="font-semibold">{r.name}</div>
              <div className="flex gap-2">
                <button className="btn" onClick={()=>onOpen(r)}>Open</button>
                <button className="btn" onClick={()=>deleteFile(r._id)}>Delete</button>
              </div>
            </div>
            <div className="ml-3 mt-2">
              {files.filter((f:any)=>f.parentId===r._id).map((c:any)=>(
                <div key={c._id} className="flex justify-between items-center">
                  <div>{c.name}</div>
                  <div className="flex gap-2">
                    <button className="btn" onClick={()=>onOpen(c)}>Open</button>
                    <button className="btn" onClick={()=>deleteFile(c._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
