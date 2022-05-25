const Image = require("exifr");
const fs = require("fs");

Image.parse("./tmp/uploads/1/1/01.avif").then(console.log)

let bits = 0;
let totalImages = 0;

const mangas = fs.readdirSync("./tmp/uploads")





const a = fs.statSync("./tmp/uploads/1/1/01.avif")

console.log(a)


mangas.forEach(async manga => {
    const files = fs.readdirSync(`./tmp/uploads/${manga}`)

    files.forEach(async file => {
        if (["png", "jpg", "jpeg"].includes(file.split(".")[1])) return;

        const image = fs.statSync(`./tmp/uploads/${manga}/${file}`);

        bits += image.size;
        totalImages++;
    })

    files.forEach(async file => {
        if (["png", "jpg", "jpeg", "avif"].includes(file.split(".")[1])) return;

        const images = fs.readdirSync(`./tmp/uploads/${manga}/${file}`)

        images.forEach(image => {
            if (!["avif"].includes(file.split(".")[1])) return;

            const imagem = fs.statSync(`./tmp/uploads/${manga}/${file}/${image}`);

            bits += imagem.size;
            totalImages++;
        })
    })

    console.log(`Manga: ${manga} || Actual size: ${(bits / 1024 / 1024).toFixed(2)} MB || Total images: ${totalImages}`);
})