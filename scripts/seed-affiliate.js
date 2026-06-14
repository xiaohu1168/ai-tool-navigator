const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');

const tools = [];
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('_tools.json') && f !== 'other_tools.json');
files.forEach(file => {
  const catId = file.replace('_tools.json', '');
  const catTools = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8').replace(/^\uFEFF/, ''));
  catTools.forEach(t => {
    t.category_id = catId;
    tools.push(t);
  });
});

console.log('Loaded ' + tools.length + ' tools');

const byCategory = {};
tools.forEach(t => {
  if (!byCategory[t.category_id]) byCategory[t.category_id] = [];
  byCategory[t.category_id].push(t);
});

const comparisons = [];
Object.keys(byCategory).forEach(cat => {
  const sorted = byCategory[cat].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  for (let i = 0; i < Math.min(sorted.length, 5); i++) {
    for (let j = i + 1; j < Math.min(sorted.length, 5); j++) {
      const t1 = sorted[i];
      const t2 = sorted[j];
      comparisons.push({
        slug: t1.slug + '-vs-' + t2.slug,
        tool1_id: t1.slug,
        tool2_id: t2.slug,
        title: t1.name + ' vs ' + t2.name + ': Which AI Tool Is Better?',
        content: '# ' + t1.name + ' vs ' + t2.name + '\n\n' + (t1.description || '') + '\n\n## ' + t1.name + '\n\nRating: ' + (t1.rating || 'N/A') + '/5\nPrice: ' + (t1.price || 'Contact') + '\n\n## ' + t2.name + '\n\nRating: ' + (t2.rating || 'N/A') + '/5\nPrice: ' + (t2.price || 'Contact'),
        category: cat
      });
    }
  }
});

const prompts = [];
const promptDefs = {
  coding: [
    { title: 'Code Review Assistant', use_case: 'Review code for bugs and improvements', template: 'Review the following code for potential bugs, security issues, and performance optimizations. Suggest specific improvements:\n\n`\\n[CODE HERE]\\n`' },
    { title: 'Generate Unit Tests', use_case: 'Auto-generate unit tests', template: 'Generate comprehensive unit tests for the following function. Include edge cases and error handling:\n\n`javascript\\n[FUNCTION CODE]\\n`' },
    { title: 'Explain Code', use_case: 'Understand complex code', template: 'Explain what this code does in simple terms:\\n\n`\\n[CODE HERE]\\n`' }
  ],
  writing: [
    { title: 'Blog Post Outline', use_case: 'Generate blog post outline', template: 'Create a detailed blog post outline for the topic: [TOPIC]. Include introduction, 5-7 main sections, and conclusion.' },
    { title: 'SEO Meta Description', use_case: 'Write meta descriptions', template: 'Write a compelling meta description (150-160 characters) for: [TOPIC]. Include primary keyword and call to action.' },
    { title: 'Social Media Captions', use_case: 'Generate social captions', template: 'Write 5 engaging social media captions for [PRODUCT/TOPIC]. Vary the tone.' }
  ],
  design: [
    { title: 'Image Prompt Generator', use_case: 'Generate image prompts', template: 'Create a detailed image generation prompt for: [SUBJECT]. Include style, lighting, composition, and mood.' },
    { title: 'Color Palette', use_case: 'Generate color palettes', template: 'Generate a 5-color color palette for a [INDUSTRY] website. Mood should be [MOOD]. Provide hex codes.' }
  ],
  default: [
    { title: 'Best Use Prompt', use_case: 'General optimal usage', template: 'What are the best practices and optimal prompts for using [TOOL_NAME] to achieve [GOAL]? Provide step-by-step instructions with examples.' }
  ]
};

const catPrompts = promptDefs;
tools.forEach(tool => {
  const promptsForCat = catPrompts[tool.category_id] || catPrompts.default;
  if (promptsForCat) {
    promptsForCat.forEach(pt => {
      prompts.push({
        tool_id: tool.slug,
        title: pt.title,
        prompt_text: pt.template.replace('[TOOL_NAME]', tool.name || '[TOOL]').replace('[GOAL]', pt.use_case || 'your task'),
        use_case: pt.use_case,
        best_model: tool.name
      });
    });
  }
});

fs.writeFileSync(path.join(dataDir, 'comparisons_seed.json'), JSON.stringify(comparisons, null, 2), 'utf-8');
fs.writeFileSync(path.join(dataDir, 'prompts_seed.json'), JSON.stringify(prompts, null, 2), 'utf-8');

console.log('Generated ' + comparisons.length + ' comparisons');
console.log('Generated ' + prompts.length + ' prompts');
