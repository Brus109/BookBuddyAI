// src/services/mockData.ts
import type { Book } from '../types';

// ACTUALIZAR los géneros para que coincidan con los filtros
export const mockBooks: Book[] = [
  {
    id: 1,
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    description: "Una saga familiar en el pueblo mágico de Macondo...",
    genre: "Clásicos", // ✅ Coincide con filtro
    published_date: "1967",
    rating: 4.8,
    reviews: 1250
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    description: "Una distopía sobre un futuro totalitario...",
    genre: "Ciencia Ficción", // ✅ Coincide
    published_date: "1949",
    rating: 4.6,
    reviews: 890
  },
  {
    id: 3,
    title: "El principito",
    author: "Antoine de Saint-Exupéry",
    description: "Un cuento poético sobre un pequeño príncipe...",
    genre: "Fantasía", // ✅ Coincide
    published_date: "1943",
    rating: 4.9,
    reviews: 2100
  },
  {
    id: 4,
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "Principios y prácticas para escribir código...",
    genre: "Programación", // ✅ Coincide
    published_date: "2008",
    rating: 4.7,
    reviews: 450
  },
  {
    id: 5,
    title: "Harry Potter y la piedra filosofal",
    author: "J.K. Rowling",
    description: "El inicio de la aventura del joven mago Harry Potter...",
    genre: "Fantasía", // ✅ Coincide
    published_date: "1997",
    rating: 4.9,
    reviews: 3500
  },
  {
    id: 6,
    title: "Orgullo y prejuicio",
    author: "Jane Austen",
    description: "Una historia de amor y superación de prejuicios...",
    genre: "Romance", // ✅ Coincide
    published_date: "1813",
    rating: 4.5,
    reviews: 980
  }
];