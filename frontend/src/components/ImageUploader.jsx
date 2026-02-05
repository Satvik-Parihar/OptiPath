import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle2, AlertCircle } from 'lucide-react';

const ImageUploader = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error

    const handleFile = (selectedFile) => {
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setStatus('idle');
        } else {
            alert('Please select an image file.');
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFile(droppedFile);
    };

    const processImage = async () => {
        if (!file) return;
        setStatus('processing');

        try {
            const formData = new FormData();
            formData.append('image', file);

            // Determine API URL (same logic as App.jsx)
            const API_BASE = (window.location.hostname === 'localhost'
                ? 'http://localhost:5000/api/algo'
                : '/api/algo');

            const response = await fetch(`${API_BASE}/analyze-image`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze image');
            }

            const data = await response.json();

            if (data.elements && Array.isArray(data.elements)) {
                setStatus('success');
                onUploadSuccess(data.elements);
            } else {
                throw new Error('Invalid response format from AI');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.message);
            setStatus('error');
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        setStatus('idle');
    };

    return (
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: file ? '4px' : '16px', fontSize: '18px' }}>Upload Graph Image</h3>
            {!file && (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                    Upload an image of your graph diagram. Our AI will analyze it and generate the nodes and edges automatically.
                </p>
            )}

            {!file ? (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    style={{
                        border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--glass-border)'}`,
                        borderRadius: '16px',
                        padding: '30px 20px',
                        background: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'var(--glass)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onClick={() => document.getElementById('file-upload').click()}
                >
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFile(e.target.files[0])}
                    />
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--glass)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <Upload size={32} color="var(--primary)" />
                    </div>
                    <p style={{ fontWeight: '600', marginBottom: '4px' }}>Click to upload or drag and drop</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PNG, JPG or SVG (Max 5MB)</p>
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    <div style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid var(--glass-border)',
                        background: '#f8fafc',
                        marginBottom: '12px',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '10px'
                    }}>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{ width: 'auto', height: '140px', objectFit: 'contain', display: 'block', borderRadius: '8px' }}
                        />
                        <button
                            onClick={removeFile}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {status === 'idle' && (
                        <button onClick={processImage} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            <ImageIcon size={18} /> Process Image
                        </button>
                    )}

                    {status === 'processing' && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '12px' }}>
                            <div className="spinner" style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid var(--glass-border)',
                                borderTopColor: 'var(--primary)',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <span style={{ fontWeight: '500' }}>Analyzing Graph...</span>
                        </div>
                    )}

                    {status === 'success' && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '8px',
                            color: '#10b981',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '8px',
                            fontSize: '13px'
                        }}>
                            <CheckCircle2 size={16} />
                            <span style={{ fontWeight: '600' }}>Graph Generated!</span>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ImageUploader;
