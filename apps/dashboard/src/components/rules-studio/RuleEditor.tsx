"use client";

import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { defaultEditorOptions } from "@/lib/monaco/editorOptions";
import type { editor } from "monaco-editor";

export interface RuleEditorRef {
  editor: editor.IStandaloneCodeEditor | null;
  getValue: () => string;
  focus: () => void;
  setDiagnostics: (markers: editor.IMarkerData[]) => void;
  revealLine: (line: number, column: number) => void;
}

interface RuleEditorProps {
  value: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  onRun?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export const RuleEditor = forwardRef<RuleEditorRef, RuleEditorProps>(({ value, onChange, onSave, onRun, onDirtyChange }, ref) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const initialValueRef = useRef(value);

  useImperativeHandle(ref, () => ({
    editor: editorRef.current,
    getValue: () => editorRef.current?.getValue() || "",
    focus: () => editorRef.current?.focus(),
    setDiagnostics: (markers: editor.IMarkerData[]) => {
      const editorInstance = editorRef.current;
      if (editorInstance) {
        const model = editorInstance.getModel();
        // Dynamic import or global monaco object needed to set markers.
        // We can just get monaco instance from the window if loaded, but a cleaner way is:
        import('monaco-editor').then(monaco => {
           if (model) {
             monaco.editor.setModelMarkers(model, "aegisllm", markers);
           }
        });
      }
    },
    revealLine: (line: number, column: number) => {
      const editorInstance = editorRef.current;
      if (editorInstance) {
        editorInstance.revealLineInCenter(line);
        editorInstance.setPosition({ lineNumber: line, column });
        editorInstance.focus();
      }
    }
  }));

  // Reset dirty state when the active rule (and thus initial value) completely changes externally
  useEffect(() => {
    initialValueRef.current = value;
    setIsDirty(false);
    onDirtyChange?.(false);
  }, [value, onDirtyChange]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Handle Ctrl+S / Cmd+S
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const currentValue = editor.getValue();
      if (onSave) {
        onSave(currentValue);
        initialValueRef.current = currentValue;
        setIsDirty(false);
        onDirtyChange?.(false);
      }
    });

    // Handle Ctrl+Enter / Cmd+Enter
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun) {
        onRun();
      }
    });
  };

  const handleChange = (currentValue: string | undefined) => {
    const safeValue = currentValue || "";
    if (onChange) {
      onChange(safeValue);
    }
    
    const dirty = safeValue !== initialValueRef.current;
    if (dirty !== isDirty) {
      setIsDirty(dirty);
      onDirtyChange?.(dirty);
    }
  };

  return (
    <div className="w-full h-full relative">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="yaml"
        theme="vs-dark"
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            <span className="text-sm">Loading Editor...</span>
          </div>
        }
        options={{ 
          ...defaultEditorOptions,
          readOnly: false,
          domReadOnly: false,
        }}
      />
    </div>
  );
});

RuleEditor.displayName = "RuleEditor";
