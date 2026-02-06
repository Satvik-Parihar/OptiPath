import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ChevronRight, ChevronLeft, Info, BarChart3, Edit3, Plus } from 'lucide-react';
import GraphCanvas from './components/GraphCanvas';
import AlgorithmTheory from './components/AlgorithmTheory';
import ComparisonPanel from './components/ComparisonPanel';
import ImageUploader from './components/ImageUploader';

// Dynamically set API base URL based on environment
const API_BASE = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api/algo'
    : '/api/algo');

function App() {
  const [elements, setElements] = useState([]);
  const [algo, setAlgo] = useState(null); // 'dijkstra' or 'floyd'
  const [view, setView] = useState('editor'); // 'editor', 'theory', 'comparison'
  const [simulationData, setSimulationData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startNode, setStartNode] = useState('1');
  const [edgeInput, setEdgeInput] = useState('');

  /* Removed addEdge */

  const runAlgorithm = async (type) => {
    setLoading(true);
    // Reset previous simulation state
    setSimulationData(null);
    setCurrentStep(0);
    setAlgo(type);

    try {
      const nodes = elements.filter(el => !el.data.source).map(el => ({ id: el.data.id }));
      const edges = elements.filter(el => el.data.source).map(el => ({
        source: el.data.source,
        target: el.data.target,
        weight: el.data.weight
      }));

      // Check if graph is undirected (has edges with 'undirected' class)
      const isUndirected = elements.some(el => el.classes && el.classes.includes('undirected'));

      const res = await axios.post(`${API_BASE}/${type === 'dijkstra' ? 'dijkstra' : 'floyd-warshall'}`, {
        nodes,
        edges,
        startNode: type === 'dijkstra' ? startNode : undefined,
        isDirected: !isUndirected
      });

      setSimulationData(res.data);
      setCurrentStep(0);
      setView('editor');
    } catch (err) {
      alert('Error running algorithm. Check console.');
      console.error(err);
      setAlgo(null);
    }
    setLoading(false);
  };

  // Synchronize startNode with available nodes when graph changes
  useEffect(() => {
    const nodes = elements.filter(el => !el.data.source);
    if (nodes.length > 0 && !nodes.find(n => n.data.id === startNode)) {
      setStartNode(nodes[0].data.id);
    }
  }, [elements, startNode]);

  const nextStep = () => {
    if (simulationData && currentStep < simulationData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setSimulationData(null);
    setAlgo(null);
    setCurrentStep(0);
    // Clear classes from elements but preserve 'undirected' which is part of graph type
    setElements(prev => prev.map(el => ({
      ...el,
      classes: (el.classes || '').split(' ').filter(c => c === 'undirected').join(' ')
    })));
  };

  // Effect to highlight graph during simulation
  useEffect(() => {
    if (!simulationData || !simulationData.steps || !simulationData.steps[currentStep]) return;

    if (algo === 'dijkstra') {
      const step = simulationData.steps[currentStep];
      const visitedNodes = step.visited || [];
      const currentNode = step.currentNode;
      const currentPrevious = step.previous || {};
      const exploringEdges = step.exploring || [];

      setElements(prevElements => prevElements.map(el => {
        if (!el.data.source) {
          // Node styling
          let className = '';
          if (el.data.id === currentNode) className = 'node-active';
          else if (visitedNodes.includes(el.data.id)) className = 'node-visited';
          return { ...el, classes: className };
        } else {
          // Edge styling
          const target = el.data.target;
          const source = el.data.source;

          // Logic to find path to current node
          const getPathToNode = (target, prevMap) => {
            const path = [];
            let curr = target;
            while (curr && prevMap[curr]) {
              path.push({ from: prevMap[curr], to: curr });
              curr = prevMap[curr];
            }
            return path;
          };

          // Check if graph is undirected (has edges with 'undirected' class)
          const isUndirected = elements.some(el => el.classes && el.classes.includes('undirected'));
          const isDirected = !isUndirected;

          const activePath = getPathToNode(currentNode, currentPrevious);
          const isActivePath = activePath.some(
            p => (p.from === source && p.to === target) || (!isDirected && p.from === target && p.to === source)
          );

          const isExploring = exploringEdges.some(
            e => (e.from === source && e.to === target) || (!isDirected && e.from === target && e.to === source)
          );

          // Check if edge is part of the general shortest path tree
          const isSPT = currentPrevious[target] === source || (!isDirected && currentPrevious[source] === target);

          const classList = [];
          if ((el.classes || '').includes('undirected')) {
            classList.push('undirected');
          }

          if (isActivePath) classList.push('shortest-path-edge');
          else if (isSPT) classList.push('spt-edge');
          else if (isExploring) classList.push('edge-exploring');

          return { ...el, classes: classList.join(' ') };
        }
      }));
    } else if (algo === 'floyd') {
      const step = simulationData.steps[currentStep];
      const k = step.k;
      setElements(prevElements => prevElements.map(el => {
        if (!el.data.source) {
          return { ...el, classes: el.data.id === k ? 'node-active' : '' };
        }
        // Preserve undirected class for edges
        const classList = [];
        if ((el.classes || '').includes('undirected')) {
          classList.push('undirected');
        }
        return { ...el, classes: classList.join(' ') };
      }));
    }
  }, [currentStep, simulationData, algo]);

  return (
    <div className="App">
      <header className="header">
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img src="/optipath-logo.png" alt="OptiPath Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>OptiPath</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Algorithm Visualizer</p>
          </div>
        </div>

        <nav className="nav-buttons" style={{ display: 'flex', gap: '8px', background: 'var(--bg-subtle)', padding: '6px', borderRadius: '14px' }}>
          <button onClick={() => setView('editor')} className={`btn-secondary ${view === 'editor' ? 'active' : ''}`}>
            <Edit3 size={16} /> Editor
          </button>
          <button onClick={() => setView('theory')} className={`btn-secondary ${view === 'theory' ? 'active' : ''}`}>
            <Info size={16} /> Theory
          </button>
          <button onClick={() => setView('comparison')} className={`btn-secondary ${view === 'comparison' ? 'active' : ''}`}>
            <BarChart3 size={16} /> Compare
          </button>
        </nav>
      </header>

      <main className="container">
        <AnimatePresence mode="wait">
          {view === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid-layout"
            >
              <div className="left-panel">
                {simulationData && (
                  <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', flexShrink: 0 }}>
                    <div>
                      <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Step Counter</h4>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)', fontFamily: 'Fraunces' }}>
                          Step {currentStep + 1}
                        </p>
                        <span style={{ fontSize: '14px', color: 'var(--text-light)', fontWeight: '500' }}>of {simulationData.steps.length}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={prevStep} disabled={currentStep === 0} className="btn-secondary" style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronLeft size={18} />
                      </button>
                      <button onClick={nextStep} disabled={currentStep === simulationData.steps.length - 1} className="btn-secondary" style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronRight size={18} />
                      </button>
                      <button onClick={handleReset} className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2', padding: '0 12px', height: '36px', fontSize: '13px', gap: '6px', display: 'flex', alignItems: 'center' }}>
                        <RotateCcw size={14} /> Reset
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ flex: 1, minHeight: 0 }}>
                  <GraphCanvas elements={elements} setElements={setElements} />
                </div>
              </div>

              <aside className="right-panel">
                <div className="glass-card" style={{
                  padding: '32px',
                  // overflow: 'hidden' // removing hidden overflow to allow scrolling if needed
                }}>
                  <div style={{ display: !simulationData ? 'block' : 'none' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '18px', color: 'var(--text-main)', flexShrink: 0 }}>Configuration</h3>

                    <ImageUploader onUploadSuccess={(newElements) => setElements(newElements)} />

                    <div style={{ textAlign: 'center', margin: '16px 0' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>OR</span>
                    </div>

                    <button
                      onClick={() => setElements([{ data: { id: '1', label: '1' }, position: { x: 400, y: 300 } }])}
                      className="btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', marginBottom: '24px', borderStyle: 'dashed', background: 'rgba(99, 102, 241, 0.05)' }}
                    >
                      <Plus size={18} /> Create Custom Graph
                    </button>

                    <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>START NODE</label>
                      </div>
                      <select
                        className="select-input"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                        value={startNode}
                        onChange={(e) => setStartNode(e.target.value)}
                      >
                        {elements.filter(el => !el.data.source).map(el => (
                          <option key={el.data.id} value={el.data.id}>Node {el.data.label}</option>
                        ))}
                      </select>
                    </div>



                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                      <button
                        onClick={() => runAlgorithm('dijkstra')}
                        className="btn-primary"
                        style={{ justifyContent: 'center' }}
                        disabled={loading || elements.length === 0}
                      >
                        {loading ? 'Processing...' : 'Run Dijkstra Algorithm'}
                      </button>
                      <button
                        onClick={() => runAlgorithm('floyd')}
                        className="btn-floyd"
                        disabled={loading || elements.length === 0}
                      >
                        Run Floyd-Warshall
                      </button>
                    </div>
                  </div>

                  {simulationData && (
                    <div className="simulation-info">
                      <h4 style={{ color: 'var(--text-main)', marginBottom: '20px', fontSize: '18px', fontFamily: 'Fraunces' }}>
                        {algo === 'dijkstra' ? 'Dijkstra Analysis' : 'Floyd-Warshall Analysis'}
                      </h4>

                      {algo === 'dijkstra' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ padding: '16px', background: '#fff7ed', borderRadius: '16px', border: '1px solid #ffedd5' }}>
                              <span style={{ fontSize: '11px', color: '#c2410c', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>Current Node</span>
                              <p style={{ fontSize: '20px', fontWeight: '700', color: '#9a3412', marginTop: '4px' }}>
                                {simulationData?.steps[currentStep]?.currentNode || '-'}
                              </p>
                            </div>
                            <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #dcfce7' }}>
                              <span style={{ fontSize: '11px', color: '#15803d', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>Visited</span>
                              <p style={{ fontSize: '20px', fontWeight: '700', color: '#166534', marginTop: '4px' }}>
                                {simulationData?.steps[currentStep]?.visited?.length || 0}
                                <span style={{ fontSize: '14px', color: '#86efac' }}>/ {elements.filter(e => !e.data.source).length}</span>
                              </p>
                            </div>
                          </div>

                          <div>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '12px', fontWeight: '600' }}>DISTANCE TABLE (STEP {currentStep + 1})</span>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', borderRadius: '16px', border: '1px solid var(--border)' }}>
                              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'var(--bg-subtle)', position: 'sticky', top: 0 }}>
                                  <tr>
                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontWeight: '600', color: 'var(--text-muted)' }}>Node</th>
                                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid var(--border)', fontWeight: '600', color: 'var(--text-muted)' }}>Dist</th>
                                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid var(--border)', fontWeight: '600', color: 'var(--text-muted)' }}>Prev</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.entries(simulationData?.steps[currentStep]?.distances || {}).map(([id, d]) => (
                                    <tr key={id} style={{
                                      background: simulationData?.steps[currentStep]?.currentNode === id ? '#fff7ed' : 'white',
                                      transition: 'background 0.2s'
                                    }}>
                                      <td style={{ padding: '12px', borderBottom: '1px solid var(--border)', color: 'var(--text-main)' }}>
                                        <b style={{ color: simulationData?.steps[currentStep]?.currentNode === id ? 'var(--primary)' : 'inherit' }}>{id}</b>
                                      </td>
                                      <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid var(--border)', fontWeight: '600', color: d === null || d === Infinity ? 'var(--text-light)' : 'var(--text-main)' }}>
                                        {d === null || d === Infinity ? '∞' : d}
                                      </td>
                                      <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                                        {simulationData?.steps[currentStep]?.previous && simulationData?.steps[currentStep]?.previous[id] ? simulationData?.steps[currentStep]?.previous[id] : '-'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {algo === 'floyd' && (
                        <div>
                          <div style={{ padding: '16px', background: '#f0fdfa', borderRadius: '16px', border: '1px solid #ccfbf1', marginBottom: '20px' }}>
                            <span style={{ fontSize: '11px', color: '#0f766e', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>Pivot Node (K)</span>
                            <p style={{ fontSize: '20px', fontWeight: '700', color: '#115e59', marginTop: '4px' }}>
                              {simulationData?.steps[currentStep]?.k === 'Initial' ? 'Initial Matrix' : `Node ${simulationData?.steps[currentStep]?.k || ''}`}
                            </p>
                          </div>
                          <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                            <table style={{ fontSize: '13px', width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ background: 'var(--bg-subtle)' }}>
                                  <th style={{ padding: '10px', border: '1px solid var(--border)', color: 'var(--text-muted)' }}></th>
                                  {simulationData.nodeOrder.map(id => (
                                    <th key={id} style={{ padding: '10px', border: '1px solid var(--border)', color: 'var(--text-main)' }}>{id}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {simulationData?.steps[currentStep]?.matrix?.map((row, i) => (
                                  <tr key={i}>
                                    <th style={{ padding: '10px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-main)' }}>{simulationData.nodeOrder[i]}</th>
                                    {row.map((val, j) => (
                                      <td key={j} style={{
                                        border: '1px solid var(--border)',
                                        padding: '10px',
                                        textAlign: 'center',
                                        background: (simulationData.nodeOrder[i] === simulationData?.steps[currentStep]?.k || simulationData.nodeOrder[j] === simulationData?.steps[currentStep]?.k) ? '#f0fdfa' : 'white',
                                        fontWeight: val !== Infinity ? '600' : '400',
                                        color: val === Infinity ? 'var(--text-light)' : 'var(--text-main)'
                                      }}>
                                        {val === null || val === Infinity ? '∞' : val}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </aside>
            </motion.div>
          )}

          {view === 'theory' && (
            <motion.div
              key="theory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <AlgorithmTheory algo="dijkstra" />
                <AlgorithmTheory algo="floyd" />
              </div>
            </motion.div>
          )}

          {view === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ComparisonPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)', flexShrink: 0 }}>
        <p>© 2026 OptiPath - DAA Course Project</p>
      </footer>
    </div>
  );
}

export default App;
