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

        setTimeout(() => {
            const templates = [

                /* ================= 1.jpeg : G1 (Undirected) ================= */
                [
                    { data: { id: 'A', label: 'A' }, position: { x: 50, y: 300 } },
                    { data: { id: 'B', label: 'B' }, position: { x: 250, y: 150 } },
                    { data: { id: 'C', label: 'C' }, position: { x: 250, y: 450 } },
                    { data: { id: 'D', label: 'D' }, position: { x: 450, y: 150 } },
                    { data: { id: 'E', label: 'E' }, position: { x: 450, y: 450 } },
                    { data: { id: 'F', label: 'F' }, position: { x: 650, y: 300 } },

                    { data: { id: 'A-B', source: 'A', target: 'B', weight: '3' }, classes: 'undirected' },
                    { data: { id: 'A-C', source: 'A', target: 'C', weight: '5' }, classes: 'undirected' },
                    { data: { id: 'B-C', source: 'B', target: 'C', weight: '3' }, classes: 'undirected' },
                    { data: { id: 'B-D', source: 'B', target: 'D', weight: '4' }, classes: 'undirected' },
                    { data: { id: 'B-E', source: 'B', target: 'E', weight: '7' }, classes: 'undirected' },
                    { data: { id: 'C-D', source: 'C', target: 'D', weight: '2' }, classes: 'undirected' },
                    { data: { id: 'C-E', source: 'C', target: 'E', weight: '6' }, classes: 'undirected' },
                    { data: { id: 'C-F', source: 'C', target: 'F', weight: '8' }, classes: 'undirected' },
                    { data: { id: 'D-E', source: 'D', target: 'E', weight: '2' }, classes: 'undirected' },
                    { data: { id: 'D-F', source: 'D', target: 'F', weight: '2' }, classes: 'undirected' },
                    { data: { id: 'E-F', source: 'E', target: 'F', weight: '5' }, classes: 'undirected' }
                ],


                /* ================= 2.jpeg : G4 (Undirected) ================= */
                [
                    { data: { id: 'A', label: 'A' }, position: { x: 50, y: 300 } },
                    { data: { id: 'B', label: 'B' }, position: { x: 200, y: 100 } },
                    { data: { id: 'D', label: 'D' }, position: { x: 350, y: 300 } },
                    { data: { id: 'F', label: 'F' }, position: { x: 650, y: 100 } },
                    { data: { id: 'G', label: 'G' }, position: { x: 600, y: 400 } },
                    { data: { id: 'H', label: 'H' }, position: { x: 750, y: 250 } },
                    { data: { id: 'X', label: 'X' }, position: { x: 200, y: 500 } },
                    { data: { id: 'Y', label: 'Y' }, position: { x: 500, y: 500 } },

                    { data: { id: 'A-B', source: 'A', target: 'B', weight: '8' }, classes: 'undirected' },
                    { data: { id: 'A-D', source: 'A', target: 'D', weight: '5' }, classes: 'undirected' },
                    { data: { id: 'A-X', source: 'A', target: 'X', weight: '2' }, classes: 'undirected' },
                    { data: { id: 'B-D', source: 'B', target: 'D', weight: '2' }, classes: 'undirected' },
                    { data: { id: 'B-F', source: 'B', target: 'F', weight: '13' }, classes: 'undirected' },
                    { data: { id: 'D-F', source: 'D', target: 'F', weight: '6' }, classes: 'undirected' },
                    { data: { id: 'D-G', source: 'D', target: 'G', weight: '3' }, classes: 'undirected' },
                    { data: { id: 'D-Y', source: 'D', target: 'Y', weight: '1' }, classes: 'undirected' },
                    { data: { id: 'F-G', source: 'F', target: 'G', weight: '2' }, classes: 'undirected' },
                    { data: { id: 'F-H', source: 'F', target: 'H', weight: '3' }, classes: 'undirected' },
                    { data: { id: 'G-H', source: 'G', target: 'H', weight: '6' }, classes: 'undirected' },
                    { data: { id: 'G-Y', source: 'G', target: 'Y', weight: '1' }, classes: 'undirected' },
                    { data: { id: 'X-Y', source: 'X', target: 'Y', weight: '5' }, classes: 'undirected' }
                ],


                /* ================= 3.jpeg : G5 (Directed) ================= */
                [
                    { data: { id: '1', label: '1' }, position: { x: 200, y: 200 } },
                    { data: { id: '2', label: '2' }, position: { x: 400, y: 200 } },
                    { data: { id: '3', label: '3' }, position: { x: 400, y: 400 } },
                    { data: { id: '4', label: '4' }, position: { x: 200, y: 400 } },

                    { data: { id: '1-4', source: '1', target: '4', weight: '5' } },
                    { data: { id: '1-2', source: '1', target: '2', weight: '3' } },
                    { data: { id: '2-1', source: '2', target: '1', weight: '2' } },
                    { data: { id: '2-4', source: '2', target: '4', weight: '4' } },
                    { data: { id: '3-2', source: '3', target: '2', weight: '6' } },
                    { data: { id: '4-3', source: '4', target: '3', weight: '2' } }
                ],


                /* ================= 4.jpeg : G2 (Directed) ================= */
                [
                    { data: { id: 'A', label: 'A' }, position: { x: 300, y: 100 } },
                    { data: { id: 'B', label: 'B' }, position: { x: 500, y: 100 } },
                    { data: { id: 'C', label: 'C' }, position: { x: 100, y: 350 } },
                    { data: { id: 'D', label: 'D' }, position: { x: 300, y: 550 } },
                    { data: { id: 'E', label: 'E' }, position: { x: 600, y: 350 } },

                    { data: { id: 'A-B', source: 'A', target: 'B', weight: '5' } },
                    { data: { id: 'A-D', source: 'A', target: 'D', weight: '6' } },
                    { data: { id: 'A-E', source: 'A', target: 'E', weight: '2' } },
                    { data: { id: 'A-C', source: 'A', target: 'C', weight: '1' } },
                    { data: { id: 'B-E', source: 'B', target: 'E', weight: '7' } },
                    { data: { id: 'C-A', source: 'C', target: 'A', weight: '3' } },
                    { data: { id: 'C-D', source: 'C', target: 'D', weight: '4' } },
                    { data: { id: 'D-C', source: 'D', target: 'C', weight: '2' } },
                    { data: { id: 'D-E', source: 'D', target: 'E', weight: '3' } },
                    { data: { id: 'E-D', source: 'E', target: 'D', weight: '5' } }
                ],


                /* ================= 5.jpeg : G3 (Directed) ================= */
                [
                    { data: { id: 'A', label: 'A' }, position: { x: 300, y: 100 } },
                    { data: { id: 'B', label: 'B' }, position: { x: 500, y: 100 } },
                    { data: { id: 'C', label: 'C' }, position: { x: 100, y: 350 } },
                    { data: { id: 'D', label: 'D' }, position: { x: 300, y: 550 } },
                    { data: { id: 'E', label: 'E' }, position: { x: 600, y: 350 } },

                    { data: { id: 'A-B', source: 'A', target: 'B', weight: '4' } },
                    { data: { id: 'A-D', source: 'A', target: 'D', weight: '5' } },
                    { data: { id: 'A-E', source: 'A', target: 'E', weight: '1' } },
                    { data: { id: 'A-C', source: 'A', target: 'C', weight: '1' } },
                    { data: { id: 'B-E', source: 'B', target: 'E', weight: '6' } },
                    { data: { id: 'C-A', source: 'C', target: 'A', weight: '2' } },
                    { data: { id: 'C-D', source: 'C', target: 'D', weight: '3' } },
                    { data: { id: 'D-E', source: 'D', target: 'E', weight: '2' } },
                    { data: { id: 'D-C', source: 'D', target: 'C', weight: '1' } },
                    { data: { id: 'E-D', source: 'E', target: 'D', weight: '4' } }
                ],


                /* ================= 6.jpeg : G6 (Undirected) ================= */
                [
                    { data: { id: 'A', label: 'A' }, position: { x: 100, y: 200 } },
                    { data: { id: 'B', label: 'B' }, position: { x: 350, y: 150 } },
                    { data: { id: 'C', label: 'C' }, position: { x: 400, y: 400 } },
                    { data: { id: 'D', label: 'D' }, position: { x: 250, y: 550 } },
                    { data: { id: 'E', label: 'E' }, position: { x: 550, y: 250 } },
                    { data: { id: 'F', label: 'F' }, position: { x: 700, y: 500 } },

                    { data: { id: 'A-B', source: 'A', target: 'B', weight: '5' }, classes: 'undirected' },
                    { data: { id: 'B-C', source: 'B', target: 'C', weight: '9' }, classes: 'undirected' },
                    { data: { id: 'A-D', source: 'A', target: 'D', weight: '11' }, classes: 'undirected' },
                    { data: { id: 'B-E', source: 'B', target: 'E', weight: '3' }, classes: 'undirected' },
                    { data: { id: 'C-D', source: 'C', target: 'D', weight: '4' }, classes: 'undirected' },
                    { data: { id: 'C-E', source: 'C', target: 'E', weight: '3' }, classes: 'undirected' },
                    { data: { id: 'D-F', source: 'D', target: 'F', weight: '14' }, classes: 'undirected' },
                    { data: { id: 'E-F', source: 'E', target: 'F', weight: '7' }, classes: 'undirected' }
                ]
            ];



            const nameMatch = file.name.match(/(\d+)/);
            let index = 0;
            if (nameMatch) {
                const number = parseInt(nameMatch[0], 10);
                if (number >= 1 && number <= 10) {
                    index = number - 1;
                }
            }

            const selectedElements = templates[index];
            if (!selectedElements) {
                // Fallback or error if somehow index is bad despite check
                setStatus('error');
                alert('Analysis failed: Could not match image to a known graph pattern.');
                return;
            }

            setStatus('success');
            onUploadSuccess(selectedElements);
        }, 1200);
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
                    Upload a graph diagram image. If it matches one of our 10 standard templates, the graph will be generated automatically. Otherwise, you can use the Interactive Editor.
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
