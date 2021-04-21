import * as mongoose from 'mongoose';

// TODO: Replace by containerized URL
const databaseURL = process.env.MONGODB_URI || `mongodb+srv://root:${process.env.DB_PASSWORD}@cluster0.hlv5v.mongodb.net/UGRAM?retryWrites=true&w=majority`;

async function run() {
    try {
        await mongoose.connect(databaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Connected to database at ${databaseURL}`);

    let scriptName = process.argv.length === 3 ? process.argv[2] : 'serve';
    try {
        let script = await import(`./scripts/${scriptName}`)
        script.default();
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}

run();
