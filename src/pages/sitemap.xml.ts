import type { APIRoute } from 'astro';
import { getAllGames, getAllGrades, getAllTopics } from '../contentLoader';
import { auditGameCollection } from '../quality/qualityGate';

export const GET: APIRoute = async () => {
  const games = getAllGames();
  const grades = getAllGrades();
  const topics = getAllTopics();
  const audit = auditGameCollection(games, { minWords: 250, maxSimilarity: 0.70 });

  const urls: Array<{ loc: string; priority: string; changefreq: string }> = [
    { loc: 'https://gridfluency.com/', priority: '1.0', changefreq: 'weekly' },
    { loc: 'https://gridfluency.com/math/', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://gridfluency.com/playlist/', priority: '0.8', changefreq: 'monthly' },
    { loc: 'https://gridfluency.com/privacy/', priority: '0.5', changefreq: 'monthly' }
  ];

  // Grade hubs
  grades.forEach((grade) => {
    urls.push({
      loc: `https://gridfluency.com/math/grade-${grade}/`,
      priority: '0.7',
      changefreq: 'weekly'
    });
  });

  // Topic hubs
  topics.forEach((topic) => {
    urls.push({
      loc: `https://gridfluency.com/math/${topic}/`,
      priority: '0.7',
      changefreq: 'weekly'
    });
  });

  // Quality gate verified game pages only
  games.forEach((game) => {
    const report = audit.reports.get(game.slug);
    // Exclude noindex flagged pages from sitemap
    if (report?.suggestedRobotsDirective === 'index, follow') {
      urls.push({
        loc: `https://gridfluency.com/math/${game.slug}/`,
        priority: '0.8',
        changefreq: 'monthly'
      });
    }
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
