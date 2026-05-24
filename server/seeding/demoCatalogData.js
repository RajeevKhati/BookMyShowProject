/** Indian multiplex / cinema locations (demo data). */
const INDIAN_THEATRES = [
  {
    name: "PVR INOX Select Citywalk",
    address: "A-3, District Centre, Saket, New Delhi, Delhi 110017",
    phone: 9876543210,
    email: "saket@pvr-demo.in",
    city: "Delhi",
  },
  {
    name: "PVR ICON Phoenix Palladium",
    address:
      "462, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
    phone: 9876543211,
    email: "lowerparel@pvr-demo.in",
    city: "Mumbai",
  },
  {
    name: "INOX R City Mall",
    address: "LBS Marg, Ghatkopar West, Mumbai, Maharashtra 400086",
    phone: 9876543212,
    email: "rcity@inox-demo.in",
    city: "Mumbai",
  },
  {
    name: "Cinepolis Orion Mall",
    address: "Dr Rajkumar Road, Rajajinagar, Bengaluru, Karnataka 560055",
    phone: 9876543213,
    email: "orion@cinepolis-demo.in",
    city: "Bengaluru",
  },
  {
    name: "PVR Nexus Koramangala",
    address: "Forum Nexus Mall, Koramangala, Bengaluru, Karnataka 560034",
    phone: 9876543214,
    email: "koramangala@pvr-demo.in",
    city: "Bengaluru",
  },
  {
    name: "INOX DLF Promenade",
    address: "3, Nelson Mandela Marg, Vasant Kunj, New Delhi, Delhi 110070",
    phone: 9876543215,
    email: "promenade@inox-demo.in",
    city: "Delhi",
  },
  {
    name: "PVR Vega City",
    address: "Bannerghatta Road, Bengaluru, Karnataka 560076",
    phone: 9876543216,
    email: "vega@pvr-demo.in",
    city: "Bengaluru",
  },
  {
    name: "Miraj Cinemas FC Road",
    address: "FC Road, Shivajinagar, Pune, Maharashtra 411004",
    phone: 9876543217,
    email: "fcroad@miraj-demo.in",
    city: "Pune",
  },
  {
    name: "Carnival Cinemas Hitech City",
    address: "HITEC City, Madhapur, Hyderabad, Telangana 500081",
    phone: 9876543218,
    email: "hitech@carnival-demo.in",
    city: "Hyderabad",
  },
  {
    name: "PVR Acropolis Mall",
    address: "Kasba, Kolkata, West Bengal 700107",
    phone: 9876543219,
    email: "acropolis@pvr-demo.in",
    city: "Kolkata",
  },
];

