import React, { useState } from "react";

const Test2 = () => {
  // Initial table data
  const [data, setData] = useState([
    {
      id: 1,
      name: "น้ำพริกปลาร้า 60 กรัม",
      unit: "กป",
      transactions: [
        { date: "5/11/68", receive: 0, used: { crate: 0, pack: 0 }, remain: { crate: 0, pack: 0 } },
        { date: "6/11/68", receive: 0, used: { crate: 0, pack: 0 }, remain: { crate: 0, pack: 0 } },
        { date: "7/11/68", receive: 0, used: { crate: 0, pack: 0 }, remain: { crate: 0, pack: 0 } },
      ],
    },
    // Add more products as needed
  ]);

  const handleInputChange = (id, date, field, subField, value) => {
    const updatedData = data.map((item) => {
      if (item.id === id) {
        const updatedTransactions = item.transactions.map((transaction) => {
          if (transaction.date === date) {
            return {
              ...transaction,
              [field]: subField
                ? { ...transaction[field], [subField]: value }
                : value,
            };
          }
          return transaction;
        });
        return { ...item, transactions: updatedTransactions };
      }
      return item;
    });
    setData(updatedData);
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Inventory Table</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">รายการ</th>
            <th className="border p-2">หน่วย</th>
            {data[0].transactions.map((txn, index) => (
              <th key={index} className="border p-2">
                {txn.date}
                <br />
                รับเข้า/ใช้ไป/คงเหลือ
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.unit}</td>
              {item.transactions.map((txn) => (
                <td key={txn.date} className="border p-2">
                  <div>
                    <label className="block text-sm">รับเข้า:</label>
                    <input
                      type="number"
                      value={txn.receive}
                      onChange={(e) =>
                        handleInputChange(item.id, txn.date, "receive", null, e.target.value)
                      }
                      className="w-full border p-1 mb-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">ใช้ไป (กล่อง):</label>
                    <input
                      type="number"
                      value={txn.used.crate}
                      onChange={(e) =>
                        handleInputChange(item.id, txn.date, "used", "crate", e.target.value)
                      }
                      className="w-full border p-1 mb-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">ใช้ไป (แพ็ค):</label>
                    <input
                      type="number"
                      value={txn.used.pack}
                      onChange={(e) =>
                        handleInputChange(item.id, txn.date, "used", "pack", e.target.value)
                      }
                      className="w-full border p-1 mb-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">คงเหลือ (กล่อง):</label>
                    <input
                      type="number"
                      value={txn.remain.crate}
                      onChange={(e) =>
                        handleInputChange(item.id, txn.date, "remain", "crate", e.target.value)
                      }
                      className="w-full border p-1 mb-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">คงเหลือ (แพ็ค):</label>
                    <input
                      type="number"
                      value={txn.remain.pack}
                      onChange={(e) =>
                        handleInputChange(item.id, txn.date, "remain", "pack", e.target.value)
                      }
                      className="w-full border p-1"
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => console.log(data)}
        className="bg-blue-500 text-white px-4 py-2 mt-5 rounded hover:bg-blue-600"
      >
        Save Data
      </button>
    </div>
  );
};

export default Test2;
