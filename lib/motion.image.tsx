"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";
const CloseIcon = ({ closeModal }: { closeModal: () => void }) => (
  <X
    className="absolute top-[15%] right-[15%] text-white text-4xl cursor-pointer"
    onClick={(e) => {
      e.stopPropagation();
      closeModal();
    }}
  />
);

export default function Motions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex items-center rounded-full justify-center shadow-2xl shadow-blue-500"
    >
      <div
        className="relative flex items-center rounded-full justify-center shadow-2xl shadow-blue-500"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="absolute w-[220px] h-[220px] sm:w-[270px] sm:h-[270px] rounded-full border-4 border-dashed border-black dark:border-white animate-spin-slow"></div>

        <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] rounded-full overflow-hidden flex items-center justify-center group cursor-pointer">
          <Image
            className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
            src="/me.jpg"
            alt="Profile Image"
            width={250}
            height={250}
            priority={true}
          />
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <CloseIcon closeModal={closeModal} />
            <div
              className="max-w-[90vw] max-h-[90vh] flex items-center justify-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                className="w-full h-full sm:w-[70%] sm:h-[70%] max-w-full max-h-full rounded-full"
                src="/me.jpg"
                alt="Profile Image"
                width={1000}
                height={1000}
                priority={false}
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
