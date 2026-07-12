import { useRef, useState } from 'react';
import { UploadCloud, X, FileText, Image as ImageIcon } from 'lucide-react';
import { cx } from '../../utils/index.js';
import { ProgressBar } from '../ui/Progress.jsx';

const MAX_MB = 8;
const ACCEPT = 'image/*,application/pdf';

export default function EvidenceUpload({ files, onChange }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList).slice(0, 5).map((f) => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 6)}`,
      name: f.name,
      size: f.size,
      type: f.type,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      progress: 100, // fake — UI only
    }));
    onChange([...(files || []), ...incoming]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const remove = (id) => onChange(files.filter((f) => f.id !== id));

  return (
    <div className="space-y-3">
      <label
        htmlFor="evidence-input"
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={cx(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors',
          drag ? 'border-brand bg-brand-soft/40' : 'border-border bg-surface hover:bg-elevated'
        )}
      >
        <div className="h-10 w-10 rounded-full bg-elevated text-brand flex items-center justify-center">
          <UploadCloud size={18} />
        </div>
        <p className="text-sm font-medium text-fg">
          Drag &amp; drop or <span className="text-brand underline">browse files</span>
        </p>
        <p className="text-xs text-muted">Images or PDFs · up to {MAX_MB}MB each · max 5 files</p>
        <input
          ref={inputRef}
          id="evidence-input"
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </label>

      {files?.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {files.map((f) => (
            <li
              key={f.id}
              className="relative rounded-lg border border-border bg-surface overflow-hidden group"
            >
              <div className="aspect-video bg-elevated flex items-center justify-center">
                {f.preview ? (
                  <img src={f.preview} alt={f.name} className="h-full w-full object-cover" />
                ) : (
                  <FileText size={22} className="text-muted" />
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-fg truncate flex items-center gap-1.5">
                  {f.type?.startsWith('image/') ? <ImageIcon size={12} /> : <FileText size={12} />}
                  {f.name}
                </p>
                <p className="text-[10px] text-muted mt-0.5">{(f.size / 1024).toFixed(1)} KB</p>
                <div className="mt-1.5">
                  <ProgressBar value={f.progress} tone="success" />
                </div>
              </div>
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() => remove(f.id)}
                className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
