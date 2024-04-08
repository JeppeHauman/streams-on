import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

interface Props {
  data: any;
  countryCodes: string[];
}

export const WhereToStreamQwik = component$<Props>(({ data, countryCodes }) => {
  const countryCode = useSignal<string>();
  const countryProviders = useSignal<{
    link: string;
    flatrate?: {
      logo_path: string;
      provider_id: number;
      provider_name: string;
      display_priority: number;
    }[];
  }>();

  // Task runs once in browser/on client since we're not giving any 'track'
  useVisibleTask$(async () => {
    countryCode.value = localStorage.getItem("countryCode") || "DK";
  });

  // Task runs on mount in browser and then every time we change countryCode
  useVisibleTask$(({ track }) => {
    track(() => countryCode.value);
    if (countryCode.value && countryCode.value.length > 1) {
      countryProviders.value = data[countryCode.value];
    }
    console.log(countryProviders.value);
  });
  return (
    <div class="">
      <div class="flex gap-2">
        {countryProviders.value?.hasOwnProperty("flatrate") ? (
          //@ts-ignore
          countryProviders.value.flatrate.map((provider) => (
            <img
              class=""
              src={`https://media.themoviedb.org/t/p/original/${provider.logo_path}`}
              alt="asd"
            />
          ))
        ) : (
          <div>No streaming provider</div>
        )}
      </div>
      <div class="flex gap-2 flex-wrap">
        {countryCodes.map((cC) => (
          <button onClick$={() => (countryCode.value = cC)}>{cC}</button>
        ))}
      </div>
      {/* <CountrySwitcher countries={Object.keys(data.results)} /> */}
    </div>
  );
});
