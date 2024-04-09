import {
  Resource,
  component$,
  useResource$,
  useSignal,
} from "@builder.io/qwik";

export const Search = component$(() => {
  const inputValue = useSignal("");

  const dropdownItems = useResource$(async ({ cleanup, track }) => {
    track(() => inputValue.value);

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
    const url = new URL(`http://127.0.0.1:4321/api/${inputValue.value}`);

    const response = await fetch(url, options);
    const data = await response.json();
    return data.results as SearchResult[];
  });

  return (
    <div class="relative">
      <input
        class="border-[3px] border-black outline-none ring-0 border-opacity-0 mb-1 rounded-xl px-2 py-2 w-full bg-zinc-50 text-zinc-900 placeholder-zinc-600 focus:outline-none focus:border-orange-600 focus:border-[3px] transition-all"
        type="text"
        placeholder="Search"
        value={inputValue.value}
        onInput$={(_, element) => (inputValue.value = element.value)}
      />
      <Resource
        value={dropdownItems}
        onPending={() => <div class="absolute">Loading...</div>}
        onResolved={(items) => (
          <ul
            class={`absolute left-0 right-0 divide-y-2 divide-zinc-900 divide-opacity-40 rounded-md bg-zinc-950 text-orange-600 ${
              items.length != 0 && "p-1"
            }`}
          >
            {items.map((item, i) => (
              <li
                class="py-2 hover:bg-zinc-900 first:rounded-t-md last:rounded-b-md pl-3 top-full"
                key={i}
              >
                <a class="block w-full h-full" href={`/movie/${item.id}`}>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      />
    </div>
  );
});
