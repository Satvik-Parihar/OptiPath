import React from 'react';
import { motion } from 'framer-motion';

const AlgorithmTheory = ({ algo }) => {
    const content = {
        dijkstra: {
            title: "Dijkstra's Algorithm",
            strategy: "Greedy Strategy",
            def: "Dijkstra's algorithm finds the shortest path from a single source node to all other nodes in a weighted graph. It is the gold standard for pathfinding in networks without negative edge weights.",
            constraints: "⚠️ Only works with non-negative edge weights. Negative weights can lead to incorrect results because the algorithm assumes that once a node is visited, its shortest path is finalized.",
            time: "O((V + E) log V)",
            space: "O(V)",
            steps: [
                "Initialize distances to all nodes as Infinity, except the source node which is 0.",
                "Priority Queue: Insert the source node into a min-priority queue (ordered by distance).",
                "Extraction: While the queue is not empty, extract the node with the smallest distance.",
                "Relaxation: For each neighbor of the current node, calculate the distance through the current node.",
                "Update: If 'Dist(Current) + Weight(Edge)' is less than 'Dist(Neighbor)', update the neighbor's distance and parent pointer.",
                "Completion: Mark the current node as 'Visited'. It will not be processed again."
            ]
        },
        floyd: {
            title: "Floyd-Warshall Algorithm",
            strategy: "Dynamic Programming",
            def: "Floyd-Warshall is an all-pairs shortest path algorithm. It calculates the shortest distance between every possible pair of nodes in a single run.",
            constraints: "✅ Works with negative edge weights, but ⚠️ cannot handle negative cycles (where the sum of weights in a loop is negative).",
            time: "O(V³)",
            space: "O(V²)",
            steps: [
                "Pre-process: Initialize a distance matrix where dist[i][j] is the edge weight between node i and j, or 0 if i=j, or Infinity otherwise.",
                "Iterative DP: The algorithm uses three nested loops (k, i, j).",
                "The Pivot (k): In each iteration 'k', node 'k' is considered as an intermediate junction.",
                "Optimal Substructure: For every pair (i, j), check if going through node 'k' (i → k → j) provides a shorter path than the current known path (i → j).",
                "Recurrence: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).",
                "Final Goal: After considering all nodes as pivots, the matrix holds the absolute shortest path between all nodes."
            ]
        }
    };

    const current = content[algo];
    if (!current) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ padding: '32px', marginTop: '24px', border: '1px solid var(--border)' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '26px', color: 'var(--text-main)', margin: 0 }}>{current.title}</h2>
                <span style={{
                    padding: '4px 12px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--primary)',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '0.05em'
                }}>{current.strategy}</span>
            </div>

            <p style={{ color: 'var(--text-main)', marginBottom: '16px', lineHeight: '1.6', fontSize: '15px' }}>{current.def}</p>

            <div style={{
                background: '#fff7ed',
                borderLeft: '4px solid var(--primary)',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '13px',
                color: '#9a3412'
            }}>
                {current.constraints}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: '16px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Time Complexity</span>
                    <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>{current.time}</p>
                </div>
                <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: '16px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Space Complexity</span>
                    <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>{current.space}</p>
                </div>
            </div>

            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontFamily: 'Fraunces' }}>Standard Procedure:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {current.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            background: 'var(--primary)',
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            flexShrink: 0,
                            marginTop: '2px'
                        }}>{i + 1}</div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '14px' }}>{step}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default AlgorithmTheory;
