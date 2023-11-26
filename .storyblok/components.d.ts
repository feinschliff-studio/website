import {StoryblokStory} from 'storyblok-generate-ts'

export interface ButtonStoryblok {
  autofocus?: boolean;
  disabled?: boolean;
  label?: string;
  type: "submit" | "reset" | "button";
  name?: string;
  value?: string;
  _uid: string;
  component: "Button";
  [k: string]: any;
}

export interface CheckboxFieldStoryblok {
  label: string;
  name: string;
  placeholder?: string;
  value?: boolean;
  required?: boolean;
  autofocus?: boolean;
  disabled?: boolean;
  _uid: string;
  component: "CheckboxField";
  [k: string]: any;
}

export interface RichtextStoryblok {
  type: string;
  content?: RichtextStoryblok[];
  marks?: RichtextStoryblok[];
  attrs?: any;
  text?: string;
  [k: string]: any;
}

export type MultilinkStoryblok =
  | {
      id?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "story";
      story?: {
        name: string;
        created_at?: string;
        published_at?: string;
        id: number;
        uuid: string;
        content?: {
          [k: string]: any;
        };
        slug: string;
        full_slug: string;
        sort_by_date?: null | string;
        position?: number;
        tag_list?: string[];
        is_startpage?: boolean;
        parent_id?: null | number;
        meta_data?: null | {
          [k: string]: any;
        };
        group_id?: string;
        first_published_at?: string;
        release_id?: null | number;
        lang?: string;
        path?: null | string;
        alternates?: any[];
        default_full_slug?: null | string;
        translated_slugs?: null | any[];
        [k: string]: any;
      };
      [k: string]: any;
    }
  | {
      url?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "asset" | "url";
      [k: string]: any;
    }
  | {
      email?: string;
      linktype?: "email";
      [k: string]: any;
    };

export interface CookieBannerStoryblok {
  heading: string;
  description: RichtextStoryblok;
  privacyPolicyLink: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  imprintLink: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  immediateRejectionEnabled?: boolean;
  labels?: any;
  acceptLabel: string;
  rejectLabel: string;
  settingsLabel: string;
  closeLabel: string;
  editLabel: string;
  applyLabel: string;
  necessaryControlGroup?: any;
  necessaryCategoryLabel: string;
  necessaryCategoryDescription: string;
  trackingControlGroup?: any;
  trackingCategoryLabel: string;
  trackingCategoryDescription: string;
  trackingCategoryEnabled?: boolean;
  analyticsControlGroup?: any;
  analyticsCategoryLabel: string;
  analyticsCategoryDescription: string;
  analyticsCategoryEnabled?: boolean;
  marketingControlGroup?: any;
  marketingCategoryLabel: string;
  marketingCategoryDescription: string;
  marketingCategoryEnabled?: boolean;
  roundedCorners?: boolean;
  backdropBlur?: boolean;
  _uid: string;
  component: "CookieBanner";
  [k: string]: any;
}

export interface FieldGroupStoryblok {
  columns: string;
  fields: (
    | ButtonStoryblok
    | CheckboxFieldStoryblok
    | FieldGroupStoryblok
    | MultiLineFieldStoryblok
    | NumberFieldStoryblok
    | TextFieldStoryblok
  )[];
  rows: string;
  gap?:
    | "auto"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16";
  _uid: string;
  component: "FieldGroup";
  [k: string]: any;
}

export interface FooterStoryblok {
  links?: MenuLinkStoryblok[];
  content?: RichtextStoryblok;
  colored?: boolean;
  _uid: string;
  component: "Footer";
  [k: string]: any;
}

export interface FormStoryblok {
  notificationRecipientName: string;
  notificationRecipientEmail: string;
  notificationSubject: string;
  notificationHtml: RichtextStoryblok;
  notificationPlain: string;
  name: string;
  fields: (
    | ButtonStoryblok
    | CheckboxFieldStoryblok
    | FieldGroupStoryblok
    | MultiLineFieldStoryblok
    | NumberFieldStoryblok
    | TextFieldStoryblok
  )[];
  content?: RichtextStoryblok;
  columns?: string;
  rows?: string;
  gap:
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16";
  method: "post" | "get";
  action: string;
  encodingType: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
  colored?: boolean;
  redirectionTarget: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  fallbackValue: string;
  feedbackOptions?: any;
  successMessage: RichtextStoryblok;
  errorMessage: RichtextStoryblok;
  _uid: string;
  component: "Form";
  [k: string]: any;
}

