import File from '../models/File';

class FileController {
  async store(req, res) {
    /* Desestruturação para pegar apenas alguns dados do file
    originalname: name -> Salvando o originalname como name
    filename -> Salvando filename como path */
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
