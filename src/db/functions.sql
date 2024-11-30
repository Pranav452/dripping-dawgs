-- Function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock(p_id TEXT, quantity INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products
  SET stock = stock - quantity
  WHERE id = p_id AND stock >= quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found or insufficient stock';
  END IF;
END;
$$; 