export type MultiassetStoryblok = {
  alt?: string;
  copyright?: string;
  id: number;
  filename: string;
  name: string;
  title?: string;
  [k: string]: any;
}[];

export interface GalleryStoryblok {
  playbackOptions?: any;
  perViewOptions?: any;
  controlOptions?: any;
  type: "carousel" | "slider";
  autoplay: string;
  animationDuration: string;
  perView: string;
  perViewMobile: string;
  direction: "ltr" | "rtl";
  startAt: string;
  peek: string;
  rewind?: boolean;
  rewindDuration: string;
  keyboard?: boolean;
  control?: boolean;
  hoverpause?: boolean;
  bullets?: boolean;
  swipeTreshold: string;
  dragThreshold: string;
  name: string;
  items: MultiassetStoryblok;
  colored?: boolean;
  _uid: string;
  component: "Gallery";
  [k: string]: any;
}

export interface GeoMapStoryblok {
  mapId?: string;
  maxZoom?: string;
  minZoom?: string;
  tilt?: boolean;
  showStreetViewControl?: boolean;
  clickableIcons?: boolean;
  zoom: string;
  markers?: MapMarkerStoryblok[];
  longitude?: string;
  latitude?: string;
  colored?: boolean;
  _uid: string;
  component: "GeoMap";
  [k: string]: any;
}

export interface GridStoryblok {
  heading?: string;
  subheading?: string;
  items?: (
    | FooterStoryblok
    | FormStoryblok
    | GalleryStoryblok
    | GeoMapStoryblok
    | GridStoryblok
    | HeroStoryblok
    | OfferingListStoryblok
    | TextSectionStoryblok
    | ButtonStoryblok
    | CheckboxFieldStoryblok
    | FieldGroupStoryblok
    | MultiLineFieldStoryblok
    | NumberFieldStoryblok
    | TextFieldStoryblok
    | LinkStoryblok
    | TextStoryblok
    | TextBlockStoryblok
  )[];
  headingLevel: string;
  subheadingLevel: string;
  columns: string;
  rows: string;
  gap:
    | "auto"
    | "0.5"
    | "1"
    | "1.5"
    | "2"
    | "2.5"
    | "3"
    | "3.5"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12"
    | "14"
    | "16";
  recede?: boolean;
  bleed?: boolean;
  popOut?: boolean;
  colored?: boolean;
  anchor?: string;
  _uid: string;
  component: "Grid";
  [k: string]: any;
}

export interface AssetStoryblok {
  alt?: string;
  copyright?: string;
  id: number;
  filename: string;
  name: string;
  title?: string;
  focus?: string;
  [k: string]: any;
}

export interface HeroStoryblok {
  headline: string;
  scrollIndicator?: boolean;
  subheading?: (TextStoryblok | LinkStoryblok)[];
  backgroundImage?: AssetStoryblok;
  patternOverlay?: boolean;
  _uid: string;
  component: "Hero";
  [k: string]: any;
}

export interface LinkStoryblok {
  target: Exclude<MultilinkStoryblok, {linktype?: "asset"}>;
  label: string;
  _uid: string;
  component: "Link";
  [k: string]: any;
}

export interface MapMarkerStoryblok {
  title?: string;
  content?: RichtextStoryblok;
  open?: boolean;
  latitude: string;
  longitude: string;
  _uid: string;
  component: "MapMarker";
  [k: string]: any;
}

export interface MenuLinkStoryblok {
  target: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  label?: string;
  _uid: string;
  component: "MenuLink";
  [k: string]: any;
}

export interface MultiLineFieldStoryblok {
  autofocus?: boolean;
  autocorrect?: boolean;
  autocomplete?: boolean;
  spellcheck?: "default" | "true" | "false";
  disabled?: boolean;
  readonly?: boolean;
  rows?: string;
  cols?: string;
  wrap?: "hard" | "soft" | "off";
  required?: boolean;
  minlength?: string;
  maxlength?: string;
  label: string;
  name: string;
  placeholder?: string;
  _uid: string;
  component: "MultiLineField";
  [k: string]: any;
}

