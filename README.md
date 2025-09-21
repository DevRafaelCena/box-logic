# 📦 BoxLogic API

API para otimização de embalagem de produtos em caixas usando NestJS e TypeScript.

## 🚀 Como Iniciar

### Sem Docker (Desenvolvimento Local)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Executar em desenvolvimento
npm run start:dev

# 4. Acessar
# API: http://localhost:3000/api/embalagem/processar
# Docs: http://localhost:3000/api/docs
```

### Com Docker (Recomendado)

```bash
# Executar com Docker
npm run docker:prod

# Parar containers
npm run docker:stop

# Ou comandos diretos
docker-compose up --build
docker-compose down
```

## 🔧 Comandos Disponíveis

```bash
npm run start:dev     # Desenvolvimento local
npm run build         # Build para produção
npm run test          # Executar testes
npm run docker:prod   # Docker (produção)
npm run docker:stop   # Parar Docker
```

## 🔐 Autenticação

Use uma das seguintes API Keys no header `X-API-Key`:

- `boxlogic-admin-key` (desenvolvimento)
- `demo-key-123` (testes)

## 📋 Exemplo de Uso

```bash
curl -X POST "http://localhost:3000/api/embalagem/processar" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: boxlogic-admin-key" \
  -d '{
    "pedidos": [
      {
        "pedido_id": 1,
        "produtos": [
          {
            "produto_id": "PRODUTO1",
            "dimensoes": {
              "altura": 30,
              "largura": 20,
              "comprimento": 15
            }
          }
        ]
      }
    ]
  }'
```

## 📚 Documentação

- **Swagger UI**: http://localhost:3000/api/docs
- **Repositório**: https://github.com/DevRafaelCena/box-logic

## 🧪 Testes

```bash
npm test              # Todos os testes
npm run test:watch    # Modo watch
npm run test:cov      # Com cobertura
```

## 🏗️ Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem
- **Swagger** - Documentação API
- **Jest** - Testes
- **Docker** - Containerização

## 📦 Caixas Disponíveis

- **Caixa 1**: 30 × 40 × 80 cm
- **Caixa 2**: 50 × 50 × 40 cm
- **Caixa 3**: 50 × 80 × 60 cm
