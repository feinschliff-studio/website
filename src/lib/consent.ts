import { PUBLIC_CONSENT_COOKIE_NAME } from "$env/static/public";
import Cookies, { type CookieAttributes } from "js-cookie";
import type { EventDispatcher } from "svelte";

export function setCookie<T extends SerializedChoices>(choices: T, cookieConfig: CookieAttributes = {}) {
  const cookieName = PUBLIC_CONSENT_COOKIE_NAME;
  const expires = new Date();
  expires.setDate(expires.getDate() + 365);

  const options: CookieAttributes = {
    sameSite: "strict",
    ...cookieConfig,
    expires,
  };

  Cookies.set(cookieName, JSON.stringify({ choices }), options);
}

export function removeCookie(cookieConfig: CookieAttributes = {}) {
  const cookieName = PUBLIC_CONSENT_COOKIE_NAME;
  const { path } = cookieConfig;

  Cookies.remove(cookieName, Object.assign({}, path ? { path } : {}));
}

export function execute<T extends Choices, V extends SerializedChoices<T>>(
  choices: T,
  chosen: V,
  dispatch: EventDispatcher<Record<ChoiceCategoryIdentifier<T>, unknown>>,
) {
  const types: ChoiceCategoryIdentifier<T>[] = Object.keys(choices);

  for (const key of types) {
    const agreed = chosen[key];

    if (choices[key]) {
      choices[key].value = agreed;
    }

    if (agreed) {
      dispatch(key);
    }
  }
}

export function validate(choice: SerializedChoices, cookieChoices: SerializedChoices) {
  const choices = Object.keys(choice);
  const chosen = Object.keys(cookieChoices);

  if (chosen.length !== choices.length) {
    return false;
  }

  return chosen.every(c => choices.includes(c));
}

export function enlistChoices<T extends Choices<V>, V extends ConsentCategory>(choices: T) {
  return Object.values(choices).map((item: V, index): IdentifiedConsentCategory<T, V> => ({
    ...item,
    id: Object.keys(choices)[index],
  }));
}

export function serializeChoices<T extends Choices<V>, V extends ConsentCategory>(
  choices: IdentifiedConsentCategory<T, V>[],
  callback: (item: IdentifiedConsentCategory<T, V>) => boolean,
) {
  return choices.reduce<SerializedChoices<T>>((result, item) => ({
    ...result,
    [item.id]: callback(item),
  }), {} as SerializedChoices<T>);
}

export interface ConsentCategory extends Record<string, unknown> {
  label: string;
  description: string;
  value: boolean;
}

export type Choices<T extends ConsentCategory = ConsentCategory> = Record<string, T>;
export type ChoiceCategoryIdentifier<T extends Choices = Choices> = keyof T & string;
export type SerializedChoices<T extends Choices = Choices> = Record<keyof T, boolean>;
type IdentifiedConsentCategory<T extends Choices<V>, V extends ConsentCategory, K extends keyof T = keyof T> = V & {
  id: K & string
}
