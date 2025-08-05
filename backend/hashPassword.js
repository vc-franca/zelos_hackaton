import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function generateHash(label, password) {
  // Gerar o salt
  const salt = await bcrypt.genSalt(10);

  // Hashear a senha com o salt
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log(`${label} Hash:`, hashedPassword);
}

async function generateHashedPasswords() {
  try {
    await generateHash('ADMIN', process.env.SENHA_ADMIN);
    await generateHash('USER', process.env.SENHA_USER);

    process.exit(0); // Encerra o processo após exibir o hash
  } catch (error) {
    console.error('Erro ao hashear a senha:', error);
    process.exit(1); // Encerra o processo com código de erro
  }
}

generateHashedPasswords();
