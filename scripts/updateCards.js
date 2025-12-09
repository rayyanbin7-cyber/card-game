const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://raybaron:freadson786@cluster0.gniwl1y.mongodb.net/cardgame?retryWrites=true&w=majority&appName=Cluster0';

const CardSchema = new mongoose.Schema({
  name: String,
  company: String,
  colors: [String],
  position: String,
  isWildCard: Boolean
});

const Card = mongoose.models.Card || mongoose.model('Card', CardSchema);

async function updateDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Delete all existing cards to start fresh
    await Card.deleteMany({});
    console.log('Cleared existing cards');

    // Create 32 new cards with multiple colors
    const newCards = [
      // Single color cards (12 cards - 2 per color)
      { name: 'John Smith', company: 'Tech Corp', colors: ['#FF6B6B'], position: 'CEO' },
      { name: 'Sarah Johnson', company: 'Tech Innovations', colors: ['#FF6B6B'], position: 'CTO' },
      
      { name: 'Mike Brown', company: 'Design Studio', colors: ['#4ECDC4'], position: 'Creative Director' },
      { name: 'Emily Davis', company: 'Creative Co', colors: ['#4ECDC4'], position: 'Art Director' },
      
      { name: 'David Wilson', company: 'Dev Solutions', colors: ['#45B7D1'], position: 'Lead Developer' },
      { name: 'Lisa Anderson', company: 'Code Masters', colors: ['#45B7D1'], position: 'Senior Engineer' },
      
      { name: 'Tom Martinez', company: 'Brand Agency', colors: ['#FFA07A'], position: 'Marketing Manager' },
      { name: 'Anna Taylor', company: 'Media Group', colors: ['#FFA07A'], position: 'PR Director' },
      
      { name: 'Chris Lee', company: 'Finance Pro', colors: ['#98D8C8'], position: 'Financial Analyst' },
      { name: 'Jessica White', company: 'Investment Ltd', colors: ['#98D8C8'], position: 'Portfolio Manager' },
      
      { name: 'Robert Garcia', company: 'Consulting Group', colors: ['#F7DC6F'], position: 'Senior Consultant' },
      { name: 'Maria Rodriguez', company: 'Strategy Partners', colors: ['#F7DC6F'], position: 'Business Advisor' },

      // Two color cards (15 cards)
      { name: 'James Miller', company: 'Tech Design', colors: ['#FF6B6B', '#4ECDC4'], position: 'Product Designer' },
      { name: 'Jennifer Lopez', company: 'Digital Creative', colors: ['#FF6B6B', '#45B7D1'], position: 'UX Engineer' },
      { name: 'William Clark', company: 'Brand Tech', colors: ['#FF6B6B', '#FFA07A'], position: 'Growth Manager' },
      
      { name: 'Patricia Hall', company: 'Design Dev', colors: ['#4ECDC4', '#45B7D1'], position: 'Full Stack Designer' },
      { name: 'Richard Young', company: 'Creative Marketing', colors: ['#4ECDC4', '#FFA07A'], position: 'Brand Designer' },
      { name: 'Linda King', company: 'Finance Design', colors: ['#4ECDC4', '#98D8C8'], position: 'Data Visualizer' },
      
      { name: 'Charles Wright', company: 'Dev Marketing', colors: ['#45B7D1', '#FFA07A'], position: 'Growth Engineer' },
      { name: 'Barbara Scott', company: 'Tech Finance', colors: ['#45B7D1', '#98D8C8'], position: 'FinTech Developer' },
      { name: 'Joseph Green', company: 'Code Consulting', colors: ['#45B7D1', '#F7DC6F'], position: 'Tech Advisor' },
      
      { name: 'Susan Adams', company: 'Marketing Finance', colors: ['#FFA07A', '#98D8C8'], position: 'Revenue Manager' },
      { name: 'Thomas Baker', company: 'Brand Consulting', colors: ['#FFA07A', '#F7DC6F'], position: 'Strategy Director' },
      { name: 'Karen Nelson', company: 'Design Consulting', colors: ['#4ECDC4', '#F7DC6F'], position: 'Creative Strategist' },
      
      { name: 'Daniel Carter', company: 'Finance Consulting', colors: ['#98D8C8', '#F7DC6F'], position: 'Investment Advisor' },
      { name: 'Nancy Mitchell', company: 'Tech Consulting', colors: ['#FF6B6B', '#F7DC6F'], position: 'Digital Strategist' },
      { name: 'Paul Perez', company: 'Multi Solutions', colors: ['#98D8C8', '#4ECDC4'], position: 'Operations Manager' },

      // Three color cards (3 cards)
      { name: 'Betty Roberts', company: 'Triple Threat Inc', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'], position: 'Chief Innovation Officer' },
      { name: 'Mark Turner', company: 'Spectrum Agency', colors: ['#FFA07A', '#98D8C8', '#F7DC6F'], position: 'Managing Director' },
      { name: 'Sandra Phillips', company: 'Rainbow Corp', colors: ['#4ECDC4', '#45B7D1', '#FFA07A'], position: 'VP of Operations' },

      // Wild cards (2 cards)
      { name: 'WILD CARD', company: 'Universal', colors: [], isWildCard: true },
      { name: 'JOKER', company: 'Universal', colors: [], isWildCard: true }
    ];

    console.log(`\nAdding ${newCards.length} new cards...`);
    const result = await Card.insertMany(newCards);
    console.log(`✓ Successfully added ${result.length} cards!`);

    // Show breakdown
    const singleColor = newCards.filter(c => c.colors.length === 1).length;
    const twoColors = newCards.filter(c => c.colors.length === 2).length;
    const threeColors = newCards.filter(c => c.colors.length === 3).length;
    const wildCards = newCards.filter(c => c.isWildCard).length;

    console.log('\nCard Breakdown:');
    console.log(`- Single color: ${singleColor}`);
    console.log(`- Two colors: ${twoColors}`);
    console.log(`- Three colors: ${threeColors}`);
    console.log(`- Wild cards: ${wildCards}`);
    console.log(`- Total: ${newCards.length}`);
    console.log('\n✓ Ready to play! (4 players × 5 cards = 20, plus 1 center card, leaves 11 in draw pile)');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateDatabase();
