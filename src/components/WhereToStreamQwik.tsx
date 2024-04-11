import {
  component$,
  useSignal,
  useTask$,
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
  const countryName = useSignal("");
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
    countries.registerLocale(en);
    countryCode.value = localStorage.getItem("countryCode") || "NONE";
    countryName.value = countries.getName(countryCode.value, "en", {
      select: "alias",
    })!;
  });

  // Task runs on mount in browser and then every time we change countryCode
  useVisibleTask$(({ track }) => {
    track(() => countryCode.value);
    if (countryCode.value && countryCode.value.length > 1) {
      countryProviders.value = data[countryCode.value];
      countryName.value = countries.getName(countryCode.value, "en", {
        select: "alias",
      })!;
    }
  });
  return (
    <div class="">
      <div class="flex gap-2 items-center justify-center lg:justify-normal">
        {countryProviders.value?.hasOwnProperty("flatrate") ? (
          //@ts-ignore
          countryProviders.value.flatrate.map((provider) => (
            <img
              key={provider.provider_id}
              class=""
              src={`https://media.themoviedb.org/t/p/original/${provider.logo_path}`}
              alt="asd"
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
          class="bg-zinc-950 text-zinc-100 px-2 py-1"
          style="scrollbar-width:thin;"
          name="countries"
          id="countries-select"
          onChange$={(event, el) => {
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
      {/* <div class="flex gap-2 flex-wrap">
        {countryCodes.map((cC) => (
          <button onClick$={() => (countryCode.value = cC)}>{cC}</button>
        ))}
      </div> */}
      {/* <CountrySwitcher countries={Object.keys(data.results)} /> */}
    </div>
  );
});
