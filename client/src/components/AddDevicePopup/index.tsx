import React, { useState } from 'react';
import Modal from '../Modal';
import { Device } from '../../layouts/Admin/DeviceType';

interface AddDevicePopupProps {
  onSave: (device: Device) => void;
  onClose: () => void;
}

const AddDevicePopup: React.FC<AddDevicePopupProps> = ({ onSave, onClose }) => {
  const [device, setDevice] = useState<Device>({
    id: '',
    brand: '',
    name: '',
    volume: '',
    quantity: 0,
    category: '',
    idmanager: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setDevice({ ...device, [name]: Number(value) });
    } else {
      setDevice({ ...device, [name]: value });
    }
  };

  const handleSave = () => {
    if (validateDevice(device)) {
      onSave(device);
      onClose();
    } else {
      alert('Vui lòng kiểm tra lại thông tin nhập vào.');
    }
  };

  const validateDevice = (device: Device): boolean => {
    return (
      !!device.id &&
      !!device.brand &&
      !!device.name &&
      !!device.volume &&
      Number(device.quantity) >= 0 &&
      !!device.category &&
      !!device.idmanager
    );
  };

  return (
    <Modal onClose={onClose}>
      <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-primary-500">Thêm Thiết Bị Mới</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="id" className="block text-sm font-medium">
              Mã Thiết Bị
            </label>
            <input
              id="id"
              type="text"
              name="id"
              value={device.id}
              onChange={handleChange}
              className="my-1 block w-full border border-gray-600 pl-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Nhập mã thiết bị"
            />
          </div>
          <div>
            <label htmlFor="brand" className="block text-sm font-medium">
              Hãng
            </label>
            <input
              id="brand"
              type="text"
              name="brand"
              value={device.brand}
              onChange={handleChange}
              className="my-1 block w-full border border-gray-600 pl-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Nhập tên hãng"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Tên Thiết Bị
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={device.name}
              onChange={handleChange}
              className="my-1 block w-full border border-gray-600 pl-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Nhập tên thiết bị"
            />
          </div>
          <div>
            <label htmlFor="volume" className="block text-sm font-medium">
              Thể tích
            </label>
            <input
              id="volume"
              type="text"
              name="volume"
              value={device.volume}
              onChange={handleChange}
              className="my-1 block w-full border border-gray-600 pl-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Nhập thể tích"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium">
              Số lượng
            </label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              value={device.quantity}
              onChange={handleChange}
              className="my-1 block w-full border border-gray-600 pl-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Nhập số lượng"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium">
              Loại
            </label>
            <input
              id="category"
              type="text"
              name="category"
              value={device.category}
              onChange={handleChange}
              className="my-1 block w-full border border-gray-600 pl-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="idmanager" className="block text-sm font-medium">
              Mã người quản lý
            </label>
            <input
              id="idmanager"
              type="text"
              name="idmanager"
              value={device.idmanager}
              onChange={handleChange}
              className="my-1 block w-full border border-gray-600 pl-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="w-32 transform rounded-md bg-gray-700 px-4 py-2 text-white shadow-sm transition-transform hover:scale-105 hover:bg-gray-600"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="w-32 transform rounded-md bg-primary-500 px-4 py-2 text-white shadow-sm transition-transform hover:scale-105 hover:bg-primary-400"
          >
            Lưu
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddDevicePopup;
