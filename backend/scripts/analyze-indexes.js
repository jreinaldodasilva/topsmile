// backend/scripts/analyze-indexes.js
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

async function analyzeIndexes() {
    try {
        await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/topsmile');
        console.log('✅ Connected to database\n');

        const collections = await mongoose.connection.db.listCollections().toArray();
        const results = [];

        for (const collection of collections) {
            const collectionName = collection.name;
            const indexes = await mongoose.connection.db.collection(collectionName).indexes();
            
            console.log(`\n${'='.repeat(60)}`);
            console.log(`📊 Collection: ${collectionName}`);
            console.log(`${'='.repeat(60)}`);
            console.log(`Total indexes: ${indexes.length}\n`);

            const stats = await mongoose.connection.db
                .collection(collectionName)
                .aggregate([{ $indexStats: {} }])
                .toArray();

            for (const index of indexes) {
                const indexStat = stats.find(s => s.name === index.name);
                const operations = indexStat?.accesses?.ops || 0;
                const lastUsed = indexStat?.accesses?.since || 'Never';

                console.log(`  📌 ${index.name}`);
                console.log(`     Keys: ${JSON.stringify(index.key)}`);
                console.log(`     Operations: ${operations}`);
                console.log(`     Last used: ${lastUsed}`);
                
                if (operations === 0) {
                    console.log(`     ⚠️  UNUSED - Consider removing`);
                }
                console.log('');

                results.push({
                    collection: collectionName,
                    index: index.name,
                    keys: index.key,
                    operations,
                    lastUsed,
                    unused: operations === 0
                });
            }
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log('📈 Summary');
        console.log(`${'='.repeat(60)}`);
        console.log(`Total collections: ${collections.length}`);
        console.log(`Total indexes: ${results.length}`);
        console.log(`Unused indexes: ${results.filter(r => r.unused).length}`);
        
        const unusedIndexes = results.filter(r => r.unused && r.index !== '_id_');
        if (unusedIndexes.length > 0) {
            console.log(`\n⚠️  Unused indexes to consider removing:`);
            unusedIndexes.forEach(idx => {
                console.log(`   - ${idx.collection}.${idx.index}`);
            });
        }

        await mongoose.disconnect();
        console.log('\n✅ Analysis complete\n');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

analyzeIndexes();
