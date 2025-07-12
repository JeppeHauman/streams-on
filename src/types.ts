type SearchResult = {
  id: string;
  name?: string;
  original_name?: string
  title?: string;
  original_title?: string
  vote_count: number
  media_type: 'tv' | 'movie'
  poster_path: string
};

type Movie = {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  overview: string;
  poster_path: string;
  runtime: number;
};

type Series = {
  id: number;
  name: string;
  original_name: string;
  first_air_date: string;
  poster_path: string;
  number_of_seasons: number;
  overview: string;
  genres: {
    id: number;
    name: string;
  }[];
};
