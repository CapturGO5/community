interface CountryNameProps {
  country: string;
}

const countryNames: { [key: string]: string } = {
  'au': 'Australia',
  'at': 'Austria',
  'be': 'Belgium',
  'br': 'Brazil',
  'ca': 'Canada',
  'ch': 'Switzerland',
  'cl': 'Chile',
  'co': 'Colombia',
  'cz': 'Czech Republic',
  'dk': 'Denmark',
  'eg': 'Egypt',
  'es': 'Spain',
  'fi': 'Finland',
  'gb': 'United Kingdom',
  'gr': 'Greece',
  'hu': 'Hungary',
  'id': 'Indonesia',
  'ie': 'Ireland',
  'il': 'Israel',
  'it': 'Italy',
  'mx': 'Mexico',
  'ng': 'Nigeria',
  'nl': 'Netherlands',
  'no': 'Norway',
  'nz': 'New Zealand',
  'pe': 'Peru',
  'ph': 'Philippines',
  'pl': 'Poland',
  'pt': 'Portugal',
  'ro': 'Romania',
  'ru': 'Russia',
  'sa': 'Saudi Arabia',
  'se': 'Sweden',
  'sg': 'Singapore',
  'th': 'Thailand',
  'tr': 'Turkey',
  'ua': 'Ukraine',
  'us': 'United States',
  'uy': 'Uruguay',
  'vn': 'Vietnam',
  'za': 'South Africa'
};

export function CountryName({ country }: CountryNameProps) {
  console.log('CountryName component received:', { country });
  const countryCode = country.toLowerCase();
  console.log('CountryName lookup:', { countryCode, found: countryNames[countryCode] });
  const countryName = countryNames[countryCode] || country;

  return (
    <span className="text-lg text-white/90">{countryName}</span>
  );
}
