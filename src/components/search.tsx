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
        onPending={() => <>Loading...</>}
        onResolved={(items) => (
          <ul
            class={`absolute rounded-md bg-orange-600 text-zinc-900 ${
              items.length != 0 && "p-1"
            }`}
          >
            {items.map((item, i) => (
              <li
                class=" first:rounded-t-md last:rounded-b-md hover:text-zinc-100 top-full"
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
