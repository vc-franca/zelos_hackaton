CREATE DATABASE zelos;
USE zelos;

-- Criação da tabela `usuarios`
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    funcao VARCHAR(100) NOT NULL,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criação da tabela `pool`
CREATE TABLE pool (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo ENUM('externo', 'manutencao', 'apoio_tecnico', 'limpeza') NOT NULL,
    descricao TEXT,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    FOREIGN KEY (updated_by) REFERENCES usuarios(id)
);

-- Criação da tabela `chamados`
CREATE TABLE chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    tipo_id INT,
    tecnico_id INT,
    usuario_id INT,
    status ENUM('pendente', 'em andamento', 'concluído') DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_id) REFERENCES pool(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Criação da tabela `apontamentos`
CREATE TABLE apontamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT,
    tecnico_id INT,
    descricao TEXT,
    comeco TIMESTAMP NOT NULL,
    fim TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duracao INT AS (TIMESTAMPDIFF(SECOND, comeco, fim)) STORED,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
);

-- Criação da tabela `pool_tecnico`
CREATE TABLE pool_tecnico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pool INT,
    id_tecnico INT,
    FOREIGN KEY (id_pool) REFERENCES pool(id),
    FOREIGN KEY (id_tecnico) REFERENCES usuarios(id)
);

-- Índices adicionais para otimização
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_apontamentos_comeco_fim ON apontamentos(comeco, fim);

-- Inserts para testes

-- Usuários
INSERT INTO usuarios (nome, senha, email, funcao, status) VALUES 
    ('Alice Silva',   'senha123', 'alice@teste.com',   'administrador', 'ativo'),
    ('Bruno Costa',   'senha123', 'bruno@teste.com',   'tecnico',       'ativo'),
    ('Carla Dias',    'senha123', 'carla@teste.com',   'tecnico',       'ativo'),
    ('Daniela Lima',  'senha123', 'daniela@teste.com', 'usuario',       'ativo'),
    ('Eduardo Nunes', 'senha123', 'eduardo@teste.com', 'usuario',       'ativo');

-- Pool (tipos de chamados)
INSERT INTO pool (titulo, descricao, created_by, updated_by) VALUES
    ('manutencao',     'Problemas estruturais, elétricos ou hidráulicos.',          1, 1),
    ('apoio_tecnico',  'Apoio com software, hardware ou internet.',                 1, 1),
    ('limpeza',        'Solicitações relacionadas à limpeza de ambientes.',         1, 1),
    ('externo',        'Demandas externas à unidade escolar.',                      1, 1);

-- Chamados
INSERT INTO chamados (titulo, descricao, tipo_id, tecnico_id, usuario_id, status) VALUES
    ('Trocar lâmpada',      'A lâmpada da sala 102 está queimada.',                     1, 2, 4, 'pendente'),
    ('Erro no computador',  'O computador da secretaria não liga.',                     2, 3, 5, 'em andamento'),
    ('Limpeza urgente',     'Sala 201 precisa de limpeza urgente após evento.',         3, NULL, 4, 'pendente'),
    ('Impressora travada',  'Impressora da sala dos professores não imprime.',          2, 2, 5, 'concluído');

-- Apontamentos
INSERT INTO apontamentos (chamado_id, tecnico_id, descricao, comeco, fim) VALUES
    (1, 2, 'Troca da lâmpada feita com sucesso.',                     '2025-08-07 09:00:00', '2025-08-07 09:20:00'),
    (2, 3, 'Verificado cabo de energia e substituído.',              '2025-08-07 10:00:00', '2025-08-07 10:45:00'),
    (4, 2, 'Limpeza de cartuchos e reinicialização do sistema.',     '2025-08-06 14:00:00', '2025-08-06 14:30:00');

-- Associação de técnicos ao pool
INSERT INTO pool_tecnico (id_pool, id_tecnico) VALUES
    (1, 2),  -- manutenção - Bruno
    (2, 2),  -- apoio técnico - Bruno
    (2, 3),  -- apoio técnico - Carla
    (3, 3);  -- limpeza - Carla
    
SELECT * FROM pool_tecnico
