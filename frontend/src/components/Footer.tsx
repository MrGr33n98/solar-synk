export const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground py-8">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-foreground">SolarSync</h3>
          <p className="text-sm mt-2">
            Avaliações autênticas de equipamentos solares.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Links</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <a href="#" className="hover:text-primary">
                Sobre Nós
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Contato
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Termos de Uso
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Política de Privacidade
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Siga-nos</h3>
          <div className="flex space-x-4 mt-2">
            {/* Add social media icons here */}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 mt-8 text-center text-sm">
        © {new Date().getFullYear()} SolarSync. Todos os direitos reservados.
      </div>
    </footer>
  );
};
