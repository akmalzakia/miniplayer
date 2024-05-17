const externalUrlsBase = {
  spotify: "",
};

const restrictionsBase = {
  reason: "",
};

const externalIdsBase = {
  isrc: "",
  ean: "",
  upc: "",
};

const followersBase = {
  href: "",
  total: 0,
};

const ownerBase = {
  external_urls: externalUrlsBase,
  followers: followersBase,
  href: "",
  id: "",
  type: "",
  uri: "",
  display_name: "",
};

const imageBase = {
  url: "",
  height: 0,
  width: 0,
};

const simplifiedArtistBase = {
  external_urls: externalUrlsBase,
  href: "",
  id: "",
  name: "",
  type: "",
  uri: "",
};

const artistBase = {
  external_urls: externalUrlsBase,
  followers: followersBase,
  genres: [],
  href: "",
  id: "",
  images: [imageBase],
  name: "",
  popularity: 0,
  type: "",
  uri: "",
};

const trackBase = {
  added_at: "",
  added_by: ownerBase,
  is_local: false,
  track: {
    album: {
      album_type: "",
      total_tracks: 0,
      available_markets: [],
      external_urls: externalUrlsBase,
      href: "",
      id: "",
      images: [imageBase],
      name: "",
      release_date: "",
      release_date_precision: "",
      restrictions: restrictionsBase,
      type: "",
      uri: "",
      artists: [simplifiedArtistBase],
    },
    artists: [artistBase],
    available_markets: [],
    disc_number: 0,
    duration_ms: 0,
    explicit: false,
    external_ids: externalIdsBase,
    externalUrlsBase: externalUrlsBase,
    href: "",
    id: "",
    is_playable: true,
    linked_from: {},
    restrictions: restrictionsBase,
    name: "",
    popularity: 0,
    preview_url: "",
    track_number: 0,
    type: "",
    uri: "",
    is_local: false,
  },
};

const playlistBase = {
  collaborative: false,
  description: "",
  external_urls: externalUrlsBase,
  followers: followersBase,
  href: "",
  id: "",
  images: [imageBase],
  name: "",
  owner: ownerBase,
  public: true,
  snapshot_id: "",
  tracks: {
    href: "",
    limit: 0,
    next: "",
    offset: 0,
    previous: "",
    total: 0,
    items: [trackBase],
  },
  type: "",
  uri: "",
};

const userBase = {
  country: "",
  display_name: "",
  email: "",
  explicit_content: {
    filter_enabled: false,
    filter_locked: false,
  },
  external_urls: externalUrlsBase,
  followers: followersBase,
  href: "",
  id: "",
  images: [imageBase],
  product: "",
  type: "",
  uri: "",
};

export {
  externalIdsBase,
  externalUrlsBase,
  restrictionsBase,
  imageBase,
  ownerBase,
  followersBase,
  simplifiedArtistBase,
  artistBase,
  trackBase,
  playlistBase,
  userBase,
};
