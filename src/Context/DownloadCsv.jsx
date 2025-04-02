export const downloadCSV = (products) => {
  if (products.length === 0) return;

  const csvRows = [];
  const headers = Object.keys(products[0]);
  csvRows.push(headers.join(","));

  products.forEach((product) => {
    const row = headers.map((header) => product[header]);
    csvRows.push(row.join(","));
  });

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "products_backup.csv");
  a.click();
};
