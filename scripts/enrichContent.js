import * as fs from 'fs';
import * as path from 'path';

const gamesDir = path.resolve('content/games');
const files = fs.readdirSync(gamesDir).filter((f) => f.endsWith('.json'));

// Pedagogical enrichment dictionary by game topic and type
for (const file of files) {
  const filePath = path.join(gamesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Ensure intro has deep background
  if (!data.seo.intro.includes('Educational Benefits') && !data.seo.intro.includes('Fluency Development')) {
    data.seo.intro = `${data.seo.intro} Fluency Development: When students engage in timed identification on a 100-number grid, they move beyond manual finger-counting and transition into visual pattern synthesis. Developing automaticity with this specific math concept reduces cognitive load during multi-step problem solving, long division, and algebraic equation manipulation.`;
  }

  // Ensure howToPlay has clear step-by-step instructions
  if (!data.seo.howToPlay.includes('Keyboard and Accessibility')) {
    data.seo.howToPlay = `${data.seo.howToPlay} Keyboard and Accessibility Controls: Students can use a touchscreen, trackpad, mouse, or keyboard arrow keys to navigate between tiles. Pressing Space or Enter activates the focused tile. Wrong clicks temporarily flash red with an X icon and subtract 2 seconds, but remain unlocked so learners can self-correct without getting stuck.`;
  }

  // Ensure teacherNotes has rich classroom guidance
  if (!data.seo.teacherNotes.includes('Classroom Implementation')) {
    data.seo.teacherNotes = `${data.seo.teacherNotes} Classroom Implementation Ideas: Use this interactive grid during the first five minutes of math instruction as an energetic bell-ringer or daily warm-up. Teachers can project the screen onto an interactive whiteboard for whole-class competitive rounds, or assign the canonical link directly into Google Classroom for independent Chromebook math station rotations.`;
  }

  // Ensure at least 3 comprehensive FAQ items
  if (data.seo.faq.length < 3) {
    data.seo.faq.push({
      q: `How does mastering ${data.game.prompt.toLowerCase()} support higher-level math standards?`,
      a: `Building speed and accuracy with ${data.game.prompt.toLowerCase()} directly strengthens mental arithmetic and numerical reasoning. When foundational number facts become second nature, students can dedicate their active working memory to advanced problem-solving strategies, fraction equivalence, and multi-step word problems.`
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

console.log(`Enriched all ${files.length} game files.`);
