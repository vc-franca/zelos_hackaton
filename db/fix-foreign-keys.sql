-- Script para corrigir as foreign keys com CASCADE DELETE
USE zelos;

-- Remover as foreign keys existentes
ALTER TABLE apontamentos DROP FOREIGN KEY apontamentos_ibfk_1;
ALTER TABLE apontamentos DROP FOREIGN KEY apontamentos_ibfk_2;

-- Adicionar as foreign keys com CASCADE DELETE
ALTER TABLE apontamentos 
ADD CONSTRAINT fk_apontamentos_chamado 
FOREIGN KEY (chamado_id) REFERENCES chamados(id) ON DELETE CASCADE;

ALTER TABLE apontamentos 
ADD CONSTRAINT fk_apontamentos_tecnico 
FOREIGN KEY (tecnico_id) REFERENCES usuarios(id) ON DELETE CASCADE;

-- Verificar se as alterações foram aplicadas
SHOW CREATE TABLE apontamentos;
