import {
  component$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

interface Props {
  data: any;
  countryCodes: string[];
}

export const WhereToStreamQwik = component$<Props>(({ data, countryCodes }) => {
  const countryCode = useSignal<string>("");
  const countryProviders = useSignal<{
    link: string;
    flatrate?: {
      logo_path: string;
      provider_id: number;
      provider_name: string;
      display_priority: number;
    }[];
  }>();
  countries.registerLocale(en);

  // Task runs once in browser/on client since we're not giving any 'track'
  useVisibleTask$(() => {
    countryCode.value = localStorage.getItem("countryCode") || "NONE";
  });

  // Task runs on mount in browser and then every time we change countryCode
  useVisibleTask$(({ track }) => {
    track(() => countryCode.value);
    if (countryCode.value && countryCode.value.length > 1) {
      countryProviders.value = data[countryCode.value];
    }
  });
  return (
    <div class="grid gap-4">
      <div class="flex flex-wrap gap-2 items-center justify-center lg:justify-normal">
        {countryProviders.value?.hasOwnProperty("flatrate") ? (
          //@ts-ignore
          countryProviders.value.flatrate.map((provider) => (
            <img
              title={provider.provider_name}
              key={provider.provider_id}
              class="rounded-sm"
              src={`https://media.themoviedb.org/t/p/original/${provider.logo_path}`}
              alt={`${provider.provider_name} logo`}
            />
          ))
        ) : countryCode.value !== "NONE" ? (
          <p class="mx-auto lg:mx-0">
            No streaming provider for{" "}
            {countries.getName(countryCode.value, "en", { select: "alias" })}
          </p>
        ) : (
          <p>Select a country below</p>
        )}
      </div>
      <div>
        <select
          class="bg-zinc-950 text-zinc-100 px-2 cursor-pointer py-1 rounded-lg"
          style="scrollbar-width:thin;"
          name="countries"
          id="countries-select"
          onChange$={(_, el) => {
            countryCode.value = el.value;
            localStorage.setItem("countryCode", el.value);
          }}
        >
          <option
            value="NONE"
            disabled
            defaultSelected={
              countryCode.value === "NONE" ||
              countryCodes.indexOf(countryCode.value) === -1
            }
          >
            Select a Country
          </option>
          {countryCodes.map((cC, i) => (
            <option
              defaultSelected={countryCode.value === cC}
              key={i}
              value={cC}
            >
              {countries.getName(cC, "en", { select: "alias" })}
            </option>
          ))}
        </select>
      </div>
      <p class="text-xs text-right">Data provided by JustWatch</p>
    </div>
  );
});
