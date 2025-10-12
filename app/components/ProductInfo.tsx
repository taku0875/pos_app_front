"use client";

interface ProductInfoProps {
  code: string;
  name: string;
  price: number | null;
}

export default function ProductInfo({ code, name, price }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-2 w-64">
      <input
        type="text"
        placeholder="コード"
        value={code}
        readOnly
        className="border p-2 rounded-md bg-white"
      />
      <input
        type="text"
        placeholder="名称"
        value={name}
        readOnly
        className="border p-2 rounded-md bg-white"
      />
      <input
        type="text"
        placeholder="単価"
        value={price ? `${price}円` : ""}
        readOnly
        className="border p-2 rounded-md bg-white"
      />
    </div>
  );
}

