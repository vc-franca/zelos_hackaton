CREATE DATABASE IF NOT EXISTS zelos;
USE zelos;

-- Criação da tabela `usuarios`
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    funcao ENUM('administrador', 'tecnico', 'usuario') NOT NULL,
    estado ENUM('ativo', 'inativo') DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criação da tabela `pool`
CREATE TABLE IF NOT EXISTS pool (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo ENUM('externo', 'manutencao', 'apoio_tecnico', 'limpeza') NOT NULL,
    descricao TEXT,
    estado ENUM('ativo', 'inativo') DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    FOREIGN KEY (updated_by) REFERENCES usuarios(id)
);

-- Criação da tabela `chamados`
CREATE TABLE IF NOT EXISTS chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    patrimonio INT(7) NOT NULL,
    descricao TEXT NOT NULL,
    tipo_id INT,
    tecnico_id INT,
    usuario_id INT,
    estado ENUM('pendente', 'em andamento', 'concluido') DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_id) REFERENCES pool(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Criação da tabela `apontamentos`
CREATE TABLE IF NOT EXISTS apontamentos (
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
CREATE TABLE IF NOT EXISTS pool_tecnico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pool INT NOT NULL,
    id_tecnico INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pool FOREIGN KEY (id_pool) REFERENCES pool(id) ON DELETE CASCADE,
    CONSTRAINT fk_tecnico FOREIGN KEY (id_tecnico) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices adicionais
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_chamados_estado ON chamados(estado);
CREATE INDEX idx_apontamentos_comeco_fim ON apontamentos(comeco, fim);

-- Inserts para testes
INSERT INTO usuarios (nome, senha, email, funcao, estado) VALUES 
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
INSERT INTO chamados (titulo, patrimonio, descricao, tipo_id, tecnico_id, usuario_id, estado) VALUES
    ('Trocar lâmpada', 0000001,      'A lâmpada da sala 102 está queimada.',                     1, 2, 4, 'pendente'),
    ('Erro no computador', 0000002,  'O computador da secretaria não liga.',                     2, 3, 5, 'em andamento'),
    ('Limpeza urgente', 0000003,     'Sala 201 precisa de limpeza urgente após evento.',         3, NULL, 4, 'pendente'),
    ('Impressora travada', 0000004,  'Impressora da sala dos professores não imprime.',          2, 2, 5, 'concluido');

-- Apontamentos
INSERT INTO apontamentos (chamado_id, tecnico_id, descricao, comeco, fim) VALUES
    (1, 2, 'Troca da lâmpada feita com sucesso.',                     '2025-08-07 09:00:00', '2025-08-07 09:20:00'),
    (2, 3, 'Verificado cabo de energia e substituído.',              '2025-08-07 10:00:00', '2025-08-07 10:45:00'),
    (4, 2, 'Limpeza de cartuchos e reinicialização do sistema.',     '2025-08-06 14:00:00', '2025-08-06 14:30:00');

-- Pool técnico
INSERT INTO pool_tecnico (id_pool, id_tecnico) VALUES
    (1, 2),  -- Bruno alocado para pool 1
    (1, 3),  -- Carla alocada para pool 1
    (2, 2),  -- Bruno alocado para pool 2
    (2, 3);  -- Carla alocada para pool 2

-- Exemplo de query corrigida para pegar técnicos por pool
SELECT u.id, u.nome
FROM usuarios u
INNER JOIN pool_tecnico pt ON pt.id_tecnico = u.id
INNER JOIN pool p ON p.id = pt.id_pool
WHERE p.id = 1 AND u.funcao = 'tecnico';


select * from chamados;
select * from usuarios;
