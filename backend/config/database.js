import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { DB_CONFIG } from './secrets.js';

const pool = mysql.createPool({
    host: DB_CONFIG.host,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    database: DB_CONFIG.database, 
    port: DB_CONFIG.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Função assíncrona que obtém uma conexão do pool.
// Essa conexão é usada para executar as queries SQL.
async function getConnection() {
    return pool.getConnection();
}

// Função para ler todos os registros
async function readAll(table, where = null) {
    const connection = await getConnection();
    try {
        let sql = `SELECT * FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }

        const [rows] = await connection.execute(sql);
        return rows;
    } finally {
        connection.release();
    }
}

// Função para ler um registro específico
async function read(table, where, and) {
    const connection = await getConnection();
    try {
        let sql = `SELECT * FROM ${table}`;
        
        if (where && and) {
            sql += ` WHERE ${where} AND ${and}`;
          } else if (where) {
            sql += ` WHERE ${where}`;
          }

        const [rows] = await connection.execute(sql);
        return rows[0] || null;
    } finally {
        connection.release();
    }
}

// Função para inserir um novo registro
// Função assíncrona para inserir dados em uma tabela do banco de dados
async function create(table, data) {
    // Obtém uma conexão com o banco de dados
    const connection = await getConnection();
    try {
        // Filtra apenas os campos que têm valores válidos (não undefined/null)
        const filteredData = {};
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
                filteredData[key] = data[key];
            }
        });

        // Obtém as chaves do objeto filtrado e as junta em uma string separada por vírgulas
        const columns = Object.keys(filteredData).join(', ');

        // Cria um array de placeholders "?" com o mesmo número de colunas e o transforma em uma string
        const placeholders = Array(Object.keys(filteredData).length).fill('?').join(', ');

        // Monta a query SQL para inserção dos dados na tabela especificada
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

        // Obtém os valores do objeto filtrado para serem usados na query
        const values = Object.values(filteredData);

        // Executa a query SQL com os valores fornecidos e armazena o resultado
        const [result] = await connection.execute(sql, values);

        // Retorna o ID do registro inserido
        return result.insertId;
    } finally {
        // Libera a conexão com o banco de dados
        connection.release();
    }
}

// Função para atualizar um registro
async function update(table, data, where) {
    const connection = await getConnection();
    try {
        // Filtra apenas os campos que têm valores válidos (não undefined/null)
        const filteredData = {};
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
                filteredData[key] = data[key];
            }
        });

        const set = Object.keys(filteredData)
            .map(column => `${column} = ?`)
            .join(', ');

        const sql = `UPDATE ${table} SET ${set} WHERE ${where}`;
        const values = Object.values(filteredData);

        const [result] = await connection.execute(sql, [...values]);
        return result.affectedRows;
    } finally {
        connection.release();
    }
}

// Função para excluir um registro
async function deleteRecord(table, where) {
    const connection = await getConnection();
    try {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        const [result] = await connection.execute(sql);
        return result.affectedRows;
    } finally {
        connection.release();
    }
}

async function compare(senha, hash) {
    try {
        // Compare a senha com o hash usando bcrypt
        return await bcrypt.compare(senha, hash);
    } catch (error) {
        console.error('Erro ao comparar a senha com o hash:', error);
        return false; // Em caso de erro, retorne falso para indicar que a senha não corresponde
    }
}

export { create, readAll, read, update, deleteRecord, compare, pool };