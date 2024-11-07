import { supabaseAdmin } from './supabaseAdmin'
import fs from 'fs'
import path from 'path'

const DESIGNS_FOLDER = path.join(process.cwd(), 'Designs-20241028T152917Z-001', 'Designs')

interface ProductData {
  name: string
  description: string
  price: number
  brand: string
  category: string
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  imagePath: string
}

// Define your actual products
const products: ProductData[] = [
  {
    name: "Classic Black Hoodie",
    description: "Premium quality cotton blend hoodie with minimalist design",
    price: 49.99,
    brand: "Dripping Dog",
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray"],
    stock: 50,
    featured: true,
    imagePath: "hoodie-black.jpg"  // Make sure this matches your actual file name
  },
  // Add more products based on your actual designs
]

async function uploadImage(filePath: string): Promise<string> {
  const fileName = path.basename(filePath)
  const fileBuffer = fs.readFileSync(filePath)
  
  const { error, data: uploadData } = await supabaseAdmin.storage
    .from('products')
    .upload(fileName, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (error) throw error
  
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('products')
    .getPublicUrl(fileName)

  return publicUrl
}

async function getOrCreateCategory(categoryName: string) {
  // First try to get existing category
  const { data: existingCategory } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .single()

  if (existingCategory) {
    console.log(`Category ${categoryName} already exists`)
    return existingCategory.id
  }

  // If category doesn't exist, create it
  const { data: newCategory, error } = await supabaseAdmin
    .from('categories')
    .insert({
      name: categoryName,
      slug: categoryName.toLowerCase().replace(/\s+/g, '-')
    })
    .select('id')
    .single()

  if (error) {
    console.error(`Error creating category ${categoryName}:`, error)
    throw error
  }

  console.log(`Created new category: ${categoryName}`)
  return newCategory.id
}

async function uploadProducts() {
  try {
    // Process each product
    for (const product of products) {
      console.log(`Processing ${product.name}...`)

      // Get or create category
      const categoryId = await getOrCreateCategory(product.category)

      // Upload image
      const imagePath = path.join(DESIGNS_FOLDER, product.imagePath)
      console.log('Image path:', imagePath)
      
      let imageUrl
      try {
        imageUrl = await uploadImage(imagePath)
        console.log('Image uploaded:', imageUrl)
      } catch (error) {
        console.error(`Failed to upload image for ${product.name}:`, error)
        continue
      }

      // Check if product already exists
      const { data: existingProduct } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('name', product.name)
        .single()

      if (existingProduct) {
        // Update existing product
        const { error: updateError } = await supabaseAdmin
          .from('products')
          .update({
            description: product.description,
            price: product.price,
            brand: product.brand,
            image_url: imageUrl,
            size_available: product.sizes,
            colors: product.colors,
            stock: product.stock,
            featured: product.featured
          })
          .eq('id', existingProduct.id)

        if (updateError) {
          console.error(`Failed to update product ${product.name}:`, updateError)
          continue
        }
        console.log(`Updated product: ${product.name}`)
      } else {
        // Insert new product
        const { error: insertError } = await supabaseAdmin
          .from('products')
          .insert({
            name: product.name,
            description: product.description,
            price: product.price,
            brand: product.brand,
            category_id: categoryId,
            image_url: imageUrl,
            size_available: product.sizes,
            colors: product.colors,
            stock: product.stock,
            featured: product.featured
          })

        if (insertError) {
          console.error(`Failed to insert product ${product.name}:`, insertError)
          continue
        }
        console.log(`Created new product: ${product.name}`)
      }
    }

    console.log('All products processed successfully')
  } catch (error) {
    console.error('Error in upload process:', error)
  }
}

// Run the upload
uploadProducts()
