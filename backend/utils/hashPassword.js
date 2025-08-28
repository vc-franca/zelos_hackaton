// geraHash.js
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function generateHash(label, password) {
  if (!password) {
    console.error(`⚠️ A senha para ${label} não foi definida.`);
    return;
  }

  try {
    // Gerar o salt
    const salt = await bcrypt.genSalt(10);

    // Hashear a senha com o salt
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(`${label} Hash:`, hashedPassword);
  } catch (error) {
    console.error(`❌ Erro ao gerar hash para ${label}:`, error);
  }
}

async function generateHashedPasswords() {
  try {
    await generateHash("TESTE", "senha123");

    process.exit(0); // finaliza
  } catch (error) {
    console.error("❌ Erro inesperado:", error);
    process.exit(1);
  }
}

generateHashedPasswords();
