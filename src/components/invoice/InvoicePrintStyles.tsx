
import React from 'react';

const InvoicePrintStyles: React.FC = () => {
  return (
    <style>{`
      @media print {
        /* Masquer tous les éléments par défaut */
        * {
          visibility: hidden !important;
        }
        
        /* Masquer spécifiquement les éléments de navigation et interface */
        body > *:not(.invoice-print-container) {
          display: none !important;
        }
        
        nav, 
        header, 
        footer, 
        aside, 
        .sidebar,
        .navigation,
        .nav,
        .menu,
        .header,
        .footer,
        .dashboard,
        .main-content,
        .app-container,
        [data-testid*="nav"],
        [class*="nav"],
        [class*="sidebar"],
        [class*="menu"],
        .no-print {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Afficher uniquement le conteneur de facture */
        .invoice-print-container,
        .invoice-print-container * {
          visibility: visible !important;
          display: block !important;
        }
        
        .invoice-print-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: auto !important;
          margin: 0 !important;
          padding: 10mm !important;
          background: white !important;
          font-size: 12px !important;
        }
        
        /* Styles spécifiques pour les éléments de la facture */
        .invoice-print-container .grid {
          display: grid !important;
        }
        
        .invoice-print-container .flex {
          display: flex !important;
        }
        
        .invoice-print-container .border-2 {
          border: 2px solid black !important;
        }
        
        .invoice-print-container .border-b {
          border-bottom: 1px solid black !important;
        }
        
        .invoice-print-container .border-dotted {
          border-style: dotted !important;
        }
        
        /* Configuration de la page */
        @page {
          margin: 5mm !important;
          size: A4 portrait !important;
        }
        
        /* Reset du body pour l'impression */
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          font-family: Arial, sans-serif !important;
        }
        
        /* Masquer les overlays et modales */
        .dialog-overlay,
        .modal-overlay,
        [role="dialog"],
        [data-radix-popper-content-wrapper] {
          position: static !important;
          background: transparent !important;
        }
        
        /* S'assurer que le contenu du dialog est visible */
        [role="dialog"] .invoice-print-container {
          position: static !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
      }
    `}</style>
  );
};

export default InvoicePrintStyles;
