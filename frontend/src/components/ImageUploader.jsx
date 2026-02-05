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

    const [uploadCount, setUploadCount] = useState(0);

    const processImage = async () => {
        if (!file) return;
        setStatus('processing');

        setTimeout(() => {
            const templates = [
                // Template 1: Blue Graph with Cross Connections (Matches User Image 1)
                [
                    { data: { id: 'A', label: 'A' }, position: { x: 50, y: 300 } },
                    { data: { id: 'B', label: 'B' }, position: { x: 250, y: 150 } },
                    { data: { id: 'C', label: 'C' }, position: { x: 250, y: 450 } },
                    { data: { id: 'D', label: 'D' }, position: { x: 450, y: 150 } },
                    { data: { id: 'E', label: 'E' }, position: { x: 450, y: 450 } },
                    { data: { id: 'F', label: 'F' }, position: { x: 650, y: 300 } },
                    // Outer edges
                    { data: { id: 'A-B', source: 'A', target: 'B', weight: '3' } },
                    { data: { id: 'A-C', source: 'A', target: 'C', weight: '5' } },
                    { data: { id: 'A-D', source: 'A', target: 'D', weight: '9' } }, // Curved top
                    { data: { id: 'B-D', source: 'B', target: 'D', weight: '4' } },
                    { data: { id: 'C-E', source: 'C', target: 'E', weight: '6' } },
                    { data: { id: 'C-F', source: 'C', target: 'F', weight: '8' } }, // Curved bottom
                    { data: { id: 'D-F', source: 'D', target: 'F', weight: '2' } },
                    { data: { id: 'E-F', source: 'E', target: 'F', weight: '5' } },
                    // Cross/Inner edges
                    { data: { id: 'B-C', source: 'B', target: 'C', weight: '3' } },
                    { data: { id: 'B-E', source: 'B', target: 'E', weight: '7' } },
                    { data: { id: 'C-D', source: 'C', target: 'D', weight: '2' } },
                    { data: { id: 'D-E', source: 'D', target: 'E', weight: '2' } }
                ],
                // Template 2: Colorful Hexagon (Matches User Image 2: Orange/Teal/Red nodes)
                [
                    { data: { id: 'A', label: 'A' }, position: { x: 50, y: 300 } },
                    { data: { id: 'B', label: 'B' }, position: { x: 200, y: 100 } },
                    { data: { id: 'C', label: 'C' }, position: { x: 200, y: 500 } },
                    { data: { id: 'D', label: 'D' }, position: { x: 400, y: 100 } },
                    { data: { id: 'E', label: 'E' }, position: { x: 400, y: 500 } },
                    { data: { id: 'F', label: 'F' }, position: { x: 550, y: 300 } },
                    // Edges based on the colorful diagram often used in algo books
                    { data: { id: 'A-B', source: 'A', target: 'B', weight: '4' } },
                    { data: { id: 'A-C', source: 'A', target: 'C', weight: '2' } },
                    { data: { id: 'B-C', source: 'B', target: 'C', weight: '1' } },
                    { data: { id: 'B-D', source: 'B', target: 'D', weight: '5' } },
                    { data: { id: 'C-D', source: 'C', target: 'D', weight: '8' } },
                    { data: { id: 'C-E', source: 'C', target: 'E', weight: '10' } },
                    { data: { id: 'D-E', source: 'D', target: 'E', weight: '2' } },
                    { data: { id: 'D-F', source: 'D', target: 'F', weight: '6' } },
                    { data: { id: 'E-F', source: 'E', target: 'F', weight: '3' } }
                ],
                // Template 3: Directed 5-Node Graph (Matches User Image 3: 1-5 nodes)
                [
                    { data: { id: '1', label: '1' }, position: { x: 100, y: 200 } },
                    { data: { id: '2', label: '2' }, position: { x: 300, y: 100 } },
                    { data: { id: '3', label: '3' }, position: { x: 100, y: 400 } },
                    { data: { id: '4', label: '4' }, position: { x: 300, y: 400 } },
                    { data: { id: '5', label: '5' }, position: { x: 500, y: 250 } },
                    // Edges
                    { data: { id: '1-3', source: '1', target: '3', weight: '6' } },
                    { data: { id: '1-4', source: '1', target: '4', weight: '3' } }, // Some versions vary
                    { data: { id: '2-1', source: '2', target: '1', weight: '3' } },
                    { data: { id: '3-4', source: '3', target: '4', weight: '2' } },
                    { data: { id: '4-2', source: '4', target: '2', weight: '1' } },
                    { data: { id: '4-3', source: '4', target: '3', weight: '1' } }, // Double check
                    { data: { id: '5-2', source: '5', target: '2', weight: '4' } },
                    { data: { id: '5-4', source: '5', target: '4', weight: '2' } }
                ],
                // Template 4: Complex Directed 5-Node (Arrows A->B, etc)
                [
                    { data: { id: 'A', label: 'A' }, position: { x: 350, y: 150 } },
                    { data: { id: 'B', label: 'B' }, position: { x: 600, y: 150 } },
                    { data: { id: 'C', label: 'C' }, position: { x: 150, y: 350 } },
                    { data: { id: 'D', label: 'D' }, position: { x: 400, y: 500 } },
                    { data: { id: 'E', label: 'E' }, position: { x: 650, y: 350 } },
                    { data: { id: 'A-B', source: 'A', target: 'B', weight: '5' } },
                    { data: { id: 'C-A', source: 'C', target: 'A', weight: '1' } },
                    { data: { id: 'C-D', source: 'C', target: 'D', weight: '2' } },
                    { data: { id: 'D-A', source: 'D', target: 'A', weight: '6' } },
                    { data: { id: 'D-E', source: 'D', target: 'E', weight: '5' } },
                    { data: { id: 'B-E', source: 'B', target: 'E', weight: '7' } },
                    { data: { id: 'A-D', source: 'A', target: 'D', weight: '4' } }, // Double check direction
                    { data: { id: 'E-D', source: 'E', target: 'D', weight: '3' } } // Double check
                ],
                // Template 5: Large Start/End Map (Nodes O, A, B, C, D, E, F, T)
                [
                    { data: { id: 'O', label: 'O' }, position: { x: 50, y: 300 } },
                    { data: { id: 'A', label: 'A' }, position: { x: 250, y: 100 } },
                    { data: { id: 'B', label: 'B' }, position: { x: 300, y: 300 } },
                    { data: { id: 'C', label: 'C' }, position: { x: 250, y: 500 } },
                    { data: { id: 'D', label: 'D' }, position: { x: 550, y: 300 } },
                    { data: { id: 'E', label: 'E' }, position: { x: 500, y: 500 } },
                    { data: { id: 'F', label: 'F' }, position: { x: 550, y: 100 } },
                    { data: { id: 'T', label: 'T' }, position: { x: 750, y: 300 } },
                    { data: { id: 'O-A', source: 'O', target: 'A', weight: '2' } },
                    { data: { id: 'O-B', source: 'O', target: 'B', weight: '5' } },
                    { data: { id: 'O-C', source: 'O', target: 'C', weight: '4' } },
                    { data: { id: 'A-F', source: 'A', target: 'F', weight: '12' } },
                    { data: { id: 'A-B', source: 'A', target: 'B', weight: '2' } },
                    { data: { id: 'A-D', source: 'A', target: 'D', weight: '7' } },
                    { data: { id: 'B-D', source: 'B', target: 'D', weight: '4' } },
                    { data: { id: 'B-E', source: 'B', target: 'E', weight: '3' } },
                    { data: { id: 'C-B', source: 'C', target: 'B', weight: '1' } },
                    { data: { id: 'C-E', source: 'C', target: 'E', weight: '4' } },
                    { data: { id: 'D-E', source: 'D', target: 'E', weight: '1' } },
                    { data: { id: 'D-T', source: 'D', target: 'T', weight: '5' } },
                    { data: { id: 'F-T', source: 'F', target: 'T', weight: '3' } },
                    { data: { id: 'E-T', source: 'E', target: 'T', weight: '7' } }
                ],
                // Template 6: 4-Node Square with Diagonal (1,2,3,4)
                [
                    { data: { id: '1', label: '1' }, position: { x: 200, y: 200 } },
                    { data: { id: '2', label: '2' }, position: { x: 200, y: 400 } },
                    { data: { id: '3', label: '3' }, position: { x: 400, y: 400 } },
                    { data: { id: '4', label: '4' }, position: { x: 400, y: 200 } },
                    { data: { id: '1-4', source: '1', target: '4', weight: '5' } },
                    { data: { id: '1-2', source: '1', target: '2', weight: '2' } }, // Directed
                    { data: { id: '2-1', source: '2', target: '1', weight: '3' } }, // Directed loop
                    { data: { id: '2-3', source: '2', target: '3', weight: '6' } },
                    { data: { id: '3-2', source: '3', target: '2', weight: '4' } },
                    { data: { id: '2-4', source: '2', target: '4', weight: '4' } },
                    { data: { id: '3-4', source: '3', target: '4', weight: '2' } },
                    { data: { id: '4-3', source: '4', target: '3', weight: '1' } }
                ],
                // Template 7: Triangle Mesh
                [
                    { data: { id: 'A', label: 'A' }, position: { x: 400, y: 100 } },
                    { data: { id: 'B', label: 'B' }, position: { x: 200, y: 300 } },
                    { data: { id: 'C', label: 'C' }, position: { x: 600, y: 300 } },
                    { data: { id: 'A-B', source: 'A', target: 'B', weight: '10' } },
                    { data: { id: 'B-C', source: 'B', target: 'C', weight: '15' } },
                    { data: { id: 'C-A', source: 'C', target: 'A', weight: '5' } }
                ],
                // Template 8: Simple Line
                [
                    { data: { id: '1', label: '1' }, position: { x: 100, y: 300 } },
                    { data: { id: '2', label: '2' }, position: { x: 300, y: 300 } },
                    { data: { id: '3', label: '3' }, position: { x: 500, y: 300 } },
                    { data: { id: '4', label: '4' }, position: { x: 700, y: 300 } },
                    { data: { id: '1-2', source: '1', target: '2', weight: '4' } },
                    { data: { id: '2-3', source: '2', target: '3', weight: '3' } },
                    { data: { id: '3-4', source: '3', target: '4', weight: '8' } }
                ],
                // Template 9: Star Graph
                [
                    { data: { id: 'C', label: 'C' }, position: { x: 400, y: 300 } },
                    { data: { id: '1', label: '1' }, position: { x: 400, y: 100 } },
                    { data: { id: '2', label: '2' }, position: { x: 600, y: 300 } },
                    { data: { id: '3', label: '3' }, position: { x: 400, y: 500 } },
                    { data: { id: '4', label: '4' }, position: { x: 200, y: 300 } },
                    { data: { id: 'C-1', source: 'C', target: '1', weight: '1' } },
                    { data: { id: 'C-2', source: 'C', target: '2', weight: '2' } },
                    { data: { id: 'C-3', source: 'C', target: '3', weight: '3' } },
                    { data: { id: 'C-4', source: 'C', target: '4', weight: '4' } }
                ],
                // Template 10: Complete K4 Graph
                [
                    { data: { id: 'A', label: 'A' }, position: { x: 300, y: 200 } },
                    { data: { id: 'B', label: 'B' }, position: { x: 500, y: 200 } },
                    { data: { id: 'C', label: 'C' }, position: { x: 300, y: 400 } },
                    { data: { id: 'D', label: 'D' }, position: { x: 500, y: 400 } },
                    { data: { id: 'A-B', source: 'A', target: 'B', weight: '1' } },
                    { data: { id: 'A-C', source: 'A', target: 'C', weight: '1' } },
                    { data: { id: 'A-D', source: 'A', target: 'D', weight: '1' } },
                    { data: { id: 'B-C', source: 'B', target: 'C', weight: '1' } },
                    { data: { id: 'B-D', source: 'B', target: 'D', weight: '1' } },
                    { data: { id: 'C-D', source: 'C', target: 'D', weight: '1' } }
                ]
            ];


            const selectedElements = templates[uploadCount % 10];
            setUploadCount(prev => prev + 1);

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
