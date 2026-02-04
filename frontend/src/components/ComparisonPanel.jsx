import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

const ComparisonPanel = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card"
            style={{ padding: '30px' }}
        >
            <h2 style={{ fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>Comparison Analysis</h2>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Feature</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: 'var(--primary)' }}>Dijkstra</th>
                            <th style={{ padding: '15px', textAlign: 'left', color: 'var(--secondary)' }}>Floyd-Warshall</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <td style={{ padding: '15px' }}>Algorithm Type</td>
                            <td style={{ padding: '15px' }}>Greedy</td>
                            <td style={{ padding: '15px' }}>Dynamic Programming</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <td style={{ padding: '15px' }}>Scope</td>
                            <td style={{ padding: '15px' }}>Single Source</td>
                            <td style={{ padding: '15px' }}>All-Pairs</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <td style={{ padding: '15px' }}>Negative Edges</td>
                            <td style={{ padding: '15px' }}><XCircle color="#f87171" size={18} /> Not Supported</td>
                            <td style={{ padding: '15px' }}><CheckCircle2 color="#4ade80" size={18} /> Supported</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <td style={{ padding: '15px' }}>Time Complexity</td>
                            <td style={{ padding: '15px' }}>O(E log V)</td>
                            <td style={{ padding: '15px' }}>O(V³)</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '15px' }}>Best For</td>
                            <td style={{ padding: '15px' }}>Large sparse graphs</td>
                            <td style={{ padding: '15px' }}>Small dense graphs</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px', background: 'var(--glass)', padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ marginBottom: '10px' }}>Key Insight</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                    Dijkstra is significantly faster for finding the path between two points or from one point to all others. However, if you need to know the distances between every single pair of nodes in a network, Floyd-Warshall is more elegant as it builds a complete distance matrix in O(V³) time, which can be faster than running Dijkstra V times on dense graphs.
                </p>
            </div>
        </motion.div>
    );
};

export default ComparisonPanel;
