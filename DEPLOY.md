# Deploy no Vercel

## 🚀 Como fazer o deploy

### 1. Preparação
- ✅ `.gitignore` configurado (node_modules excluído)
- ✅ Logo na pasta `public/logo-esimples.png`
- ✅ `vercel.json` configurado
- ✅ Scripts de build prontos

### 2. Deploy via Git
```bash
# 1. Fazer commit das alterações
git add .
git commit -m "Aplicação React para consulta de clientes XMLS"

# 2. Conectar ao repositório remoto
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main

# 3. No Vercel:
# - Conectar o repositório
# - Framework: Create React App
# - Build Command: npm run build
# - Output Directory: build
```

### 3. Deploy via Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy de produção
vercel --prod
```

## 📁 Estrutura de Arquivos
```
public/
├── index.html
└── logo-esimples.png    # ✅ Logo incluído

src/
├── components/
├── services/
└── ...

.gitignore              # ✅ node_modules excluído
vercel.json            # ✅ Configuração do Vercel
package.json           # ✅ Scripts de build
```

## 🔧 Configurações Importantes

### Logo
- ✅ Arquivo: `public/logo-esimples.png`
- ✅ Referência: `process.env.PUBLIC_URL + "/logo-esimples.png"`
- ✅ Compatível com Vercel

### Build
- ✅ Comando: `npm run build`
- ✅ Diretório: `build/`
- ✅ Framework: Create React App

### Variáveis de Ambiente
- ✅ API_BASE_URL: `https://xmls-api.esimplesauditor.com.br`
- ✅ Headers: `Content-Type: application/json`
