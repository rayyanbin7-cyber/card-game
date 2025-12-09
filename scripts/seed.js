// Quick seed script to add sample business cards
// Run with: node scripts/seed.js

const sampleCards = [
  { name: 'John Smith', company: 'Tech Corp', color: '#FF6B6B', position: 'CEO' },
  { name: 'Sarah Johnson', company: 'Design Co', color: '#4ECDC4', position: 'Designer' },
  { name: 'Mike Brown', company: 'Dev Studio', color: '#45B7D1', position: 'Developer' },
  { name: 'Emily Davis', company: 'Marketing Inc', color: '#FFA07A', position: 'Manager' },
  { name: 'David Wilson', company: 'Tech Corp', color: '#FF6B6B', position: 'CTO' },
  { name: 'Lisa Anderson', company: 'Design Co', color: '#4ECDC4', position: 'Art Director' },
  { name: 'Tom Martinez', company: 'Dev Studio', color: '#45B7D1', position: 'Engineer' },
  { name: 'Anna Taylor', company: 'Marketing Inc', color: '#FFA07A', position: 'Specialist' },
  { name: 'Chris Lee', company: 'Finance Ltd', color: '#98D8C8', position: 'Analyst' },
  { name: 'Jessica White', company: 'Consulting', color: '#F7DC6F', position: 'Consultant' },
  { name: 'Robert Garcia', company: 'Tech Corp', color: '#FF6B6B', position: 'VP' },
  { name: 'Maria Rodriguez', company: 'Design Co', color: '#4ECDC4', position: 'UX Lead' },
  { name: 'James Miller', company: 'Dev Studio', color: '#45B7D1', position: 'Architect' },
  { name: 'Jennifer Lopez', company: 'Marketing Inc', color: '#FFA07A', position: 'Director' },
  { name: 'William Clark', company: 'Finance Ltd', color: '#98D8C8', position: 'CFO' },
  { name: 'Patricia Hall', company: 'Consulting', color: '#F7DC6F', position: 'Partner' },
  { name: 'Richard Young', company: 'Tech Corp', color: '#FF6B6B', position: 'Engineer' },
  { name: 'Linda King', company: 'Design Co', color: '#4ECDC4', position: 'Creative' },
  { name: 'Charles Wright', company: 'Dev Studio', color: '#45B7D1', position: 'Lead Dev' },
  { name: 'Barbara Scott', company: 'Marketing Inc', color: '#FFA07A', position: 'VP Sales' },
  { name: 'Joseph Green', company: 'Finance Ltd', color: '#98D8C8', position: 'Advisor' },
  { name: 'Susan Adams', company: 'Consulting', color: '#F7DC6F', position: 'Senior' },
  { name: 'Thomas Baker', company: 'Tech Corp', color: '#FF6B6B', position: 'PM' },
  { name: 'Karen Nelson', company: 'Design Co', color: '#4ECDC4', position: 'Lead' },
  { name: 'Daniel Carter', company: 'Dev Studio', color: '#45B7D1', position: 'Senior Dev' },
  { name: 'Nancy Mitchell', company: 'Marketing Inc', color: '#FFA07A', position: 'CMO' },
  { name: 'Paul Perez', company: 'Finance Ltd', color: '#98D8C8', position: 'Manager' },
  { name: 'Betty Roberts', company: 'Consulting', color: '#F7DC6F', position: 'Expert' },
  { name: 'Mark Turner', company: 'Tech Corp', color: '#FF6B6B', position: 'Specialist' },
  { name: 'Sandra Phillips', company: 'Design Co', color: '#4ECDC4', position: 'Director' }
];

console.log('Sample cards to add via /setup page:');
console.log(JSON.stringify(sampleCards, null, 2));
console.log(`\nTotal: ${sampleCards.length} cards (enough for a 4-player game with 7 cards each)`);
