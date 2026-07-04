// Replay Domain Types

export interface ReplayMetadata {
  id: string;
  timestamp: string;
  environment: string;
  durationMs: number;
}

export interface ReplaySession {
  metadata: ReplayMetadata;
  events: any[]; // We will type this properly based on our audit log structure
  findings: any[];
  decision: any;
  fingerprint: string;
  metrics: {
    totalEvents: number;
    highestRisk: number;
    latencyMs: number;
  };
}

// Player State
export type PlaybackStatus = 'playing' | 'paused' | 'ended';

export interface ReplayState {
  status: PlaybackStatus;
  currentTimeMs: number;
  speed: number;
  durationMs: number;
}

// Unified Inspectable Item for the Inspector
export type InspectableType = 'timeline_item' | 'graph_node' | 'finding' | 'rule' | 'decision';

export interface InspectableItem {
  type: InspectableType;
  id: string;
  title: string;
  data: any; // The raw data backing this item
}

// Graph Models for Builders
export interface GraphNode {
  id: string;
  label: string;
  type?: string;
  data?: any;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface GraphModel {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Timeline Models for Builders
export enum TimelineState {
  FUTURE = 'FUTURE',
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE'
}

export interface TimelineItem {
  id: string;
  timestampMs: number;
  label: string;
  description?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  state: TimelineState;
}

export interface TimelineModel {
  items: TimelineItem[];
}

import { MetricsModel } from './builders/metricsBuilder';

export interface PlaybackFrame {
  currentTimeMs: number;
  timeline: TimelineModel;
  graph: GraphModel;
  metrics: MetricsModel;
  selected: InspectableItem | null;
}

