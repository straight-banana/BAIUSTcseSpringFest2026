import { useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission1SubNav from '../../components/mission1/Mission1SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import EvidenceUpload from '../../components/mission1/EvidenceUpload.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { Paperclip, CheckCircle2, XCircle, FileText, Image as ImageIcon, Film, ShieldCheck } from 'lucide-react';

const MOCK_FILES = [
  { id: 'ev-1', name: 'incident-photo.jpg',       type: 'image/jpeg',      size: 812_400,  preview: null, progress: 100, status: 'success' },
  { id: 'ev-2', name: 'signed-attendance.pdf',    type: 'application/pdf', size: 240_030,  preview: null, progress: 100, status: 'success' },
  { id: 'ev-3', name: 'corridor-clip.mp4',        type: 'video/mp4',       size: 3_240_500, preview: null, progress: 62,  status: 'uploading' },
  { id: 'ev-4', name: 'blurry-shot.png',          type: 'image/png',       size: 4_800_000, preview: null, progress: 0,   status: 'error' },
];

const supported = [
  { ext: 'JPG',  icon: <ImageIcon size={14} /> },
  { ext: 'PNG',  icon: <ImageIcon size={14} /> },
  { ext: 'PDF',  icon: <FileText size={14} /> },
  { ext: 'MP4',  icon: <Film size={14} /> },
];

const STATUS_MAP = {
  success:   { tone: 'text-success', icon: <CheckCircle2 size={12} />, label: 'Uploaded' },
  uploading: { tone: 'text-brand',   icon: <Paperclip size={12} />,    label: 'Uploading' },
  error:     { tone: 'text-danger',  icon: <XCircle size={12} />,      label: 'Failed' },
};

export default function EvidenceManager() {
  const [files, setFiles] = useState([]);

  return (
    <PageContainer>
      <PageHeader
        title="Evidence Manager"
        subtitle="Drop images, PDFs, and video clips. Metadata is stripped server-side before storage."
        icon={<Paperclip size={18} />}
      />
      <Mission1SubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-fg mb-3">Upload new evidence</h3>
            <EvidenceUpload files={files} onChange={setFiles} />
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-fg">Recent uploads (mock)</h3>
              <span className="text-xs text-muted">{MOCK_FILES.length} files</span>
            </div>
            <ul className="divide-y divide-border">
              {MOCK_FILES.map((f) => {
                const st = STATUS_MAP[f.status];
                const kb = (f.size / 1024).toFixed(1);
                const mb = (f.size / 1024 / 1024).toFixed(2);
                return (
                  <li key={f.id} className="py-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-elevated text-muted flex items-center justify-center shrink-0">
                      {f.type.startsWith('image/') ? <ImageIcon size={16} /> :
                       f.type.startsWith('video/') ? <Film size={16} /> :
                       <FileText size={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-fg truncate">{f.name}</p>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-border overflow-hidden">
                        <div
                          className={
                            f.status === 'error' ? 'h-full bg-danger' :
                            f.status === 'success' ? 'h-full bg-success' :
                            'h-full bg-brand'
                          }
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-muted mt-1 font-mono">
                        {f.size > 1_000_000 ? `${mb} MB` : `${kb} KB`} · {f.type}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] ${st.tone}`}>
                      {st.icon} {st.label}
                    </span>
                    <Button size="sm" variant="ghost">Remove</Button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-brand" />
              <h3 className="text-sm font-semibold text-fg">Evidence is safe</h3>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Uploaded files are stripped of EXIF metadata (camera signature, GPS, timestamps)
              before being written to storage. Only authorized reviewers can access the raw file.
            </p>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-fg mb-2">Supported formats</h3>
            <ul className="grid grid-cols-2 gap-2">
              {supported.map((s) => (
                <li key={s.ext} className="flex items-center gap-2 rounded-md border border-border bg-surface px-2 py-1.5 text-xs text-fg">
                  {s.icon} {s.ext}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-muted">Max 8 MB per file · Up to 5 files per complaint.</p>
          </Card>

          <Alert tone="warning" title="Blurry / cropped media may be rejected">
            Reviewers need to confirm what happened. Take a second shot if the first is unclear.
          </Alert>
        </aside>
      </div>
    </PageContainer>
  );
}
