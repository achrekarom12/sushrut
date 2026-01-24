// import fs from 'fs';
// import path from 'path';
// import { PDFParse } from 'pdf-parse';
// import { Pinecone } from '@pinecone-database/pinecone';
// import { getEmbeddingModel } from './client.service';
// import { google, createGoogleGenerativeAI, GoogleGenerativeAIProvider } from '@ai-sdk/google';
// import { PINECONE_API_KEY, PINECONE_INDEX_NAME, PINECONE_INDEX_HOST } from '../../env';

// const INDEX_NAME = PINECONE_INDEX_NAME;
// const INDEX_HOST = PINECONE_INDEX_HOST;

// const pc = new Pinecone({ apiKey: PINECONE_API_KEY });

// async function processPdfAndUpsert(pdfPath: string) {
//     const model = google.embedding('gemini-embedding-001');
//     const fileName = path.basename(pdfPath);

//     // 1. Extract text from PDF
//     const dataBuffer = fs.readFileSync(pdfPath);
//     const parser = new PDFParse({ data: dataBuffer });
//     const data = await parser.getText();
//     const fullText = data.text.replace(/\s+/g, ' ').trim();
//     const words = fullText.split(' ');

//     // 2. Chunking logic: 500 words with 100 word overlap
//     const chunkSize = 500;
//     const overlap = 100;
//     const records = [];

//     for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
//         const chunkWords = words.slice(i, i + chunkSize);
//         const chunkText = chunkWords.join(' ');

//         const embeddingResult = await model.doEmbed({
//             values: [chunkText]
//         })

//         records.push({
//             id: `${fileName}-chunk-${Math.floor(i / (chunkSize - overlap))}`,
//             values: embeddingResult.embeddings,
//             metadata: {
//                 chunk_text: chunkText,
//                 filename: fileName
//             },
//         });

//         // Break if we've reached the end of the text
//         if (i + chunkSize >= words.length) break;
//     }

//     // 3. Upsert to Pinecone
//     try {
//         const namespace = pc.index(INDEX_NAME, INDEX_HOST);

//         // Upserting in batches of 100 is generally safer for large PDFs
//         const batchSize = 100;
//         for (let i = 0; i < records.length; i += batchSize) {
//             const batch = records.slice(i, i + batchSize);
//             await namespace.upsert(batch);
//             console.log(`Successfully upserted batch ${i / batchSize + 1} for ${fileName}`);
//         }

//         console.log("Processing complete.");
//     } catch (error) {
//         console.error("Error upserting to Pinecone:", error);
//     }
// }


// processPdfAndUpsert('/Users/achrekarom/Downloads/STG-Endocrinology.pdf');