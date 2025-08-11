# ReadingSN - Sua Biblioteca Digital

## Descrição

O ReadingSN é um site profissional e responsivo com tema de biblioteca que permite criar, editar e gerenciar anotações pessoais. O projeto foi desenvolvido com HTML5, CSS3 e JavaScript vanilla, oferecendo uma experiência elegante e funcional.

## Funcionalidades

### ✨ Principais Recursos
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Sistema de Anotações**: Crie, edite e organize suas anotações
- **Export PDF**: Baixe suas anotações em formato PDF de alta qualidade
- **Armazenamento Local**: Suas anotações são salvas no navegador
- **Design Elegante**: Inspirado nas bibliotecas clássicas com toque moderno
- **Navegação Suave**: Transições fluidas entre seções

### 📱 Seções do Site
1. **Início**: Página principal com apresentação e funcionalidades
2. **Anotações**: Editor completo para criar e gerenciar anotações
3. **Sobre**: Informações sobre o projeto ReadingSN
4. **Contato**: Formulário de contato e informações

## Estrutura do Projeto

```
readingsn/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos responsivos
├── js/
│   └── script.js       # Funcionalidades JavaScript
├── images/
│   ├── library_interior.jpg
│   ├── old_books.jpg
│   └── notebook.jpg
└── README.md           # Este arquivo
```

## Como Usar

### 1. Instalação
- Baixe todos os arquivos do projeto
- Mantenha a estrutura de pastas intacta
- Abra o arquivo `index.html` em qualquer navegador moderno

### 2. Funcionalidades das Anotações
- **Nova Anotação**: Clique em "+ Nova Anotação"
- **Editar**: Clique em qualquer anotação da lista para editá-la
- **Salvar**: As anotações são salvas automaticamente
- **Download PDF**: Clique em "Baixar PDF" para exportar
- **Excluir**: Use o botão "Excluir" para remover anotações

### 3. Atalhos de Teclado
- `Ctrl/Cmd + S`: Salvar anotação atual
- `Ctrl/Cmd + N`: Criar nova anotação

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design responsivo com Flexbox e Grid
- **JavaScript ES6+**: Funcionalidades interativas
- **jsPDF**: Geração de arquivos PDF
- **Google Fonts**: Tipografia elegante (Crimson Text + Inter)

## Compatibilidade

### Navegadores Suportados
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Dispositivos
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Recursos Técnicos

### CSS Features
- Variáveis CSS customizadas
- Design responsivo mobile-first
- Animações e transições suaves
- Sistema de cores consistente
- Tipografia hierárquica

### JavaScript Features
- Programação orientada a objetos
- Armazenamento local (localStorage)
- Sistema de notificações
- Auto-save com debounce
- Geração de PDF client-side

## Personalização

### Cores
As cores podem ser facilmente alteradas no arquivo `css/style.css` nas variáveis CSS:

```css
:root {
    --primary-color: #2C1810;    /* Marrom escuro */
    --secondary-color: #8B4513;  /* Marrom médio */
    --accent-color: #D4AF37;     /* Dourado */
    --background-color: #F5F5DC; /* Bege claro */
}
```

### Fontes
Para alterar as fontes, modifique as importações no `index.html` e as variáveis no CSS:

```css
--font-serif: 'Crimson Text', Georgia, serif;
--font-sans: 'Inter', Arial, sans-serif;
```

## Segurança e Privacidade

- **Dados Locais**: Todas as anotações são armazenadas localmente no navegador
- **Sem Servidor**: Não há envio de dados para servidores externos
- **Offline**: Funciona completamente offline após o carregamento inicial

## Suporte

Para dúvidas ou sugestões sobre o ReadingSN:
- Email: contato@readingsn.com
- Suporte: suporte@readingsn.com

## Licença

Este projeto foi desenvolvido como demonstração de habilidades em desenvolvimento web front-end.

---

**ReadingSN** - Transformando anotações em conhecimento estruturado.

