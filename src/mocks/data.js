// Datos exclusivos de la API simulada. Las páginas los obtienen a través de fetch.
export const categories = [
  {
    id: "ficcion",
    image: "https://covers.openlibrary.org/b/id/8566990-M.jpg?default=false",
    name: "Ficción",
    description:
      "Novelas de Jane Austen, Charlotte Brontë y Louisa May Alcott.",
    accent: "wine",
  },
  {
    id: "ciencia-ficcion",
    image: "https://covers.openlibrary.org/b/id/15266215-M.jpg?default=false",
    name: "Ciencia ficción",
    description: "Mary Shelley y H. G. Wells: ciencia, futuros e invenciones.",
    accent: "blue",
  },
  {
    id: "fantasia",
    image: "https://covers.openlibrary.org/b/id/11165954-M.jpg?default=false",
    name: "Fantasía",
    description: "Alicia, Oz y otros clásicos de la literatura fantástica.",
    accent: "green",
  },
  {
    id: "poesia",
    image: "https://covers.openlibrary.org/b/id/747596-M.jpg?default=false",
    name: "Poesía",
    description: "Poemarios de Gabriela Mistral y Pablo Neruda.",
    accent: "rose",
  },
  {
    id: "aventura",
    image: "https://covers.openlibrary.org/b/id/12331377-M.jpg?default=false",
    name: "Aventura",
    description: "Viajes y expediciones de Julio Verne y R. L. Stevenson.",
    accent: "ochre",
  },
  {
    id: "drama",
    image: "images/categories/drama.jpg",
    name: "Drama",
    description: "Esta categoría aún no tiene títulos disponibles.",
    accent: "purple",
  },
];

