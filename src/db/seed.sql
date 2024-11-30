-- Clean up existing data
DELETE FROM orders;
DELETE FROM wishlist;
DELETE FROM products;
DELETE FROM categories;

-- Insert categories
INSERT INTO categories (id, name)
VALUES ('t-shirts', 'T-Shirts');

-- Insert products
INSERT INTO products (
  id,
  name,
  description,
  price,
  brand,
  category_id,
  image_url,
  size_available,
  colors,
  stock,
  featured,
  images
) VALUES 
(
  'heart-tshirt',
  'Heart T-Shirt',
  'Express your love with our iconic heart design. Made with 100% premium cotton for ultimate comfort.',
  799,
  'DrippingDawgs',
  't-shirts',
  '/For website/heart/white.png',
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['White', 'Black', 'Brown'],
  100,
  true,
  jsonb_build_array(
    jsonb_build_object('color', 'White', 'url', '/For website/heart/white.png'),
    jsonb_build_object('color', 'Black', 'url', '/For website/heart/black.png'),
    jsonb_build_object('color', 'Brown', 'url', '/For website/heart/brown.png')
  )
),
(
  'no-time-4-luv',
  'No Time 4 Luv T-Shirt',
  'Make a statement with our edgy ''No Time 4 Luv'' design. Perfect blend of style and attitude.',
  799,
  'DrippingDawgs',
  't-shirts',
  '/For website/No/black.png',
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Black', 'Brown', 'Purple'],
  100,
  true,
  jsonb_build_array(
    jsonb_build_object('color', 'Black', 'url', '/For website/No/black.png'),
    jsonb_build_object('color', 'Brown', 'url', '/For website/No/brown.png'),
    jsonb_build_object('color', 'Purple', 'url', '/For website/No/purple.png')
  )
),
(
  'numb',
  'NUMB T-Shirt',
  'Feel the vibe with our NUMB design. Premium quality meets street style.',
  799,
  'DrippingDawgs',
  't-shirts',
  '/For website/NUMB/black.png',
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Black', 'Brown', 'Green'],
  100,
  true,
  jsonb_build_array(
    jsonb_build_object('color', 'Black', 'url', '/For website/NUMB/black.png'),
    jsonb_build_object('color', 'Brown', 'url', '/For website/NUMB/brown.png'),
    jsonb_build_object('color', 'Green', 'url', '/For website/NUMB/green.png')
  )
),
(
  'question-mark',
  'Question Mark T-Shirt',
  'Keep them guessing with our mysterious Question Mark design. A conversation starter.',
  799,
  'DrippingDawgs',
  't-shirts',
  '/For website/question mark/black.png',
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Black', 'Brown'],
  100,
  true,
  jsonb_build_array(
    jsonb_build_object('color', 'Black', 'url', '/For website/question mark/black.png'),
    jsonb_build_object('color', 'Brown', 'url', '/For website/question mark/brown.png')
  )
),
(
  'survival-mode',
  'Survival Mode T-Shirt',
  'Embrace the grind with our Survival Mode design. For those who never give up.',
  799,
  'DrippingDawgs',
  't-shirts',
  '/For website/survival mode/black.png',
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Black', 'Brown', 'Green'],
  100,
  true,
  jsonb_build_array(
    jsonb_build_object('color', 'Black', 'url', '/For website/survival mode/black.png'),
    jsonb_build_object('color', 'Brown', 'url', '/For website/survival mode/brown.png'),
    jsonb_build_object('color', 'Green', 'url', '/For website/survival mode/green.png')
  )
); 