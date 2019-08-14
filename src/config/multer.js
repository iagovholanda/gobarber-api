import multer from 'multer';
import crypto from 'crypto';
/* extname -> Retorna a extensão do arquivo
resolve -> Percorrer um caminho, dentro da minha aplicação. */
import { extname, resolve } from 'path';

/* Objeto de configuração */
export default {
  /* Como o multer vai guardar nossos arquivos de imagem */
  storage: multer.diskStorage({
    /* Destino do arquivo
    __dirname -> Diretorio onde se encontra atualmente o arquivo
    */
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    /* Onde é formatado o nome do arquivo
      req -> Todos os dados do corpo da requisição
      file -> Todos os dados referente ao arquivos de upload
    */
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        /* Transformando um valor de caracteries aleatorio em hexadecimal */
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
