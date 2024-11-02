import React, { useState, useEffect } from "react";
import Container from "../Container/Container";
import axios from "axios";
import Addok from "../Alert/Addok";
import AddProNot from "../Alert/AddProNot";
import AddInput from "../AddInput/AddInput";
import TextTitle from "../Text/TextTitle";

interface IProduct {
  id: string;
  title: string;
  price: number;
  inventory: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface Category {
  category: string;
}

function AddPro() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [inventory, setInventory] = useState("");
  const [image, setImage] = useState("");
  const [ratingRate, setRatingRate] = useState("");
  const [ratingCount, setRatingCount] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8001/products");
        const data: IProduct[] = await response.json();

        const uniqueCategories = Array.from(
          new Set(data.map((cat) => cat.category))
        ).map((category) => ({ category }));

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const checkDuplicateProduct = async (newProduct: any) => {
    try {
      const response = await axios.get("http://localhost:8001/products");
      const products: IProduct[] = response.data;

      return products.some(
        (product) =>
          product.title === newProduct.title &&
          product.price === newProduct.price &&
          product.description === newProduct.description &&
          product.inventory === newProduct.inventory &&
          product.category === newProduct.category &&
          product.image === newProduct.image &&
          product.rating.rate === newProduct.rating.rate &&
          product.rating.count === newProduct.rating.count
      );
    } catch (error) {
      console.error("Error checking for duplicate products:", error);
      return false;
    }
  };

  const normalizeSpaces = (str: string) => {
    return str.replace(/\s+/g, " ").trim();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("لطفاً همه فیلدها را پر کنید.");
      return;
    }

    const newProduct = {
      title: normalizeSpaces(title),
      price: parseFloat(price),
      description: normalizeSpaces(description),
      inventory: parseInt(inventory),
      category: normalizeSpaces(category),
      image: normalizeSpaces(image),
      rating: {
        rate: parseFloat(ratingRate),
        count: parseInt(ratingCount),
      },
      createdAt: new Date().toISOString(), // اضافه کردن تاریخ و زمان ایجاد
    };

    const isDuplicate = await checkDuplicateProduct(newProduct);
    if (isDuplicate) {
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 4000);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8001/products",
        newProduct
      );
      setShowAlert(true);
      setProductId(response.data.id);

      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("خطا در ثبت محصول.");
    }
  };

  const isFormValid = () => {
    return (
      title &&
      price &&
      description &&
      inventory &&
      category &&
      image &&
      ratingRate &&
      ratingCount
    );
  };

  return (
    <Container>
      {showAlert && (
        <div
          role="alert"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <Addok idset={productId} />
        </div>
      )}
      {showErrorAlert && (
        <div
          role="alert"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <AddProNot idset={productId} />
        </div>
      )}
      <div className="pb-7">
        <TextTitle value="ثبت کالای جدید" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rtl">
        <div className="pl-36 pr-36">
          <AddInput
            id="productTitle"
            type="text"
            labelText="عنوان محصول"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex justify-center  items-center gap-24">
          <AddInput
            id="productPrice"
            type="number"
            labelText="قیمت محصول"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <AddInput
            id="productInventory"
            type="number"
            labelText="موجودی محصول"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
          />
        </div>
        <div className="flex justify-center items-center gap-24">
          <div className="flex flex-col mb-4 rounded-md border border-gray-200 p-2 text-right ">
            <label
              htmlFor="HeadlineAct"
              className=" mb-1  text-sm font-medium text-gray-900 "
            >
              : دسته بندی
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              name="HeadlineAct"
              id="HeadlineAct"
              className="text-right mt-1.5  h-10 rounded-lg border-gray-300 text-gray-700 sm:text-sm w-96"
            >
              <option value="">انتخاب کنید</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>
          <AddInput
            id="productRate"
            type="number"
            labelText="نمره محصول"
            value={ratingRate}
            onChange={(e) => setRatingRate(e.target.value)}
          />{" "}
          <AddInput
            id="productCount"
            type="number"
            labelText="تعداد نظرات"
            value={ratingCount}
            onChange={(e) => setRatingCount(e.target.value)}
          />
        </div>
        <div className="pl-36 pr-36">
          <label
            htmlFor="OrderNotes"
            className="block text-sm font-medium text-gray-700 text-right p-2"
          >
            توضیحات محصول
          </label>

          <textarea
            id="OrderNotes"
            className="mt-2 w-full rounded-xl border-gray-300 align-top shadow-md sm:text-sm text-right p-4"
            placeholder="توضیحات محصول"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>{" "}
        <div className="pl-36 pr-36">
          {" "}
          <AddInput
            id="productUrl"
            type="url"
            labelText="آدرس تصویر محصول"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />{" "}
        </div>
        <div className="pl-36 pr-36">
          <button
            type="submit"
            className={`w-full p-2 rounded ${
              isFormValid() ? "bg-gray-700" : "bg-gray-400"
            } text-white`}
            disabled={!isFormValid()}
          >
            ثبت محصول
          </button>
        </div>
      </form>
    </Container>
  );
}

export default AddPro;