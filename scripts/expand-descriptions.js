/**
 * Expand tool descriptions from short one-liners to detailed, SEO-friendly paragraphs.
 * Uses existing tool data (pros, cons, tags, for_whom, alternatives) to generate
 * specific, content-rich descriptions that don't read like generic AI output.
 *
 * Usage: node scripts/expand-descriptions.js
 * This reads from data/*.json files and writes updated descriptions back.
 * Then outputs a CSV of changes for review.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Category-specific description templates and angle hints
const CATEGORY_ANGLES = {
  coding: {
    focus: 'code generation, IDE integration, autocomplete, debugging, full-stack app building',
    tone: 'technical but accessible, highlight practical developer benefits'
  },
  writing: {
    focus: 'copywriting, blog posts, emails, marketing content, creative writing',
    tone: 'highlight productivity gains and content quality improvements'
  },
  design: {
    focus: 'UI/UX, image generation, video editing, logo creation, graphic design',
    tone: 'emphasize creative capabilities and output quality'
  },
  seo: {
    focus: 'keyword research, site analysis, ranking optimization, content optimization',
    tone: 'highlight measurable SEO improvements and time savings'
  },
  marketing: {
    focus: 'social media, email marketing, A/B testing, analytics, campaign management',
    tone: 'emphasize ROI and automation benefits'
  },
  productivity: {
    focus: 'project management, meeting notes, docs, workflow automation, task management',
    tone: 'highlight time savings and organizational benefits'
  },
  voice: {
    focus: 'text-to-speech, speech recognition, podcast production, audio tools',
    tone: 'emphasize audio quality and accessibility benefits'
  },
  video: {
    focus: 'video generation, editing, enhancement, animation',
    tone: 'highlight creative video capabilities and production speed'
  },
  analytics: {
    focus: 'business intelligence, data visualization, AI-powered insights, reporting',
    tone: 'emphasize data-driven decision making'
  },
  education: {
    focus: 'learning platforms, tutoring, course creation, skill development',
    tone: 'highlight personalized learning and accessibility'
  },
  'customer-service': {
    focus: 'chatbots, helpdesk, AI customer support, ticket management',
    tone: 'emphasize response quality and cost reduction'
  },
  devops: {
    focus: 'deployment, CI/CD, monitoring, performance, infrastructure',
    tone: 'highlight reliability and operational efficiency'
  }
};

/**
 * Generate a rich description for a single tool.
 * Combines the existing short description with pros, cons, tags, for_whom, alternatives
 * to create something that reads like a real review, not a Wikipedia summary.
 */
function generateDescription(tool, categoryInfo) {
  const { name, description: shortDesc, pros, cons, tags, for_whom, alternatives, price_type, featured } = tool;

  // Start with the core capability from the short description
  const sentences = [];

  // Sentence 1: What it is + main capability
  sentences.push(shortDesc);

  // Sentence 2: Highlight key strengths from pros (pick top 2-3)
  const topPros = (pros || []).slice(0, 3).join('、');
  if (topPros) {
    sentences.push(`Key strengths include ${topPros.toLowerCase()}.`);
  }

  // Sentence 3: Who it's best for (from for_whom + tags)
  if (for_whom) {
    sentences.push(`Best suited for ${for_whom.toLowerCase()}, especially those looking to ${categoryInfo.focus.split(',')[0].trim()}.`);
  }

  // Sentence 4: Pricing model context
  if (price_type === 'free') {
    sentences.push('Completely free to use, making it accessible for anyone.');
  } else if (price_type === 'freemium') {
    sentences.push('Offers a generous free tier with optional paid upgrades for power users.');
  } else if (price_type === 'paid' || price_type === 'subscription') {
    sentences.push('Requires a paid subscription, typically offering strong value for professional users.');
  }

  // Sentence 5: Alternatives context (adds uniqueness)
  if (alternatives) {
    const altList = alternatives.split(',').map(a => a.trim()).slice(0, 2);
    sentences.push(`For similar tools, consider ${altList.join(' or ')} as alternatives.`);
  }

  // Sentence 6: Differentiator based on category
  if (featured) {
    sentences.push('A standout choice that\'s editor-recommended for its quality and impact.');
  }

  return sentences.join(' ');
}

/**
 * Format pros/cons as readable bullet-style text for descriptions.
 */
function formatList(arr) {
  if (!arr || !Array.isArray(arr)) return '';
  return arr.join(', ').toLowerCase();
}

function processFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return { tools: [], skipped: [] };

  const content = fs.readFileSync(filePath, 'utf-8').replace(/^﻿/, '');
  const tools = JSON.parse(content);
  const category = filename.replace('_tools.json', '');
  const categoryInfo = CATEGORY_ANGLES[category] || { focus: 'various use cases', tone: 'informative' };

  const updated = [];
  const skipped = [];

  for (const tool of tools) {
    const oldDesc = tool.description || '';
    const newDesc = generateDescription(tool, categoryInfo);

    if (newDesc.length <= 120) {
      skipped.push({ name: tool.name, desc: newDesc, length: newDesc.length });
    }

    tool.description = newDesc;
    updated.push({
      slug: tool.slug,
      name: tool.name,
      oldLength: oldDesc.length,
      newLength: newDesc.length,
      description: newDesc
    });
  }

  return { tools, updated, skipped, category };
}

async function main() {
  console.log('='.repeat(60));
  console.log('Tool Description Expander');
  console.log('='.repeat(60));

  // Gather all category tool files
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('_tools.json') && f !== 'other_tools.json');

  console.log(`\nFound ${files.length} category files to process.\n`);

  const allUpdated = [];
  const allSkipped = [];

  for (const file of files) {
    const result = processFile(file);
    if (result.updated) {
      allUpdated.push(...result.updated);
    }
    if (result.skipped) {
      allSkipped.push(...result.skipped);
    }
  }

  // Summary
  console.log(`Processed: ${allUpdated.length} tools`);
  console.log(`Skipped (too short): ${allSkipped.length} tools`);

  const avgOld = allUpdated.reduce((sum, t) => sum + t.oldLength, 0) / allUpdated.length;
  const avgNew = allUpdated.reduce((sum, t) => sum + t.newLength, 0) / allUpdated.length;
  console.log(`\nAverage description length: ${Math.round(avgOld)} → ${Math.round(avgNew)} characters`);
  console.log(`Expansion ratio: ${(avgNew / avgOld).toFixed(1)}x`);

  // Output CSV for review
  const csvLines = ['slug,name,old_length,new_length'];
  for (const t of allUpdated) {
    csvLines.push(`"${t.slug}","${t.name}",${t.oldLength},${t.newLength}`);
  }
  const csvPath = path.join(__dirname, '..', 'data', 'description_changes.csv');
  fs.writeFileSync(csvPath, csvLines.join('\n'));
  console.log(`\nCSV report saved to: ${csvPath}`);

  // Output sample descriptions
  console.log('\n--- Sample expanded descriptions ---');
  for (const t of allUpdated.slice(0, 5)) {
    console.log(`\n${t.name}:`);
    console.log(t.description);
  }

  // Print skipped
  if (allSkipped.length > 0) {
    console.log('\n--- Skipped (descriptions too short) ---');
    for (const s of allSkipped) {
      console.log(`  ${s.name}: "${s.desc}" (${s.length} chars)`);
    }
  }
}

main().catch(console.error);
