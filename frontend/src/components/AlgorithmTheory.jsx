import React from 'react';
import { motion } from 'framer-motion';

const AlgorithmTheory = ({ algo }) => {
    const content = {
        dijkstra: {
            title: "Dijkstra's Algorithm",
            def: "Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a weighted graph, which may represent, for example, road networks.",
            time: "O((V + E) log V)",
            space: "O(V)",
            steps: [
                "Mark all nodes unvisited. Create a set of all the unvisited nodes.",
                "Assign to every node a tentative distance value: set it to zero for our initial node and to infinity for all other nodes.",
                "From the current node, consider all of its unvisited neighbors and calculate their tentative distances through the current node.",
                "Compare the newly calculated tentative distance to the current assigned value and assign the smaller one.",
                "When we are done considering all of the unvisited neighbors of the current node, mark the current node as visited. A visited node will never be checked again.",
                "If the destination node has been marked visited or if the smallest tentative distance among the nodes in the unvisited set is infinity, then stop.",
                "Otherwise, select the unvisited node that is marked with the smallest tentative distance, set it as the new 'current node', and go back to step 3."
            ]
        },
        floyd: {
            title: "Floyd-Warshall Algorithm",
            def: "The Floyd-Warshall algorithm is an algorithm for finding shortest paths in a directed weighted graph with positive or negative edge weights (but with no negative cycles).",
            time: "O(V³)",
            space: "O(V²)",
            steps: [
                "Initialize the shortest paths between all pairs of vertices with their edge weights, or infinity if there is no edge.",
                "For each vertex k, update the shortest path between any two vertices i and j by checking if a path through k is shorter than the current path (i to j).",
                "The update formula: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).",
                "Repeat this for all vertices k from 1 to V.",
                "After V iterations, the dist matrix contains the shortest path between all pairs of vertices."
            ]
        }
    };

    const current = content[algo];
    if (!current) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ padding: '30px', marginTop: '24px' }}
        >
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--secondary)' }}>{current.title}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.6' }}>{current.def}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--glass)', padding: '15px', borderRadius: '12px' }}>
                    <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Time Complexity</span>
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{current.time}</p>
                </div>
                <div style={{ background: 'var(--glass)', padding: '15px', borderRadius: '12px' }}>
                    <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Space Complexity</span>
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{current.space}</p>
                </div>
            </div>

            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>How it works:</h3>
            <ol style={{ paddingLeft: '20px' }}>
                {current.steps.map((step, i) => (
                    <li key={i} style={{ marginBottom: '10px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{step}</li>
                ))}
            </ol>
        </motion.div>
    );
};

export default AlgorithmTheory;