export const books = [
  {
    id: "orgullo-y-prejuicio",
    coverImage:
      "https://covers.openlibrary.org/b/id/8566990-L.jpg?default=false",
    coverSource: "https://openlibrary.org/works/OL19651512W",
    title: "Orgullo y prejuicio",
    author: "Jane Austen",
    categoryId: "ficcion",
    price: 14990,
    year: 1813,
    pages: 424,
    monogram: "OP",
    accent: "wine",
    description:
      "Elizabeth Bennet y el señor Darcy descubren cuánto pueden ocultar las primeras impresiones. Una novela sobre el amor, las convenciones sociales y la libertad de elegir.",
  },
  {
    id: "frankenstein",
    coverImage:
      "https://covers.openlibrary.org/b/id/15266215-L.jpg?default=false",
    coverSource: "https://openlibrary.org/works/OL26860869W",
    title: "Frankenstein",
    author: "Mary Shelley",
    categoryId: "ciencia-ficcion",
    price: 12990,
    year: 1818,
    pages: 280,
    monogram: "F",
    accent: "blue",
    description:
      "La ambición de Victor Frankenstein da vida a una criatura que busca su lugar en el mundo. Una historia sobre la responsabilidad, la soledad y los límites del conocimiento.",
  },
  {
    id: "alicia",
    coverImage:
      "https://covers.openlibrary.org/b/id/11165954-L.jpg?default=false",
    coverSource: "https://openlibrary.org/works/OL24531607W",
    title: "Alicia en el país de las maravillas",
    author: "Lewis Carroll",
    categoryId: "fantasia",
    price: 10990,
    year: 1865,
    pages: 160,
    monogram: "A",
    accent: "green",
    description:
      "Una madriguera abre la puerta a un mundo donde la lógica cambia a cada paso. Acompaña a Alicia en una aventura llena de personajes imposibles y preguntas inesperadas.",
  },
  {
    id: "veinte-poemas",
    coverImage:
      "https://covers.openlibrary.org/b/id/747596-L.jpg?default=false",
    coverSource: "https://openlibrary.org/works/OL979517W",
    title: "Veinte poemas de amor y una canción desesperada",
    author: "Pablo Neruda",
    categoryId: "poesia",
    price: 11990,
    year: 1924,
    pages: 112,
    monogram: "20",
    accent: "rose",
    description:
      "Una colección de poemas que recorre el amor, la memoria y la ausencia a través de imágenes de la naturaleza y una voz íntima.",
  },
  {
    id: "la-isla-del-tesoro",
    coverImage:
      "https://covers.openlibrary.org/b/id/12331377-L.jpg?default=false",
    coverSource: "https://openlibrary.org/works/OL26384450W",
    title: "La isla del tesoro",
    author: "Robert Louis Stevenson",
    categoryId: "aventura",
    price: 13990,
    year: 1883,
    pages: 304,
    monogram: "IT",
    accent: "ochre",
    description:
      "Un mapa lleva al joven Jim Hawkins a una expedición entre piratas, secretos y lealtades inciertas. Una aventura que convirtió la búsqueda del tesoro en un clásico.",
  },
  {
    id: "jane-eyre",
    coverImage:
      "https://covers.openlibrary.org/b/id/14713571-L.jpg?default=false",
    coverSource: "https://openlibrary.org/works/OL36754933W",
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    categoryId: "ficcion",
    price: 16990,
    year: 1847,
    pages: 544,
    monogram: "JE",
    accent: "purple",
    description:
      "Jane construye su independencia mientras enfrenta las expectativas de su época. Su llegada a Thornfield abre una historia de afectos, secretos y convicciones.",
  },
  {
    id: "la-maquina-del-tiempo",
    coverImage:
      "https://covers.openlibrary.org/b/id/13720965-L.jpg?default=false",
    coverSource: "https://openlibrary.org/works/OL34910251W",
    title: "La máquina del tiempo",
    author: "H. G. Wells",
    categoryId: "ciencia-ficcion",
    price: 9990,
    year: 1895,
    pages: 176,
    monogram: "MT",
    accent: "blue",
    description:
      "Un inventor viaja hacia un futuro remoto y encuentra una humanidad que apenas reconoce. Su descubrimiento invita a pensar en el progreso y sus consecuencias.",
  },
  {
    id: "el-mago-de-oz",
    coverImage:
      "https://covers.openlibrary.org/b/id/13639062-L.jpg?default=false",
    coverSource: "https://openlibrary.org/works/OL34853674W",
    title: "El maravilloso mago de Oz",
    author: "L. Frank Baum",
    categoryId: "fantasia",
    price: 12990,
    year: 1900,
    pages: 224,
    monogram: "OZ",
    accent: "green",
    description:
      "Dorothy recorre el camino de baldosas amarillas en busca de una manera de volver a casa. En el trayecto descubre el valor de la amistad y de sus propios recursos.",
  },
  {
    id: "desolacion",
    coverImage:
      "https://covers.openlibrary.org/b/id/11618024-L.jpg?default=false",
    coverSource: "https://openlibrary.org/works/OL24822235W",
    title: "Desolación",
    author: "Gabriela Mistral",
    categoryId: "poesia",
    price: 13990,
    year: 1922,
    pages: 256,
    monogram: "D",
    accent: "rose",
    description:
      "La primera colección de Gabriela Mistral reúne una poesía intensa que dialoga con la infancia, la naturaleza, el amor y la pérdida.",
  },
  {
    id: "viaje-al-centro",
    coverImage:
      "https://covers.openlibrary.org/b/id/8016398-L.jpg?default=false",
    coverSource: "https://openlibrary.org/works/OL17736890W",
    title: "Viaje al centro de la Tierra",
    author: "Julio Verne",
    categoryId: "aventura",
    price: 14990,
    year: 1864,
    pages: 320,
    monogram: "VT",
    accent: "ochre",
    description:
      "Un mensaje cifrado impulsa una expedición hacia las profundidades del planeta. Ciencia e imaginación acompañan un viaje a territorios desconocidos.",
  },
  {
    id: "mujercitas",
    coverImage:
      "https://covers.openlibrary.org/b/id/13012019-L.jpg?default=false",
    coverSource: "https://openlibrary.org/works/OL30919756W",
    title: "Mujercitas",
    author: "Louisa May Alcott",
    categoryId: "ficcion",
    price: 15990,
    year: 1868,
    pages: 480,
    monogram: "M",
    accent: "wine",
    description:
      "Las hermanas March crecen entre proyectos, dificultades y afectos compartidos. Cada una busca una vida propia sin perder los lazos que las unen.",
  },
  {
    id: "la-guerra-de-los-mundos",
    coverImage:
      "https://covers.openlibrary.org/b/id/13499665-L.jpg?default=false",
    coverSource: "https://openlibrary.org/works/OL34767175W",
    title: "La guerra de los mundos",
    author: "H. G. Wells",
    categoryId: "ciencia-ficcion",
    price: 12990,
    year: 1898,
    pages: 240,
    monogram: "GM",
    accent: "blue",
    description:
      "La llegada de visitantes de Marte transforma una comunidad inglesa y pone a prueba la seguridad humana. Un relato sobre la vulnerabilidad y la supervivencia.",
  },
];
