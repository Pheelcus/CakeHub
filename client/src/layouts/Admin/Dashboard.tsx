import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Product {
  name: string;
  quantity: number;
  revenue: string;
  date: Date;
}

interface Ingredient {
  name: string;
  quantity: string;
  price: string;
  total: string;
  date: Date;
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewByYear, setViewByYear] = useState<boolean>(false);
  const [cakeItems, setCakeItems] = useState<Product[]>([]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleYearToggle = () => {
    setViewByYear(!viewByYear);
  };

  const products: Product[] = [
    { name: 'Bánh kem rừng nhiệt đới', quantity: 30, revenue: '8,500,000 VND', date: new Date('2022-02-10') },
    { name: 'Bánh kem thiên thần', quantity: 28, revenue: '7,850,000 VND', date: new Date('2023-02-11') },
    { name: 'Bánh kem socola đắng', quantity: 25, revenue: '7,500,000 VND', date: new Date('2023-02-12') },
    { name: 'Bánh kem dâu tây', quantity: 22, revenue: '6,500,000 VND', date: new Date('2024-02-13') },
    { name: 'Bánh kem bắp', quantity: 20, revenue: '6,000,000 VND', date: new Date('2024-02-14') },
    { name: 'Bánh halloween', quantity: 22, revenue: '7,000,000 VND', date: new Date('2024-02-14') }
  ];

  const ingredients: Ingredient[] = [
    {
      name: 'Trứng gà',
      quantity: '1500 quả',
      price: '5,250 VND',
      total: '8,000,000 VND',
      date: new Date('2022-02-10'),
    },
    {
      name: 'Bột mì số 8',
      quantity: '1000 gram',
      price: '1,000,000 VND',
      total: '1,000,000 VND',
      date: new Date('2023-02-11'),
    },
    {
      name: 'Sữa tươi',
      quantity: '2000 ml',
      price: '1,200,000 VND',
      total: '1,200,000 VND',
      date: new Date('2023-02-12'),
    },
    {
      name: 'Đường cát trắng',
      quantity: '1000 gram',
      price: '750,000 VND',
      total: '750,000 VND',
      date: new Date('2024-02-13'),
    },
    { name: 'Bơ', quantity: '500 gram', price: '1,250,000 VND', total: '1,250,000 VND', date: new Date('2024-02-14') },
    {
      name: 'Kem whipping',
      quantity: '2000 ml',
      price: '2,000,000 VND',
      total: '2,000,000 VND',
      date: new Date('2024-02-15'),
    },
  ];

  // Ensure selectedDate is not null
  const selectedYear = selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();
  const selectedMonth = selectedDate ? selectedDate.getMonth() : new Date().getMonth();

  const filteredProducts = products.filter((product) => {
    const productYear = product.date.getFullYear();
    const productMonth = product.date.getMonth();
    return productYear === selectedYear && (viewByYear || productMonth === selectedMonth);
  });

  const filteredIngredients = ingredients.filter((ingredient) => {
    const ingredientYear = ingredient.date.getFullYear();
    const ingredientMonth = ingredient.date.getMonth();
    return ingredientYear === selectedYear && (viewByYear || ingredientMonth === selectedMonth);
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const totalRevenue = filteredProducts.reduce(
    (total, product) => total + parseInt(product.revenue.replace(/[^0-9]/g, '')),
    0,
  );
  const totalCost = filteredIngredients.reduce(
    (total, ingredient) => total + parseInt(ingredient.price.replace(/[^0-9]/g, '')),
    0,
  );
  const totalProfit = totalRevenue - totalCost;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 text-center shadow">
          <h2 className="mb-2 text-xl font-bold">Tổng doanh thu</h2>
          <p className="text-3xl font-semibold text-green-500">{totalRevenue.toLocaleString()} VND</p>
          <div className="h-24">{/* Insert chart here */}</div>
        </div>
        <div className="rounded-lg bg-white p-4 text-center shadow">
          <h2 className="mb-2 text-xl font-bold">Tổng chi tiêu</h2>
          <p className="text-3xl font-semibold text-red-500">{totalCost.toLocaleString()} VND</p>
          <div className="h-24">{/* Insert chart here */}</div>
        </div>
        <div className="rounded-lg bg-white p-4 text-center shadow">
          <h2 className="mb-2 text-xl font-bold">Tổng lợi nhuận</h2>
          <p className="text-3xl font-semibold text-yellow-500">{totalProfit.toLocaleString()} VND</p>
          <div className="h-24">{/* Insert chart here */}</div>
        </div>
      </div>
      {/* <div className="mb-8 flex items-center justify-between">
        <button onClick={handleYearToggle} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          {viewByYear ? 'View by Month' : 'View by Year'}
        </button>
        <div className="w-1/3">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat={viewByYear ? 'yyyy' : 'MMMM yyyy'}
            showMonthYearPicker={!viewByYear}
            showYearPicker={viewByYear}
            className="border-1 w-full rounded border border-primary-500 p-2"
          />
        </div>
      </div> */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={handleYearToggle}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md transition-transform duration-200 hover:bg-blue-600 hover:shadow-lg"
        >
          {viewByYear ? 'View by Month' : 'View by Year'}
        </button>
        <div className="flex w-1/3 items-center">
          <span className="mr-2 text-gray-500 hover:text-blue-600">📅</span>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat={viewByYear ? 'yyyy' : 'MMMM yyyy'}
            showMonthYearPicker={!viewByYear}
            showYearPicker={viewByYear}
            className="w-full rounded-lg border border-blue-300 p-3 shadow-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-bold">Danh sách sản phẩm đã bán</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border px-4 py-2">STT</th>
                <th className="border px-4 py-2">Mẫu bánh</th>
                <th className="border px-4 py-2">Số lượng</th>
                <th className="border px-4 py-2">Thành tiền</th>
                <th className="border px-4 py-2">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">{product.revenue}</td>
                  <td className="border px-4 py-2">{formatDate(product.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-4 text-xl font-bold">Danh sách nguyên liệu đã chi tiêu</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border px-4 py-2">STT</th>
                <th className="border px-4 py-2">Nguyên liệu</th>
                <th className="border px-4 py-2">Số lượng</th>
                <th className="border px-4 py-2">Đơn giá</th>
                <th className="border px-4 py-2">Thành tiền</th>
                <th className="border px-4 py-2">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.map((ingredient, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{ingredient.name}</td>
                  <td className="border px-4 py-2">{ingredient.quantity}</td>
                  <td className="border px-4 py-2">{ingredient.price}</td>
                  <td className="border px-4 py-2">{ingredient.total}</td>
                  <td className="border px-4 py-2">{formatDate(ingredient.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
