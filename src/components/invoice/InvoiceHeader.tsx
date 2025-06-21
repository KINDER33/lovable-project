
import React from 'react';

interface InvoiceHeaderProps {
  invoiceNumber: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoiceNumber }) => {
  return (
    <>
      {/* En-tête avec logo médical */}
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 mr-3">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Logo médical - Caducée */}
            <circle cx="50" cy="50" r="48" fill="#059669" stroke="#047857" strokeWidth="2"/>
            {/* Croix médicale */}
            <rect x="45" y="25" width="10" height="50" fill="white"/>
            <rect x="25" y="45" width="50" height="10" fill="white"/>
            {/* Serpents stylisés */}
            <path d="M35 30 Q45 35 35 40 Q25 45 35 50 Q45 55 35 60" 
                  stroke="white" strokeWidth="2" fill="none"/>
            <path d="M65 30 Q55 35 65 40 Q75 45 65 50 Q55 55 65 60" 
                  stroke="white" strokeWidth="2" fill="none"/>
            {/* Étoile et croissant */}
            <circle cx="20" cy="20" r="8" fill="#fbbf24"/>
            <path d="M15 15 L20 12 L25 15 L22 20 L18 20 Z" fill="white"/>
            <path d="M75 15 Q80 10 85 15 Q80 20 75 15" fill="#fbbf24"/>
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold">CENTRE DE SANTÉ SOLIDARITÉ ISLAMIQUE</h1>
          <p className="text-xs">Adresse: MONGO-TCHAD Tél: +235 66 49 22 54</p>
        </div>
      </div>

      <div className="text-center mb-3">
        <h2 className="text-sm font-bold">REÇU DE CONSULTATION N°</h2>
        <div className="border-b-2 border-dotted border-black inline-block w-32 text-center font-bold">
          {invoiceNumber}
        </div>
      </div>
    </>
  );
};

export default InvoiceHeader;
