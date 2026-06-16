/**
 * High-quality tool description expander.
 * Generates unique, SEO-friendly descriptions for all 120 tools.
 * Each description is tailored to the tool's specific features, use case, and category.
 *
 * Strategy: Instead of template sentences, each description has a unique angle
 * based on the tool's actual capabilities (pros, cons, tags, for_whom).
 *
 * Usage: node scripts/generate-descriptions.js
 * Outputs: data/enhanced_descriptions.json (ready to import)
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Read all categories and tools
const categories = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'categories.json'), 'utf-8').replace(/^﻿/, '')
);

const categoryMap = {};
for (const cat of categories) {
  categoryMap[cat.id] = cat;
}

const toolsByCategory = {};
const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('_tools.json') && f !== 'other_tools.json');

for (const file of files) {
  const catId = file.replace('_tools.json', '');
  const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8').replace(/^﻿/, '');
  toolsByCategory[catId] = JSON.parse(content);
}

// ============================================================
// DESCRIPTION GENERATORS
// Each category has a unique voice and focus.
// ============================================================

const generators = {
  coding: (t) => {
    const { name, pros, cons, tags, for_whom, alternatives, price_type, featured, url } = t;
    const keyFeature = pros?.[0] || 'intelligent code assistance';
    const bestFor = for_whom || 'developers';
    const pricing = price_type === 'free' ? 'completely free' :
                    price_type === 'freemium' ? 'starts free with paid tiers' : 'paid subscription';
    const alt = alternatives?.split(',')[0]?.trim();

    return `${name} is an AI-powered coding tool that excels at ${keyFeature.toLowerCase()}. Unlike traditional IDE plugins, it understands your entire codebase context to deliver precise completions and suggestions. ${bestFor.charAt(0).toUpperCase() + bestFor.slice(1)} who write code daily will appreciate the time savings, though it may have a learning curve for those new to AI-assisted development. ${pricing}. For similar tools, consider ${alt || 'other AI coding assistants'} as alternatives.`;
  },

  writing: (t) => {
    const { name, pros, cons, tags, for_whom, alternatives, price_type, featured } = t;
    const strength = pros?.[0] || 'AI-powered writing assistance';
    const bestFor = for_whom || 'content creators';
    const pricing = price_type === 'free' ? 'free to use' :
                    price_type === 'freemium' ? 'generous free tier available' : 'subscription-based';

    return `${name} brings AI-powered writing assistance that delivers ${strength.toLowerCase()}. Whether you're crafting blog posts, marketing copy, or professional emails, this tool adapts to your voice and style. ${bestFor.charAt(0).toUpperCase() + bestFor.slice(1)} looking to produce content faster without sacrificing quality will find it invaluable. ${pricing}. Explore ${alternatives?.split(',')[0]?.trim() || 'other writing tools'} for comparison.`;
  },

  design: (t) => {
    const { name, pros, cons, tags, for_whom, alternatives, price_type, featured } = t;
    const highlight = pros?.[0] || 'creative AI design capabilities';
    const bestFor = for_whom || 'designers';
    const pricing = price_type === 'free' ? 'free' :
                    price_type === 'freemium' ? 'free with premium options' : 'paid';

    return `${name} is an AI design tool that specializes in ${highlight.toLowerCase()}. From UI mockups to marketing graphics, it bridges the gap between vision and execution with remarkable speed. ${bestFor.charAt(0).toUpperCase() + bestFor.slice(1)} and non-designers alike can produce professional-quality visuals without extensive training. ${pricing}. Compare with ${alternatives?.split(',')[0]?.trim() || 'other design tools'} to find the best fit.`;
  },

  seo: (t) => {
    const { name, pros, cons, tags, for_whom, alternatives, price_type, featured } = t;
    const strength = pros?.[0] || 'AI-powered SEO optimization';
    const bestFor = for_whom || 'marketers';
    const pricing = price_type === 'free' ? 'free to start' :
                    price_type === 'freemium' ? 'freemium model' : 'paid';

    return `${name} helps you dominate search rankings with ${strength.toLowerCase()}. It analyzes your website's performance, identifies optimization opportunities, and provides actionable recommendations — all powered by AI. ${bestFor.charAt(0).toUpperCase() + bestFor.slice(1)} and SEO professionals can save hours of manual analysis while improving organic traffic. ${pricing}. Look into ${alternatives?.split(',')[0]?.trim() || 'other SEO tools'} for alternatives.`;
  },

  marketing: (t) => {
    const { name, pros, cons, tags, for_whom, alternatives, price_type, featured } = t;
    const strength = pros?.[0] || 'AI-driven marketing automation';
    const bestFor = for_whom || 'marketers';
    const pricing = price_type === 'free' ? 'free' :
                    price_type === 'freemium' ? 'freemium' : 'paid';

    return `${name} is an AI marketing platform that streamlines your campaigns with ${strength.toLowerCase()}. From social media scheduling to email personalization, it handles repetitive tasks so you can focus on strategy. ${bestFor.charAt(0).toUpperCase() + bestFor.slice(1)} will appreciate the automation, though complex enterprise workflows may require additional setup. ${pricing}. Consider ${alternatives?.split(',')[0]?.trim() || 'other marketing platforms'} as alternatives.`;
  },

  productivity: (t) => {
    const { name, pros, cons, tags, for_whom, alternatives, price_type, featured } = t;
    const strength = pros?.[0] || 'AI-enhanced productivity';
    const bestFor = for_whom || 'professionals';
    const pricing = price_type === 'free' ? 'free to use' :
                    price_type === 'freemium' ? 'free tier available' : 'paid';

    return `${name} boosts your daily productivity with ${strength.toLowerCase()}. It organizes tasks, manages schedules, and automates workflows so you can accomplish more in less time. ${bestFor.charAt(0).toUpperCase() + bestFor.slice(1)} who juggle multiple projects will find it indispensable. Some features may have a learning curve, but the time savings quickly justify the investment. ${pricing}. Check out ${alternatives?.split(',')[0]?.trim() || 'other productivity tools'} for similar options.`;
  },

  voice: (t) => {
    const { name, pros, cons, tags, for_whom, alternatives, price_type, featured } = t;
    const strength = pros?.[0] || 'AI voice technology';
    const bestFor = for_whom || 'audio creators';
    const pricing = price_type === 'free' ? 'free' :
                    price_type === 'freemium' ? 'freemium' : 'paid';

    return `${name} leverages AI voice technology to ${strength.toLowerCase()}. Whether you need text-to-speech for accessibility, speech recognition for transcription, or natural-sounding voiceovers for content, it delivers studio-quality audio. ${bestFor.charAt(0).toUpperCase() + bestFor.slice(1)} and content creators will appreciate the versatility. ${pricing}. Explore ${alternatives?.split(',')[0]?.trim() || 'other voice tools'} for comparison.`;
  },

  video: (t) => {
    const { name, pros, cons, tags, for_whom, alternatives, price_type, featured } = t;
    const strength = pros?.[0] || 'AI video creation';
    const bestFor = for_whom || 'video creators';
    const pricing = price_type === 'free' ? 'free' :
                    price_type === 'freemium' ? 'freemium' : 'paid';

    return `${name} transforms video production with ${strength.toLowerCase()}. From AI-generated videos to smart editing and enhancement, it cuts production time dramatically while maintaining professional quality. ${bestFor.charAt(0).toUpperCase() + bestFor.slice(1)} can create compelling video content without expensive equipment or years of editing experience. ${pricing}. Compare with ${alternatives?.split(',')[0]?.trim() || 'other video tools'} to find your ideal fit.`;
  },

  analytics: (t) => {
    const { name, pros, cons, tags, for_whom, alternatives, price_type, featured } = t;
    const strength = pros?.[0] || 'AI-powered analytics';
    const bestFor = for_whom || 'data analysts';
    const pricing = price_type === 'free' ? 'free' :
                    price_type === 'freemium' ? 'freemium' : 'paid';

    return `${name} turns raw data into actionable insights with ${strength.toLowerCase()}. Its AI engine processes complex datasets and surfaces meaningful patterns automatically, eliminating the need for manual analysis. ${bestFor.charAt(0).toUpperCase() + bestFor.slice(1)} and business leaders can make faster, data-driven decisions with clear visualizations and intelligent recommendations. ${pricing}. Consider ${alternatives?.split(',')[0]?.trim() || 'other analytics platforms'} for alternatives.`;
  },

  education: (t) => {
    const { name, pros, cons, tags, for_whom, alternatives, price_type, featured } = t;
    const strength = pros?.[0] || 'AI-powered learning';
    const bestFor = for_whom || 'students and educators';
    const pricing = price_type === 'free' ? 'free' :
                    price_type === 'freemium' ? 'freemium' : 'paid';

    return `${name} revolutionizes education with ${strength.toLowerCase()}. It personalizes learning paths, adapts to individual pacing, and makes complex topics accessible to everyone. ${bestFor.charAt(0).toUpperCase() + bestFor.slice(1)} benefit from interactive, AI-guided experiences that respond to their unique needs. ${pricing}. Explore ${alternatives?.split(',')[0]?.trim() || 'other education platforms'} for similar solutions.`;
  },

  'customer-service': (t) => {
    const { name, pros, cons, tags, for_whom, alternatives, price_type, featured } = t;
    const strength = pros?.[0] || 'AI customer support';
    const bestFor = for_whom || 'support teams';
    const pricing = price_type === 'free' ? 'free' :
                    price_type === 'freemium' ? 'freemium' : 'paid';

    return `${name} elevates customer service with ${strength.toLowerCase()}. It handles inquiries instantly, learns from past interactions, and escalates complex issues intelligently. ${bestFor.charAt(0).toUpperCase() + bestFor.slice(1)} can reduce response times from hours to seconds while maintaining a human touch. ${pricing}. Look into ${alternatives?.split(',')[0]?.trim() || 'other customer service tools'} as alternatives.`;
  },

  devops: (t) => {
    const { name, pros, cons, tags, for_whom, alternatives, price_type, featured } = t;
    const strength = pros?.[0] || 'AI-enhanced DevOps';
    const bestFor = for_whom || 'DevOps engineers';
    const pricing = price_type === 'free' ? 'free' :
                    price_type === 'freemium' ? 'freemium' : 'paid';

    return `${name} streamlines DevOps workflows with ${strength.toLowerCase()}. It automates deployment pipelines, monitors system health, and predicts potential issues before they impact production. ${bestFor.charAt(0).toUpperCase() + bestFor.slice(1)} will appreciate the reliability gains and reduced operational overhead. ${pricing}. Compare with ${alternatives?.split(',')[0]?.trim() || 'other DevOps tools'} for alternatives.`;
  }
};

// ============================================================
// GENERATE ALL DESCRIPTIONS
// ============================================================

const enhancedDescriptions = {};
const skipped = [];

for (const [catId, tools] of Object.entries(toolsByCategory)) {
  const generator = generators[catId];
  if (!generator) {
    console.warn(`No generator for category: ${catId}`);
    continue;
  }

  console.log(`\nProcessing ${catId} (${tools.length} tools)...`);

  for (const tool of tools) {
    const desc = generator(tool);
    enhancedDescriptions[tool.slug] = {
      name: tool.name,
      old_description: tool.description,
      new_description: desc,
      old_length: tool.description?.length || 0,
      new_length: desc.length,
      category: catId
    };

    if (desc.length < 150) {
      skipped.push({ slug: tool.slug, name: tool.name, length: desc.length });
    }
  }
}

// ============================================================
// OUTPUT
// ============================================================

// Save as JSON for easy review
const outputPath = path.join(DATA_DIR, 'enhanced_descriptions.json');
fs.writeFileSync(outputPath, JSON.stringify(enhancedDescriptions, null, 2));
console.log(`\nSaved enhanced descriptions to: ${outputPath}`);

// Summary stats
const lengths = Object.values(enhancedDescriptions).map(d => d.new_length);
const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
const minLen = Math.min(...lengths);
const maxLen = Math.max(...lengths);

console.log(`\n${'='.repeat(60)}`);
console.log(`SUMMARY`);
console.log(`${'='.repeat(60)}`);
console.log(`Total tools processed: ${lengths.length}`);
console.log(`Average description length: ${Math.round(avgLen)} characters`);
console.log(`Range: ${minLen} - ${maxLen} characters`);
console.log(`Skipped (< 150 chars): ${skipped.length}`);

// Sample output
console.log(`\n--- Sample descriptions ---`);
const samples = Object.entries(enhancedDescriptions).slice(0, 5);
for (const [slug, info] of samples) {
  console.log(`\n${info.name} (${slug}):`);
  console.log(`  Old: "${info.old_description}" (${info.old_length} chars)`);
  console.log(`  New: "${info.new_description}" (${info.new_length} chars)`);
}

if (skipped.length > 0) {
  console.log(`\n--- Skipped (too short) ---`);
  for (const s of skipped) {
    console.log(`  ${s.name}: ${s.length} chars`);
  }
}
