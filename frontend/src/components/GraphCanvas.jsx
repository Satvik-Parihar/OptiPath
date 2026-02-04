import React, { useState, useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

const GraphCanvas = ({ elements, setElements }) => {
    const cyRef = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null);

    const layout = {
        name: 'preset',
    };

    const style = [
        {
            selector: 'node',
            style: {
                'background-color': '#ffffff',
                'label': 'data(label)',
                'color': '#1c1917',
                'text-valign': 'center',
                'text-halign': 'center',
                'width': '60px',
                'height': '60px',
                'font-family': 'Plus Jakarta Sans',
                'font-size': '16px',
                'font-weight': '700',
                'border-width': '3px',
                'border-color': '#c2410c', // Primary Terracotta
                'box-shadow': '0 4px 12px rgba(0,0,0,0.1)',
                'transition-property': 'background-color, border-color, width, height',
                'transition-duration': '0.3s'
            }
        },
        {
            selector: 'node:selected',
            style: {
                'background-color': '#ffedt1', // Light orange
                'border-color': '#9a3412',
                'border-width': '4px',
                'width': '65px',
                'height': '65px',
                'shadow-blur': 10
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#d6d3d1', // Stone 300
                'target-arrow-color': '#d6d3d1',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'label': 'data(weight)',
                'color': '#44403c', // Warm dark gray
                'font-size': '14px',
                'font-weight': '600',
                'text-margin-y': -12,
                'edge-text-rotation': 'autorotate',
                'text-background-opacity': 1,
                'text-background-color': '#fcf9f2', // Match main bg
                'text-background-padding': '4px',
                'text-background-shape': 'roundrectangle',
                'text-border-width': 1,
                'text-border-color': '#e7e5e4',
                'text-border-opacity': 1
            }
        },
        {
            selector: '.node-active',
            style: {
                'background-color': '#c2410c', // Primary
                'color': '#ffffff',
                'border-color': '#9a3412',
                'border-width': '4px',
                'width': '70px',
                'height': '70px',
                'shadow-blur': 20,
                'shadow-color': '#c2410c'
            }
        },
        {
            selector: '.path-highlight',
            style: {
                'line-color': '#0f766e', // Teal
                'target-arrow-color': '#0f766e',
                'width': 5,
                'z-index': 100
            }
        },
        {
            selector: '.node-visited',
            style: {
                'background-color': '#d1fae5', // Light green/teal
                'border-color': '#0f766e',
                'color': '#0f766e'
            }
        }
    ];

    const addNode = () => {
        const id = (elements.filter(e => !e.data.source).length + 1).toString();
        const newNode = {
            data: { id, label: id },
            position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 300 }
        };
        setElements([...elements, newNode]);
    };

    useEffect(() => {
        if (!cyRef.current) return;

        cyRef.current.on('tap', 'node', (evt) => {
            const node = evt.target;
            const nodeId = node.id();

            if (selectedNode && selectedNode !== nodeId) {
                // Create edge
                const weight = prompt('Enter edge weight:', '10') || '10';
                const newEdge = {
                    data: {
                        id: `${selectedNode}-${nodeId}`,
                        source: selectedNode,
                        target: nodeId,
                        weight
                    }
                };
                setElements(prev => [...prev, newEdge]);
                setSelectedNode(null);
                cyRef.current.$(`#${selectedNode}`).unselect();
            } else {
                setSelectedNode(nodeId);
            }
        });

        cyRef.current.on('tap', (evt) => {
            if (evt.target === cyRef.current) {
                setSelectedNode(null);
            }
        });
    }, [elements, selectedNode]);

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
                    <div style={{ width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%' }}></div>
                    Interactive Graph
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
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Graph view generated from image analysis.</p>
            </div>
        </div>
    );
};

export default GraphCanvas;
