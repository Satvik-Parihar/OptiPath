// Dijkstra's Algorithm Simulation
const solveDijkstra = (req, res) => {
    const { nodes, edges, startNode } = req.body;

    if (!startNode || !nodes || !edges) {
        return res.status(400).json({ error: 'Incomplete graph data' });
    }

    // Convert to adjacency list
    const adj = {};
    nodes.forEach(node => adj[node.id] = []);
    edges.forEach(edge => {
        adj[edge.source].push({ to: edge.target, weight: Number(edge.weight) });
        // Assuming undirected graph for visualizer, can be changed
        adj[edge.target].push({ to: edge.source, weight: Number(edge.weight) });
    });

    const distances = {};
    const previous = {};
    const steps = [];
    const visited = new Set();
    const pq = [[0, startNode]];

    nodes.forEach(node => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
    });
    distances[startNode] = 0;

    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [d, u] = pq.shift();

        if (visited.has(u)) continue;
        visited.add(u);

        // Save step
        steps.push({
            currentNode: u,
            distances: { ...distances },
            visited: Array.from(visited),
            exploring: []
        });

        adj[u].forEach(neighbor => {
            const v = neighbor.to;
            const weight = neighbor.weight;
            const alt = distances[u] + weight;

            if (alt < distances[v]) {
                distances[v] = alt;
                previous[v] = u;
                pq.push([alt, v]);
            }

            // Add exploration step details
            steps[steps.length - 1].exploring.push({ from: u, to: v, weight });
        });
    }

    res.json({ distances, previous, steps });
};

// Floyd-Warshall Algorithm Simulation
const solveFloydWarshall = (req, res) => {
    const { nodes, edges } = req.body;
    const n = nodes.length;
    const nodeIds = nodes.map(node => node.id);
    const dist = Array(n).fill().map(() => Array(n).fill(Infinity));
    const next = Array(n).fill().map(() => Array(n).fill(null));

    for (let i = 0; i < n; i++) dist[i][i] = 0;

    edges.forEach(edge => {
        const u = nodeIds.indexOf(edge.source);
        const v = nodeIds.indexOf(edge.target);
        dist[u][v] = Number(edge.weight);
        dist[v][u] = Number(edge.weight); // Undirected
        next[u][v] = v;
        next[v][u] = u;
    });

    const steps = [];

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
            }
        }
        // Snapshot after considering intermediate node k
        steps.push({
            k: nodeIds[k],
            matrix: JSON.parse(JSON.stringify(dist)),
            nodeOrder: nodeIds
        });
    }

    res.json({ matrix: dist, steps, nodeOrder: nodeIds });
};

module.exports = { solveDijkstra, solveFloydWarshall };
