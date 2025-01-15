import fetch from 'node-fetch';
import mongoose from 'mongoose';

mongoose.connect("mongodb://127.0.0.1:27017/API", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Database connected successfully"))
.catch((error) => console.error("Database connection failed:", error));

const postSchema = new mongoose.Schema({
    id: { type: String, required: true },
    sourceIdentifier: { type: String, required: true },
    published: { type: String, required: true },
    lastModified: { type: String, required: true },
    vulnStatus: { type: String, required: true },
});

const Post = mongoose.model('Post', postSchema);

async function getPosts() {
    try {
        const myPosts = await fetch("https://services.nvd.nist.gov/rest/json/cves/2.0");
        if (!myPosts.ok) {
            throw new Error(`API fetch failed with status ${myPosts.status}`);
        }
        const response = await myPosts.json();
        const vulnerabilities = response.vulnerabilities || [];

        for (let i = 0; i < vulnerabilities.length; i++) {
            const vuln = vulnerabilities[i].cve;

            // **Data Cleansing**
            if (!vuln.id || !vuln.sourceIdentifier || !vuln.published || !vuln.lastModified || !vuln.vulnStatus) {
                console.warn("Missing required fields for:", vuln);
                continue; // Skip invalid documents
            }

            // Normalize data (e.g., trimming strings, converting dates)
            const cleanedData = {
                id: vuln.id.trim(),
                sourceIdentifier: vuln.sourceIdentifier.trim(),
                published: new Date(vuln.published).toISOString(),
                lastModified: new Date(vuln.lastModified).toISOString(),
                vulnStatus: vuln.vulnStatus.trim(),
            };

            // **De-Duplication** (Check if the document already exists)
            const existingPost = await Post.findOne({ id: cleanedData.id });
            if (existingPost) {
                console.log(`Duplicate found, skipping post with ID: ${cleanedData.id}`);
                continue;
            }

            // Save the cleansed and unique document
            const post = new Post(cleanedData);
            try {
                await post.save();
                console.log("Post saved:", post);
            } catch (error) {
                console.error("Error saving post:", error);
            }
        }

        // **Post-Save De-Duplication**
        console.log("Running post-save de-duplication...");
        await deduplicatePosts();
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// **Post-Save De-Duplication Function**
async function deduplicatePosts() {
    try {
        const duplicates = await Post.aggregate([
            {
                $group: {
                    _id: { id: "$id" }, // Group by unique identifier
                    ids: { $push: "$_id" }, // Collect all document IDs in the group
                    count: { $sum: 1 }, // Count the number of documents in the group
                },
            },
            { $match: { count: { $gt: 1 } } }, // Keep only duplicate groups
        ]); 

        for (const group of duplicates) {
            const [keepId, ...removeIds] = group.ids; // Keep one document and remove the rest
            await Post.deleteMany({ _id: { $in: removeIds } });
            console.log(`Duplicate found, skipping post with ID: ${removeIds}`);
            
        }
        console.log("De-duplication complete.");
    } catch (error) {
        console.error("Error during de-duplication:", error);
    }
}

getPosts();
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to fetch all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find(); // Fetch all posts from MongoDB
        res.json(posts); // Send the data as JSON
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
import fetch from 'node-fetch';
import mongoose from 'mongoose';

mongoose.connect("mongodb://127.0.0.1:27017/API", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Database connected successfully"))
.catch((error) => console.error("Database connection failed:", error));

const postSchema = new mongoose.Schema({
    id: { type: String, required: true },
    sourceIdentifier: { type: String, required: true },
    published: { type: String, required: true },
    lastModified: { type: String, required: true },
    vulnStatus: { type: String, required: true },
});

const Post = mongoose.model('Post', postSchema);

async function getPosts() {
    try {
        const myPosts = await fetch("https://services.nvd.nist.gov/rest/json/cves/2.0");
        if (!myPosts.ok) {
            throw new Error(`API fetch failed with status ${myPosts.status}`);
        }
        const response = await myPosts.json();
        const vulnerabilities = response.vulnerabilities || [];

        for (let i = 0; i < vulnerabilities.length; i++) {
            const vuln = vulnerabilities[i].cve;

            // **Data Cleansing**
            if (!vuln.id || !vuln.sourceIdentifier || !vuln.published || !vuln.lastModified || !vuln.vulnStatus) {
                console.warn("Missing required fields for:", vuln);
                continue; // Skip invalid documents
            }

            // Normalize data (e.g., trimming strings, converting dates)
            const cleanedData = {
                id: vuln.id.trim(),
                sourceIdentifier: vuln.sourceIdentifier.trim(),
                published: new Date(vuln.published).toISOString(),
                lastModified: new Date(vuln.lastModified).toISOString(),
                vulnStatus: vuln.vulnStatus.trim(),
            };

            // **De-Duplication** (Check if the document already exists)
            const existingPost = await Post.findOne({ id: cleanedData.id });
            if (existingPost) {
                console.log(`Duplicate found, skipping post with ID: ${cleanedData.id}`);
                continue;
            }

            // Save the cleansed and unique document
            const post = new Post(cleanedData);
            try {
                await post.save();
                console.log("Post saved:", post);
            } catch (error) {
                console.error("Error saving post:", error);
            }
        }

        // **Post-Save De-Duplication**
        console.log("Running post-save de-duplication...");
        await deduplicatePosts();
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// **Post-Save De-Duplication Function**
async function deduplicatePosts() {
    try {
        const duplicates = await Post.aggregate([
            {
                $group: {
                    _id: { id: "$id" }, // Group by unique identifier
                    ids: { $push: "$_id" }, // Collect all document IDs in the group
                    count: { $sum: 1 }, // Count the number of documents in the group
                },
            },
            { $match: { count: { $gt: 1 } } }, // Keep only duplicate groups
        ]); 

        for (const group of duplicates) {
            const [keepId, ...removeIds] = group.ids; // Keep one document and remove the rest
            await Post.deleteMany({ _id: { $in: removeIds } });
            console.log(`Duplicate found, skipping post with ID: ${removeIds}`);
            
        }
        console.log("De-duplication complete.");
    } catch (error) {
        console.error("Error during de-duplication:", error);
    }
}

getPosts();
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to fetch all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find(); // Fetch all posts from MongoDB
        res.json(posts); // Send the data as JSON
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
 // to be installed
// npm init -y
// npm i node-fetch
// npm install mongoose
// npx nodemon index.js
// package.json "type":"module"; under license
// command prompt   mongo
// connection url/database_name
// npm install express
