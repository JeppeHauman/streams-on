import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, url }) => {
  const query = params.query;
  const media = url.searchParams.get("media")
  console.log(media)

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.PUBLIC_TMDB_AUTH}`,
    },
  };
  const link = new URL(
    `https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=en-US`
  );
  link.searchParams.set("query", query || "");

  const response = await fetch(link, options);
  const data = await response.json();

  return new Response(JSON.stringify(data));
};
