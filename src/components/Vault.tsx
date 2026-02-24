import { useState, useEffect, type ChangeEvent } from 'react';

interface VaultProps {
  user: { username: string } | null;
}

export function Vault({ user }: VaultProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sharingFile, setSharingFile] = useState<string | null>(null);
  const [duration, setDuration] = useState('PT15M');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const bucketName = user?.username?.toLowerCase().replace(/[^a-z0-9.-]/g, '-') || '';

  const fetchFiles = async () => {
    if (!bucketName) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/minio/${bucketName}`);
      if (response.ok) {
        const data = await response.json();
        // The backend returns an array of strings (filenames)
        setFiles(Array.isArray(data) ? data : []);
      } else if (response.status === 404) {
        // Bucket might not exist, try to create it
        await createBucket();
      } else {
        throw new Error(`Failed to fetch files: ${response.status}`);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading files');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createBucket = async () => {
    if (!bucketName) return;
    try {
      const response = await fetch(`/api/minio/${bucketName}`, {
        method: 'POST',
      });
      if (response.ok) {
        setFiles([]);
        setError(null);
      } else {
        throw new Error(`Failed to create bucket: ${response.status}`);
      }
    } catch (err) {
      console.error('Error creating bucket', err);
      setError('Error creating bucket');
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !bucketName) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/minio/${bucketName}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchFiles();
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload error');
    } finally {
      setUploading(false);
      // Clear input
      e.target.value = '';
    }
  };

  const handleDownload = (filename: string) => {
    if (!bucketName) return;
    window.open(`/api/minio/${bucketName}/download/${filename}`, '_blank');
  };

  const toggleShare = (filename: string) => {
    if (sharingFile === filename) {
      setSharingFile(null);
      setGeneratedLink(null);
    } else {
      setSharingFile(filename);
      setGeneratedLink(null);
      setDuration('PT15M');
    }
  };

  const handleGenerateLink = async (filename: string) => {
    if (!bucketName) return;
    try {
      const response = await fetch(`/api/minio/${bucketName}/link/${duration}/${filename}`);
      if (response.ok) {
        const link = await response.text();
        setGeneratedLink(link);
      } else {
        alert('Failed to generate link');
      }
    } catch (err) {
      console.error('Error generating link', err);
      alert('Error generating link');
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      alert('Link copied to clipboard!');
    }
  };

  if (!user) {
    return (
      <div className="vault-container">
        <h2>Vault</h2>
        <p>Please log in to access your vault.</p>
      </div>
    );
  }

  return (
    <div className="vault-container glass-panel">
      <h2>Vault</h2>
      <p>Secure storage for {user.username}</p>

      <div className="upload-section">
        <label className="upload-button">
          {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" onChange={handleUpload} disabled={uploading} hidden />
        </label>
      </div>

      {loading ? (
        <p>Loading files...</p>
      ) : error ? (
        <div className="error-section">
          <p className="error">{error}</p>
          <button className="create-vault-button" onClick={() => createBucket().catch(() => {})}>
            Create Vault
          </button>
        </div>
      ) : (
        <ul className="file-list">
          {files.length === 0 ? (
            <p>No files yet.</p>
          ) : (
            files.map((fileName) => (
              <li key={fileName} className="file-item-container">
                <div className="file-item">
                  <button 
                    className="file-link" 
                    onClick={() => handleDownload(fileName)}
                    title="Download"
                  >
                    {fileName}
                  </button>
                  <button 
                    className="share-button" 
                    onClick={() => toggleShare(fileName)}
                  >
                    {sharingFile === fileName ? 'Cancel' : 'Share'}
                  </button>
                </div>
                
                {sharingFile === fileName && (
                  <div className="share-panel">
                    {!generatedLink ? (
                      <div className="share-setup">
                        <select 
                          value={duration} 
                          onChange={(e) => setDuration(e.target.value)}
                          className="duration-select"
                        >
                          <option value="PT15M">15 Minutes</option>
                          <option value="PT1H">1 Hour</option>
                          <option value="P1D">1 Day</option>
                          <option value="P7D">1 Week</option>
                        </select>
                        <button 
                          onClick={() => handleGenerateLink(fileName)}
                          className="generate-button"
                        >
                          Generate Link
                        </button>
                      </div>
                    ) : (
                      <div className="link-display">
                        <input 
                          type="text" 
                          readOnly 
                          value={generatedLink} 
                          className="link-input"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <button onClick={copyToClipboard} className="copy-button">
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
