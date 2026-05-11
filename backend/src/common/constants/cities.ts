export const EGYPT_CITIES = [
  { key: 'cairo', value: 'Cairo' },
  { key: 'giza', value: 'Giza' },
  { key: 'alexandria', value: 'Alexandria' },
  { key: 'dakahlia', value: 'Dakahlia' },
  { key: 'red_sea', value: 'Red Sea' },
  { key: 'beheira', value: 'Beheira' },
  { key: 'fayoum', value: 'Fayoum' },
  { key: 'gharbia', value: 'Gharbia' },
  { key: 'ismailia', value: 'Ismailia' },
  { key: 'monufia', value: 'Monufia' },
  { key: 'minya', value: 'Minya' },
  { key: 'qalyubia', value: 'Qalyubia' },
  { key: 'new_valley', value: 'New Valley' },
  { key: 'suez', value: 'Suez' },
  { key: 'aswan', value: 'Aswan' },
  { key: 'assiut', value: 'Assiut' },
  { key: 'beni_suef', value: 'Beni Suef' },
  { key: 'port_said', value: 'Port Said' },
  { key: 'damietta', value: 'Damietta' },
  { key: 'sharqia', value: 'Sharqia' },
  { key: 'south_sinai', value: 'South Sinai' },
  { key: 'kafr_el_sheikh', value: 'Kafr El Sheikh' },
  { key: 'matrouh', value: 'Matrouh' },
  { key: 'luxor', value: 'Luxor' },
  { key: 'qena', value: 'Qena' },
  { key: 'north_sinai', value: 'North Sinai' },
  { key: 'sohag', value: 'Sohag' },
];

export type EgyptCityKey = (typeof EGYPT_CITIES)[number]['key'];

export const EGYPT_CITY_ENUM_VALUES = EGYPT_CITIES.map(({ key }) => key) as [
  EgyptCityKey,
  ...EgyptCityKey[],
];
