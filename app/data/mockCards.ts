import type { CardData, EngineNode, EngineEdge } from "@/engine";

// Mock card data representing different content types
export const mockCards: CardData[] = [
  {
    label: "Introduction to Graph Theory",
    description: "A comprehensive guide to understanding graphs, nodes, and edges in computer science.",
    cardType: "article",
    author: "Dr. Smith",
    thumbnail: "https://picsum.photos/seed/graph1/400/300",
    tags: ["math", "cs", "fundamentals"],
    connections: ["card-2", "card-3"],
  },
  {
    label: "Network Visualization",
    description: "Techniques for rendering complex network data in web applications.",
    cardType: "article",
    author: "Jane Doe",
    thumbnail: "https://picsum.photos/seed/network/400/300",
    tags: ["visualization", "web"],
    connections: ["card-4"],
  },
  {
    label: "React Flow Deep Dive",
    description: "Building interactive node-based interfaces with React Flow.",
    cardType: "video",
    author: "Tech Channel",
    thumbnail: "https://picsum.photos/seed/react/400/300",
    tags: ["react", "tutorial"],
    connections: ["card-5", "card-6"],
  },
  {
    label: "Layout Algorithms",
    description: "Exploring dagre, force-directed, and radial layout algorithms.",
    cardType: "article",
    thumbnail: "https://picsum.photos/seed/algo/400/300",
    tags: ["algorithms"],
    connections: ["card-5"],
  },
  {
    label: "D3.js Fundamentals",
    description: "Data-driven documents for the web.",
    cardType: "link",
    url: "https://d3js.org",
    thumbnail: "https://picsum.photos/seed/d3/400/300",
    tags: ["d3", "svg"],
    connections: [],
  },
  {
    label: "Canvas vs SVG",
    description: "Comparing rendering approaches for web graphics.",
    cardType: "note",
    tags: ["performance", "graphics"],
    connections: [],
  },
  {
    label: "Mountain Landscape",
    description: "A beautiful mountain scene captured at sunrise.",
    cardType: "image",
    thumbnail: "https://picsum.photos/seed/mountain/400/300",
    tags: ["nature", "photography"],
    connections: [],
  },
  {
    label: "Urban Architecture",
    description: "Modern cityscapes and architectural photography.",
    cardType: "image",
    thumbnail: "https://picsum.photos/seed/city/400/300",
    tags: ["architecture", "urban"],
    connections: ["card-9"],
  },
  {
    label: "Design Systems",
    description: "Building scalable design systems for product teams.",
    cardType: "article",
    author: "Design Co",
    thumbnail: "https://picsum.photos/seed/design/400/300",
    tags: ["design", "systems"],
    connections: [],
  },
  {
    label: "TypeScript Tips",
    description: "Advanced TypeScript patterns for better code.",
    cardType: "video",
    author: "TS Guru",
    thumbnail: "https://picsum.photos/seed/ts/400/300",
    tags: ["typescript", "tips"],
    connections: [],
  },
  {
    label: "State Management",
    description: "Comparing Zustand, Jotai, and Redux for React apps.",
    cardType: "article",
    thumbnail: "https://picsum.photos/seed/state/400/300",
    tags: ["react", "state"],
    connections: ["card-3"],
  },
  {
    label: "CSS Grid Mastery",
    description: "Complete guide to CSS Grid layout.",
    cardType: "link",
    url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
    thumbnail: "https://picsum.photos/seed/css/400/300",
    tags: ["css", "layout"],
    connections: [],
  },
];

// Convert mock data to nodes
export function getMockNodes(): EngineNode<CardData>[] {
  return mockCards.map((card, index) => ({
    id: `card-${index + 1}`,
    type: "card",
    position: { x: 0, y: 0 },
    data: {
      ...card,
      connections: card.connections,
    },
  }));
}

// Generate edges from card connections
export function getMockEdges(): EngineEdge[] {
  const edges: EngineEdge[] = [];
  const nodeIds = new Set(mockCards.map((_, i) => `card-${i + 1}`));

  mockCards.forEach((card, index) => {
    const sourceId = `card-${index + 1}`;
    const connections = card.connections || [];

    connections.forEach((targetId) => {
      if (nodeIds.has(targetId)) {
        edges.push({
          id: `${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
        });
      }
    });
  });

  return edges;
}

// Simpler data set for tree demonstrations
export const simpleTreeData = {
  nodes: [
    { id: "root", type: "base", position: { x: 0, y: 0 }, data: { label: "Root Node", description: "The starting point" } },
    { id: "a", type: "base", position: { x: 0, y: 0 }, data: { label: "Node A", description: "First child" } },
    { id: "b", type: "base", position: { x: 0, y: 0 }, data: { label: "Node B", description: "Second child" } },
    { id: "c", type: "base", position: { x: 0, y: 0 }, data: { label: "Node C", description: "Third child" } },
    { id: "a1", type: "minimal", position: { x: 0, y: 0 }, data: { label: "A-1" } },
    { id: "a2", type: "minimal", position: { x: 0, y: 0 }, data: { label: "A-2" } },
    { id: "b1", type: "minimal", position: { x: 0, y: 0 }, data: { label: "B-1" } },
    { id: "b2", type: "minimal", position: { x: 0, y: 0 }, data: { label: "B-2" } },
    { id: "b3", type: "minimal", position: { x: 0, y: 0 }, data: { label: "B-3" } },
    { id: "c1", type: "minimal", position: { x: 0, y: 0 }, data: { label: "C-1" } },
  ],
  edges: [
    { id: "root-a", source: "root", target: "a" },
    { id: "root-b", source: "root", target: "b" },
    { id: "root-c", source: "root", target: "c" },
    { id: "a-a1", source: "a", target: "a1" },
    { id: "a-a2", source: "a", target: "a2" },
    { id: "b-b1", source: "b", target: "b1" },
    { id: "b-b2", source: "b", target: "b2" },
    { id: "b-b3", source: "b", target: "b3" },
    { id: "c-c1", source: "c", target: "c1" },
  ],
};