export interface NumberFieldStoryblok {
  autofocus?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
  label: string;
  name: string;
  placeholder?: string;
  value?: string;
  size?: string;
  _uid: string;
  component: "NumberField";
  [k: string]: any;
}

export interface OfferingStoryblok {
  name: string;
  price: string;
  description?: RichtextStoryblok;
  _uid: string;
  component: "Offering";
  [k: string]: any;
}

export interface OfferingListStoryblok {
  highlights?: OfferingStoryblok[];
  items?: OfferingStoryblok[];
  content?: RichtextStoryblok;
  colored?: boolean;
  _uid: string;
  component: "OfferingList";
  [k: string]: any;
}

export interface PageStoryblok {
  body: (
    | FooterStoryblok
    | FormStoryblok
    | GalleryStoryblok
    | GeoMapStoryblok
    | GridStoryblok
    | HeroStoryblok
    | OfferingListStoryblok
    | TextSectionStoryblok
  )[];
  _uid: string;
  component: "Page";
  [k: string]: any;
}

export interface SiteConfigStoryblok {
  monday?: any;
  openOnMonday?: boolean;
  openingTimeMonday?: string;
  closingTimeMonday?: string;
  tuesday?: any;
  openOnTuesday?: boolean;
  openingTimeTuesday?: string;
  closingTimeTuesday?: string;
  wednesday?: any;
  openOnWednesday?: boolean;
  openingTimeWednesday?: string;
  closingTimeWednesday?: string;
  thursday?: any;
  openOnThursday?: boolean;
  openingTimeThursday?: string;
  closingTimeThursday?: string;
  friday?: any;
  openOnFriday?: boolean;
  openingTimeFriday?: string;
  closingTimeFriday?: string;
  saturday?: any;
  openOnSaturday?: boolean;
  openingTimeSaturday?: string;
  closingTimeSaturday?: string;
  sunday?: any;
  openOnSunday?: boolean;
  openingTimeSunday?: string;
  closingTimeSunday?: string;
  founderGivenName: string;
  founderFamilyName: string;
  founderEmail: string;
  companyName: string;
  website: string;
  phoneNumber: string;
  emailAdress: string;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  paymentAccepted: ("Cash" | "Credit Card" | "Debit Card")[];
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  addressCountry: "DE" | "CH" | "AT";
  coordinates?: any;
  latitude: string;
  longitude: string;
  _uid: string;
  component: "SiteConfig";
  [k: string]: any;
}

export interface TextStoryblok {
  text: string;
  _uid: string;
  component: "Text";
  [k: string]: any;
}

export interface TextBlockStoryblok {
  heading?: string;
  subheading?: string;
  content: RichtextStoryblok;
  headingLevel: string;
  subheadingLevel: string;
  anchor?: string;
  _uid: string;
  component: "TextBlock";
  [k: string]: any;
}

export interface TextFieldStoryblok {
  type: "text" | "email" | "search" | "tel" | "url";
  autocomplete?:
    | "on"
    | "off"
    | "name"
    | "honorific-prefix"
    | "given-name"
    | "additional-name"
    | "family-name"
    | "honorific-suffix"
    | "nickname"
    | "email"
    | "username"
    | "organization-title"
    | "organization"
    | "street-address"
    | "shipping street-address"
    | "billing street-address"
    | "country"
    | "country-name"
    | "postal-code"
    | "language"
    | "bday"
    | "sex"
    | "url"
    | "photo"
    | "tel";
  autofocus?: boolean;
  spellcheck?: boolean;
  autocapitalize?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  size?: string;
  required?: boolean;
  pattern?: string;
  minlength?: string;
  maxlength?: string;
  label: string;
  name: string;
  placeholder?: string;
  value?: string;
  _uid: string;
  component: "TextField";
  [k: string]: any;
}

export interface TextSectionStoryblok {
  recede?: boolean;
  heading?: string;
  subheading?: string;
  content: RichtextStoryblok;
  bleed?: boolean;
  popOut?: boolean;
  headingLevel?: string;
  subheadingLevel?: string;
  colored?: boolean;
  anchor?: string;
  _uid: string;
  component: "TextSection";
  [k: string]: any;
}
