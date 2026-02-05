import React, { useState, useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

const GraphCanvas = ({ elements, setElements }) => {
    const cyRef = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null);

    const layout = {
        name: 'preset',
        animate: true,
        animationDuration: 500
    };

    const style = [
        {
            selector: 'node',
            style: {
                'label': 'data(label)',
                'background-color': '#fff',
                'border-width': '3px',
                'border-color': 'var(--secondary)',
                'color': 'var(--text-main)',
                'font-size': '16px',
                'font-weight': '700',
                'text-valign': 'center',
                'text-halign': 'center',
                'width': '55px',
                'height': '55px',
                'transition-property': 'background-color, border-color, width, height',
                'transition-duration': '0.3s',
                'box-shadow': '0 4px 12px rgba(0,0,0,0.1)'
            }
        },
        {
            selector: 'node:selected',
            style: {
                'border-color': 'var(--primary)',
                'border-width': '4px',
                'background-color': '#fff7ed'
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#cbd5e1',
                'target-arrow-color': '#cbd5e1',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'label': 'data(weight)',
                'font-size': '16px',
                'font-weight': '800',
                'color': '#0f172a',
                'text-rotation': 'autorotate',
                'text-margin-y': -15,
                'text-background-opacity': 1,
                'text-background-color': '#ffffff',
                'text-background-padding': '6px',
                'text-background-shape': 'roundrectangle',
                'text-border-color': '#e2e8f0',
                'text-border-width': 1,
                'text-border-opacity': 1
            }
        },
        {
            selector: 'edge.undirected',
            style: {
                'target-arrow-shape': 'none'
            }
        },
        {
            selector: '.shortest-path-node',
            style: {
                'background-color': 'var(--primary)',
                'border-color': 'var(--primary)',
                'color': '#fff',
                'width': '65px',
                'height': '65px',
                'z-index': 10
            }
        },
        {
            selector: '.shortest-path-edge',
            style: {
                'line-color': 'var(--primary)',
                'width': 6,
                'target-arrow-color': 'var(--primary)',
                'z-index': 10
            }
        },
        {
            selector: '.edge-exploring',
            style: {
                'line-color': '#f59e0b', // Amber 500
                'target-arrow-color': '#f59e0b',
                'width': 4,
                'z-index': 9,
                'line-style': 'dashed'
            }
        }
    ];

    const addNode = () => {
        const id = (elements.filter(e => !e.data.source).length + 1).toString();
        const newNode = {
            data: { id, label: id },
            position: { x: 400, y: 300 }
        };
        setElements(prev => [...prev, newNode]);
    };

    const clearGraph = () => {
        if (window.confirm('Are you sure you want to clear the entire graph?')) {
            setElements([]);
        }
    };

    useEffect(() => {
        if (!cyRef.current) return;

        cyRef.current.on('tap', 'node', (evt) => {
            const node = evt.target;
            const nodeId = node.id();

            if (selectedNode && selectedNode !== nodeId) {
                // Check if edge already exists
                const edgeId = `${selectedNode}-${nodeId}`;
                const inverseEdgeId = `${nodeId}-${selectedNode}`;
                const exists = elements.some(e => e.data.id === edgeId || e.data.id === inverseEdgeId);

                if (!exists) {
                    const weight = prompt('Enter edge weight:', '1') || '1';
                    const newEdge = {
                        data: {
                            id: edgeId,
                            source: selectedNode,
                            target: nodeId,
                            weight
                        }
                    };
                    setElements(prev => [...prev, newEdge]);
                }
                setSelectedNode(null);
                cyRef.current.nodes().unselect();
            } else {
                setSelectedNode(nodeId);
            }
        });

        cyRef.current.on('tap', (evt) => {
            if (evt.target === cyRef.current) {
                setSelectedNode(null);
            }
        });

        // Add delete functionality
        const handleKeyDown = (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const selected = cyRef.current.$(':selected');
                if (selected.length > 0) {
                    const idsToRemove = selected.map(el => el.id());
                    setElements(prev => prev.filter(el => !idsToRemove.includes(el.data.id)));
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [elements, selectedNode, setElements]);

    return (
        <div className="glass-card" style={{ height: '600px', position: 'relative', overflow: 'hidden', background: 'white' }}>
            <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10, display: 'flex', gap: '10px' }}>
                <div style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    background: 'white',
                    borderRadius: '50px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                    Interactive Editor
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={addNode} className="btn-secondary" style={{ padding: '8px 16px', height: 'auto', background: 'white' }}>
                        <Plus size={16} /> Add Node
                    </button>
                    <button onClick={clearGraph} className="btn-secondary" style={{ padding: '8px 16px', height: 'auto', background: 'white', color: '#ef4444' }}>
                        <Trash2 size={16} /> Clear Graph
                    </button>
                </div>
            </div>

            <CytoscapeComponent
                elements={elements}
                style={{ width: '100%', height: '100%' }}
                stylesheet={style}
                layout={layout}
                cy={(cy) => { cyRef.current = cy; }}
                className="cy-container"
            />

            <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 10 }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    <b>How to build:</b> 1. Click 'Add Node' 2. Select a node, then click another to link them 3. Press Delete to remove selected.
                </p>
            </div>
        </div>
    );
};

export default GraphCanvas;
