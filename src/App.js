import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { useQueryClient } from 'react-query';
import "./App.css";
const queryClient = new QueryClient();

const App = () => {
  console.log(fetchProducts());
  return (
    <QueryClientProvider client={queryClient}>
      <AddProductForm />
      <ProductList />
      
    </QueryClientProvider>
  );
};

const ProductList = () => {
  const { data: products, isLoading } = useQuery('products', fetchProducts);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='productdiv'>
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const fetchProducts = async () => {
  const response = await fetch('https://dummyjson.com/products');
  const data = await response.json();
  console.log(data.products,"products")
  return data.products;
  
};

const AddProductForm = () => {
  const queryClient = useQueryClient();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, description, price } = event.target.elements;
    await  fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: name.value,
        description: description.value,
        price: price.value,
      }),
    })
    .then(res => res.json())
.then(console.log);

    queryClient.invalidateQueries('products');

    
    event.target.reset();
    fetchProducts();
  };

  return (
    <div className='addnewdiv'>
      <h2>Add New Product</h2>
      <form className='form' onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" name="description" />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input type="text" id="price" name="price" />
        </div>
        <button type="submit">Submit</button>
      </form>

      <br/>
      <marquee>By Rahul Chandnani</marquee>
    </div>
  );
};

export default App;
