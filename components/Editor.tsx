
'use client';
import dynamic from 'next/dynamic';
import React from 'react';
const Monaco = dynamic(() => import('@monaco-editor/react'), { ssr:false });

export default function Editor({ code='', onChange }: any) {
  return (
    <div style={{height:'60vh'}}>
      <Monaco height="60vh" defaultLanguage="javascript" value={code} onChange={(v)=>onChange(v)} options={{automaticLayout:true, minimap:{enabled:false}}} />
    </div>
  );
}
