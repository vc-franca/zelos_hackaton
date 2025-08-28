# 🗄️ Banco de Dados - Zelos Hackaton

## 📋 Configuração

### 🚀 Inicialização Rápida
```sql
-- Execute o arquivo novo.sql para criar o banco completo
mysql -u root -p < novo.sql
```

### 🔧 Configurações
- **Host**: localhost
- **Porta**: 3306
- **Usuário**: root
- **Senha**: (vazia)
- **Database**: zelos

## 👥 Usuários de Teste

### 🔑 Credenciais Padrão
**Senha para todos os usuários**: `password`

### 👑 Administrador
- **Email**: `alice@teste.com`
- **Função**: administrador
- **Acesso**: `/admin`

### 🔧 Técnicos
- **Email**: `bruno@teste.com`
- **Função**: tecnico
- **Acesso**: `/tecnicos`

- **Email**: `carla@teste.com`
- **Função**: tecnico
- **Acesso**: `/tecnicos`

### 👤 Usuários
- **Email**: `daniela@teste.com`
- **Função**: usuario
- **Acesso**: `/home`

- **Email**: `eduardo@teste.com`
- **Função**: usuario
- **Acesso**: `/home`

## 🏗️ Estrutura do Banco

### 📊 Tabelas Principais
1. **usuarios** - Usuários do sistema
2. **pool** - Tipos de serviços/chamados
3. **chamados** - Solicitações de serviço
4. **apontamentos** - Registro de tempo dos técnicos
5. **pool_tecnico** - Relacionamento técnicos x tipos de serviço

### 🔐 Segurança
- ✅ Senhas armazenadas com hash bcrypt
- ✅ Salt de 10 rounds
- ✅ JWT para autenticação
- ✅ Cookies HTTP-only

## 🚨 Importante

### ⚠️ Primeira Execução
- Execute `novo.sql` para criar o banco completo
- As senhas já vêm com hash bcrypt
- **NÃO** é necessário executar scripts adicionais

### 🔄 Atualizações
- Ao puxar o projeto do GitHub, execute apenas `novo.sql`
- Todas as configurações já estão corretas
- Credenciais funcionam imediatamente

## 📝 Scripts Disponíveis

### 🆕 Criação Completa
```bash
# Criar banco e todas as tabelas
mysql -u root -p < novo.sql
```

### 🔍 Verificação
```bash
# Conectar ao banco
mysql -u root -p zelos

# Verificar usuários
SELECT nome, email, funcao, estado FROM usuarios;

# Verificar se senhas estão hasheadas
SELECT nome, LENGTH(senha) as tamanho_senha FROM usuarios;
```

## 🎯 Status
- ✅ **Banco configurado**
- ✅ **Senhas corrigidas**
- ✅ **Estrutura completa**
- ✅ **Pronto para uso**

---
**Última atualização**: Agosto 2025
**Versão**: 2.0 (com senhas corrigidas)

