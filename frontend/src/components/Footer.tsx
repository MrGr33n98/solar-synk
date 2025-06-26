import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <p>&copy; 2025 Solar Sync. Todos os direitos reservados.</p>
          <div className="space-x-4">
            <a href="/about" className="hover:text-blue-400">Sobre</a>
            <a href="/contact" className="hover:text-blue-400">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
