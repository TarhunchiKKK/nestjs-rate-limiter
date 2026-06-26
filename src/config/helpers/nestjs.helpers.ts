import type { ClassProvider, ExistingProvider, ValueProvider } from "@nestjs/common";

export type CustomProvider<T> = ClassProvider<T> | ValueProvider<T> | ExistingProvider<T>;

export type CustomProvidersMap<T> = Map<CustomProvider<T>["provide"], T>;

export function getProvidersMap<T>(providers: CustomProvider<T>[]): CustomProvidersMap<T> {
    const map: CustomProvidersMap<T> = new Map();

    for (const provider of providers) {
        if ("useClass" in provider) {
            map.set(provider.provide, new provider.useClass());
        } else if ("useValue" in provider) {
            map.set(provider.provide, provider.useValue);
        } else if ("useExisting" in provider) {
            map.set(provider.provide, provider.useExisting);
        } else {
            throw Error(`Unknown provider type: ${provider}`);
        }
    }

    return map;
}
