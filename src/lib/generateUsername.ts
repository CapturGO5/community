const adjectives = [
  'Swift', 'Bright', 'Clever', 'Dynamic', 'Epic', 'Fresh',
  'Grand', 'Happy', 'Iconic', 'Jolly', 'Keen', 'Lively',
  'Mighty', 'Noble', 'Prime', 'Quick', 'Royal', 'Smart',
  'True', 'Ultra', 'Vital', 'Wise', 'Zen'
];

const nouns = [
  'Pixel', 'Byte', 'Code', 'Data', 'Echo', 'Flow',
  'Grid', 'Hash', 'Icon', 'Jump', 'Key', 'Link',
  'Meta', 'Node', 'Orbit', 'Pulse', 'Quest', 'Ray',
  'Sync', 'Tech', 'Unit', 'View', 'Wave', 'Zone'
];

export function generateUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  
  return `${adjective}${noun}${number}`;
}
