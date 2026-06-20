/**
 * Add new Best pages to best_pages_data.json
 * Run: node scripts/add-best-pages.js
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'best_pages_data.json');

// Read existing data
let raw = fs.readFileSync(filePath, 'utf-8').replace(/^﻿/, '');

// Fix backticks to valid JSON
function fixBackticks(text) {
  const result = [];
  let i = 0;
  let inBT = false;

  while (i < text.length) {
    const ch = text[i];

    if (ch === '`') {
      if (!inBT) {
        if (i >= 2 && text[i - 2] === ':') {
          inBT = true;
          result.push('"');
          i++;
          continue;
        }
      } else {
        inBT = false;
        result.push('"');
        i++;
        continue;
      }
    } else if (inBT) {
      if (ch === '"') {
        result.push('\\"');
        i++;
        continue;
      } else if (ch === '\\' && i + 1 < text.length && text[i + 1] === 'n') {
        result.push('\\n');
        i += 2;
        continue;
      } else if (ch === '\\' && i + 1 < text.length && text[i + 1] === '\\') {
        result.push('\\\\');
        i += 2;
        continue;
      }
    }

    result.push(ch);
    i++;
  }

  return result.join('');
}

const fixed = fixBackticks(raw);
const data = JSON.parse(fixed);

// New Best pages to add
const newPages = [
  {
    slug: "best-ai-seo-tools",
    title: "Best 10 AI SEO Tools for Content Ranking in 2026",
    category: "Best Of",
    date: "2026-06-18",
    excerpt: "From Surfer SEO to Semrush AI, we tested the top AI SEO tools. Find the perfect tool for keyword research, content optimization, and rank tracking.",
    content: "AI-powered SEO tools have revolutionized how we approach search engine optimization. From automated keyword research to AI-generated content briefs, these tools can dramatically improve your organic traffic.\n\nHere are our top 10 picks for 2026.\n\n## 1. Surfer SEO\n\nThe industry leader in AI content optimization. Its real-time content scoring analyzes top-ranking pages and tells you exactly what to include in your content — from keyword density to word count to header structure.\n\n**Best for:** Content optimization and on-page SEO\n**Price:** Starts at $89/month\n\n## 2. Semrush AI\n\nA comprehensive SEO suite with AI-powered features. Covers keyword research, backlink analysis, site audits, content marketing, and more. The AI features enhance the already extensive toolkit.\n\n**Best for:** Full-featured SEO campaigns\n**Price:** Starts at $129.95/month\n\n## 3. Ahrefs\n\nKnown for its industry-leading backlink database and keyword research tools. The AI features enhance content analysis and competitor research. Essential for serious SEO professionals.\n\n**Best for:** Backlink analysis and keyword research\n**Price:** Starts at $99/month\n\n## 4. Frase\n\nExcels at content briefs and research automation. Its AI can scan hundreds of sources and compile relevant information. The content brief feature goes beyond outlines — it includes sentiment analysis, entity recommendations, and question extraction.\n\n**Best for:** Content research and briefs\n**Price:** Starts at $59.99/month\n\n## 5. Clearscope\n\nProvides keyword recommendations and content optimization guidance. Analyzes top-ranking pages and suggests keywords, topics, and phrases to include. Simple and focused tool.\n\n**Best for:** Keyword recommendations\n**Price:** Starts at $170/month\n\n## 6. Content at Scale\n\nAI-powered content creation tool that generates SEO-optimized articles. Analyzes top-ranking pages and creates content structured to rank well. Great for content marketing teams.\n\n**Best for:** Automated content creation\n**Price:** Starts at $49/month\n\n## 7. MarketMuse\n\nUses AI to analyze your content portfolio and identify gaps. Creates comprehensive content strategies based on topic authority and keyword opportunities.\n\n**Best for:** Content strategy and planning\n**Price:** Contact for pricing\n\n## 8. Outranking\n\nCombines content research, creation, and optimization in one platform. AI-powered topic clustering and content grouping help you build topical authority.\n\n**Best for:** Topic authority building\n**Price:** Contact for pricing\n\n## 9. Neuronizer\n\nAI-powered keyword research and content ideation tool. Helps discover long-tail keywords and content opportunities that your competitors are missing.\n\n**Best for:** Keyword discovery\n**Price:** Free tier available\n\n## 10. Rank Ranger\n\nEnterprise-grade SEO platform with AI features for rank tracking, keyword research, and content optimization. Designed for SEO agencies and large teams.\n\n**Best for:** Enterprise SEO\n**Price:** Contact for pricing\n\n## How to Choose\n\n- **Content optimization:** Surfer SEO or Clearscope\n- **Full SEO suite:** Semrush AI or Ahrefs\n- **Content research:** Frase or MarketMuse\n- **Automated content:** Content at Scale\n- **Topic authority:** Outranking\n- **Enterprise:** Rank Ranger"
  },
  {
    slug: "best-ai-marketing-tools",
    title: "Best 10 AI Marketing Tools for Growth in 2026",
    category: "Best Of",
    date: "2026-06-18",
    excerpt: "From HubSpot AI to Jasper, we tested the top AI marketing tools. Find the perfect tool for email marketing, social media, and content creation.",
    content: "AI marketing tools have transformed how businesses attract and convert customers. From automated email campaigns to AI-generated content, these tools can accelerate your marketing efforts.\n\nHere are our top 10 picks for 2026.\n\n## 1. HubSpot AI\n\nAn all-in-one growth platform with AI features. Covers CRM, marketing automation, sales pipeline management, customer service, and content management. The AI enhances every aspect of the platform.\n\n**Best for:** All-in-one marketing platform\n**Price:** Free tier available, paid plans from $45/month\n\n## 2. Jasper\n\nBuilt specifically for marketing teams with brand tone-of-voice features, comprehensive templates, and team collaboration. Produces high-quality marketing copy for any channel.\n\n**Best for:** Marketing copy and brand content\n**Price:** Paid plans from $39/month\n\n## 3. ActiveCampaign\n\nWidely regarded as having the best marketing automation in the industry. Its visual automation builder lets you create complex customer journeys with conditional logic, predictive sending, and AI-powered personalization.\n\n**Best for:** Marketing automation\n**Price:** Starts at $29/month\n\n## 4. Hootsuite AI\n\nSocial media management platform with AI-powered features. Schedules posts, analyzes engagement, and generates content suggestions. Essential for social media managers.\n\n**Best for:** Social media management\n**Price:** Starts at $99/month\n\n## 5. Copy.ai\n\nOptimized for social media managers with extensive template library for posts, ads, and product descriptions. AI-powered content generation for marketing teams.\n\n**Best for:** Social media content\n**Price:** Free tier available\n\n## 6. Writesonic\n\nAI writing assistant with built-in SEO features and powerful article writer. Great value for SEO-focused content creators and marketing teams.\n\n**Best for:** SEO content creation\n**Price:** Free tier available\n\n## 7. Buffer AI\n\nSocial media scheduling and analytics with AI-powered content suggestions. Easy to use and great for small teams and solopreneurs.\n\n**Best for:** Social media scheduling\n**Price:** Free tier available, paid plans from $6/month\n\n## 8. ConvertKit AI\n\nEmail marketing platform designed for creators and bloggers. AI features help with email writing, subject lines, and audience segmentation.\n\n**Best for:** Creator email marketing\n**Price:** Free tier available, paid plans from $25/month\n\n## 9. Mailchimp AI\n\nPopular email marketing platform with AI-powered features. Campaign optimization, audience insights, and content suggestions. Great for small businesses.\n\n**Best for:** Small business email marketing\n**Price:** Free tier available, paid plans from $13/month\n\n## 10. Crazy Egg\n\nHeatmap and A/B testing tool with AI insights. Helps you understand how visitors interact with your website and optimize for conversions.\n\n**Best for:** Website optimization\n**Price:** Starts at $25/month\n\n## How to Choose\n\n- **All-in-one platform:** HubSpot AI\n- **Marketing copy:** Jasper or Copy.ai\n- **Email marketing:** ActiveCampaign or Mailchimp AI\n- **Social media:** Hootsuite AI or Buffer AI\n- **SEO content:** Writesonic\n- **Website optimization:** Crazy Egg"
  },
  {
    slug: "best-ai-devops-tools",
    title: "Best 8 AI DevOps Platforms for Modern Development in 2026",
    category: "Best Of",
    date: "2026-06-18",
    excerpt: "From Vercel to Cloudflare AI, compare the best AI DevOps platforms for deployment, hosting, and infrastructure management.",
    content: "AI-powered DevOps platforms have transformed how developers build, deploy, and scale applications. From one-click deployments to AI-assisted monitoring, these platforms can dramatically improve your development workflow.\n\nHere are our top 8 picks for 2026.\n\n## 1. Vercel\n\nThe gold standard for frontend deployment, especially for Next.js applications. One-click deployments from Git, automatic preview deployments, built-in CDN, and Edge Functions. Unmatched developer experience.\n\n**Best for:** Frontend and Next.js deployment\n**Price:** Free tier available, Pro from $20/month\n\n## 2. Railway\n\nGeneral-purpose deployment platform that supports any backend, database, or full-stack application. Deploy databases, background workers, APIs, and frontend apps all from the same platform.\n\n**Best for:** Full-stack applications\n**Price:** Pay-as-you-go pricing\n\n## 3. Fly.io\n\nDeploy applications globally with minimal configuration. Runs your apps in lightweight VMs close to your users. Supports Docker containers and multiple programming languages.\n\n**Best for:** Global application deployment\n**Price:** Free tier available, paid from $5/month\n\n## 4. Supabase\n\nOpen-source Firebase alternative with AI features. Provides database, authentication, storage, and real-time subscriptions. The AI features enhance database queries and data management.\n\n**Best for:** Backend as a service\n**Price:** Free tier available, paid from $25/month\n\n## 5. Render\n\nSimple cloud platform for deploying web services, databases, and static sites. Git-based deployments with automatic HTTPS and custom domains. Great alternative to Heroku.\n\n**Best for:** Simple cloud deployment\n**Price:** Free tier available, paid from $7/month\n\n## 6. Cloudflare AI\n\nEdge computing platform with AI features. Deploys code close to your users with Cloudflare's global network. Includes Workers, Pages, and AI inference capabilities.\n\n**Best for:** Edge computing and AI inference\n**Price:** Free tier available, paid from $5/month\n\n## 7. Netlify\n\nFrontend-focused deployment platform with excellent developer experience. Git-based deployments, preview URLs, serverless functions, and AI-powered features.\n\n**Best for:** Static sites and JAMstack\n**Price:** Free tier available, paid from $19/month\n\n## 8. Heroku\n\nEstablished PaaS platform with AI integrations. Simple deployment model with extensive add-on ecosystem. Great for prototyping and small applications.\n\n**Best for:** Rapid prototyping\n**Price:** Paid from $25/month\n\n## How to Choose\n\n- **Frontend/Next.js:** Vercel\n- **Full-stack:** Railway or Render\n- **Global deployment:** Fly.io\n- **Backend services:** Supabase\n- **Edge computing:** Cloudflare AI\n- **Static sites:** Netlify\n- **Prototyping:** Heroku"
  },
  {
    slug: "best-ai-productivity-tools",
    title: "Best 10 AI Productivity Tools for Professionals in 2026",
    category: "Best Of",
    date: "2026-06-18",
    excerpt: "From Notion AI to Microsoft Copilot, compare the best AI productivity tools for note-taking, project management, and workflow automation.",
    content: "AI productivity tools have become essential for professionals who want to work smarter, not harder. From intelligent note-taking to automated workflows, these tools can save hours every week.\n\nHere are our top 10 picks for 2026.\n\n## 1. Notion AI\n\nAll-in-one workspace with AI features. Combines notes, databases, project management, and AI-powered content generation. The AI helps with summarization, translation, and brainstorming.\n\n**Best for:** Teams and individuals\n**Price:** Free tier available, AI from $10/user/month\n\n## 2. Microsoft Copilot\n\nAI assistant integrated into Microsoft 365. Helps with document creation, email drafting, data analysis, and presentations. Leverages GPT-4 for powerful AI capabilities.\n\n**Best for:** Microsoft 365 users\n**Price:** Included with Microsoft 365 Copilot\n\n## 3. Google Gemini\n\nGoogle's AI assistant integrated into Google Workspace. Helps with document creation, email drafting, data analysis, and presentations. Leverages Google's AI models for powerful capabilities.\n\n**Best for:** Google Workspace users\n**Price:** Free tier available, Pro from $10/month\n\n## 4. Mem AI\n\nAI-first knowledge base that automatically organizes and connects your information. Semantic search understands context and meaning. No manual tagging or organization needed.\n\n**Best for:** Individual knowledge management\n**Price:** Starts at $16/month\n\n## 5. Craft\n\nBeautiful note-taking and document creation app with AI features. Creates stunning documents and presentations with minimal effort. Great for creative professionals.\n\n**Best for:** Creative professionals\n**Price:** Free tier available, paid from $10/month\n\n## 6. Rewind AI\n\nRecords everything you do on your computer and uses AI to help you find information. Search through your screen recordings, documents, and messages with natural language.\n\n**Best for:** Information retrieval\n**Price:** Starts at $10/month\n\n## 7. Motion\n\nAI-powered project management and scheduling tool. Automatically schedules your tasks and meetings based on priorities and deadlines. Great for busy professionals.\n\n**Best for:** Project management\n**Price:** Starts at $32/month\n\n## 8. Superhuman\n\nUltra-fast email client with AI features. Helps with email drafting, scheduling, and organization. Designed for speed and efficiency.\n\n**Best for:** Email management\n**Price:** $30/month\n\n## 9. Obsidian\n\nLocal-first note-taking app with powerful linking and plugin ecosystem. AI plugins enhance its capabilities. Your data stays on your device for maximum privacy.\n\n**Best for:** Privacy-focused users\n**Price:** Free for personal use\n\n## 10. Anytype\n\nPrivacy-first productivity suite with local-first architecture. Combines notes, tasks, and databases in a beautiful interface. Completely open-source.\n\n**Best for:** Privacy-conscious teams\n**Price:** Free tier available\n\n## How to Choose\n\n- **All-in-one workspace:** Notion AI\n- **Microsoft users:** Microsoft Copilot\n- **Google users:** Google Gemini\n- **Knowledge management:** Mem AI or Obsidian\n- **Project management:** Motion\n- **Email:** Superhuman\n- **Privacy:** Anytype or Obsidian"
  },
  {
    slug: "best-ai-education-tools",
    title: "Best 8 AI Education Tools for Learning in 2026",
    category: "Best Of",
    date: "2026-06-18",
    excerpt: "From Khan Academy AI to Quizlet, compare the best AI education tools for students, teachers, and lifelong learners.",
    content: "AI education tools are transforming how we learn and teach. From personalized tutoring to automated grading, these tools can make education more accessible and effective.\n\nHere are our top 8 picks for 2026.\n\n## 1. Khan Academy (AI)\n\nFree educational platform with AI-powered features. Personalized learning paths, instant feedback, and adaptive exercises. Covers math, science, computing, and more.\n\n**Best for:** K-12 education\n**Price:** Free\n\n## 2. Duolingo Max (AI)\n\nLanguage learning platform with AI-powered features. Includes role-play scenarios, explain-my-answer AI, and personalized learning paths. Makes language learning engaging and effective.\n\n**Best for:** Language learning\n**Price:** Free tier available, Max from $13/month\n\n## 3. Quizlet\n\nAI-powered study tool with flashcards, practice tests, and explanations. Uses AI to generate study sets from textbooks and notes. Great for exam preparation.\n\n**Best for:** Exam preparation\n**Price:** Free tier available, Plus from $48/year\n\n## 4. Tome\n\nAI-powered storytelling and presentation tool. Creates beautiful presentations and narratives from text prompts. Great for educators and students.\n\n**Best for:** Presentations\n**Price:** Free tier available, paid from $20/month\n\n## 5. Gamma\n\nAI-powered document and presentation creator. Generates professional-looking documents, presentations, and webpages from simple prompts. Great for educators.\n\n**Best for:** Document creation\n**Price:** Free tier available, paid from $10/month\n\n## 6. Anthropic Claude\n\nWhile not specifically an education tool, Claude's reasoning capabilities make it excellent for tutoring, essay review, and complex problem-solving. The 200K context window allows for comprehensive document analysis.\n\n**Best for:** Advanced tutoring\n**Price:** Free tier available, Pro $20/month\n\n## 7. ChatGPT\n\nVersatile AI assistant that can help with homework, research, writing, and problem-solving. The free tier is remarkably generous for educational use.\n\n**Best for:** General education support\n**Price:** Free tier available, Plus $20/month\n\n## 8. Socratic by Google\n\nAI-powered homework help app. Take a photo of a math, science, or history problem and get step-by-step explanations. Great for visual learners.\n\n**Best for:** Homework help\n**Price:** Free\n\n## How to Choose\n\n- **K-12 education:** Khan Academy\n- **Language learning:** Duolingo Max\n- **Exam prep:** Quizlet\n- **Presentations:** Tome or Gamma\n- **Advanced tutoring:** Claude or ChatGPT\n- **Homework help:** Socratic"
  }
];

// Add new pages
let added = 0;
let skipped = 0;

for (const page of newPages) {
  // Check if already exists
  const exists = data.best_pages.some(p => p.slug === page.slug);
  if (exists) {
    console.log(`  Skipped (exists): ${page.slug}`);
    skipped++;
    continue;
  }

  data.best_pages.push(page);
  console.log(`  Added: ${page.slug}`);
  added++;
}

console.log(`\nAdded: ${added}, Skipped: ${skipped}`);
console.log(`Total best pages: ${data.best_pages.length}`);

// Write back with backticks for consistency with existing format
let output = JSON.stringify(data, null, 2);

// Convert back to backtick format for consistency
output = output.replace(/"content": "/g, 'content: `');
output = output.replace(/"content":\s*"/g, 'content: `');

// Write
fs.writeFileSync(filePath, output, 'utf-8');
console.log('\nFile updated successfully!');