/** Demo movies — poster is a single full image URL per title. */
const SEED_MOVIES = [
  {
    movieName: "Jawan",
    description:
      "A high-octane action thriller about a man on a mission to set right past wrongs in society.",
    duration: 169,
    genre: "Action",
    language: "Hindi",
    releaseDate: "2023-09-07",
    poster:
      "https://www.themoviedb.org/t/p/w1280/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg",
  },
  {
    movieName: "Pathaan",
    description:
      "An Indian spy races to stop a mercenary leader from unleashing a devastating attack.",
    duration: 146,
    genre: "Action",
    language: "Hindi",
    releaseDate: "2023-01-25",
    poster:
      "https://www.themoviedb.org/t/p/w1280/arf00BkwvXo0CFKbaD9OpqdE4Nu.jpg",
  },
  {
    movieName: "Animal",
    description:
      "A son's obsessive devotion to his father pushes him into violence and moral collapse.",
    duration: 201,
    genre: "Thriller",
    language: "Hindi",
    releaseDate: "2023-12-01",
    poster:
      "https://www.themoviedb.org/t/p/w1280/hr9rjR3J0xBBKmlJ4n3gHId9ccx.jpg",
  },
  {
    movieName: "12th Fail",
    description:
      "Inspired by a true story — a UPSC aspirant from Chambal refuses to give up on his dream.",
    duration: 147,
    genre: "Patriot",
    language: "Hindi",
    releaseDate: "2023-10-27",
    poster:
      "https://www.themoviedb.org/t/p/w1280/eebUPRI4Z5e1Z7Hev4JZAwMIFkX.jpg",
  },
  {
    movieName: "Dunki",
    description:
      "Four Punjabi friends take an unusual route to reach England and reunite with loved ones.",
    duration: 161,
    genre: "Comedy",
    language: "Hindi",
    releaseDate: "2023-12-21",
    poster:
      "https://www.themoviedb.org/t/p/w1280/kPRb1mbVHGop0egQ7153y0lhzGL.jpg",
  },
  {
    movieName: "Fighter",
    description:
      "IAF aviators unite when a terrorist plot threatens the nation from the skies.",
    duration: 166,
    genre: "Action",
    language: "Hindi",
    releaseDate: "2024-01-25",
    poster: "https://image.tmdb.org/t/p/w500/zqFuriKJ6pYDvf72kXNLONnuE8k.jpg",
  },
  {
    movieName: "Stree 2",
    description:
      "The vengeful spirit returns, and the town must outsmart supernatural terror once again.",
    duration: 147,
    genre: "Horror",
    language: "Hindi",
    releaseDate: "2024-08-15",
    poster: "https://image.tmdb.org/t/p/w500/2NC7sj8rheKxWqLYAbHnCa4mYBH.jpg",
  },
  {
    movieName: "Kalki 2898 AD",
    description:
      "In a dystopian future, a warrior rises on a mission tied to prophecy and cosmic war.",
    duration: 181,
    genre: "Action",
    language: "Telugu",
    releaseDate: "2024-06-27",
    poster: "https://image.tmdb.org/t/p/w500/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg",
  },
  {
    movieName: "Pushpa 2: The Rule",
    description:
      "The sandalwood smuggler returns as rivals and police close in from every side.",
    duration: 150,
    genre: "Action",
    language: "Telugu",
    releaseDate: "2024-12-05",
    poster:
      "https://www.themoviedb.org/t/p/w1280/bhxZj3y59cK7JtGdV285dhDRaMe.jpg",
  },
  {
    movieName: "RRR",
    description:
      "Two revolutionaries forge an epic bond before fighting for India's independence.",
    duration: 187,
    genre: "Action",
    language: "Telugu",
    releaseDate: "2022-03-24",
    poster: "https://image.tmdb.org/t/p/w500/tjpiEnZBUAA8pdNPRKa5vP2Zpqw.jpg",
  },
  {
    movieName: "Salaar: Part 1 – Cease Fire",
    description:
      "A loyal friend returns to a lawless city, igniting a brutal battle for power.",
    duration: 175,
    genre: "Action",
    language: "Telugu",
    releaseDate: "2023-12-22",
    poster:
      "https://www.themoviedb.org/t/p/w1280/nlu9WbcetNFRGXXPWITr30ob7W6.jpg",
  },
  {
    movieName: "Gadar 2",
    description:
      "During the 1971 war, Tara Singh crosses the border again to rescue his son.",
    duration: 170,
    genre: "Patriot",
    language: "Hindi",
    releaseDate: "2023-08-11",
    poster:
      "https://www.themoviedb.org/t/p/w1280/nlu9WbcetNFRGXXPWITr30ob7W6.jpg",
  },
  {
    movieName: "Brahmāstra Part One: Shiva",
    description:
      "A DJ discovers ancient astras and powers that could save or destroy the world.",
    duration: 167,
    genre: "Action",
    language: "Hindi",
    releaseDate: "2022-09-09",
    poster:
      "https://www.themoviedb.org/t/p/w1280/x61qdvHIsr9U53FwoLVDQqAGur0.jpg",
  },
  {
    movieName: "Kantara",
    description:
      "A Kambala champion's life intertwines with forest deity folklore in coastal Karnataka.",
    duration: 150,
    genre: "Bhakti",
    language: "Telugu",
    releaseDate: "2022-09-30",
    poster:
      "https://www.themoviedb.org/t/p/w1280/jIsKmkxMzdCZ0Ux1GVSnu8m6Na6.jpg",
  },
  {
    movieName: "Leo",
    description:
      "A café owner in Kashmir is dragged back into the violent world he tried to escape.",
    duration: 164,
    genre: "Thriller",
    language: "Telugu",
    releaseDate: "2023-10-19",
    poster:
      "https://www.themoviedb.org/t/p/w1280/t1oAdt8JjUs4sHEBvE8fKtjV7er.jpg",
  },
  {
    movieName: "Vikram",
    description:
      "A black-ops agent hunts a masked syndicate flooding Tamil Nadu with narcotics.",
    duration: 175,
    genre: "Thriller",
    language: "Telugu",
    releaseDate: "2022-06-03",
    poster:
      "https://www.themoviedb.org/t/p/w1280/774UV1aCURb4s4JfEFg3IEMu5Zj.jpg",
  },
  {
    movieName: "Oppenheimer",
    description:
      "J. Robert Oppenheimer and the race to build the atomic bomb during World War II.",
    duration: 180,
    genre: "Thriller",
    language: "English",
    releaseDate: "2023-07-21",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
  },
  {
    movieName: "Dune: Part Two",
    description:
      "Paul Atreides unites with the Fremen to avenge his family and control Arrakis.",
    duration: 166,
    genre: "Action",
    language: "English",
    releaseDate: "2024-03-01",
    poster: "https://image.tmdb.org/t/p/w500/3HzGtM0JpfH2pWFGugJK22LRP6b.jpg",
  },
  {
    movieName: "Barbie",
    description:
      "Barbie and Ken leave Barbieland and discover what it means to be human.",
    duration: 114,
    genre: "Comedy",
    language: "English",
    releaseDate: "2023-07-21",
    poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
  },
  {
    movieName: "Avatar: The Way of Water",
    description:
      "Jake and Neytiri protect their family as a familiar threat returns to Pandora.",
    duration: 192,
    genre: "Action",
    language: "English",
    releaseDate: "2022-12-16",
    poster: "https://image.tmdb.org/t/p/w500/qnzQm0PCVnSyv1dqpVmRgMWHbLD.jpg",
  },
  {
    movieName: "Spider-Man: Across the Spider-Verse",
    description:
      "Miles Morales leaps across the Multiverse and meets a new team of Spider-People.",
    duration: 140,
    genre: "Action",
    language: "English",
    releaseDate: "2023-06-02",
    poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
  },
  {
    movieName: "Mission: Impossible – Dead Reckoning Part One",
    description:
      "Ethan Hunt tracks a terrifying new weapon that could end all of humanity.",
    duration: 163,
    genre: "Action",
    language: "English",
    releaseDate: "2023-07-12",
    poster: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
  },
  {
    movieName: "Guardians of the Galaxy Vol. 3",
    description:
      "The Guardians race to protect one of their own and defend the galaxy.",
    duration: 150,
    genre: "Comedy",
    language: "English",
    releaseDate: "2023-05-05",
    poster: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
  },
  {
    movieName: "Interstellar",
    description:
      "Explorers travel through a wormhole in space to secure humanity's future.",
    duration: 169,
    genre: "Mystery",
    language: "English",
    releaseDate: "2014-11-07",
    poster: "https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
  },
  {
    movieName: "Laapataa Ladies",
    description:
      "Two brides are swapped on a train, sparking a tender search across rural India.",
    duration: 122,
    genre: "Comedy",
    language: "Hindi",
    releaseDate: "2024-03-01",
    poster:
      "https://www.themoviedb.org/t/p/w1280/cGG5hCwPnMvuKzvUBnxo5y3DcVM.jpg",
  },
];

const SHOW_SLOTS = [
  { name: "Morning Show", time: "10:00", ticketPrice: 180 },
  { name: "Matinee", time: "13:30", ticketPrice: 220 },
  { name: "Evening Show", time: "16:45", ticketPrice: 260 },
  { name: "Prime Show", time: "20:00", ticketPrice: 320 },
  { name: "Late Night", time: "22:30", ticketPrice: 280 },
];

module.exports = {
  INDIAN_THEATRES,
  SEED_MOVIES,
  SHOW_SLOTS,
};
