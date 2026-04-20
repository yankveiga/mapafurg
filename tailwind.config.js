/** @type {import('tailwindcss').Config} */
/**
 * Configuração do Tailwind CSS.
 *
 * Escopo:
 * - define caminhos que serão analisados para classes utilitárias;
 * - aplica extensões de tema utilizadas pela interface.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Sombra utilitária usada em componentes com efeito "soft".
      boxShadow: {
        'neumorphic': '6px 6px 12px #e0e6ed, -6px -6px 12px #ffffff',
      }
    },
  },
  plugins: [],
}
