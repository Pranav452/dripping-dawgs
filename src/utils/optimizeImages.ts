import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const DESIGNS_FOLDER = path.join(process.cwd(), 'public', 'designs')
const OUTPUT_FOLDER = path.join(process.cwd(), 'public', 'optimized')

async function optimizeImages() {
  // Create output folder if it doesn't exist
  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true })
  }

  const files = fs.readdirSync(DESIGNS_FOLDER)

  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const inputPath = path.join(DESIGNS_FOLDER, file)
      const outputPath = path.join(OUTPUT_FOLDER, file)

      await sharp(inputPath)
        .resize(1200, 1500, {
          fit: 'cover',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toFile(outputPath)

      console.log(`Optimized: ${file}`)
    }
  }
}

optimizeImages()
