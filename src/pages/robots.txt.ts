import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const robots = `User-agent: *
Allow: /

Sitemap: https://gridfluency.com/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
