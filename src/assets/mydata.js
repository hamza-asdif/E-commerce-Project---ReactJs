// ** products varaibles & functions here **
 export let MyProducts = [
    {
      id: 1,
      name: "ساعة اليد الفاخرة ONOLA Watch الأكثر مبيعا في المملكة - إصدار محدود",
      Image: "images/products/watch.jpeg",
      price: 349,
      quantity : 1
    },
  
    {
      id: 2,
      name: "جهاز تبريد مقعد السيارة الذكي Magnetic Fan Car الأكثر مبيعا في العالم",
      Image: "images/new-products/car-product.jpeg",
      price: 349,
      quantity : 1
    },
  
    {
      id: 3,
      name: "الشاحن العجيب Three Port Charger الأكثر مبيعا في العالم",
      Image: "images/new-products/charger.jpeg",
      price: 349,
      quantity : 1
    },
  
    {
      id: 4,
      name: "غسالة الأكواب الأتوماتيكية Rinser الأكثر مبيعا في شهر رمضان",
      Image: "images/products/rinser-cuisine.jpeg",
      price: 349,
      quantity : 1
    },
    {
      id: 5,
      name: "الأكثر طلبًا عند النساء حقيبة الماكياج الفاخرة Vergi",
      Image: "images/products/vergi%20sac.jpeg",
      price: 180,
      quantity : 1
    },
    {
      id: 6,
      name: "مصحح قوام الجسم Shapewear الأصلي و الأكثر مبيعا في العالم",
      Image: "images/products/shapeware.jpeg",
      price: 199,
      quantity : 1
    },
    {
      id: 7,
      name: "المصباح الكرستالي الأنيق Carluxy الجديد لسنة 2023",
      Image: "images/products/crystal.webp",
      price: 309,
      quantity : 1
    },
    {
      id: 8,
      name: "منعم بشرة الأقدام الأصلي Marlo-X الأكثر مبيعا في العالم",
      Image: "images/products/marlox.webp",
      price: 199,
      quantity : 1
    },
  ];


var Products = localStorage.setItem("Products", JSON.stringify(MyProducts))




let My_Second_Products = [
  {
    id: 1,
    name: "ساعة اليد الفاخرة ONOLA Watch الأكثر مبيعا في المملكة - إصدار محدود",
    Image: "images/products/watch.jpeg",
    price: 349,
    quantity : 1
  },
  {
    id: 2,
    name: "غسالة الأكواب الأتوماتيكية Rinser الأكثر مبيعا في شهر رمضان",
    Image: "images/products/rinser-cuisine.jpeg",
    price: 349,
    quantity : 1
  },
  {
    id: 3,
    name: "جهاز تبريد مقعد السيارة الذكي Magnetic Fan Car الأكثر مبيعا في العالم",
    Image: "images/new-products/car-product.jpeg",
    price: 349,
    quantity : 1
  }
]

var secondProducts = localStorage.setItem("Second_Products", JSON.stringify(My_Second_Products))