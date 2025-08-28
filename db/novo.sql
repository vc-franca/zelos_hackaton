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
    ('Alice Silva',   '$2b$10$ZeDWeGpvJSQ9SuJz.MO0aeVPJTHgclk0UYH/xuPEpvaYB3i2sct4W', 'alice@teste.com',   'administrador', 'ativo'),
    ('Bruno Costa',   '$2b$10$ZeDWeGpvJSQ9SuJz.MO0aeVPJTHgclk0UYH/xuPEpvaYB3i2sct4W', 'bruno@teste.com',   'tecnico',       'ativo'),
    ('Carla Dias',    '$2b$10$ZeDWeGpvJSQ9SuJz.MO0aeVPJTHgclk0UYH/xuPEpvaYB3i2sct4W', 'carla@teste.com',   'tecnico',       'ativo'),
    ('Daniela Lima',  '$2b$10$ZeDWeGpvJSQ9SuJz.MO0aeVPJTHgclk0UYH/xuPEpvaYB3i2sct4W', 'daniela@teste.com', 'usuario',       'ativo'),
    ('Eduardo Nunes', '$2b$10$ZeDWeGpvJSQ9SuJz.MO0aeVPJTHgclk0UYH/xuPEpvaYB3i2sct4W', 'eduardo@teste.com', 'usuario',       'ativo');

-- Pool (tipos de chamados)
INSERT INTO pool (titulo, descricao, created_by, updated_by) VALUES
    ('manutencao',     'Solicitações de manutenção elétrica, hidráulica ou estrutural.', 1, 1),
    ('apoio_tecnico',  'Suporte com computadores, rede ou dispositivos digitais.',       1, 1),
    ('limpeza',        'Chamados relacionados à higienização de salas e corredores.',    1, 1),
    ('externo',        'Demandas externas ou serviços fora da instituição.',             1, 1);

-- Chamados
INSERT INTO chamados (titulo, patrimonio, descricao, tipo_id, tecnico_id, usuario_id, estado) VALUES
    ('Ar-condicionado não liga', 1000001, 'O ar-condicionado da sala 203 não resfria.', 1, 2, 4, 'pendente'),
    ('Internet lenta',           1000002, 'Rede da biblioteca está com conexão instável.', 2, 3, 5, 'em andamento'),
    ('Sala precisa de limpeza',  1000003, 'Sala de reuniões suja após evento de pais.', 3, NULL, 4, 'pendente'),
    ('Projetor queimado',        1000004, 'Projetor do auditório parou de funcionar.', 2, 2, 5, 'concluido');

-- Apontamentos
INSERT INTO apontamentos (chamado_id, tecnico_id, descricao, comeco, fim) VALUES
    (1, 2, 'Verificado fusível, substituído e testado.',          '2025-08-10 08:30:00', '2025-08-10 09:00:00'),
    (2, 3, 'Troca do roteador e ajuste de configuração.',         '2025-08-11 10:15:00', '2025-08-11 11:00:00'),
    (4, 2, 'Substituído lâmpada do projetor e feito alinhamento.', '2025-08-09 15:00:00', '2025-08-09 15:40:00');

-- Pool técnico
INSERT INTO pool_tecnico (id_pool, id_tecnico) VALUES
    (1, 2),  -- Bruno no pool de manutenção
    (3, 3),  -- Carla no pool de limpeza
    (2, 2),  -- Bruno no pool de apoio técnico
    (2, 3);  -- Carla no pool de apoio técnico


-- Exemplo de query corrigida para pegar técnicos por pool
SELECT u.id, u.nome
FROM usuarios u
INNER JOIN pool_tecnico pt ON pt.id_tecnico = u.id
INNER JOIN pool p ON p.id = pt.id_pool
WHERE p.id = 1 AND u.funcao = 'tecnico';


select * from chamados;
select * from usuarios;
