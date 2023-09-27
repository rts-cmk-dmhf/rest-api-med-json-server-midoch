// Define the URL of your JSON server (replace 'http://localhost:3000/products' with the actual URL)
const JSON_SERVER_URL = "http://localhost:3000/products";

// Reference to the product list element and add product form
const productList = document.getElementById("productList");
const addProductForm = document.getElementById("addProductForm");

// Function to fetch products from JSON server
const fetchProducts = async () => {
  try {
    const response = await fetch(JSON_SERVER_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Function to render products in the list
const renderProducts = (products) => {
  productList.innerHTML = products.map(renderProduct).join("");
};

// Function to render a single product item
const renderProduct = (product) => `
<li data-id=${product.id}>
<strong>${product.name}</strong>
<br>
<p><strong>Price:</strong> ${product.price}</p>
<p><strong>Weight:</strong> ${product.weight}</p>
<p><strong>Description:</strong> ${product.description}</p>
<button class="delete-button" data-id="${product.id}">Delete</button>
</li>`;

// Event listener for delete buttons within the product list
productList.addEventListener("click", async (event) => {
  const target = event.target;
  if (target.classList.contains("delete-button")) {
    const productId = target.getAttribute("data-id");
    try {
      const response = await fetch(`${JSON_SERVER_URL}/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }
});

// Event listener for adding a new product
addProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Collect data from the form fields
  const productName = event.target.productName.value;
  const productPrice = parseFloat(event.target.productPrice.value);
  const productWeight = parseFloat(event.target.productWeight.value);
  const productDescription = event.target.productDescription.value;

  // Create a new product object
  const newProduct = {
    name: productName,
    price: productPrice,
    weight: productWeight,
    description: productDescription,
  };

  try {
    const response = await fetch(JSON_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      // Clear the form
      event.target.reset();
      fetchProducts(); // Fetch and display products with the new one added
    } else {
      console.error("Failed to add the product");
    }
  } catch (error) {
    console.error("Error adding the product:", error);
  }
});

// Fetch and display products when the page loads
fetchProducts();
