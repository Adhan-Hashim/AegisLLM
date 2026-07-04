export const timelineData = [
  { time: '08:00', allowed: 4200, blocked: 120 },
  { time: '09:00', allowed: 4800, blocked: 450 },
  { time: '10:00', allowed: 5100, blocked: 890 },
  { time: '11:00', allowed: 4900, blocked: 340 },
  { time: '12:00', allowed: 5300, blocked: 1100 },
  { time: '13:00', allowed: 5800, blocked: 400 },
  { time: '14:00', allowed: 6100, blocked: 250 },
  { time: '15:00', allowed: 5900, blocked: 280 },
];

export const topThreatsData = [
  { name: 'Prompt Injection', count: 1240, color: '#ef4444' },
  { name: 'Jailbreak', count: 890, color: '#f97316' },
  { name: 'Prompt Leakage', count: 650, color: '#eab308' },
  { name: 'PII/Secrets', count: 420, color: '#3b82f6' },
  { name: 'Toxicity', count: 210, color: '#8b5cf6' },
];

export const severityData = [
  { name: 'Critical', value: 340, fill: '#ef4444' },
  { name: 'High', value: 890, fill: '#f97316' },
  { name: 'Medium', value: 1450, fill: '#eab308' },
  { name: 'Low', value: 2100, fill: '#3b82f6' },
];

export const sparklineData = [
  { value: 10 }, { value: 15 }, { value: 12 }, { value: 25 }, 
  { value: 40 }, { value: 35 }, { value: 65 }, { value: 85 }, { value: 100 }
];

export const mockModels = ['GPT-4.1', 'Claude 3.5', 'Gemini 1.5 Pro', 'Llama 3', 'DeepSeek Coder'];

export const mockEvents = [
  { rule: 'PI-003', risk: 99, action: 'Blocked', eventName: 'Prompt Injection', severity: 'Critical' },
  { rule: 'SEC-001', risk: 95, action: 'Blocked', eventName: 'Secrets Detection', severity: 'Critical' },
  { rule: 'JB-002', risk: 92, action: 'Blocked', eventName: 'Jailbreak Attempt', severity: 'High' },
  { rule: 'Safe', risk: 5, action: 'Allowed', eventName: 'Safe Request', severity: 'Low' },
  { rule: 'Safe', risk: 15, action: 'Allowed', eventName: 'Safe Request', severity: 'Low' },
  { rule: 'Safe', risk: 8, action: 'Allowed', eventName: 'Safe Request', severity: 'Low' },
  { rule: 'TOX-004', risk: 78, action: 'Flagged', eventName: 'Toxicity', severity: 'Medium' },
  { rule: 'LEAK-01', risk: 85, action: 'Blocked', eventName: 'Prompt Leakage', severity: 'High' },
];

export interface Incident {
  id: number;
  time: string;
  model: string;
  rule: string;
  risk: number;
  action: string;
  eventName: string;
  severity: string;
}
