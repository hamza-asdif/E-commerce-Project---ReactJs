import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div>
      <p>{message}</p>
      <button onClick={onConfirm}>نعم</button>
      <button onClick={onCancel}>إلغاء</button>
    </div>
  );
};

const showConfirmPopup = (message, onConfirm, onCancel) => {
  toast(
    <ConfirmPopup
      message={message}
      onConfirm={() => {
        onConfirm();
        toast.dismiss(); // إغلاق الـ Toast بعد التأكيد
      }}
      onCancel={() => {
        onCancel();
        toast.dismiss(); // إغلاق الـ Toast بعد الإلغاء
      }}
    />,
    {
      position: "top-center",
      autoClose: false, // لا تغلق تلقائيًا
      closeButton: false, // إخفاء زر الإغلاق
      draggable: false, // منع السحب
      closeOnClick: false, // لا تغلق عند النقر خارجها
    },
  );
};

export default showConfirmPopup;
