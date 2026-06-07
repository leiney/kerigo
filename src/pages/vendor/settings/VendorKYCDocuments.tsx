import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  FileImage,
  Download,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import BottomNav from '../../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';
import { authApi } from '../../../../lib/api';
import { UserProfile } from '../../../types';
import { KYCDocument } from '../../../../lib/types';
import { BASE_URL, TENANT_ID } from '@/config';

const CACHE_KEY = 'vendor_profile_cache';

export const VendorKYCDocuments: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem(CACHE_KEY);
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to load compliance documents:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getDocuments = (): KYCDocument[] => {
    if (!profile) return [];
    const otherInfo = profile.otherInfo || {};
    return (otherInfo as any).documents || [];
  };

  const documents = getDocuments();

  const handleCancel = () => {
    navigate('/vendor/profile');
  };

  const isImageFile = (fileName: string) => {
    const lower = fileName.toLowerCase();
    return lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp');
  };

  const isPdfFile = (fileName: string) => {
    return fileName.toLowerCase().endsWith('.pdf');
  };

  // Helper to extract file ID and Name
  const getFileDetails = (file: any): { id: string; name: string } => {
    if (typeof file === 'string') {
      return { id: file, name: `Attachment_${file.slice(0, 8)}` };
    }
    if (file && typeof file === 'object') {
      const id = file.id || file.resourceId || file.name || '';
      const name = file.name || `Attachment_${id.slice(0, 8)}`;
      return { id, name };
    }
    return { id: '', name: 'Attachment' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm font-semibold text-foreground/50 animate-pulse">Loading compliance documents...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader
        title="KYC & Compliance Documents"
        subtitle="Verify business legality and identity compliance"
      />

      <div className="px-4 space-y-6">
        {documents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border/50 p-8 text-center flex flex-col items-center justify-center shadow-sm">
            <AlertCircle className="w-12 h-12 text-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-foreground/60">No compliance documents uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc, idx) => (
              <div key={doc.serialNumber || idx} className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{doc.documentType}</h3>
                    <p className="text-xs text-foreground/40 mt-1">Serial: {doc.serialNumber}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> Active
                  </span>
                </div>

                <div className="space-y-3">
                  {doc.files && (doc.files as any[]).map((file, fileIdx) => {
                    const { id: fileId, name: fileName } = getFileDetails(file);
                    if (!fileId) return null;

                    const downloadUrl = `${BASE_URL}/resources/download/${fileId}?tenant-id=${TENANT_ID}`;
                    const isImg = isImageFile(fileName) || !fileName.includes('.'); // Default to image if no extension for rich preview

                    return (
                      <div key={fileIdx} className="bg-secondary/35 rounded-xl p-3 border border-border/20 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isImg ? (
                              <FileImage className="w-4 h-4 text-primary shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-foreground/60 shrink-0" />
                            )}
                            <span className="text-xs font-semibold text-foreground truncate max-w-[180px] sm:max-w-[240px]">
                              {fileName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 hover:bg-secondary rounded-full text-foreground/60 hover:text-foreground transition-colors"
                              title="Open in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={downloadUrl}
                              download={fileName}
                              className="p-1.5 hover:bg-secondary rounded-full text-primary hover:text-primary/80 transition-colors"
                              title="Download file"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* Inline Image Preview */}
                        {isImg && (
                          <div className="w-full h-36 bg-background rounded-lg border border-border/40 overflow-hidden relative group">
                            <img
                              src={downloadUrl}
                              alt={fileName}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                              onError={(e) => {
                                // Fallback to placeholder if download fails or is not an image
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default VendorKYCDocuments;
