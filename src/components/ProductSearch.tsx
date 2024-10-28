'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface ProductSearchProps {
  categories: { id: string; name: string }[]
  onSearch: (search: string, category: string, sort: string) => void
}

export function ProductSearch({ categories, onSearch }: ProductSearchProps) {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')

  useEffect(() => {
    onSearch(search, category, sort)
  }, [search, category, sort, onSearch])

  return (
    <div className="mb-8 space-y-4 rounded-lg border bg-white p-4 md:flex md:items-center md:space-x-4 md:space-y-0">
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border px-4 py-2 focus:border-black focus:outline-none"
        />
      </div>

      {/* Category Filter */}
      <div className="w-full md:w-48">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border px-4 py-2 focus:border-black focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Options */}
      <div className="w-full md:w-48">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full rounded-md border px-4 py-2 focus:border-black focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </div>
    </div>
  )
}
