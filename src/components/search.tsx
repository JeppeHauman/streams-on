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
    console.log(data);
    return data.results as SearchResult[];
  });

  return (
    <div class="relative">
      <input
        class="border-[3px] border-black outline-none ring-0 border-opacity-0 rounded-xl px-2 py-2 w-full bg-zinc-50 text-zinc-900 placeholder-zinc-600 focus:outline-none focus:border-orange-600 focus:border-[3px] transition-all
        "
        type="text"
        placeholder="Search"
        value={inputValue.value}
        onInput$={(event, element) => (inputValue.value = element.value)}
      />
      <Resource
        value={dropdownItems}
        onPending={() => <>Loading...</>}
        onResolved={(items) => (
          <ul class="absolute top-full">
            {items.map((item, i) => (
              <li key={i}>
                <a href={`/movie/${item.id}`}>{item.title}</a>
              </li>
            ))}
          </ul>
        )}
      />
    </div>
  );
});
