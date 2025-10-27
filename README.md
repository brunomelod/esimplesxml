# Consulta Cliente XMLS

Uma aplicação React interativa para gerenciar clientes através das APIs XMLS.

## Funcionalidades

- **Cadastrar Cliente**: Interface para criar novos clientes na base de dados
- **Consultar Cliente**: Sistema para verificar se um cliente está cadastrado

## Tecnologias Utilizadas

- React 18
- Axios para requisições HTTP
- CSS3 com animações modernas
- Design responsivo

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute a aplicação:
```bash
npm start
```

3. Acesse `http://localhost:3000` no seu navegador

## APIs Utilizadas

### Criar Cliente
- **Endpoint**: `POST https://xmls-api.esimplesauditor.com.br/create_client`
- **Body**: 
  ```json
  {
    "cnpj": "string",
    "company_name": "string"
  }
  ```

### Consultar Cliente
- **Endpoint**: `GET https://xmls-api.esimplesauditor.com.br/view_client/{cnpj}`
- **Parâmetro**: CNPJ do cliente

## Características da Interface

- Design moderno com gradientes e animações
- Formulários com validação em tempo real
- Máscara automática para CNPJ
- Feedback visual para todas as operações
- Interface totalmente responsiva
- Navegação por abas intuitiva

## Como Usar

1. **Cadastrar Cliente**:
   - Preencha o CNPJ (com formatação automática)
   - Digite o nome da empresa
   - Clique em "Cadastrar Cliente"

2. **Consultar Cliente**:
   - Digite o CNPJ do cliente
   - Clique em "Consultar Cliente"
   - Visualize as informações retornadas

## Estrutura do Projeto

```
src/
├── components/
│   ├── CreateClient.js    # Componente para cadastro
│   └── ViewClient.js      # Componente para consulta
├── services/
│   └── api.js            # Configuração das APIs
├── App.js                # Componente principal
├── App.css               # Estilos da aplicação
├── index.js              # Ponto de entrada
└── index.css             # Estilos globais
```
