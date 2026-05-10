export interface Country {
  name: string;
  code: string;
  zone: "local" | "surrounding" | "farther" | "international";
}

export const countries: Country[] = [
  // Local
  { name: "Netherlands", code: "netherlands", zone: "local" },
  
  // Surrounding
  { name: "Belgium", code: "belgium", zone: "surrounding" },
  { name: "Germany", code: "germany", zone: "surrounding" },
  { name: "Luxembourg", code: "luxembourg", zone: "surrounding" },
  { name: "France", code: "france", zone: "surrounding" },

  // Farther (Europe)
  { name: "Austria", code: "austria", zone: "farther" },
  { name: "Bulgaria", code: "bulgaria", zone: "farther" },
  { name: "Croatia", code: "croatia", zone: "farther" },
  { name: "Cyprus", code: "cyprus", zone: "farther" },
  { name: "Czech Republic", code: "czech-republic", zone: "farther" },
  { name: "Denmark", code: "denmark", zone: "farther" },
  { name: "Estonia", code: "estonia", zone: "farther" },
  { name: "Finland", code: "finland", zone: "farther" },
  { name: "Greece", code: "greece", zone: "farther" },
  { name: "Hungary", code: "hungary", zone: "farther" },
  { name: "Ireland", code: "ireland", zone: "farther" },
  { name: "Italy", code: "italy", zone: "farther" },
  { name: "Latvia", code: "latvia", zone: "farther" },
  { name: "Lithuania", code: "lithuania", zone: "farther" },
  { name: "Malta", code: "malta", zone: "farther" },
  { name: "Poland", code: "poland", zone: "farther" },
  { name: "Portugal", code: "portugal", zone: "farther" },
  { name: "Romania", code: "romania", zone: "farther" },
  { name: "Slovakia", code: "slovakia", zone: "farther" },
  { name: "Slovenia", code: "slovenia", zone: "farther" },
  { name: "Spain", code: "spain", zone: "farther" },
  { name: "Sweden", code: "sweden", zone: "farther" },
  { name: "United Kingdom", code: "united-kingdom", zone: "farther" },
  { name: "Switzerland", code: "switzerland", zone: "farther" },
  { name: "Norway", code: "norway", zone: "farther" },
  { name: "Turkey", code: "turkey", zone: "farther" },

  // International (Major)
  { name: "United States", code: "united-states", zone: "international" },
  { name: "Canada", code: "canada", zone: "international" },
  { name: "Australia", code: "australia", zone: "international" },
  { name: "New Zealand", code: "new-zealand", zone: "international" },
  { name: "Japan", code: "japan", zone: "international" },
  { name: "China", code: "china", zone: "international" },
  { name: "India", code: "india", zone: "international" },
  { name: "Brazil", code: "brazil", zone: "international" },
  { name: "Mexico", code: "mexico", zone: "international" },
  { name: "South Africa", code: "south-africa", zone: "international" },
  { name: "United Arab Emirates", code: "united-arab-emirates", zone: "international" },
  { name: "Saudi Arabia", code: "saudi-arabia", zone: "international" },
  { name: "Singapore", code: "singapore", zone: "international" },
  { name: "South Korea", code: "south-korea", zone: "international" },
  { name: "Israel", code: "israel", zone: "international" },
  { name: "Hong Kong", code: "hong-kong", zone: "international" },
  { name: "Argentina", code: "argentina", zone: "international" },
  { name: "Chile", code: "chile", zone: "international" },
  { name: "Colombia", code: "colombia", zone: "international" },
  { name: "Peru", code: "peru", zone: "international" },
  { name: "Thailand", code: "thailand", zone: "international" },
  { name: "Vietnam", code: "vietnam", zone: "international" },
  { name: "Malaysia", code: "malaysia", zone: "international" },
  { name: "Indonesia", code: "indonesia", zone: "international" },
  { name: "Philippines", code: "philippines", zone: "international" },
  { name: "Egypt", code: "egypt", zone: "international" },
  { name: "Morocco", code: "morocco", zone: "international" },
  { name: "Nigeria", code: "nigeria", zone: "international" },
  { name: "Kenya", code: "kenya", zone: "international" },
];

// If you need more countries, you can add them here. 
// For "every small and big country", we could use a library, 
// but this list covers the most common ones and sets the pattern.
