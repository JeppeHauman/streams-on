import {
  Resource,
  component$,
  useResource$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

export const Search = component$(({ isHomepage }: { isHomepage: boolean }) => {
  const inputValue = useSignal("");
  const searchMedia = useSignal("");

  const inputRef = useSignal<HTMLElement>();

  const isProd = import.meta.env.PROD;

  useVisibleTask$(() => {
    searchMedia.value = localStorage.getItem("searchMedia") || "movie";
  });

  const dropdownItems = useResource$(async ({ cleanup, track }) => {
    track(() => inputValue.value);
    track(() => searchMedia.value);

    const controller = new AbortController();
    cleanup(() => controller.abort());

    if (inputValue.value.length < 1) {
      return [];
    }

    const options = {
      method: "GET",
      signal: controller.signal,
      headers: {
        accept: "application/json",
      },
    };

    const url = new URL(
      `${
        isProd ? "https://streams-on.vercel.app" : "http://localhost:4321/"
      }/api/${inputValue.value}?media=${searchMedia.value}`
    );

    const response = await fetch(url, options);
    const data = await response.json();
    if (searchMedia.value === "movie") {
      return data.results as MovieSearchResult[];
    }
    return data.results as SeriesSearchResult[];
  });
  return (
    <div class="relative z-20">
      <div
        class={`flex gap-2 p-2 justify-end items-center ${
          isHomepage ? "justify-center" : ""
        }`}
      >
        {isHomepage && <p>What are you looking for?</p>}
        <div>
          <input
            class="hidden peer"
            id="series"
            name="media"
            type="radio"
            value="tv"
            checked={searchMedia.value === "tv"}
            onChange$={(event, el) => {
              searchMedia.value = el.value;
              localStorage.setItem("searchMedia", el.value);
            }}
          />
          <label
            for="series"
            class="peer-checked:text-orange-600 text-xs lg:text-base py-1 px-2 border rounded-md peer-checked:border-orange-600
              peer-hover:cursor-pointer peer-checked:hover:border-orange-600 peer-checked:hover:text-orange-600 peer-hover:bg-zinc-800 peer-checked:hover:bg-zinc-900"
          >
            Series
          </label>
        </div>
        <div>
          <input
            class="hidden peer"
            id="movie"
            name="media"
            type="radio"
            value="movie"
            checked={searchMedia.value === "movie"}
            onChange$={(event, el) => {
              searchMedia.value = el.value;
              localStorage.setItem("searchMedia", el.value);
            }}
          />
          <label
            for="movie"
            class="peer-checked:text-orange-600 text-xs lg:text-base py-1 px-2 border rounded-md peer-checked:border-orange-600
              peer-hover:cursor-pointer peer-checked:hover:border-orange-600 peer-checked:hover:text-orange-600 peer-hover:bg-zinc-800 peer-checked:hover:bg-zinc-900"
          >
            Movie
          </label>
        </div>
      </div>
      <div class="relative">
        <input
          ref={inputRef}
          class="border-[3px] border-black outline-none ring-0 border-opacity-0 rounded-sm sm:rounded-xl px-2 py-1 lg:py-2 lg:min-w-96 w-full bg-zinc-50 text-zinc-900 placeholder-zinc-600 focus:outline-none focus:border-orange-600 hover:border-zinc-500 focus:border-[3px] transition-all"
          type="text"
          placeholder="Search"
          value={inputValue.value}
          onInput$={(_, element) => (inputValue.value = element.value)}
        />

        <button
          class={`${
            inputValue.value.length < 1 && "hidden"
          } absolute inline-block text-2xl font-bold right-2 top-1/2 -translate-y-1/2 text-zinc-900 hover:text-zinc-700`}
          onClick$={() => {
            inputValue.value = "";
            inputRef.value?.focus();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
            />
          </svg>
        </button>
      </div>
      <Resource
        value={dropdownItems}
        onPending={() => (
          <ul
            class={`absolute left-0 right-0 divide-y-2 divide-zinc-900 divide-opacity-40 rounded-md bg-zinc-950 text-orange-600 p-1`}
          >
            <li class="py-2 hover:bg-zinc-900 first:rounded-t-md last:rounded-b-md pl-3 top-full">
              Loading...
            </li>
          </ul>
        )}
        onResolved={(items) => (
          <ul
            class={`absolute overflow-y-auto overflow-x-hidden left-0 right-0 divide-y-2 divide-zinc-900 divide-opacity-40 rounded-md bg-zinc-950 text-orange-600 ${
              items.length != 0 && "p-1"
            }  ${items.length === 1 && "h-24"} ${
              items.length === 2 && "h-44"
            } ${items.length === 3 && "h-72"} ${
              items.length > 3 && isHomepage
                ? "h-[50vh]"
                : items.length > 3 && "h-[70vh]"
            } `}
          >
            {items.map((item, i) => (
              <li
                class="py-2 hover:bg-zinc-900 first:rounded-t-md last:rounded-b-md pl-3 top-full"
                key={i}
              >
                <a
                  class="w-full h-full grid grid-cols-[1fr_5fr] gap-2"
                  onClick$={() => (inputValue.value = "")}
                  href={`/${
                    searchMedia.value === "movie" ? "movie" : "series"
                  }/${item.id}`}
                >
                  <div class="w-8 lg:w-12">
                    <img
                      class="w-full aspect-[11/16] object-cover"
                      src={
                        item.poster_path !== null
                          ? `https://media.themoviedb.org/t/p/original${item.poster_path}`
                          : "../../imagePlaceholder.png"
                      }
                      alt={`Movieposter of ${
                        "name" in item ? item.name : item.title
                      }`}
                    />
                  </div>

                  <div class="flex flex-col grow">
                    <p class="">{"name" in item ? item.name : item.title}</p>
                    {"name" in item
                      ? item.original_name !== item.name && (
                          <p class="">{item.original_name}</p>
                        )
                      : item.original_title !== item.title && (
                          <p class="">{item.original_title}</p>
                        )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
        onRejected={() => <div>Something went terribly wrong. Try again</div>}
      />
    </div>
  );
});
