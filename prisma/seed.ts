import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const samplePassages = [
  {
    text: `The rapid advancement of artificial intelligence has transformed various industries, from healthcare to finance, and continues to reshape how we work and live. Machine learning algorithms can now process vast amounts of data in seconds, identifying patterns that would take humans years to discover.

In healthcare, AI systems assist doctors in diagnosing diseases more accurately and quickly than ever before. These systems can analyze medical images, predict patient outcomes, and even suggest treatment plans. For instance, AI-powered diagnostic tools can detect early signs of cancer in medical scans with remarkable precision.

The financial sector has also embraced AI technology. Banks use machine learning to detect fraudulent transactions, assess credit risks, and provide personalized financial advice to customers. Algorithmic trading systems can execute thousands of transactions per second, responding to market changes faster than any human trader.

However, the rise of AI also brings challenges. Concerns about job displacement, privacy, and the ethical use of AI systems are growing. As AI becomes more sophisticated, society must address these issues to ensure that the benefits of artificial intelligence are shared equitably while minimizing potential risks.

The future of AI holds immense promise, but it requires careful consideration of its implications for humanity. As we continue to develop more advanced AI systems, we must balance innovation with responsibility, ensuring that artificial intelligence serves as a tool for human progress rather than a source of division or harm.`,
    source: 'Tech Weekly',
    difficulty: 'intermediate',
    tags: ['technology', 'AI', 'society', 'healthcare', 'finance'],
  },
  {
    text: `Climate change continues to be one of the most pressing issues of our time, with far-reaching consequences for ecosystems, human societies, and the global economy. The scientific consensus is clear: human activities, particularly the burning of fossil fuels, are the primary drivers of current climate change.

The effects of climate change are already visible worldwide. Rising global temperatures have led to melting ice caps, rising sea levels, and more frequent extreme weather events. Arctic ice is disappearing at an alarming rate, threatening polar bear populations and contributing to sea-level rise that endangers coastal communities.

Extreme weather patterns have become more common and severe. Hurricanes are intensifying, droughts are lasting longer, and heatwaves are breaking temperature records. These changes affect agriculture, water resources, and human health, with vulnerable populations bearing the greatest burden.

The economic implications of climate change are staggering. Damage from extreme weather events costs billions of dollars annually, while the transition to renewable energy requires massive investments. However, the cost of inaction far exceeds the cost of addressing climate change proactively.

Solutions to climate change require global cooperation and immediate action. Renewable energy technologies like solar and wind power are becoming more affordable and efficient. Governments, businesses, and individuals must work together to reduce greenhouse gas emissions, protect natural ecosystems, and adapt to the changes that are already underway.`,
    source: 'Environmental Science Journal',
    difficulty: 'advanced',
    tags: ['environment', 'climate', 'science', 'economics', 'policy'],
  },
  {
    text: `Reading is one of the most fundamental skills we learn as children, yet its importance extends far beyond the classroom. Regular reading habits contribute significantly to cognitive development, vocabulary expansion, and critical thinking abilities throughout our lives.

When we read, our brains engage in complex processes that strengthen neural pathways and improve mental agility. Studies have shown that people who read regularly have better memory retention, enhanced focus, and improved analytical skills. Reading fiction, in particular, helps develop empathy by allowing us to experience different perspectives and emotions through characters' experiences.

The benefits of reading extend to stress reduction and mental health. Engaging with a good book can lower stress levels, reduce anxiety, and provide a healthy escape from daily pressures. Many people find that reading before bedtime helps them relax and improves sleep quality.

In our digital age, reading habits are evolving. While traditional books remain popular, e-readers and audiobooks have made literature more accessible than ever. However, some research suggests that reading from physical books may offer advantages in terms of comprehension and retention compared to digital formats.

Developing a consistent reading habit doesn't require hours of daily commitment. Even reading for 15-20 minutes per day can provide significant benefits. The key is choosing materials that interest you and gradually building reading into your daily routine.`,
    source: 'Education Today',
    difficulty: 'beginner',
    tags: ['education', 'reading', 'cognitive-development', 'health', 'habits'],
  },
  {
    text: `The human brain is arguably the most complex structure in the known universe, containing approximately 86 billion neurons interconnected through trillions of synapses. This remarkable organ weighs only about three pounds but consumes roughly 20% of the body's total energy, highlighting its critical importance to human survival and function.

Neuroscientists have made tremendous strides in understanding brain structure and function over the past century. Advanced imaging techniques like fMRI and PET scans allow researchers to observe brain activity in real-time, revealing how different regions work together to produce thoughts, emotions, and behaviors. The discovery of neuroplasticity—the brain's ability to reorganize and form new neural connections throughout life—has revolutionized our understanding of learning and recovery from brain injuries.

The brain's structure is highly specialized, with different regions responsible for specific functions. The prefrontal cortex handles executive functions like decision-making and planning, while the hippocampus is crucial for memory formation. The cerebellum coordinates movement and balance, and the brainstem controls vital functions like breathing and heart rate.

Recent research has revealed the importance of sleep for brain health. During sleep, the brain clears metabolic waste products, consolidates memories, and repairs cellular damage. Chronic sleep deprivation can impair cognitive function and increase the risk of neurodegenerative diseases.

Understanding the brain has practical implications for education, mental health treatment, and artificial intelligence development. As we continue to unlock the brain's secrets, we move closer to treating neurological disorders and enhancing human cognitive capabilities.`,
    source: 'Neuroscience Review',
    difficulty: 'advanced',
    tags: ['neuroscience', 'brain', 'biology', 'research', 'health'],
  },
  {
    text: `Social media has fundamentally changed how we communicate, share information, and connect with others. Platforms like Facebook, Twitter, Instagram, and TikTok have billions of users worldwide, making them powerful tools for social interaction, business, and cultural exchange.

The benefits of social media are numerous. These platforms allow people to maintain relationships across great distances, discover communities with shared interests, and access information quickly. Small businesses can reach customers directly, activists can organize movements, and artists can showcase their work to global audiences without traditional gatekeepers.

However, social media also presents significant challenges. The spread of misinformation has become a major concern, as false information can reach millions of people within hours. Cyberbullying, privacy violations, and addiction to social media platforms are growing problems, particularly among young people.

The psychological effects of social media use are complex and still being studied. While these platforms can provide social support and reduce feelings of isolation, they can also contribute to anxiety, depression, and low self-esteem through social comparison and fear of missing out (FOMO).

As social media continues to evolve, society must find ways to maximize its benefits while minimizing its harms. This includes developing better digital literacy skills, implementing stronger privacy protections, and creating healthier online environments that promote genuine connection and well-being.`,
    source: 'Digital Society Quarterly',
    difficulty: 'intermediate',
    tags: ['social-media', 'technology', 'communication', 'psychology', 'society'],
  },
]

async function main() {
  console.log('Starting database seed...')

  // Clear existing data
  await prisma.comprehensionResponse.deleteMany()
  await prisma.userAIConnection.deleteMany()
  await prisma.passage.deleteMany()

  // Create sample passages
  console.log('Creating sample passages...')
  for (const passageData of samplePassages) {
    await prisma.passage.create({
      data: passageData,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
