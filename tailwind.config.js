/** @type {import('tailwindcss').Config} */
/**
 * Configuracao Tailwind CSS.
 *
 * Conteudo:
 * - caminhos analisados para gerar classes utilizadas;
 * - extensoes de tema especificas da identidade visual do projeto.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Sombra customizada para componentes em estilo "soft UI".
      boxShadow: {
        'neumorphic': '6px 6px 12px #e0e6ed, -6px -6px 12px #ffffff',
      }
    },
  },
  plugins: [],
}
