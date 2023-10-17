export interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  title: string;
  author: string;
  published_at: string;
  url: string;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
  value: number;
}

export type Data = {
  nodes: Node[];
  links: Link[];
};
