import axios from "axios";
import { useEffect, useState } from "react";

function HomeComTwo() {
  interface Product {
    id: string;
    category: string;
    title: string;
    image: string;
    description: string;
    createdAt: string;
    price: number;
  }

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(
          "http://localhost:8001/products"
        );
        const filteredProducts = response.data
          .filter((product) => product.category === "ساعت-سامسونگ")
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        setProducts(filteredProducts.slice(0, 2));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <section>
        <div className="h-fit">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="grid rounded bg-gray-100 p-6 h-fit">
              <div className="mx-auto max-w-md text-center lg:text-left ">
                <header>
                  {products.length > 0 && (
                    <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                      123
                    </h2>
                  )}
                  <p className="mt-4 text-gray-500">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Quas rerum quam amet provident nulla error!
                  </p>
                </header>
                <a
                  href="#"
                  className="mt-8 inline-block rounded border border-gray-900 bg-gray-900 px-12 py-3 text-sm font-medium text-white transition hover:shadow focus:outline-none focus:ring"
                >
                  Shop All
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 lg:py-8">
              <ul className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all"
                  >
                    <a href="#" className="group block">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="aspect-square w-full rounded object-cover"
                      />
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4">
                          {product.title}
                        </h3>
                        <p className="flex gap-2 mt-4 text-lg pb-3 text-gray-700 text-right">
                          <p>تومان</p>
                          <p>{product.price.toLocaleString("fa-IR")}</p>
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeComTwo;