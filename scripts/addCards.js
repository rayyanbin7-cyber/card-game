const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://raybaron:freadson786@cluster0.gniwl1y.mongodb.net/cardgame?retryWrites=true&w=majority&appName=Cluster0';

const CardSchema = new mongoose.Schema({
  name: String,
  company: String,
  color: String,
  position: String
});

const Card = mongoose.models.Card || mongoose.model('Card', CardSchema);

// 20 additional cards to add (you already have 9, need at least 29 total)
const newCards = [
  { name: 'Michael Chen', company: 'Tech Innovations', color: '#FF6B6B', position: 'Senior Developer' },
  { name: 'Sarah Williams', company: 'Creative Studios', color: '#4ECDC4', position: 'Art Director' },
  { name: 'David Kumar', company: 'Digital Solutions', color: '#45B7D1', position: 'Tech Lead' },
  { name: 'Emma Thompson', company: 'Brand Masters', color: '#FFA07A', position: 'Marketing Manager' },
  { name: 'James Rodriguez', company: 'Tech Innovations', color: '#FF6B6B', position: 'Product Manager' },
  
  { name: 'Olivia Martinez', company: 'Creative Studios', color: '#4ECDC4', position: 'UX Designer' },
  { name: 'William Zhang', company: 'Digital Solutions', color: '#45B7D1', position: 'Software Engineer' },
  { name: 'Sophia Anderson', company: 'Brand Masters', color: '#FFA07A', position: 'Content Strategist' },
  { name: 'Benjamin Lee', company: 'Finance Pro', color: '#98D8C8', position: 'Financial Analyst' },
  { name: 'Isabella Garcia', company: 'Consulting Group', color: '#F7DC6F', position: 'Business Consultant' },
  
  { name: 'Lucas Brown', company: 'Tech Innovations', color: '#FF6B6B', position: 'DevOps Engineer' },
  { name: 'Mia Johnson', company: 'Creative Studios', color: '#4ECDC4', position: 'Graphic Designer' },
  { name: 'Alexander Wang', company: 'Digital Solutions', color: '#45B7D1', position: 'Full Stack Developer' },
  { name: 'Charlotte Davis', company: 'Brand Masters', color: '#FFA07A', position: 'Social Media Manager' },
  { name: 'Daniel Kim', company: 'Finance Pro', color: '#98D8C8', position: 'Investment Advisor' },
  
  { name: 'Amelia Wilson', company: 'Consulting Group', color: '#F7DC6F', position: 'Strategy Consultant' },
  { name: 'Ethan Taylor', company: 'Tech Innovations', color: '#FF6B6B', position: 'Security Specialist' },
  { name: 'Ava Martinez', company: 'Creative Studios', color: '#4ECDC4', position: 'Brand Designer' },
  { name: 'Matthew Singh', company: 'Digital Solutions', color: '#45B7D1', position: 'Cloud Architect' },
  { name: 'Harper Anderson', company: 'Brand Masters', color: '#FFA07A', position: 'PR Manager' }
];

async function addCards() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Check existing cards
    const existingCount = await Card.countDocuments();
    console.log(`\nCurrent cards in database: ${existingCount}`);

    // Add new cards
    console.log(`\nAdding ${newCards.length} new cards...`);
    const result = await Card.insertMany(newCards);
    console.log(`✓ Successfully added ${result.length} cards!`);

    // Show final count
    const finalCount = await Card.countDocuments();
    console.log(`\nTotal cards in database: ${finalCount}`);
    console.log(`Ready to play! (Need at least 29 cards for a 4-player game)`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addCards();
