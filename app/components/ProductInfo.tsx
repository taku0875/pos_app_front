"use client";

interface ProductInfoProps {
  code: string;
  name: string;
  price: number | null;
}

export default function ProductInfo({ code, name, price }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <input
        type="text"
        placeholder="コード"
        value={code}
        readOnly
        // 👇 背景色を薄いグレーに変更
        className="border p-2 rounded-md bg-gray-100"
      />
      <input
        type="text"
        placeholder="名称"
        value={name}
        readOnly
        // 👇 背景色を薄いグレーに変更
        className="border p-2 rounded-md bg-gray-100"
      />
      <input
        type="text"
        placeholder="単価"
        value={price ? `${price}円` : ""}
        readOnly
        // 👇 背景色を薄いグレーに変更
        className="border p-2 rounded-md bg-gray-100"
      />
    </div>
  );
}