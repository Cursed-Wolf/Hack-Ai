import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCn9e6YPEWZi40k4kLdZ-SHhOo2LL0Q438';
const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Hi');
    console.log(`Success with ${modelName}:`, result.response.text());
  } catch (err) {
    console.error(`Failed with ${modelName}:`, err.message);
  }
}

async function run() {
  await testModel('gemini-2.5-flash-lite');
  await testModel('gemini-2.0-flash');
  await testModel('gemini-1.5-flash');
}

run();
