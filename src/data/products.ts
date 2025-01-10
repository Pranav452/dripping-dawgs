export interface Product {
  id: string
  name: string
  description: string
  price: number
  brand: string
  category_id: string
  image_url: string
  size_available: string[]
  colors: string[]
  stock: number
  featured: boolean
  images: {
    color: string
    url: string
  }[]
}

export const products: Product[] = [
  {
    id: "heart-tshirt",
    name: "Heart T-Shirt",
    description: "Express your love with our iconic heart design. Made with 100% premium cotton for ultimate comfort.",
    price: 699,
    brand: "DrippingDawgs",
    category_id: "t-shirts",
    image_url: "/For website/heart/white.png",
    size_available: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Brown"],
    stock: 100,
    featured: true,
    images: [
      { color: "White", url: "/For website/heart/white.png" },
      { color: "Black", url: "/For website/heart/black.png" },
      { color: "Brown", url: "/For website/heart/brown.png" }
    ]
  },
  {
    id: "no-time-4-luv",
    name: "No Time 4 Luv T-Shirt",
    description: "Make a statement with our edgy 'No Time 4 Luv' design. Perfect blend of style and attitude.",
    price: 699,
    brand: "DrippingDawgs",
    category_id: "t-shirts",
    image_url: "/For website/No/black.png",
    size_available: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Brown", "Purple"],
    stock: 100,
    featured: true,
    images: [
      { color: "Black", url: "/For website/No/black.png" },
      { color: "Brown", url: "/For website/No/brown.png" },
      { color: "Purple", url: "/For website/No/purple.png" }
    ]
  },
  {
    id: "numb",
    name: "NUMB T-Shirt",
    description: "Feel the vibe with our NUMB design. Premium quality meets street style.",
    price: 699,
    brand: "DrippingDawgs",
    category_id: "t-shirts",
    image_url: "/For website/NUMB/black.png",
    size_available: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Brown", "Green"],
    stock: 100,
    featured: true,
    images: [
      { color: "Black", url: "/For website/NUMB/black.png" },
      { color: "Brown", url: "/For website/NUMB/brown.png" },
      { color: "Green", url: "/For website/NUMB/green.png" }
    ]
  },
  {
    id: "question-mark",
    name: "Question Mark T-Shirt",
    description: "Keep them guessing with our mysterious Question Mark design. A conversation starter.",
    price: 699,
    brand: "DrippingDawgs",
    category_id: "t-shirts",
    image_url: "/For website/question mark/black.png",
    size_available: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Brown"],
    stock: 100,
    featured: true,
    images: [
      { color: "Black", url: "/For website/question mark/black.png" },
      { color: "Brown", url: "/For website/question mark/brown.png" }
    ]
  },
  {
    id: "survival-mode",
    name: "Survival Mode T-Shirt",
    description: "Embrace the grind with our Survival Mode design. For those who never give up.",
    price: 799,
    brand: "DrippingDawgs",
    category_id: "t-shirts",
    image_url: "/For website/survival mode/black.png",
    size_available: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Brown", "Green"],
    stock: 100,
    featured: true,
    images: [
      { color: "Black", url: "/For website/survival mode/black.png" },
      { color: "Brown", url: "/For website/survival mode/brown.png" },
      { color: "Green", url: "/For website/survival mode/green.png" }
    ]
  }
] 