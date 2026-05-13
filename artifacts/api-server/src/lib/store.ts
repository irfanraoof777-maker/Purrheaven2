import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Cat {
  id: string;
  name: string;
  age: number;
  ageUnit: string;
  breed?: string;
  color?: string;
  temperament?: string;
  goodWithKids?: boolean;
  goodWithDogs?: boolean;
  spayedNeutered: boolean;
  healthNotes: string;
  city: string;
  postedBy: string;
  postedByUsername: string;
  photo1: string;
  photo2: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  catId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
  parentId: string | null;
}

export const users: User[] = [
  {
    id: uuidv4(),
    username: "testuser",
    password: "cat123",
  },
];

export const cats: Cat[] = [
  {
    id: uuidv4(),
    name: "Mochi",
    age: 8,
    ageUnit: "months",
    breed: "Domestic Shorthair",
    color: "Orange & White",
    temperament: "Playful",
    goodWithKids: true,
    goodWithDogs: false,
    spayedNeutered: true,
    healthNotes: "Healthy and playful, no known allergies.",
    city: "Bangalore",
    postedBy: users[0].id,
    postedByUsername: "testuser",
    photo1: "https://placekitten.com/400/300",
    photo2: "https://placekitten.com/401/300",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Simba",
    age: 2,
    ageUnit: "years",
    breed: "Persian Mix",
    color: "Golden",
    temperament: "Calm",
    goodWithKids: true,
    goodWithDogs: true,
    spayedNeutered: false,
    healthNotes: "Mild dust allergy, otherwise perfectly fine.",
    city: "Mumbai",
    postedBy: users[0].id,
    postedByUsername: "testuser",
    photo1: "https://placekitten.com/402/300",
    photo2: "https://placekitten.com/403/300",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Luna",
    age: 5,
    ageUnit: "months",
    breed: "Domestic Longhair",
    color: "Grey & White",
    temperament: "Shy",
    goodWithKids: false,
    goodWithDogs: false,
    spayedNeutered: true,
    healthNotes: "No infections or allergies. Loves cuddles.",
    city: "Delhi",
    postedBy: users[0].id,
    postedByUsername: "testuser",
    photo1: "https://placekitten.com/404/300",
    photo2: "https://placekitten.com/405/300",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Biscuit",
    age: 1,
    ageUnit: "years",
    breed: "Tabby",
    color: "Brown Tabby",
    temperament: "Affectionate",
    goodWithKids: true,
    goodWithDogs: true,
    spayedNeutered: true,
    healthNotes: "Recovered from mild ear infection. All clear now.",
    city: "Chennai",
    postedBy: users[0].id,
    postedByUsername: "testuser",
    photo1: "https://placekitten.com/406/300",
    photo2: "https://placekitten.com/407/300",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Oreo",
    age: 3,
    ageUnit: "months",
    breed: "Domestic Shorthair",
    color: "Black & White",
    temperament: "Curious",
    goodWithKids: true,
    goodWithDogs: false,
    spayedNeutered: false,
    healthNotes: "Tiny and sweet, no health issues.",
    city: "Hyderabad",
    postedBy: users[0].id,
    postedByUsername: "testuser",
    photo1: "https://placekitten.com/408/300",
    photo2: "https://placekitten.com/409/300",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: uuidv4(),
    name: "Noodle",
    age: 4,
    ageUnit: "years",
    breed: "Siamese Mix",
    color: "Cream & Brown",
    temperament: "Calm",
    goodWithKids: true,
    goodWithDogs: true,
    spayedNeutered: true,
    healthNotes: "Senior cat, calm and gentle. No allergies.",
    city: "Pune",
    postedBy: users[0].id,
    postedByUsername: "testuser",
    photo1: "https://placekitten.com/410/300",
    photo2: "https://placekitten.com/411/300",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

export const comments: Comment[] = [
  {
    id: uuidv4(),
    catId: cats[0].id,
    userId: users[0].id,
    username: "testuser",
    text: "Mochi is absolutely adorable! Is she available for long-term fostering?",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    parentId: null,
  },
];

export function findUserByUsername(username: string): User | undefined {
  return users.find((u) => u.username === username);
}

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function createUser(username: string, password: string): User {
  const user: User = { id: uuidv4(), username, password };
  users.push(user);
  return user;
}

export function getCatById(id: string): Cat | undefined {
  return cats.find((c) => c.id === id);
}

export function createCat(data: Omit<Cat, "id" | "createdAt">): Cat {
  const cat: Cat = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  cats.push(cat);
  return cat;
}

export function deleteCat(id: string): boolean {
  const idx = cats.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  cats.splice(idx, 1);
  return true;
}

export function getCommentsByCat(catId: string): Comment[] {
  return comments.filter((c) => c.catId === catId && c.parentId === null);
}

export function getComment(id: string): Comment | undefined {
  return comments.find((c) => c.id === id);
}

export function createComment(data: Omit<Comment, "id" | "createdAt">): Comment {
  const comment: Comment = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  return comment;
}

export function getReplies(parentId: string): Comment[] {
  return comments.filter((c) => c.parentId === parentId);
}

export function getStats() {
  const uniqueCities = new Set(cats.map((c) => c.city)).size;
  return {
    totalCats: cats.length,
    citiesCovered: uniqueCities,
    happyFosters: Math.max(cats.length + 12, 18),
  };
}
